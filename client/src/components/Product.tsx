import { IProduct } from "@/types"
import { useState } from "react";
import Image from "./Image";
import { API_URL } from "@/config";
import { Link } from "react-router-dom";
import { priceMasking } from "@/utils/helpers";

const Product = ({
    data
}: {
    data: IProduct
}) => {

    const images = [
        ...(data.image ? [data.image] : []), 
        ...(Array.isArray(data.images) ? data.images : [])
      ];

      const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="w-full flex flex-col gap-3 lg:gap-5 p-2 text-center border border-border duration-300 hover:border-scrx hover:shadow-lg rounded-md">
        <div  className="relative w-full flex aspect-[1.25/1] rounded-md overflow-hidden">
            <Link to={`/urun/${data.seo}`}>
                <Image
                    src={`${API_URL}/${images[currentImage]}`}
                />
            
            <div className="absolute max-lg:hidden w-full bottom-0 gap-2 left-0 py-2 flex items-center justify-center">
            { images.length > 2 && 
                images?.map((_v, i) => (
                <span
                key={i}
                className={`w-[10px] duration-300 aspect-square rounded-full ${i === currentImage ? 'bg-scrx' : 'bg-transparent border border-white'}`}
                />
                ))
            }
            </div>

            {images.length > 2 && 
            <div className={`absolute max-lg:hidden w-full h-full top-0 left-0 flex`}>
            {
                images?.map((_v, i) => (
                <div 
                key={i}
                onMouseEnter={() => setCurrentImage(i)}
                onMouseLeave={() => setCurrentImage(0)}
                className="w-full h-full"/>
                ))
            }
            </div>}
            </Link>
        </div>

        <div className="space-y-2 pb-3 w-full overflow-hidden">
            <Link to={`/urun/${data.seo}`} className="text-xs md:text-sm font-semibold w-full overflow-hidden truncate">{data.name}</Link>
            <p className="text-xs md:text-sm font-medium min-h-5">
                <span className="opacity-80 line-through">{data.special && priceMasking(data.price)}</span> 
                {data.discount_rate && <span className="ml-3 font-semibold text-green-500">%{data.discount_rate}</span>}
            </p>
            <p className="font-semibold text-sm md:text-lg">{priceMasking(data.special ? data.special : data.price)}</p>
        </div>
    </div>
  )
}

export default Product