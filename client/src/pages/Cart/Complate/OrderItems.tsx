import { ICartItem } from "@/types"
import OrderItem from "./OrderItem"
import OrderItemLoading from "./OrderItemLoading"

const OrderItems = ({
    cartItems,
    loading
}: {
    cartItems: ICartItem[]
    loading: boolean
}) => {
  return (
    <div className=" space-y-3 rounded-md p-5 shadow-lg border border-border h-fit">
        <p className="text-sm font-semibold">Teslim Edilecek Ürün(ler)</p>
        <div className="flex flex-col h-fit max-lg:gap-2">
        { !loading ?
            cartItems?.map((v, i) => (
                <OrderItem
                    key={i}
                    data={v}
                />
            ))
            :
            [...Array(2)].map((_, i) => (
                <OrderItemLoading
                    key={i}
                />
            ))
        }
        </div>
    </div>
  )
}

export default OrderItems