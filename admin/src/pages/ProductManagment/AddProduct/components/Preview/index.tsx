import { CombinationsProps, ProductFormProps, SelectManufacturerProps } from "@/types"
import { ImageProps } from "../ProductInfo/ProductInfo"
import { FC } from "react"
import Image from "@/components/Image"
import { calculateDiscountPercentage, generateVariants, priceMasking } from "@/utils/helpers"

interface PreviewProps {
    form: ProductFormProps
    images: ImageProps[]
    image: ImageProps
    desc: string
    price: number | null
    special?: number | null
    combinations: CombinationsProps[]
    manufacurers: SelectManufacturerProps[]
}

const Preview: FC<PreviewProps> = ({
    form,
    image,
    images,
    desc,
    special,
    combinations,
    price,
    manufacurers,
}) => {

    const variants = generateVariants(combinations)

  return (
    <div className="px-48 py-5 space-y-10">
        <div className="grid grid-cols-2 gap-10">
            <div className="w-full space-y-3">
                <div className="w-full aspect-square rounded-xl border border-border overflow-hidden">
                    {image.pre && (<Image src={image.pre as string} existSrcSet={false}/>)}
                </div>

                <div className="grid grid-cols-5 gap-3">
                    {images?.map((v, i) => (
                        <div key={i} className="w-full aspect-square overflow-hidden rounded-xl">
                            <Image src={v.pre as string} existSrcSet={false} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full aspect-square bg-lightBg dark:bg-darkPrimaryLight rounded-xl p-5 space-y-5">
                <h1 className="text-xl font-semibold line-clamp-2">{form.name}</h1>

                {form.manufacturer && (
                    <p className="text-sm font-semibold text-blue-500">
                        {manufacurers.find((v) => v.id === form.manufacturer)?.name}
                    </p>
                )}

                <p className="text-end text-sm font-semibold">
                    Stok Kodu: {form.sku}
                </p>

                <div className="flex flex-col">
                    {special && (
                        <div className="flex items-center text-lg font-semibold gap-3">
                            <p className="line-through opacity-80">{price && priceMasking(price)}</p>
                            <p className="text-thirth">%{calculateDiscountPercentage(price, special)}</p>
                        </div>
                    )}
                    <p className="text-2xl font-semibold">
                        {price && priceMasking(special ? special : price)}
                    </p>
                </div>

                <p className="text-xs opacity-80">
                {form.short_desc}
                </p>

                <div className="flex flex-col gap-3">
                    {
                        variants?.map((v) => (
                            <div key={v.id} className="space-y-1">
                                <p className="text-sm font-semibold">{v.name}</p>
                                <div className="flex items-center flex-wrap gap-2">
                                    {
                                        v.values?.map((v) => (
                                            <div className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-darkPrimary">
                                                {v.value}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
        
        <div className="rounded-xl overflow-hidden border border-border">
            <div className="w-full h-[50px] bg-lightBg dark:bg-darkPrimaryLight">
                <div className="px-5 h-full flex items-center justify-center w-fit bg-white text-sm font-semibold dark:bg-darkPrimary">
                    Açıklama
                </div>
            </div>
            <div className="p-5 h-[350px] overflow-y-auto">
                <p className="text-sm" dangerouslySetInnerHTML={{__html: desc}}/>
            </div>
        </div>
    </div>
  )
}

export default Preview