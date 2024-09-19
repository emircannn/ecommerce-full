import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ClientInfoType } from 'src/common/types';
import { ClientInfo } from 'src/common/decorators/client-info.decorator';
import { CurrentUser } from 'src/common/decorators/get_current_user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AtGuard } from 'src/common/guards/at.guard';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AtGuard)
  @Post('create')
  async getCreateOrder(
    @ClientInfo() clientInfo: ClientInfoType,
    @CurrentUser() user: User,
    @Body() dto: { invoiceAddressId: number; individualAddressId: number },
  ) {
    return await this.ordersService.createOrder(
      user.id,
      dto.invoiceAddressId,
      dto.individualAddressId,
      clientInfo.ipAddress,
    );
  }

  @UseGuards(AtGuard)
  @Get('order_summary')
  getOrderSummary(
    @Query('order_id', ParseIntPipe) orderId: number,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.getOrderSummary(orderId, user.id);
  }

  @UseGuards(AtGuard)
  @Get('getOrders')
  getOrders(
    @CurrentUser() user: User,
    @Query('page', ParseIntPipe) page: number,
    @Query('status') status?: string,
  ) {
    const numericStatus = status ? parseInt(status, 10) : undefined;
    return this.ordersService.getOrders(user.id, page, numericStatus);
  }

  @UseGuards(AtGuard)
  @Get('getOrder')
  getOrder(
    @CurrentUser() user: User,
    @Query('order_id', ParseIntPipe) order_id: number,
  ) {
    return this.ordersService.getOrder(order_id, user.id);
  }
}
