/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/config"
import GridBanner from "./Banners/GridBanner"
import GridThreeBanner from "./Banners/GridThreeBanner"
import SingleBanner from "./Banners/SingleBanner"
import ThreeBanner from "./Banners/ThreeBanner"
import Products from "./Products"
import SliderWrapper from "./SliderWrapper"
import { IProduct } from "@/types"
import { useCallback, useEffect, useState } from "react"
import request from "@/utils/request"

const Home = () => {

  const [products, setProducts] = useState<IProduct[]>([])

    const getProducts = useCallback(async()=> {
        try {
            const res = await request({url: '/home/products', method: 'get'})
            setProducts(res.data)
        } catch (error: any) {
            throw new Error(error)
        }
    }, [])

    useEffect(() => {
        getProducts()
    }, [getProducts])

  return (
    <main className="space-y-5 max-lg:pb-[65px]">
      <SliderWrapper/>

      <section className="container-wrapper space-y-3 lg:space-y-5 max-lg:px-2 max-xl:px-5 pb-5">
      <ThreeBanner/>
      <SingleBanner
        src={`${API_URL}/uploads/banner/banner4.png`}
        seo="/kategori/oturma-gruplari"
      />
      <Products products={products}/>
      <SingleBanner
        src={`${API_URL}/uploads/banner/banner5.png`}
        seo="/kategori/yemek-odasi"
      />
      <Products products={products}/>
      <GridBanner/>
      <SingleBanner
        src={`${API_URL}/uploads/banner/banner6.png`}
        seo="/kategori/yatak-ve-baza"
      />
      <Products products={products}/>
      <SingleBanner
        src={`${API_URL}/uploads/banner/banner7.png`}
        seo="/kategori/genc-ve-cocuk-odasi"
        />
      <Products products={products}/>
      <GridThreeBanner/>
      </section>
    </main>
  )
}

export default Home