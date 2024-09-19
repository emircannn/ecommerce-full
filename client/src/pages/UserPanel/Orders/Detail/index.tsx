import MainWrapper from "@/components/MainWrapper"
import Heading from "@/components/UIX/Heading"
import LoadingScreen from "@/components/UIX/LoadingScreen"
import { useToast } from "@/hooks/use-toast"
import { BillingType, IOrder } from "@/types"
import { formatDate, priceMasking } from "@/utils/helpers"
import request from "@/utils/request"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Order from "./Order"
import Buttons from "./Buttons"
import { Collapse } from "@mui/material"
import Icon from "@/components/icon"
import Arrow from '@/assets/icons/arrow.svg'
import { cn } from "@/lib/utils"

const OrderDetail = () => {
    const [order, setOrder] = useState<IOrder>()
    const [loading, setLoading] = useState(true)
    const [address, setAddress] = useState(false)
    const { id } = useParams<{ id: string }>();
    const {toast} = useToast()

    const handleGetOrder = useCallback(async() => {
        try {
            setLoading(true)
            const res = await request({url: `/order/getOrder?order_id=${id}`, method: 'get'})
            setOrder(res.data)
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
                title: "İşlem Başarısız!",
                description: err.response.data.message
            })
            window.location.href = "/kullanicipaneli/siparislerim";
        } finally {
            setLoading(false);
        }
    }, [id, toast])

    useEffect(() => {
        handleGetOrder()
    }, [handleGetOrder])

    if(loading) {
        return <LoadingScreen/>
    }

  return (
    <MainWrapper>
        <div className="space-y-5">
            <Heading
                title="Sipariş Detayı"
            />
            <div className="text-sm">
                <p>Sipariş Numarası: <b>{order?.id}</b></p>
                <p>{formatDate(new Date(order!.createdAt))}</p>
            </div>
        </div>
        <div className="space-y-5 w-full lg:px-10 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 border-border w-full border rounded-md">
                <div className="">
                    {
                        order?.order_items?.map((v, i) => (
                            <Order key={i} data={v}/>
                        ))
                    }
                </div>
                <Buttons
                    order={order}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5 w-full">
                <div className="space-y-5">
                    <Heading
                        title="Adres Bilgileri"
                    />
                    <div className="w-full flex flex-col gap-2">
                        <div className="w-full p-3 lg:p-5 rounded-md border border-border">
                            <p className="max-lg:text-sm font-semibold">Teslimat Adresi</p>
                            <div className="flex flex-col gap-1 text-xs lg:text-sm mt-3">
                                <b>{order?.individualAddress?.title}</b>
                                <p>{order?.individualAddress?.address}</p>
                                <p>{order?.individualAddress?.neighborhoods} / {order?.individualAddress?.district} / {order?.individualAddress?.city}</p>
                                <b>{order?.individualAddress?.name} {order?.individualAddress?.lastname} / {order?.individualAddress?.phone}</b>
                            </div>
                        </div>
                        <div className="w-full p-3 lg:p-5 rounded-md border border-border">
                            <div className="flex items-center justify-between">
                                <p className="max-lg:text-sm font-semibold">Fatura Adresi</p>
                                <button
                                className={cn("p-2 rounded-full bg-secondary duration-300", address ? 'rotate-[270deg]' : 'rotate-90')}
                                onClick={() => setAddress(!address)}
                                >
                                    <Icon icon={<Arrow/>} width="12px" height="12px"/>
                                </button>
                            </div>
                            <Collapse in={address}>
                            <div className="flex flex-col gap-1 text-xs lg:text-sm mt-3">
                                <b>{order?.invoiceAddress?.title}</b>
                                <p>{order?.invoiceAddress?.address}</p>
                                <p>{order?.invoiceAddress?.neighborhoods} / {order?.invoiceAddress?.district} / {order?.invoiceAddress?.city}</p>
                                <b>{order?.invoiceAddress?.name} {order?.invoiceAddress?.lastname} / {order?.invoiceAddress?.phone}</b>

                                {/* Bireysel Adres Bilgileri */}
                                {order?.invoiceAddress?.billing_type === BillingType.INDIVIDUAL && order?.invoiceAddress?.tck_no && (
                                    <p>TCK No: {order.invoiceAddress.tck_no}</p>
                                )}

                                {/* Kurumsal Adres Bilgileri */}
                                {order?.invoiceAddress?.billing_type === BillingType.CORPORATE && order?.invoiceAddress?.tax_office && order?.invoiceAddress?.tax_no && (
                                    <>
                                    <p>Şirket Adı: <b>{order.invoiceAddress.company_name}</b></p>
                                    <p>Vergi Dairesi: <b>{order.invoiceAddress.tax_office}</b></p>
                                    <p>Vergi No: <b>{order.invoiceAddress.tax_no}</b></p>
                                    </>
                                )}
                            </div>
                            </Collapse>
                        </div>
                    </div>
                </div>
                <div className="space-y-5">
                    <Heading
                        title="Ödeme Bilgileri"
                    />
                    <div className="w-full p-3 lg:p-5 rounded-md border border-border text-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <p>Ürün Toplamı</p>
                            <b>{priceMasking(order?.product_total || 0)}</b>
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Kupon</p>
                            <b>-{priceMasking(order?.coupon || 0)}</b>
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Kargo</p>
                            <b>{priceMasking(order?.cargo || 0)}</b>
                        </div>
                        <div className="flex items-center pt-3 px-3 border-t border-border justify-between">
                            <p>Genel Toplam</p>
                            <b>{priceMasking(order?.total || 0)}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainWrapper>
  )
}

export default OrderDetail