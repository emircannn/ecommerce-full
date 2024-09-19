import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariationGroups, VariationOptions } from './entities/variation.entity';
import { Repository } from 'typeorm';
import { successReturn } from 'utils/helpers';
import { VariantGroupUpdateDto, VariantOptionDto } from './dto/variant.dto';

@Injectable()
export class VariationsService {
  constructor(
    @InjectRepository(VariationGroups)
    private readonly groupRepository: Repository<VariationGroups>,
    @InjectRepository(VariationOptions)
    private readonly optionsRepository: Repository<VariationOptions>,
  ) {}

  //* Group Create
  async createGroup(name: string) {
    const newGroup = this.groupRepository.create({ name });
    await this.groupRepository.save(newGroup);

    return successReturn({ message: 'Seçenek grubu başarıyla oluşturuldu.' });
  }

  //* Option Create
  async optionCreate(dto: VariantOptionDto) {
    const group = await this.groupRepository.findOne({
      where: { id: dto.group_id },
    });

    if (!group) {
      throw new BadRequestException('Böyle bir seçenek grubu bulunamadı!');
    }

    const newOption = this.optionsRepository.create({
      value: dto.name,
      variant_group: group,
    });

    // Save işlemi
    await this.optionsRepository.save(newOption);

    return successReturn({ message: 'Seçenek değeri başarıyla oluşturuldu!' });
  }

  //! Delete Group
  async deleteGroup(id: number) {
    await this.groupRepository.delete(id);

    return successReturn({ message: 'Seçenek grubu başarıyla silindi.' });
  }

  //! Delete Option
  async deleteOption(id: number) {
    await this.optionsRepository.delete(id);

    return successReturn({ message: 'Seçenek değeri başarıyla silindi.' });
  }

  //* Grup Guncelleme
  async updateGroup(dto: VariantGroupUpdateDto) {
    await this.groupRepository.update(dto.id, { name: dto.name });

    return successReturn({ message: 'Seçenek grubu başarıyla güncelle.' });
  }

  //* Deger Guncelleme
  async updateOption(dto: VariantGroupUpdateDto) {
    await this.optionsRepository.update(dto.id, { value: dto.name });

    return successReturn({ message: 'Seçenek değeri başarıyla güncelle.' });
  }

  //* Get Groups
  async getGroups() {
    const groups = await this.groupRepository.find();

    return groups;
  }

  async getOptions(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
    });
    const options = await this.optionsRepository.find({
      where: { variant_group: group },
    });

    return options;
  }
}
