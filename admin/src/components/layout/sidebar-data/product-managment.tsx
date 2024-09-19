import Products from '@/assets/icons/product.svg';
import AddProduct from '@/assets/icons/add-product.svg';
import Excel from '@/assets/icons/excel.svg';
import Price from '@/assets/icons/price.svg';
import Brand from '@/assets/icons/brand.svg';
import Categories from '@/assets/icons/categories.svg';
import Variants from '@/assets/icons/variants.svg';
import Back from '@/assets/icons/back.svg';

const productsCardData = [
    {
      title: "Ürünler",
      href: "/urun-yonetimi/urunler",
      icon: <Products />,
    },
    {
      title: "Ürün Ekle",
      href: "/urun-yonetimi/urun-ekle",
      icon: <AddProduct />,
    },
    {
      title: "Excel ile Ürün Ekle",
      href: "/urun-yonetimi/excel-ekle",
      icon: <Excel />,
    },
    {
      title: "Toplu Fiyat Değiştir",
      href: "/urun-yonetimi/toplu-fiyat-degistir",
      icon: <Price />,
    },
    {
      title: "Markalar",
      href: "/urun-yonetimi/markalar",
      icon: <Brand />,
    },
    {
      title: "Kategoriler",
      href: "/urun-yonetimi/kategoriler",
      icon: <Categories />,
    },
    {
      title: "Seçenek Yönetimi",
      href: "/urun-yonetimi/secenekler",
      icon: <Variants />,
    },
    {
      title: "Geri Dön",
      href: "/dashboard",
      icon: <Back />,
    },
  ];
  
  export default productsCardData;