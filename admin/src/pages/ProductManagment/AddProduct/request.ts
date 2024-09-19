/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateProductProps, VariantsProps } from "@/types";
import request from "@/utils/request";

export const getSku = async() => {
    try {
      const res = await request({url: '/product/sku', method: 'get'})
      return res?.data
    } catch (error: any) {
      throw new Error(error);
    }
  }

 export const getBarcode = async() => {
    try {
      const res = await request({url: '/product/barcode', method: 'get'})
      return res?.data
    } catch (error: any) {
      throw new Error(error);
    }
  }

  export const getVariantGroups = async() => {
    try {
      const res = await request({url: '/variations/get-groups', method: 'get'})
      return res?.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  export const getVariantOptions = async(id:string) => {
    try {
      const res = await request({url: `variations/get-options?id=${id}`, method: 'get'})
      return res?.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  export const createProduct = async({
    form,
    price,
    desc,
    image,
    images,
    discount_price,
    combinations,
  }: CreateProductProps) => {
    try {
      const formData = new FormData();

    // Tekli resim için
    if (image.data) {
      formData.append('image', image.data);
    }

    // Çoklu resimler için
    images.forEach((img) => {
      if (img.data) {
        formData.append(`images`, img.data);
      }
    });

    formData.append('price', price.toString());
    
    if (discount_price) {
      formData.append('special', discount_price.toString());
    }

    formData.append('combinations', JSON.stringify(combinations));

    formData.append('desc', desc);
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('barcode', form.barcode);
    formData.append('sku', form.sku);

    if (form.manufacturer) {
      formData.append('manufacturer', form.manufacturer);
    }

    formData.append('mpn', form.mpn.toString());
    formData.append('stock', form.stock.toString());

    if (form.weight) {
      formData.append('weight', form.weight.toString());
    }

    formData.append('short_desc', form.short_desc);

    const res = await request({url: '/product/create', data: formData, customHeaders: {
      'Content-Type': 'multipart/form-data',
    }})
      return res?.data
    } catch (error: any) {
      throw new Error(error);
    }
  }

  export const handleCombinations = async(variants: VariantsProps[]) => {
    try {
      const res = await request({url: '/comnbinations', data: variants})

      return res?.data;

    } catch (error: any) {
      throw new Error(error);
    }
  }