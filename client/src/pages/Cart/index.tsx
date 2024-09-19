/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICart } from "@/types"
import { priceMasking } from "@/utils/helpers"
import request from "@/utils/request"
import { useCallback, useEffect, useState } from "react"
import CartItem from "./CartItem"
import { Button } from "@/components/ui/button"
import CartItemLoading from "./CartItemLoading"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import { BiBasket } from "react-icons/bi"
import { useAuth } from "@/contexts/AuthProvider"
import useLoginModal from "@/hooks/LoginModalStore"

const Cart = () => {

    const [cart, setCart] = useState<ICart>()
    const [loading, setLoading] = useState(true)
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()
    const loginModal = useLoginModal()
    const handleCart = useCallback(async() => {
        try {
            setLoading(true)
            const session_id = localStorage.getItem('session_id');
            const res = await request({url: `/cart/getCart?session_id=${session_id}`, method: 'get'})
            setCart(res.data)
        } catch (error: any) {
            throw new Error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        handleCart()
    }, [handleCart])
    
    const handleComplate = () => {
        if(isAuthenticated) {
            navigate('/sepet/tamamla')
        } else {
            loginModal.onOpen()
        }
    }

  return (
    <main className="container-wrapper grid grid-cols-4 gap-5 py-5 max-lg:pb-[60px]">
        <section className="col-span-4 lg:col-span-3 space-y-5">
            {   
                !loading ?
                cart!.cart_items.length! > 0 ?
                cart!.cart_items?.map((v, i) => (
                    <CartItem
                        key={i}
                        data={v}
                        getData={handleCart}
                        cartId={cart!.id}
                    />
                ))
                : 
                (
                    <div className="w-full flex items-center justify-center h-[300px] flex-col gap-8">
                        <div className="flex flex-col gap-2 items-center">
                        <BiBasket size={50}/>
                        <b>Sepetiniz Boş</b>
                        </div>
                        <Button onClick={() => navigate('/')}>
                            Ürünlere Göz At
                        </Button>
                    </div>
                )
                : 
                [...Array(2)].map((_, i) => (
                    <CartItemLoading key={i}/>
                ))
            }
        </section>
        <aside className="col-span-4 lg:col-span-1 bg-secondary p-4 space-y-5 h-fit rounded-md shadow-lg">
            <div className="flex items-center justify-between text-sm">
                <p>Ürünler</p>
                {!loading && cart ? <b>{priceMasking(cart?.product_total)}</b> : <Skeleton className="w-[60px] h-5 rounded-full"/>}
            </div>
            <div className="flex items-center justify-between text-sm">
                <p>Kargo</p>
                {!loading && cart ? <b>{priceMasking(cart?.cargo)}</b> : <Skeleton className="w-[60px] h-5 rounded-full"/>}
            </div>
            <div className="flex items-center justify-between text-sm">
                <p>Kupon</p>
                {!loading && cart ? <b>-{priceMasking(cart?.coupon)}</b> : <Skeleton className="w-[60px] h-5 rounded-full"/>}
            </div>
            <div className="flex items-center justify-between text-sm">
                <b>Toplam</b>
                {!loading && cart ? <b>{priceMasking(cart?.total)}</b> : <Skeleton className="w-[60px] h-5 rounded-full"/>}
            </div>

            <div className="space-y-3 w-full">
                <Button variant={'outline'} className="w-full h-[50px]">
                    Kupon Kullan
                </Button>
                <Button 
                onClick={handleComplate}
                className="w-full h-[50px]">
                    Alışverişi Tamamla
                </Button>
            </div>
        </aside>
    </main>
  )
}

export default Cart