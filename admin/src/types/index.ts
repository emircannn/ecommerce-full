import { ImageProps } from "@/pages/ProductManagment/AddProduct/components/ProductInfo/ProductInfo";

export interface SelectCategoriesProps {
    id: number;
    name: string
    sub_categories: SelectCategoriesProps[]
}

export interface CategoriesProps extends SelectCategoriesProps {
    image: string,
    seo: string
    show_home: boolean;
    parent: CategoriesProps | null
    home_parent: CategoriesProps | null
    sub_categories: CategoriesProps[]
    product_count: number | string
}

export interface SelectManufacturerProps {
    id: string
    name: string
}

export interface ManufacturerProps extends SelectManufacturerProps {
    createdAt: Date
    image: string
    seo: string
    updatedAt: Date
}

export interface ProductFormProps {
    name: string;
    short_desc: string;
    sku: string;
    barcode: string;
    mpn: number | string;
    stock: number | string;
    weight: number | string;
    category: string;
    manufacturer: string;
}

export interface VariantGroupsProps {
    id: string;
    name: string;
}

export interface VariantOptionsProps {
    id: string | number;
    value: string;
}

export interface VariantsProps {
    id: string | number;
    name: string | undefined;
    values: VariantOptionsProps[]
}

export interface PriceType {
    float: number | null;
    formatted: string;
    value: string
}


export interface CreateProductProps {
    form : ProductFormProps;
    image: ImageProps;
    images: ImageProps[];
    desc: string;
    price: number;
    discount_price?: number | null;
    combinations: CombinationsProps[];
}

export interface CombinationsProps {
    variant_values: {id: string | number; value: string; variant_group_id: string | number, variant_group_name: string;}[];
    price: null | number;
    special: null | number;
    stock: number | null;
    barcode: string;
    sku: string;
    weight: number | null;
    priceValue: string;
    specialValue: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    special: number | null;
    weight: number | null;
    image: string;
    sku: string;
    barcode: string;
    stock: number;
    is_active: boolean;
    category?: CategoriesProps
  }
  
export interface ProductListResponse {
    data: Product[];
    total: number;
    totalPages: number;
    limit: number;
  }

  export interface ManufacturerListResponse {
    data: ManufacturerProps[];
    total: number;
    totalPages: number;
    limit: number;
  }

  export interface CategoryListResponse {
    data: CategoriesProps[];
    total: number;
    totalPages: number;
    limit: number;
  }