import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from 'src/common/decorators/get_current_user.decorator';
import { User } from 'src/users/entities/user.entity';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional.guard';
import { CreateCartItemDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('getCart')
  getCart(@Query('session_id') sessionId: string, @CurrentUser() user: User) {
    return this.cartService.getCart(user?.id, sessionId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('getCount')
  getCartItemCount(
    @Query('session_id') sessionId: string,
    @CurrentUser() user: User,
  ) {
    return this.cartService.getCartItemCount(user, sessionId);
  }

  @Post('addToCart')
  addToCart(@Body() dto: CreateCartItemDto) {
    return this.cartService.addToCart(dto);
  }

  @Post('removeFromCart')
  removeFromCart(@Body() dto: { cartItemId: number; cartId: number }) {
    return this.cartService.removeFromCart(dto.cartId, dto.cartItemId);
  }

  //* Adet Arttırma
  @Post('increaseCartItemQuantity')
  async increaseCartItem(
    @Body()
    {
      cartId,
      cartItemId,
      quantity,
    }: {
      cartId: number;
      cartItemId: number;
      quantity: number;
    },
  ) {
    return await this.cartService.increaseCartItemQuantity(
      cartId,
      cartItemId,
      quantity,
    );
  }

  //* Adet Azaltma
  @Post('decreaseCartItemQuantity')
  async decreaseCartItem(
    @Body()
    {
      cartId,
      cartItemId,
      quantity,
    }: {
      cartId: number;
      cartItemId: number;
      quantity: number;
    },
  ) {
    return await this.cartService.decreaseCartItemQuantity(
      cartId,
      cartItemId,
      quantity,
    );
  }
}
