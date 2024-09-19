import { Skeleton } from "@/components/ui/skeleton"

const OrderLoading = () => {
  return (
    <div className="w-full shrink-0 p-3 border border-border rounded-md flex items-center justify-between gap-5 text-primary">
        <div className="flex items-center gap-3 lg:gap-5 max-lg:flex-col">
            <div className="w-[160px] lg:w-[200px] gap-2 grid grid-cols-3">
                <Skeleton className="w-full aspect-square rounded-md"/>
                <Skeleton className="w-full aspect-square rounded-md"/>
                <Skeleton className="w-full aspect-square rounded-md"/>
            </div>
            <div className="min-w-40 shrink-0 max-lg:hidden">
            <Skeleton className="w-2/3 h-5 rounded-full"/>
            </div>
            <div className="min-w-40 shrink-0">
            <Skeleton className="w-2/3 h-5 rounded-full"/>
            </div>
        </div>
        <div className='flex items-center gap-3 lg:gap-5 lg:pr-2'>
            <div className="flex items-end flex-col gap-1">
                <Skeleton className="w-[80px] lg:w-[170px] h-5 rounded-full"/>
                <Skeleton className="w-[40px] lg:w-[80px] h-5 rounded-full"/>
            </div>
            <Skeleton className="w-[34px] aspect-square shrink-0 rounded-full"/>
        </div>
    </div>
  )
}

export default OrderLoading