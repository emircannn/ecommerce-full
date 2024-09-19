import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { AtGuard } from 'src/common/guards/at.guard';
import { CurrentUser } from 'src/common/decorators/get_current_user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      return this.usersService.register(dto, response);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(AtGuard)
  @Get('user')
  getUser(@CurrentUser() user: User) {
    return this.usersService.getUsers(user.id);
  }

  @UseGuards(AtGuard)
  @Post('update')
  updateUser(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(user.id, dto);
  }
}
