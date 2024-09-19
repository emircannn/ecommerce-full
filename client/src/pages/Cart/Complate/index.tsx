/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { IAddress, ICart } from "@/types"
import { priceMasking } from "@/utils/helpers"
import request from "@/utils/request"
import { useCallback, useEffect, useState } from "react"
import Adresses from "./Adresses"
import OrderItems from "./OrderItems"
import { useAuth } from "@/contexts/AuthProvider"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const Complate = () => {

    const [cart, setCart] = useState<ICart>()
    const [loading, setLoading] = useState(true)
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()
    const {toast} = useToast()
    const [complateLoading, setComplateLoading] = useState(false)
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

    const [addresses, setAddresses] = useState<IAddress[]>([])
    const [invoiceAddress, setInvoiceAddress] = useState<IAddress>()
    const [individualAddress, setIndividualAddress] = useState<IAddress>()

    const handleGetAddresses = useCallback(async () => {
        try {
            const res = await request({url: '/address/getAddress', method: 'get'})
            setAddresses(res.data)
        } catch (error: any) {
            throw new Error(error)
        }
    }, [])

    useEffect(() => {
        handleGetAddresses()
    }, [handleGetAddresses])

    useEffect(() => {
        if(addresses.length > 0 && !invoiceAddress && !individualAddress) {
            const primaryAddress = addresses.find((address) => address.primary === true);
            setIndividualAddress(primaryAddress)
            setInvoiceAddress(primaryAddress)
        }
    }, [addresses, individualAddress, invoiceAddress])

    const handleComplate = async () => {
        if(invoiceAddress && individualAddress) {
            try {
                setComplateLoading(true);
                const data = {
                    invoiceAddressId: invoiceAddress.id,
                    individualAddressId: individualAddress.id
                }
                const res = await request({url: '/order/create', data})
                toast({title: "İşlem Başarılı.", description: 'Ödeme Sayfasına yönlendiriliyorsunuz...'})
                window.location.href = res.data.paymentUrl;
            } catch (error) {
                const err = error as { status: number, response: { data: { message: string } } };
                toast({
                title: "İşlem Başarısız!",
                description: err.response.data.message
                })
            } finally {
                setComplateLoading(false);
            }
        } else {
            toast({title: "İşlem Başarısız!", description: 'Teslimat ve Fatura Adresini Seçin.'})
        }
    }
    
    if(!isAuthenticated) {
        navigate('/')
        return null;
    }

  return (
    <main className="container-wrapper grid grid-cols-4 gap-5 py-5 max-lg:pb-[60px]">
        <section className="col-span-4 lg:col-span-3 space-y-5">
            <Adresses
                addresses={addresses}
                invoiceAddress={invoiceAddress}
                individualAddress={individualAddress}
                handleGetAddresses={handleGetAddresses}
                setInvoiceAddress={setInvoiceAddress}
                setIndividualAddress={setIndividualAddress}
            />

            <OrderItems
                cartItems={cart?.cart_items || []}
                loading={loading}
            />
        </section>

        <aside className="col-span-4 lg:col-span-1 bg-secondary p-4 space-y-5 rounded-md h-fit shadow-lg">
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
                <Button
                disabled={complateLoading}
                onClick={handleComplate}
                className="w-full h-[50px]">
                    Ödemeye Geç
                </Button>
            </div>
        </aside>
    </main>
  )
}

export default Complate