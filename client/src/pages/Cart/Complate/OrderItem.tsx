import Image from "@/components/Image"
import { API_URL } from "@/config"
import { ICartItem } from "@/types"
import { formatDateWithDayInTurkish, priceMasking } from "@/utils/helpers"
import { Link } from "react-router-dom"

const OrderItem = ({
    data
}: {
    data: ICartItem
}) => {

    const currentDate = new Date();
    const daysToAdd = data.product.mpn ? Number(data.product.mpn) : 0;
    currentDate.setDate(currentDate.getDate() + daysToAdd);

  return (
    <div className="lg:p-3 flex items-center justify-between gap-5 border-t h-fit border-border">
        <div className="flex gap-3 lg:gap-5 w-full">
            <div className="w-20 h-20 lg:w-24 aspect-square rounded-md overflow-hidden shrink-0 border border-border">
                <Image
                    src={`${API_URL}/${data.product.image}`}
                />
            </div>
            <div className="h-fit lg:h-24 flex justify-between gap-5 flex-col w-full">
            <Link to={`/urun/${data.product.seo}`} className="text-sm font-semibold hover:underline">{data.product.name}</Link>
            <p className="text-sm">
            Tahmini Teslim Süresi: <b>{formatDateWithDayInTurkish(currentDate)}</b>
            </p>
            <div className="text-sm">
                    {
                        data.combination ?
                        (
                        <p>
                            {data.combination.special && (<s>{priceMasking(data.combination.price)}</s>)} {priceMasking(data.combination.special ?? data.combination.price)} X {data.quantity} = <b>{priceMasking((data.combination.special ?? data.combination.price) * data.quantity)}</b>
                        </p>
                        )
                        :
                        (
                        <p>
                            {data.product.special && (<s>{priceMasking(data.product.price)}</s>)} {priceMasking(data.product.special ?? data.product.price)} X {data.quantity} = <b>{priceMasking((data.product.special ?? data.product.price) * data.quantity)}</b>
                        </p>
                        )
                    }
                </div>
            </div>
        </div>

        {/* <div className="shrink-0">
            <Label className="text-xs font-semibold">Sipariş Notu</Label>
            <Textarea
                className="w-[250px] resize-none"
            />
        </div> */}
    </div>
  )
}

export default OrderItem