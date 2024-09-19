import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider"
import ProtectedRoute from "./utils/ProtectedRoute";
import ProtectedHome from "./utils/ProtectedHome";
import PanelLayout from "./components/layout/PanelLayout";
import LoginPage from "./pages/Login";
import Orders from "./pages/Panel/Orders";
import { Toaster } from "./components/ui/toaster";
import Users from "./pages/Users";
import Products from "./pages/ProductManagment/Products";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import Coupons from "./pages/Coupons";
import AddProduct from "./pages/ProductManagment/AddProduct";
import Categories from "./pages/ProductManagment/Categories";
import Manufacturers from "./pages/ProductManagment/Manufacturers";
import Variants from "./pages/ProductManagment/Variants";

function App() {

  return (
      <ThemeProvider defaultTheme="dark" storageKey="theme">
          <BrowserRouter>
            <Routes>
              {/* Giris */}
              <Route element={<ProtectedHome/>}>
                <Route element={<LoginPage/>} path="/"/>
              </Route>
              
              {/* Panel */}
              <Route element={<PanelLayout/>}>
                <Route element={<ProtectedRoute/>}>
                  <Route element={<Dashboard/>} path="/dashboard"/>
                  <Route element={<Orders/>} path="/siparisler"/>
                  <Route element={<Users/>} path="/kullanicilar"/>
                  {/* Urun Yonetimi */}
                  <Route path="/urun-yonetimi">
                    <Route element={<Products/>} path="urunler"/>
                    <Route element={<AddProduct/>} path="urun-ekle"/>
                    <Route element={<Categories/>} path="kategoriler"/>
                    <Route element={<Manufacturers/>} path="markalar"/>
                    <Route element={<Variants/>} path="secenekler"/>
                  </Route>

                  <Route element={<Reviews/>} path="/degerlendirmeler"/>
                  <Route element={<Coupons/>} path="/kuponlar"/>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>

          <Toaster />
      </ThemeProvider>
  )
}

export default App
