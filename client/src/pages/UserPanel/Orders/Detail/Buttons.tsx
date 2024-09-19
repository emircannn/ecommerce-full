import Hourglass from '@/assets/icons/hourglass.svg'
import Truck from '@/assets/icons/truck.svg'
import Success from '@/assets/icons/tick.svg'
import Cancel from '@/assets/icons/cancel.svg'
import CancelOrder from '@/assets/icons/cancel_order.svg'
import ReturnOrder from '@/assets/icons/return_order.svg'
import Bill from '@/assets/icons/bill.svg'
import Icon from '@/components/icon'
import { IOrder } from "@/types";
import { formatDate } from "@/utils/helpers";

const Buttons = ({
    order
}: {
    order: IOrder | undefined
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
    <div className="">
                    <div className="lg:py-5 p-3 lg:px-8 flex gap-3 border-b border-border">
                        <div className="w-[50px] h-[50px] rounded-full bg-third-dark/40 shrink-0 flex items-center justify-center">
                            <Icon
                                width="25px"
                                height="30px"
                                icon={getIcon(order?.status.id || 1)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 text-xs lg:text-sm">
                            <p className="font-semibold">{order?.status.name}</p>
                            <p className="text-scrx">Tarih: <b>{formatDate(new Date(order!.createdAt))}</b></p>
                        </div>
                    </div>
                    <div className="lg:py-5 p-3 lg:px-8 grid grid-cols-2 1420:grid-cols-3 gap-3 xl:gap-5">
                        <button 
                        disabled={!order?.bill}
                        className="px-2 py-2 lg:py-3 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center duration-300 gap-3 rounded-lg text-xs lg:text-sm font-semibold bg-third-dark bg-opacity-0 hover:bg-opacity-20">
                            <Icon
                                icon={<Bill/>}
                                width="18px"
                                height="20px"
                            />
                            <p>Fatura</p>
                        </button>
                        <button 
                        disabled={order && order?.status.id > 2}
                        className="px-2 py-2 lg:py-3 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center duration-300 gap-3 rounded-lg text-xs lg:text-sm font-semibold bg-third-dark bg-opacity-0 hover:bg-opacity-20">
                            <Icon
                                icon={<CancelOrder/>}
                                width="18px"
                                height="20px"
                            />
                            <p>İptal Et</p>
                        </button>
                        <button 
                        disabled
                        className="px-2 py-2 lg:py-3 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center duration-300 gap-3 rounded-lg text-xs lg:text-sm font-semibold bg-third-dark bg-opacity-0 hover:bg-opacity-20">
                            <Icon
                                icon={<ReturnOrder/>}
                                width="18px"
                                height="20px"
                            />
                            <p>İade Et</p>
                        </button>
                    </div>
                </div>
  )
}

export default Buttons