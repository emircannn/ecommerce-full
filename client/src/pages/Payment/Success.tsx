import Icon from "@/components/icon"
import SuccessIcon from '@/assets/icons/payment_success.svg'
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import request from "@/utils/request"
import { IOrderItem } from "@/types"
import OrderSummary from "./OrderSummary"
import OrderSummaryLoading from "./OrderSummaryLoading"

const Success = () => {
    const { order_id } = useParams<{ order_id: string }>();
    const navigate = useNavigate()
    const {toast} = useToast()
    const [summary, setSummary] = useState<{total: number, orderItems: IOrderItem[]}>()
    const [loading, setLoading] = useState(true)

    const handleGetSummary = useCallback(async () => {
        try {
            setLoading(true)
            const res = await request({url: `/order/order_summary?order_id=${order_id}`, method: 'get'})
            setSummary(res.data)
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
                toast({
                title: "İşlem Başarısız!",
                description: err.response.data.message
                })
            navigate('/')
        } finally {
            setLoading(false);
        }
    }, [navigate, order_id, toast])

    useEffect(() => {
        handleGetSummary()
    }, [handleGetSummary])
    

  return (
    <div className="container-wrapper flex flex-col items-center justify-center gap-5 min-h-[calc(100vh_-_189px)] py-5">
            <Icon
                icon={<SuccessIcon/>}
                height='120px'
                width='120px'
            /> 

            <p className='text-2xl font-semibold'>Ödeme İşlemi Başarılı</p>

            <div className="space-y-3 w-full lg:w-3/4">
            <p className="font-semibold border-b border-border w-full pb-2 text-center">Sipariş Özeti</p>

            <div className="space-y-2">
                {
                    !loading ?
                        summary?.orderItems?.map((v, i) => (
                            <OrderSummary
                                key={i}
                                data={v}
                            />
                        ))
                    :
                    [...Array(2)].map((_, i) => (
                        <OrderSummaryLoading
                            key={i}
                        />
                    ))
                }
            </div>

            </div>

            <div className='flex gap-5'>
                <Button onClick={() => navigate('/')} variant={'outline'}>
                    Anasayfaya Git
                </Button>
                <Button variant={'accept'} onClick={() => navigate('/kullanicipaneli/siparislerim')}>
                    Siparişlerim
                </Button>
            </div>
    </div>
  )
}

export default Success