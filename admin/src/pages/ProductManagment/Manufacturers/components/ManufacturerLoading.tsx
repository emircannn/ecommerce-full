import { Skeleton } from "@/components/ui/skeleton"

const ManufacturerLoading = () => {
  return (
    <div className="w-full h-fit p-5 rounded-xl border border-b shadow-lg flex flex-col gap-5">
        <div className="h-4"/>

        <div className="w-28 shrink-0 aspect-square rounded-full border border-border overflow-hidden mx-auto">
            <Skeleton className="w-full h-full"/>
        </div>

        <div className="h-[28px] rounded-full w-3/4 mx-auto overflow-hidden">
            <Skeleton className="w-full h-full"/>
        </div>
    </div>
  )
}

export default ManufacturerLoading