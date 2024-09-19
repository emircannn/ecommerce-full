
export interface ICategory {
    id: number;
    name: string;
    image?: string;
    seo: string;
    parent?: ICategory;
    home_parent?: ICategory;
    show_home: boolean;
    createdAt: Date;
    updatedAt: Date;
    sub_categories?: ICategory[];
    home_sub?: ICategory[];
    products?: IProduct[];
  }

  export enum Role {
    ADMIN = 'admin',
    USER = 'user',
  }
  
  export enum Gender {
    MAN = 'man',
    WOMAN = 'woman',
  }

  export enum AddressType {
    BILLING = 'billing',
    DELIVERY = 'delivery',
  }
  
  export enum BillingType {
    INDIVIDUAL = 'individual',
    CORPORATE = 'corporate',
  }
  
  export interface IUser {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    password: string;
    email_verified: boolean;
    role: Role;
    gender?: Gender | null;
    refresh_token?: string | null;
    createdAt: Date;
    updatedAt: Date;
    cart: ICart;
  }

  export interface IProduct {
    id: number;
    name: string;
    seo: string;
    short_desc?: string;
    desc: string;
    price: number;
    special?: number;
    discount_rate?: number;
    image?: string;
    images?: string[];
    sku: string;
    barcode: string;
    mpn: number;
    stock: number;
    weight?: number;
    is_active: boolean;
    rating: number;
    view_count: number;
    createdAt: Date;
    updatedAt: Date;
    offer_date?: Date;
    category?: ICategory;
    manufacturer?: IManufacturer;
    rate_count: number;
    variants?: Variant[];
    selectedVariant: null | Combination;
  }

 export interface IManufacturer {
  id: number;
  name: string;
  image: string;
  seo: string;
  products?: IProduct[];
 }

 export interface Variant {
  id: string;
  name: string;
  values: VariantValue[];
}

interface VariantValue {
  uid: number | string;
  id: number;
  value: string;
  combinations: string[]; 
  variant: Variant; 
}

export interface Combination {
  id: number;
  variant_values: {
    variant_group_id: string;
    id: number;
    value: string;
  }[];
  price: number;
  special?: number;
  discount_rate?: number;
  stock: number;
  barcode: string;
  sku: string;
  weight?: number;
  product: IProduct;
}

export interface ICart {
  id: number;
  product_total: number;
  cargo: number;
  coupon: number;
  total: number;
  session_id?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  cart_items: ICartItem[];
}

export interface ICartItem {
  id: number;
  cart: ICart;
  product: IProduct;
  combination?: Combination | null;
  quantity: number;
  price: number;
}

export interface IAddress {
  id: number;
  title: string;
  primary: boolean;
  tax_no?: string;
  address_type: AddressType;
  billing_type?: BillingType;
  name: string;
  phone: string;
  lastname: string;
  tck_no?: string;
  company_name?: string;
  tax_office?: string;
  city_id: number;
  city: string;
  district: string;
  district_id: number;
  neighborhoods: string;
  neighborhoods_id: number;
  address: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  id: number;
  total: number;
  product_total: number;
  coupon: number;
  cargo: number;
  decont?: string;
  payment_success: boolean;
  invoiceAddress?: IAddress;
  individualAddress?: IAddress;
  complate_date?: Date;
  return_accept_date?: Date;
  user: IUser;
  order_items: IOrderItem[];
  bill:string | null;
  cargo_code:string | null;
  status: IStatus
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: number;
  order: IOrder;
  product?: IProduct;
  combination?: Combination;
  name: string;
  price: number;
  image?: string;
  seo?: string;
  quantity: number;
  status: IStatus
}

export interface ProductResponse {
  data: IProduct[];
  total: number;
  totalPages: number;
}

export interface IStatus {
  id: number;
  name: string;
}

