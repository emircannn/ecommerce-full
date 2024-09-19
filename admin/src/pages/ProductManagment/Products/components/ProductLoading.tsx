import { Skeleton } from "@/components/ui/skeleton"

const ProductLoading = () => {
  return (
    <div className="rounded-md overflow-hidden h-fit border border-border shrink-0">
        <div className="px-5 py-3 border-border flex items-center text-xs">
            <div className="mr-3 w-4 shrink-0 flex items-center"/>
            <div className="w-20 shrink-0 aspect-square rounded-md border border-border overflow-hidden">
                <Skeleton
                    className="w-full h-full"
                />
            </div>

            <div className="w-full line-clamp-2 px-5 rounded-full overflow-hidden h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>

            <div className="w-28 shrink-0 px-2 h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>
            <div className="w-28 shrink-0 px-2 h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>
            <div className="w-20 shrink-0 px-2 h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>
            <div className="w-20 shrink-0 px-2 h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>
            <div className="w-24 shrink-0 px-2 h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>
            <div className="w-20 shrink-0 px-2 h-3">
                <Skeleton
                    className="w-full h-full"
                />
            </div>
            <div className="w-14 shrink-0 px-2">
                <Skeleton
                    className="w-full aspect-square"
                />
            </div>
        </div>
    </div>
  )
}

export default ProductLoading