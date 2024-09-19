import Image from "@/components/Image"
import { Checkbox } from "@/components/ui/checkbox"
import { API_URL } from "@/config"
import { Product as ProductType } from "@/types"
import { priceMasking } from "@/utils/helpers"
import { Edit } from "lucide-react"

const Product = ({
    data,
    selectedProducts,
    handleSelect
}: {
    data: ProductType
    selectedProducts: number[]
    handleSelect: () => void
}) => {
  return (
    <div className="rounded-md overflow-hidden h-fit border border-border shrink-0">
        <div className="px-5 py-3 flex items-center text-xs">
            <div className="pr-3 shrink-0 flex items-center">
                <Checkbox
                    onClick={handleSelect}
                    checked={selectedProducts.includes(data.id)}
                />
            </div>

            <div className="w-20 shrink-0 aspect-square rounded-md border border-border overflow-hidden">
                {
                    data.image ? (
                    <Image 
                    src={`${API_URL}/${data.image}`}
                    existSrcSet={false}
                    />) : (
                    <p className="text-xs w-full h-full flex items-center justify-center">Resim Yok</p>
                )
                }
            </div>

            <div className="w-full line-clamp-2 pl-5">
                {data.name}
            </div>

            <div className="w-28 shrink-0 text-center px-2 truncate">
                {data.category?.name}
            </div>
            <div className="w-28 shrink-0 text-center px-2 truncate">
                {data.sku}
            </div>
            <div className="w-28 shrink-0 text-center px-2 truncate">
                {data.barcode}
            </div>
            <div className="w-20 shrink-0 text-center px-2 truncate">
                {data.weight}
            </div>
            <div className="w-20 shrink-0 text-center px-2 truncate">
                {data.stock}
            </div>
            <div className="w-24 shrink-0 text-center px-2 truncate space-y-1">
                {data.special && (<p className="opacity-80 line-through">{priceMasking(data.price)}</p>)}
                {priceMasking(data.special ? data.special : data.price)}
            </div>
            <div className="w-20 shrink-0 text-center px-2 truncate font-semibold">
                {data.is_active ? (<p className="text-green-600">Açık</p>) : (<p className="text-red-500">Kapalı</p>)}
            </div>
            <div className="w-14 shrink-0 flex items-center justify-center">
                <button className="bg-thirth rounded-md p-2 hover:bg-opacity-80 duration-300">
                    <Edit className="text-darkPrimary"/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Product