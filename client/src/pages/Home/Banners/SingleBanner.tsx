import Image from "@/components/Image"
import { Link } from "react-router-dom"

const SingleBanner = ({
    src,
    seo
}: {
    src: string
    seo: string
}) => {
  return (
    <Link to={seo} className="w-full aspect-[1280/200] rounded-md overflow-hidden flex">
        <Image className="w-full h-full object-cover hover:scale-105 duration-300" src={src}/>
    </Link>
  )
}

export default SingleBanner