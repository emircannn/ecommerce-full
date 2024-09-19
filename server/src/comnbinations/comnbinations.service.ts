import { Injectable } from '@nestjs/common';
import { CombineVariantsDto } from './dto/comnbination.dto';
import { Combinations } from 'src/variations/entities/variation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ComnbinationsService {
  constructor(
    @InjectRepository(Combinations)
    private readonly combinationsRepository: Repository<Combinations>,
  ) {}

  async generateCombinationDraft(variantGroups: CombineVariantsDto[]) {
    const allCombinations = this.getCombinations(variantGroups);

    const draftCombinations = allCombinations.map(combination => ({
      variant_values: combination,
      price: '',
      special: '',
      stock: '',
      barcode: '',
      sku: '',
      priceValue: '',
      specialValue: '',
      weight: '',
    }));

    return draftCombinations;
  }

  private getCombinations(variantGroups: any[]): any[][] {
    const combine = (arrays: any[][]): any[][] => {
      if (arrays.length === 0) return [[]];
      const result: any[][] = [];
      const [first, ...rest] = arrays;
      for (const item of first) {
        for (const combination of combine(rest)) {
          result.push([item, ...combination]);
        }
      }
      return result;
    };

    const variantValues = variantGroups.map(group =>
      group.values.map(value => ({
        variant_group_id: group.id,
        variant_group_name: group.name,
        id: value.id,
        value: value.value,
      })),
    );

    return combine(variantValues);
  }

  async getSelectedComb(id: number) {
    return await this.combinationsRepository.findOne({ where: { id } });
  }
}
