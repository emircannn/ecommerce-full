import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayTRClient } from 'paytr';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  private paytr: PayTRClient;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Combinations)
    private readonly combinationsRepository: Repository<Combinations>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {
    this.paytr = new PayTRClient({
      merchant_id: process.env.MERCAHT_ID,
      merchant_key: process.env.MERCAHT_KEY,
      merchant_salt: process.env.MERCAHT_SALT,
      debug_on: true,
      no_installment: true,
      max_installment: 0,
      timeout_limit: 0,
      test_mode: true,
    });
  }

  async createPaymentToken(order: Order, user_ip: string) {
    const merchant_oid = order.id.toString();
    const paymentAmount = Math.round(order.total * 100);
    const response = await this.paytr.getToken({
      merchant_oid: merchant_oid,
      payment_amount: paymentAmount,
      currency: 'TRY',
      email: order.user.email, // Kullanıcı emaili
      user_ip: user_ip, // Kullanıcının IP adresi
      user_name: `${order.user.name}`,
      user_phone: order.user.phone,
      user_address: `${order.individualAddress.address} ${order.individualAddress.neighborhoods} ${order.individualAddress.district}/${order.individualAddress.city}`,
      user_basket: order.order_items.map(item => ({
        name: item.name,
        price: (item.price * 100).toFixed(2),
        quantity: item.quantity,
      })),
      merchant_ok_url: `${process.env.DOMAIN}/api/payment/success?merchant_oid=${merchant_oid}`,
      merchant_fail_url: `${process.env.DOMAIN}/api/payment/fail`,
    });

    return response.token;
  }

  getPaymentUrl(token: string): string {
    return `https://www.paytr.com/odeme/guvenli/${token}`;
  }

  async handleSuccess(merchantOid: string) {
    const orderId = parseInt(merchantOid, 10);
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'order_items',
        'order_items.product',
        'order_items.combination',
        'user',
      ],
    });

    if (!order) {
      throw new BadRequestException('Sipariş bulunamadı!');
    }

    // Ödeme başarılı olarak işaretle
    order.payment_success = true;
    await this.orderRepository.save(order);

    // Stok güncellemesi
    for (const orderItem of order.order_items) {
      const product = orderItem.product;
      const combination = orderItem.combination;

      if (combination) {
        combination.stock -= orderItem.quantity;
        await this.combinationsRepository.save(combination);
      } else {
        product.stock -= orderItem.quantity;
        await this.productRepository.save(product);
      }
    }

    // Sepeti temizle
    const cart = await this.cartRepository.findOne({
      where: { user: { id: order.user.id } },
    });
    if (cart) {
      await this.clearCart(cart);
    }
  }

  private async clearCart(cart: Cart): Promise<void> {
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    cart.product_total = 0;
    cart.total = 0;
    cart.coupon = 0;
    cart.cargo = 0;
    await this.cartRepository.save(cart);
  }
}
