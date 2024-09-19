import Image from "@/components/Image"
import { API_URL } from "@/config"
import { IOrderItem } from "@/types"
import { priceMasking } from "@/utils/helpers"
import { Link } from "react-router-dom"

const Order = ({
    data
}: {
    data: IOrderItem
}) => {

  return (
    <div className="p-3 flex gap-3 w-full">
        <div className="w-16 h-16 lg:h-20 lg:w-20 shrink-0 rounded-md border border-border overflow-hidden">
            <Image
                src={`${API_URL}/${data.image}`}
                className="w-full h-full object-contain"
            />
        </div>
        <div className="space-y-2">
            <Link to={`/urun/${data.seo}`} className="text-sm font-medium text-secondary-foreground hover:underline">{data.name}</Link>
            <p className="text-scrx font-semibold text-sm">{data.quantity > 1 ? `Adet: ${data.quantity}` : ''}  {priceMasking(data.price)}</p>
            {data.combination && 
                (<div className="text-xs font-medium space-y-1">
                    {/* <b className="text-secondary-foreground">Özellik</b> */}
                    <div className="flex gap-1 flex-wrap">
                        {data.combination?.variant_values?.map((v, index) => (
                            <p key={index} className="px-3 py-1 rounded-md border border-border">
                            {v.value}
                            </p>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex items-center gap-3">
                <button className="text-xs font-semibold text-secondary-foreground bg-third-dark bg-opacity-40 duration-300 hover:bg-opacity-60 rounded-md px-3 py-1">
                    Tekrar Al
                </button>
                <button className="text-xs font-semibold rounded-md px-3 py-1 text-scrx bg-scrx bg-opacity-30 hover:bg-opacity-50 duration-300">
                    Değerlendir
                </button>
            </div>
        </div>
    </div>
  )
}

export default Order