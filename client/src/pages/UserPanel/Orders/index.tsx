/* eslint-disable @typescript-eslint/no-explicit-any */
import MainWrapper from "@/components/MainWrapper"
import Menu from "./components/Menu"
import { useCallback, useEffect, useState } from "react"
import { PaginationComp } from "@/components/PaginationComp"
import Order from "./components/Order"
import request from "@/utils/request"
import { IOrder } from "@/types"
import OrderLoading from "./components/OrderLoading"
import Empty from '@/assets/icons/empty-box.svg'
import Icon from "@/components/icon"
import Heading from "@/components/UIX/Heading"
const Orders = () => {

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<number|null>(null)
  const [orders, setOrders] = useState<IOrder[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const handleOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params: {
        page?: number
        status?: number
      } = {};
      if(page) params.page = page
      if(status) params.status = status
      const res = await request({url: '/order/getOrders', method: 'get', params})
      setOrders(res.data.orders)
      setTotalPages(res.data.totalPages)
    } catch (error: any) {
      throw new Error(error)
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => {
    handleOrders()
  }, [handleOrders])
  
  const getSubTitle = (status: number) => {
    switch (status) {
      case 1:
        return "Siparişiniz bulunmamaktadır.";
      case 2:
        return "Hazırlanan siparişiniz bulunmamaktadır.";
      case 3:
        return "Kargoya verilen siparişiniz bulunmamaktadır.";
      case 4:
        return "Teslim edilen siparişiniz bulunmamaktadır.";
      case 5:
      case 6:
        return "İptal edilen siparişiniz bulunmamaktadır.";
      default:
        return "Devam eden siparişiniz bulunmamaktadır.";
    }
  };

  return (
    <MainWrapper>
      <Menu
        setStatus={setStatus}
        status={status}
        setPage={setPage}
      />
      <div className="w-full h-full hideScrollRes lg:pr-2 overflow-y-auto space-y-5">
        {
          !loading ?
          orders.length > 0 ?
          orders?.map((v, i) => (
            <Order
              key={i}
              data={v}
            />
          ))
        :
        <div className="w-full h-full flex items-center flex-col gap-5 justify-center">
            <Icon
              icon={<Empty/>}
              width="150px"
              height="150px"
            />
            <Heading
              title="Sonuç Bulunamadı"
              subTitle={getSubTitle(status || 1)} // status değişkeni buradan alınır
              center
            />
        </div>
        :
        [...Array(5)].map((_, i) => (
          <OrderLoading
            key={i}
          />
        ))
      }
      </div>
      {totalPages > 1 &&
      (<div className="w-full overflow-x-auto hideScroll flex items-center justify-center">
      <PaginationComp
            totalPages={totalPages}
            setPage={setPage}
            currentPage={page}
        />
      </div>)}
    </MainWrapper>
  )
}

export default Orders