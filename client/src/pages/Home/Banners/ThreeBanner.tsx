import Image from "@/components/Image"
import { API_URL } from "@/config"
import { Link } from "react-router-dom"

const ThreeBanner = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-3 lg:gap-5">
        <Link to={`/kategori/sleeper`} className="w-full aspect-square rounded-md overflow-hidden">
            <Image
                src={`${API_URL}/uploads/banner/banner2.png`}
                className="object-cover w-full h-full hover:scale-105 duration-300"
            />
        </Link>
        <div  className="w-full grid grid-rows-2 gap-3 lg:gap-5">
            <Link to={`/kategori/sleeper`} className="w-full h-full rounded-md overflow-hidden">
            <Image
            src={`${API_URL}/uploads/banner/banner3.png`}
            className="object-cover w-full h-full hover:scale-105 duration-300"
            />
            </Link>
            <Link to={`/kategori/sleeper`} className="w-full h-full rounded-md overflow-hidden">
            <Image
                src={`${API_URL}/uploads/banner/banner1.png`}
                className="object-cover w-full h-full hover:scale-105 duration-300"
            />
            </Link>
        </div>
    </div>
  )
}

export default ThreeBanner