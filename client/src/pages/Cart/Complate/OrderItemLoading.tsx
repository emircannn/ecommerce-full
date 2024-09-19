import { Skeleton } from "@/components/ui/skeleton"

const OrderItemLoading = () => {
  return (
    <div className="p-3 flex items-center justify-between gap-5 border-t border-border">
        <div className="flex gap-5 w-full">
            <div className="w-24 aspect-square rounded-md overflow-hidden shrink-0 border border-border">
                <Skeleton className="w-full h-full"/>
            </div>
            <div className="h-24 flex justify-between gap-5 flex-col w-full">
            <Skeleton className="w-[180px] h-[20px] rounded-full"/>
            <Skeleton className="w-[200px] h-[20px] rounded-full"/>
            <Skeleton className="w-[320px] h-[20px] rounded-full"/>
            </div>
        </div>
        <div className="shrink-0 h-24 space-y-1">
            <Skeleton className="w-[75px] h-[15px] rounded-full"/>
            <Skeleton className="w-[250px] h-[80px] rounded-md"/>
        </div>
    </div>
  )
}

export default OrderItemLoading