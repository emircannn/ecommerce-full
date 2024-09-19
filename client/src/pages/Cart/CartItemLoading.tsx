import { Skeleton } from "@/components/ui/skeleton"

const CartItemLoading = () => {
  return (
    <div className="rounded-md border border-border shadow-lg">
        <div className="p-3 border-b border-border text-sm">
            <Skeleton className="w-[200px] h-[18px] rounded-full"/>
        </div>
        <div className="p-3 flex items-center justify-between gap-5">
            <div className="flex items-center gap-5 w-full">
                <div className="h-[150px] aspect-square rounded-md border shrink-0 border-border overflow-hidden">
                    <Skeleton className="w-full h-full"/>
                </div>
                <div className="w-full flex flex-col gap-5 h-[150px] justify-between py-2">
                    <Skeleton className="w-[200px] h-[20px] rounded-full"/>

                    <div className="space-y-2">
                        <Skeleton className="w-[50px] h-[18px] rounded-full"/>
                        <div className="flex items-center gap-3">
                        {
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="w-[70px] h-[30px] overflow-hidden rounded-md">
                                    <Skeleton className="w-full h-full"/>
                                </div>
                            ))
                        }
                        </div>
                    </div>

                    <Skeleton className="w-[320px] h-[20px] rounded-full"/>
                </div>
            </div>

            <div className="shrink-0 flex items-center gap-5 pr-2">
                <div className="w-10 h-20 rounded-md overflow-hidden">
                    <Skeleton className="w-full h-full"/>
                </div>

                <div className="w-6 aspect-square rounded-md overflow-hidden">
                    <Skeleton className="w-full h-full"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItemLoading