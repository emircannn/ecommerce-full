import { Skeleton } from "./ui/skeleton"

const ProductLoading = () => {
  return (
    <div className="w-full flex flex-col gap-3 lg:gap-5 p-2 text-center border border-border duration-300 hover:border-scrx hover:shadow-lg rounded-md">
        <div  className="relative w-full flex aspect-[1.25/1] rounded-md overflow-hidden">
            <Skeleton className="w-full h-full"/>
        </div>

        <div className="flex flex-col gap-2 items-center pb-3">
            <Skeleton className="h-[15px] md:h-5 w-3/4 rounded-full"/>
            <Skeleton className="h-[15px] md:h-5 w-1/2 rounded-full"/>
            <Skeleton className="h-5 md:h-[28px] w-3/4 rounded-full"/>
        </div>
    </div>
  )
}

export default ProductLoading