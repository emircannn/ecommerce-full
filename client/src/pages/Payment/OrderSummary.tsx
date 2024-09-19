import Image from "@/components/Image"
import { API_URL } from "@/config"
import { IOrderItem } from "@/types"
import { priceMasking } from "@/utils/helpers"
import { Link } from "react-router-dom"

const OrderSummary = ({
    data
}: {
    data: IOrderItem
}) => {
  return (
    <div className="p-3 rounded-md border border-border flex gap-5">
        <div className="w-20 aspect-square shrink-0 rounded-md border border-border overflow-hidden">
            <Image
                src={`${API_URL}/${data.image}`}
            />
        </div>
        <div className="flex flex-col justify-between w-full h-20">
            <Link to={`/urun/${data.seo}`} className="text-xs font-semibold">{data.name}</Link>

            {
                data.combination &&
                (<div className="flex items-center gap-2 text-xs">
                    <b>Özellikler:</b>
                    {
                        data.combination.variant_values?.map((v, i) => (
                            <div key={i} className=" font-medium px-3 py-1 rounded-md border border-border">
                                {v.value}
                            </div>
                        ))
                    }
                </div>)
            }

            {/* Price */}
            <div className="text-xs">
                {
                    data.combination ?
                    (
                    <p>
                        {data.combination.special && (<s>{priceMasking(data.combination.price)}</s>)} {priceMasking(data.combination.special ?? data.combination.price)} X <b>{data.quantity}</b> = <b>{priceMasking((data.combination.special ?? data.combination.price) * data.quantity)}</b>
                    </p>
                    )
                    :
                    (
                    <p>
                        {data!.product!.special && (<s>{priceMasking(data!.product!.price)}</s>)} {priceMasking(data!.product!.special ?? data!.product!.price)} X <b>{data.quantity}</b> = <b>{priceMasking((data!.product!.special ?? data!.product!.price) * data.quantity)}</b>
                    </p>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default OrderSummary