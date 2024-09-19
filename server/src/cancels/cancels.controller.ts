import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CancelsService } from './cancels.service';
import { CreateCancelDto } from './dto/create-cancel.dto';
import { UpdateCancelDto } from './dto/update-cancel.dto';

@Controller('cancels')
export class CancelsController {
  constructor(private readonly cancelsService: CancelsService) {}

}
