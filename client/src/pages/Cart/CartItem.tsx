import Image from "@/components/Image"
import { API_URL } from "@/config"
import { useCart } from "@/contexts/CartContex"
import { useToast } from "@/hooks/use-toast"
import { ICartItem } from "@/types"
import { formatDateWithDayInTurkish, priceMasking } from "@/utils/helpers"
import request from "@/utils/request"
import { Trash } from "lucide-react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { Link } from "react-router-dom"

const CartItem = ({
    data,
    getData,
    cartId
}: {
    data: ICartItem
    getData: () => void,
    cartId: number
}) => {

    const currentDate = new Date();
    const daysToAdd = data.product.mpn ? Number(data.product.mpn) : 0;
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    const {setCartCount} = useCart()
    const {toast} = useToast()

    const handleDeleteFromCart = async() => {
        try {
            const dataForm = {
                cartId: Number(cartId),
                cartItemId: Number(data.id),
              }
              await request({url: '/cart/removeFromCart', data: dataForm})
              setCartCount((prev) => prev - 1);
              getData();
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
            title: "İşlem Başarısız!",
            description: err.response.data.message
            })
        }
    }

    const handleIncrease = async() => {
        try {
            const dataForm = {
                cartId: Number(cartId),
                cartItemId: Number(data.id),
                quantity: 1,
              }
              const res = await request({url: '/cart/increaseCartItemQuantity', data: dataForm})
              getData();
              toast({
                title: "İşlem Başarılı",
                description: res.data.message
                })
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
            title: "İşlem Başarısız!",
            description: err.response.data.message
            })
        }
    }

    const handleDescrease = async() => {
        try {
            const dataForm = {
                cartId: Number(cartId),
                cartItemId: Number(data.id),
                quantity: 1,
              }
              const res = await request({url: '/cart/decreaseCartItemQuantity', data: dataForm})
              if(data.quantity === 1) {
                setCartCount((prev) => prev - 1);
              }
              toast({
                title: "İşlem Başarılı",
                description: res.data.message
                })
              getData();
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
            title: "İşlem Başarısız!",
            description: err.response.data.message
            })
        }
    }

  return (
    <div className="rounded-md border border-border shadow-lg">
        <div className="p-3 border-b border-border text-sm">
            Tahmini Teslim Süresi: <b>{formatDateWithDayInTurkish(currentDate)}</b>
        </div>
        <div className="p-3 flex items-center justify-between max-lg:flex-col gap-2 lg:gap-5">
        <div className="flex items-start gap-5 w-full">
            <div className="h-[80px] lg:h-[150px] aspect-square rounded-md border shrink-0 border-border overflow-hidden">
                <Image
                    src={`${API_URL}/${data.product.image}`}
                />
            </div>
            <div className="flex flex-col justify-between h-[150px] gap-5 line-clamp-2 w-full py-2">
                <Link to={`/urun/${data.product.seo}`} className="text-sm font-semibold hover:underline">{data.product.name}</Link>
                {data.combination && 
                (<div className="text-sm space-y-2">
                    <b className="">Özellik</b>
                    <div className="flex gap-1 flex-wrap">
                        {data.combination?.variant_values?.map((v, index) => (
                            <p key={index} className="px-3 py-1 rounded-md border border-border">
                            {v.value}
                            </p>
                        ))}
                    </div>
                </div>)}

                {/* Price */}
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

            <div className="shrink-0 flex max-lg:justify-end max-lg:w-full items-center gap-5 pr-2">
                <div className="w-[80px] h-[40px] lg:w-[40px] lg:h-[80px] max-lg:flex border border-border rounded-md overflow-hidden">
                    <button
                    onClick={handleIncrease}
                    className="lg:w-full w-[20px] h-full lg:h-[20px] shrink-0 flex items-center justify-center bg-secondary hover:bg-primary hover:text-white duration-300">
                    <IoIosArrowUp className="max-lg:-rotate-90"/>
                    </button>
                        <div className="lg:w-full w-[40px] h-full lg:h-[40px] flex items-center justify-center text-sm font-semibold">
                            {data.quantity}
                        </div>
                    <button 
                    onClick={handleDescrease}
                    className="lg:w-full w-[20px] h-full lg:h-[20px] shrink-0 flex items-center justify-center bg-secondary hover:bg-primary hover:text-white duration-300">
                    <IoIosArrowDown  className="max-lg:-rotate-90"/>
                    </button>
                </div>
                <button 
                onClick={handleDeleteFromCart}
                className="hover:opacity-80 duration-300">
                    <Trash/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default CartItem