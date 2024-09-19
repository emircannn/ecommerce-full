import { Skeleton } from "@/components/ui/skeleton"

const OrderSummaryLoading = () => {
  return (
    <div className="p-3 rounded-md border border-border flex gap-5">
        <div className="w-20 aspect-square shrink-0 rounded-md border border-border overflow-hidden">
            <Skeleton className="w-full h-full"/>
        </div>

        <div className="flex flex-col justify-between w-full h-20">
            <Skeleton className="w-[120px] h-4 rounded-full"/>
            <div className="flex items-center gap-2">
                <Skeleton className="w-[62px] h-4 rounded-full"/>
                {
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="w-[65px] h-[26px] rounded-md overflow-hidden">
                            <Skeleton className="w-full h-full"/>
                        </div>
                    ))
                }
            </div>
            <Skeleton className="w-[220px] h-4 rounded-full"/>
        </div>
    </div>
  )
}

export default OrderSummaryLoading