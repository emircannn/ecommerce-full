import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginModal from "./components/modals/LoginModal"
import QuestionModal from "./components/modals/QuestionModal"
import RegisterModal from "./components/modals/RegisterModal"
import Home from "./pages/Home"
import BaseLayout from "./utils/BaseLayout"
import GoogleLogin from "./pages/GoogleLogin"
import ProtectedRoute from "./utils/ProtectedRoute"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthProvider"
import ProductDetail from "./pages/ProductDetail"
import { CartProvider } from "./contexts/CartContex"
import Cart from "./pages/Cart"
import Complate from "./pages/Cart/Complate"
import Success from "./pages/Payment/Success"
import Fail from "./pages/Payment/Fail"
import Category from "./pages/Category"
import Manufacturer from "./pages/Manufacturer"
import AccountSettings from "./pages/UserPanel/AccountSettings"
import { UserProvider } from "./contexts/UserContext"
import Orders from "./pages/UserPanel/Orders"
import OrderDetail from "./pages/UserPanel/Orders/Detail"

function App() {

  return (
    <AuthProvider>
      <UserProvider>
      <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Safe */}
          <Route element={<BaseLayout/>}>
            <Route element={<Home/>} path="/"/>
            <Route element={<ProductDetail/>} path="/urun/:seo"/>
            <Route path="/sepet">
              <Route element={<Cart/>} path=""/>
              <Route element={<Complate/>} path="tamamla"/>
            </Route>
            <Route path="/odeme">
              <Route element={<Success/>} path="basarili/:order_id"/>
              <Route element={<Fail/>} path="basarisiz"/>
            </Route>
            <Route path="/kategori/:seo" element={<Category/>}/>
            <Route path="/marka/:seo" element={<Manufacturer/>}/>
          </Route>

          <Route element={<GoogleLogin/>} path="/google-auth"/>

          {/* UserPanel */}
            <Route element={<ProtectedRoute/>} path="/kullanicipaneli">
                <Route element={<AccountSettings/>} path="hesap-ayarlarim"/>
                <Route element={<Orders/>} path="siparislerim"/>
                <Route element={<OrderDetail/>} path="siparislerim/detay/:id"/>
            </Route>
        </Routes>
      </BrowserRouter>
      {/* Modals */}
        <QuestionModal/>
        <RegisterModal/>
        <LoginModal/>
        <Toaster />
      </CartProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
