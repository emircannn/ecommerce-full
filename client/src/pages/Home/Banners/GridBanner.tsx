import Image from "@/components/Image"
import { API_URL } from "@/config"

const GridBanner = () => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-5">
        <div className="w-full aspect-square">
            <Image
                src={`${API_URL}/uploads/banner/banner8.jpg`}
            />
        </div>
        <div className="w-full aspect-square">
            <Image
                src={`${API_URL}/uploads/banner/banner9.jpg`}
            />
        </div>
        <div className="w-full aspect-square">
            <Image
                src={`${API_URL}/uploads/banner/banner10.jpg`}
            />
        </div>
        <div className="w-full aspect-square">
            <Image
                src={`${API_URL}/uploads/banner/banner11.jpg`}
            />
        </div>
    </div>
  )
}

export default GridBanner