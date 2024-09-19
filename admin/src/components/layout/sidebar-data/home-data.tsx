import Dashboard from '@/assets/icons/dashboard.svg';
import Orders from '@/assets/icons/orders.svg';
import Products from '@/assets/icons/products.svg';
import Users from '@/assets/icons/users.svg';
import Reports from '@/assets/icons/reports.svg';
import Design from '@/assets/icons/design.svg';
import Reviews from '@/assets/icons/reviews.svg';
import Coupon from '@/assets/icons/coupon.svg';


const homeCardData = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Dashboard />,
    },
    {
      title: "Ürün Yönetimi",
      href: "/urun-yonetimi/urunler",
      icon: <Products />,
    },
    {
      title: "Siparişler",
      href: "/siparisler",
      icon: <Orders />,
    },
    {
      title: "Kullanıcılar",
      href: "/kullanicilar",
      icon: <Users />,
    },
    {
      title: "Raporlar",
      href: "/raporlar",
      icon: <Reports />,
    },
    {
      title: "Tasarım",
      href: "/tasarim",
      icon: <Design />,
    },
    {
      title: "Değerlendirmeler",
      href: "/degerlendirmeler",
      icon: <Reviews />,
    },
    {
      title: "Kupon Yönetimi",
      href: "/kuponlar",
      icon: <Coupon />,
    },
  ];
  
  export default homeCardData;
  