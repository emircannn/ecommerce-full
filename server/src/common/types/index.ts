export interface ClientInfoType {
  userAgent: string;
  ipAddress: string;
}

export interface CombinationsProps {
  variant_values: {
    id: number;
    value: string;
    variant_group_id: number;
    variant_group_name: string;
  }[];
  price: null | number;
  special: null | number;
  stock: number | null;
  barcode: string;
  sku: string;
  weight: number | null;
  priceValue: string;
  specialValue: string;
}

export interface VariantOptionsProps {
  id: number;
  value: string;
}

export interface VariantsProps {
  id: number;
  name: string;
  values: VariantOptionsProps[];
}
