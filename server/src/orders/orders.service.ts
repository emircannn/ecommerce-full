import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { Address, OrderAddress } from 'src/address/entities/address.entity';
import { PaymentService } from 'src/payment/payment.service';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/filters/entities/filter.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(OrderAddress)
    private readonly orderAddressRepository: Repository<OrderAddress>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(
    userId: number,
    invoiceAddressId: number,
    individualAddressId: number,
    ip: string,
  ) {
    // Kullanıcının sepetini al
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cart_items', 'cart_items.product', 'cart_items.combination'],
    });

    if (!cart) {
      throw new BadRequestException('Kullanıcıya ait sepet bulunamadı!');
    }

    if (cart.cart_items.length === 0) {
      throw new BadRequestException('Sepetiniz boş, sipariş oluşturamazsınız.');
    }

    // Stok kontrolü
    for (const cartItem of cart.cart_items) {
      const product = cartItem.product;
      const combination = cartItem.combination;

      let stockToCheck = product.stock;

      if (combination) {
        stockToCheck = combination.stock;
      }

      if (cartItem.quantity > stockToCheck) {
        throw new BadRequestException(
          `${product.name} ürünü için yeterli stok bulunmamaktadır!`,
        );
      }
    }

    // Adresleri bul ve OrderAddress oluştur
    const invoiceAddress = await this.addressRepository.findOne({
      where: { id: invoiceAddressId },
    });
    const individualAddress = await this.addressRepository.findOne({
      where: { id: individualAddressId },
    });

    if (!invoiceAddress || !individualAddress) {
      throw new BadRequestException('Adres bulunamadı!');
    }

    const defaultStatus = await this.orderStatusRepository.findOne({
      where: { id: 1 },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Yeni sipariş oluştur
    const order = this.orderRepository.create({
      user: user,
      total: cart.total,
      coupon: cart.coupon,
      product_total: cart.product_total,
      cargo: cart.cargo,
      payment_success: false,
      status: defaultStatus,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Sipariş öğelerini oluştur
    const orderItems = cart.cart_items.map(cartItem => {
      const orderItem = new OrderItem();
      orderItem.product = cartItem.product;
      orderItem.combination = cartItem.combination;
      orderItem.name = cartItem.product.name;
      orderItem.seo = cartItem.product.seo;
      orderItem.price = cartItem.price;
      orderItem.quantity = cartItem.quantity;
      orderItem.image = cartItem.product.image;
      orderItem.order = savedOrder;
      orderItem.status = defaultStatus;
      return orderItem;
    });

    const savedOrderItems = await this.orderItemRepository.save(orderItems);

    const orderInvoiceAddress = this.orderAddressRepository.create({
      title: invoiceAddress.title,
      tax_no: invoiceAddress.tax_no,
      address_type: invoiceAddress.address_type,
      billing_type: invoiceAddress.billing_type,
      name: invoiceAddress.name,
      phone: invoiceAddress.phone,
      lastname: invoiceAddress.lastname,
      tck_no: invoiceAddress.tck_no,
      company_name: invoiceAddress.company_name,
      tax_office: invoiceAddress.tax_office,
      city_id: invoiceAddress.city_id,
      city: invoiceAddress.city,
      district: invoiceAddress.district,
      district_id: invoiceAddress.district_id,
      neighborhoods: invoiceAddress.neighborhoods,
      neighborhoods_id: invoiceAddress.neighborhoods_id,
      address: invoiceAddress.address,
      orderIndividual: savedOrder,
    });

    const orderIndividualAddress = this.orderAddressRepository.create({
      title: individualAddress.title,
      tax_no: individualAddress.tax_no,
      address_type: individualAddress.address_type,
      billing_type: individualAddress.billing_type,
      name: individualAddress.name,
      phone: individualAddress.phone,
      lastname: individualAddress.lastname,
      tck_no: individualAddress.tck_no,
      company_name: individualAddress.company_name,
      tax_office: individualAddress.tax_office,
      city_id: individualAddress.city_id,
      city: individualAddress.city,
      district: individualAddress.district,
      district_id: individualAddress.district_id,
      neighborhoods: individualAddress.neighborhoods,
      neighborhoods_id: individualAddress.neighborhoods_id,
      address: individualAddress.address,
      orderIndividual: savedOrder,
    });

    const addresses = await this.orderAddressRepository.save([
      orderInvoiceAddress,
      orderIndividualAddress,
    ]);

    savedOrder.order_items = savedOrderItems;
    savedOrder.individualAddress = addresses[1];
    savedOrder.invoiceAddress = addresses[0];

    const lastSaved = await this.orderRepository.save(savedOrder);
    // Ödeme token'ı oluştur
    const paymentToken = await this.paymentService.createPaymentToken(
      lastSaved,
      ip,
    );

    // Ödeme URL'sini al
    const paymentUrl = this.paymentService.getPaymentUrl(paymentToken);

    return { paymentUrl };
  }

  async getOrderSummary(orderId: number, userId: number) {
    // Siparişi bul
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'order_items',
        'order_items.product',
        'order_items.combination',
        'user',
      ],
      select: ['order_items', 'user', 'total', 'id'],
    });

    if (!order) {
      throw new BadRequestException('Sipariş bulunamadı!');
    }

    if (order.user.id !== userId) {
      throw new BadRequestException('Bu siparişe erişim yetkiniz yok!');
    }

    // Sipariş özeti
    const orderSummary = {
      total: order.total,
      orderItems: order.order_items,
    };

    return orderSummary;
  }

  async getOrders(userId: number, page: number, status?: number) {
    const pageSize = 20;

    const totalOrders = await this.orderRepository.count({
      where: {
        user: { id: userId },
        ...(status && { status: { id: status } }),
      },
    });

    const orders = await this.orderRepository.find({
      where: {
        user: { id: userId },
        ...(status && { status: { id: status } }),
        payment: true,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: { createdAt: 'DESC' },
      relations: ['order_items', 'status'],
    });

    const totalPages = Math.ceil(totalOrders / pageSize);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: page,
    };
  }

  async getOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'order_items',
        'order_items.combination',
        'order_items.product',
        'invoiceAddress',
        'individualAddress',
        'payment',
        'status',
        'user',
      ],
    });

    // Sipariş bulunamazsa hata döndür
    if (!order) {
      throw new BadRequestException('Sipariş bulunamadı.');
    }

    if (order.user.id !== userId) {
      throw new BadRequestException('Bu sipariş size ait değil.');
    }

    return order;
  }
}
