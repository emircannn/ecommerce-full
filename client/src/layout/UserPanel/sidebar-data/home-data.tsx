import Account from '@/assets/icons/account.svg';
import Orders from '@/assets/icons/order.svg';
import Home from '@/assets/icons/home.svg';


const homeCardData = [
  {
    title: "Siparişlerim",
    href: "/kullanicipaneli/siparislerim",
    icon: <Orders/>,
  },
  {
    title: "Hesap Ayarlarım",
    href: "/kullanicipaneli/hesap-ayarlarim",
    icon: <Account/>,
  },
  {
    title: "Anasayfa",
    href: "/",
    icon: <Home/>,
  },
  ];
  
  export default homeCardData;
  