import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { successReturn } from 'utils/helpers';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Combinations)
    private readonly combinationsRepository: Repository<Combinations>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getCart(userId: number | null, sessionId: string): Promise<Cart> {
    let cart: Cart | null = null;

    // Kullanıcı giriş yaptıysa, kullanıcıya ait sepeti bul
    if (userId) {
      cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: [
          'cart_items',
          'cart_items.product',
          'cart_items.combination',
        ],
      });

      // Eğer kullanıcıya ait bir sepet yoksa, session ID ile sepeti bul ve kullanıcıya ata
      if (!cart) {
        cart = await this.cartRepository.findOne({
          where: { session_id: sessionId },
          relations: [
            'cart_items',
            'cart_items.product',
            'cart_items.combination',
          ],
        });

        if (cart) {
          cart.user = { id: userId } as User;
          cart.session_id = null; // Session ID'yi temizle
          await this.cartRepository.save(cart);
        }
      }
    } else {
      // Kullanıcı giriş yapmamışsa, session ID ile sepeti bul
      cart = await this.cartRepository.findOne({
        where: { session_id: sessionId },
        relations: [
          'cart_items',
          'cart_items.product',
          'cart_items.combination',
        ],
      });
    }

    // Eğer session ID ile de sepet bulunmazsa, yeni bir sepet oluştur
    if (!cart) {
      cart = this.cartRepository.create({
        session_id: sessionId,
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getCartItemCount(user: User | null, sessionId: string) {
    let cart: Cart | null = null;

    if (user) {
      cart = await this.cartRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['cart_items'],
      });

      if (!cart) {
        cart = await this.cartRepository.findOne({
          where: { session_id: sessionId },
          relations: ['cart_items'],
        });

        if (cart) {
          cart.user = { id: user.id } as User;
          cart.session_id = null;
          await this.cartRepository.save(cart);
        }
      }
    } else {
      cart = await this.cartRepository.findOne({
        where: { session_id: sessionId },
        relations: ['cart_items'],
      });
    }

    if (!cart) {
      cart = this.cartRepository.create({
        session_id: sessionId,
      });
      await this.cartRepository.save(cart);
      return 0;
    }

    return { data: cart.cart_items.length, cart_id: cart.id };
  }

  //* Sepete ürün ekleme
  async addToCart(dto: CreateCartItemDto) {
    // Sepeti getir ve ilişkili öğeleri al
    const cart = await this.cartRepository.findOne({
      where: { id: dto.cartId },
      relations: ['cart_items'],
    });

    if (!cart) {
      throw new BadRequestException('Sepet bulunamadı!');
    }

    // Ürünü getir
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new BadRequestException('Ürün bulunamadı!');
    }

    // Kombinasyonu getir (varsa)
    const combination = dto.combinationId
      ? await this.combinationsRepository.findOne({
          where: { id: dto.combinationId },
        })
      : null;

    // Stok kontrolü
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: dto.cartId },
        product: { id: dto.productId },
        combination: { id: dto.combinationId },
      },
    });

    let totalQuantityInCart = dto.quantity;

    if (existingCartItem) {
      totalQuantityInCart += existingCartItem.quantity;
    }

    if (combination) {
      // Kombinasyon varsa, kombinasyon stok miktarını kontrol et
      if (totalQuantityInCart > combination.stock) {
        throw new BadRequestException('Ürün stok miktarı yetersiz!');
      }
    } else {
      // Kombinasyon yoksa, ürün stok miktarını kontrol et
      if (totalQuantityInCart > product.stock) {
        throw new BadRequestException('Ürün stok miktarı yetersiz!');
      }
    }

    if (existingCartItem) {
      // Sepette zaten mevcut bir cartItem varsa, miktarı güncelle
      existingCartItem.quantity += dto.quantity;
      existingCartItem.price = this.calculatePrice(
        product,
        combination,
        existingCartItem.quantity,
      );
      // Cart ilişkisinin doğru olduğundan emin olun
      existingCartItem.cart = cart;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      const newCartItem = this.cartItemRepository.create({
        cart: cart,
        product,
        combination,
        quantity: dto.quantity,
        price: this.calculatePrice(product, combination, dto.quantity),
      });
      // Cart ilişkisinin doğru olduğundan emin olun
      newCartItem.cart = cart;
      const savedCartItem = await this.cartItemRepository.save(newCartItem);
      cart.cart_items.push(savedCartItem);
    }

    // Sepet toplamlarını güncelle
    await this.updateCartTotals(cart);

    return successReturn({ message: 'Ürün başarıyla sepete eklendi.' });
  }

  //! Sepetten ürün çıkarma
  async removeFromCart(cartId: number, cartItemId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new BadRequestException('Sepet bulunamadı!');
    }

    await this.cartItemRepository.remove(cartItem);

    await this.updateCartTotals(cartItem.cart);
  }

  //* Sepet Guncelleme
  private async updateCartTotals(cart: Cart) {
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cart.id } },
    });

    const productTotal = cartItems.reduce(
      (total, item) => total + item.price,
      0,
    );

    cart.product_total = productTotal;

    cart.total = productTotal;

    await this.cartRepository.save(cart);
  }

  //* Fiyat hesaplama
  private calculatePrice(
    product: Product,
    combination: Combinations | null,
    quantity: number,
  ): number {
    let price = product.price;

    if (combination) {
      if (combination.special) {
        price = combination.special;
      }
      return price * quantity;
    } else {
      if (product.special) {
        price = product.special;
      }
      return price * quantity;
    }
  }

  //* Sepetteki ürünün adetini arttırma
  async increaseCartItemQuantity(
    cartId: number,
    cartItemId: number,
    quantity: number,
  ) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { id: cartId } },
      relations: ['cart', 'product', 'combination'],
    });

    if (!cartItem) {
      throw new BadRequestException('Sepet öğesi bulunamadı!');
    }

    const newQuantity = cartItem.quantity + quantity;

    // Stok kontrolü
    if (cartItem.combination) {
      if (newQuantity > cartItem.combination.stock) {
        throw new BadRequestException('Ürün stok miktarı yetersiz!');
      }
    } else {
      if (newQuantity > cartItem.product.stock) {
        throw new BadRequestException('Ürün stok miktarı yetersiz!');
      }
    }

    // Miktarı güncelle
    cartItem.quantity = newQuantity;
    cartItem.price = this.calculatePrice(
      cartItem.product,
      cartItem.combination,
      newQuantity,
    );

    await this.cartItemRepository.save(cartItem);

    // Sepet toplamlarını güncelle
    await this.updateCartTotals(cartItem.cart);

    return successReturn({ message: 'Ürün adeti başarıyla güncellendi.' });
  }

  //* Sepetteki ürünün adetini azaltma
  async decreaseCartItemQuantity(
    cartId: number,
    cartItemId: number,
    quantity: number,
  ) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { id: cartId } },
      relations: ['cart', 'product', 'combination'],
    });

    if (!cartItem) {
      throw new BadRequestException('Sepet öğesi bulunamadı!');
    }

    const newQuantity = cartItem.quantity - quantity;

    if (newQuantity <= 0) {
      // Eğer yeni miktar sıfır veya negatifse, ürünü sepetten kaldır
      await this.removeFromCart(cartId, cartItemId);
      return successReturn({ message: 'Ürün adeti başarıyla güncellendi.' });
    }

    // Miktarı güncelle
    cartItem.quantity = newQuantity;
    cartItem.price = this.calculatePrice(
      cartItem.product,
      cartItem.combination,
      newQuantity,
    );

    await this.cartItemRepository.save(cartItem);

    // Sepet toplamlarını güncelle
    await this.updateCartTotals(cartItem.cart);

    return successReturn({ message: 'Ürün adeti başarıyla güncellendi.' });
  }
}
