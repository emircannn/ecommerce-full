import Image from "@/components/Image"
import { API_URL } from "@/config"

const GridThreeBanner = () => {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        <div className="w-full aspect-[1/1.25] rounded-md overflow-hidden">
            <Image
                src={`${API_URL}/uploads/banner/banner12.png`}
                className="object-cover w-full h-full hover:scale-105 duration-300"
            />
        </div>
        <div className="w-full aspect-[1/1.25] rounded-md overflow-hidden">
            <Image
                src={`${API_URL}/uploads/banner/banner13.png`}
                className="object-cover w-full h-full hover:scale-105 duration-300"
            />
        </div>
        <div className="w-full aspect-[1/1.25] rounded-md overflow-hidden">
            <Image
            src={`${API_URL}/uploads/banner/banner14.png`}
            className="object-cover w-full h-full hover:scale-105 duration-300"
            />
        </div>
        <div className="w-full aspect-[1/1.25] rounded-md overflow-hidden">
            <Image
                src={`${API_URL}/uploads/banner/banner15.png`}
                className="object-cover w-full h-full hover:scale-105 duration-300"
            />
        </div>
    </div>
  )
}

export default GridThreeBanner