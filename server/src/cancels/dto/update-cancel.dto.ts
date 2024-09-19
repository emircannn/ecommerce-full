import { PartialType } from '@nestjs/mapped-types';
import { CreateCancelDto } from './create-cancel.dto';

export class UpdateCancelDto extends PartialType(CreateCancelDto) {}
