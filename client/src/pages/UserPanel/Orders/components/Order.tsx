import Hourglass from '@/assets/icons/hourglass.svg'
import Arrow from '@/assets/icons/arrow.svg'
import Truck from '@/assets/icons/truck.svg'
import Success from '@/assets/icons/tick.svg'
import Cancel from '@/assets/icons/cancel.svg'
import Icon from '@/components/icon'
import { formatDateWithDayInTurkish, onlyDate, priceMasking } from '@/utils/helpers'
import Image from '@/components/Image'
import { IOrder } from '@/types'
import { API_URL } from '@/config'
import { Link } from 'react-router-dom'
const Order = ({
    data
}: {
    data: IOrder
}) => {

    const getIcon = (statusId: number) => {
        switch (statusId) {
          case 1:
          case 2:
            return <Hourglass />;
          case 3:
            return <Truck />;
          case 4:
            return <Success />;
          case 5:
          case 6:
            return <Cancel />;
          default:
            return null;
        }
      };

  return (
    <div className="w-full shrink-0 p-3 border border-border rounded-md flex items-center justify-between gap-5 text-primary">
        <div className="flex max-lg:flex-col lg:items-center gap-3 lg:gap-5">
            <div className="w-[160px] lg:w-[200px] gap-2 grid grid-cols-3">
                {
                    data.order_items?.slice(0, 3).map((v, i) => (
                        <div key={i} className="w-full aspect-square rounded-md border border-border overflow-hidden">
                            <Image src={`${API_URL}/${v.image}`}/>
                        </div>
                    ))
                }
            </div>

            <div className="text-xs md:text-sm max-lg:hidden min-w-40 shrink-0">
                Sipariş No: <b>{data.id}</b>
            </div>
            <div className="text-xs md:text-sm min-w-40 shrink-0 flex items-center gap-2">
                <Icon
                    width='15px'
                    height='20px'
                    icon={getIcon(data.status.id)}
                />
                <p>
                    {data.status.name}
                </p>
            </div>
        </div>
            <div className='flex items-center gap-3 lg:gap-5 lg:pr-2'>
                <div className='flex flex-col items-end gap-1 text-xs lg:text-sm font-semibold'>
                    <p className='max-lg:hidden'>{formatDateWithDayInTurkish(new Date(data.createdAt))}</p>
                    <p className='lg:hidden'>{onlyDate(new Date(data.createdAt))}</p>
                    <p className='text-scrx'>{priceMasking(data.total)}</p>
                </div>
                <Link to={`/kullanicipaneli/siparislerim/detay/${data.id}`} className='rounded-full bg-secondary p-3 hover:animate-pulse duration-300'>
                    <Icon
                        width='10px'
                        height='10px'
                        color='#171717'
                        icon={<Arrow/>}
                    />
                </Link>
            </div>
    </div>
  )
}

export default Order