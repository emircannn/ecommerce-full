import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City, District, Neighborhoods } from './entities/map.entity';
import { HttpModule } from '@nestjs/axios';
import { AtStrategy } from 'src/common/strategies/at-strategy';
import { Address } from './entities/address.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, District, Neighborhoods, Address]),
    HttpModule,
    UsersModule,
  ],
  controllers: [AddressController],
  providers: [AddressService, AtStrategy],
})
export class AddressModule {}
