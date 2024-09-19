import { CombinationsProps, VariantsProps } from "@/types";

export function validateCombinations(combinations: CombinationsProps[]): boolean {
    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i];
      if (combination.price && combination.special !== null && combination.special >= combination.price) {
        return false;
      }
    }
    return true;
  }

  export function calculateDiscountPercentage(price: number | null, special: number | null): number | null {
    if (!price || !special) {
        return null;
    }

    const discount = ((price - special) / price) * 100;
    return Math.round(discount); // İndirimi tam sayıya yuvarlar
}

export function priceMasking(price: number): string {
  return price.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
  });
}

export function generateVariants(
  combinations: CombinationsProps[],
) {
  const variantGroups = new Map<number, VariantsProps>();

  combinations.forEach(combination => {
    combination.variant_values.forEach(variantValue => {
      const { id, value, variant_group_id, variant_group_name } = variantValue;

      // Eğer `variant_group_id` ve `id` string olabiliyorsa, onları number türüne dönüştürüyoruz
      const numericVariantGroupId = Number(variant_group_id);
      const numericId = Number(id);

      // Eğer bu variant group daha önce eklenmemişse, ekliyoruz
      if (!variantGroups.has(numericVariantGroupId)) {
        variantGroups.set(numericVariantGroupId, {
          id: numericVariantGroupId,
          name: variant_group_name,
          values: [{ id: numericId, value }],
        });
      } else {
        const existingGroup = variantGroups.get(numericVariantGroupId)!;

        if (!existingGroup.values.some(v => v.id === numericId)) {
          existingGroup.values.push({ id: numericId, value });
        }
      }
    });
  })

  return Array.from(variantGroups.values());
}
