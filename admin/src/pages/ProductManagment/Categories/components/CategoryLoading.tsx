import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"

const CategoryLoading = () => {
  return (
    <div className="px-5 py-3 border-border flex items-center text-xs w-full shrink-0 h-fit border rounded-md">
      <div className="pr-3 shrink-0 flex items-center">
        <Checkbox/>
      </div>
      <div className="w-20 shrink-0 aspect-square rounded-md border border-border overflow-hidden">
        <Skeleton className="w-full h-full"/>
      </div>
      <div className="w-full line-clamp-2 pl-5">
        <Skeleton className="w-3/4 h-3 rounded-full"/>
      </div>

      <div className="w-60 shrink-0 px-2 flex items-center justify-center">
      <Skeleton className="w-3/4 h-3 rounded-full"/>
      </div>
      <div className="w-24 shrink-0 px-2 flex items-center justify-center">
      <Skeleton className="w-3/4 h-3 rounded-full"/>
      </div>
      <div className="w-28 shrink-0 px-2 flex items-center justify-center">
      <Skeleton className="w-3/4 h-3 rounded-full"/>
      </div>
      <div className="w-24 shrink-0 px-2 flex items-center justify-center">
      <Skeleton className="w-3/4 h-3 rounded-full"/>
      </div>
      <div className="w-40 shrink-0 px-2 flex items-center justify-center">
      <Skeleton className="w-3/4 h-3 rounded-full"/>
      </div>
      <div className="w-10 shrink-0 flex items-center justify-center">
      <Skeleton className="w-10 h-10 rounded-md"/>
      </div>
    </div>
  )
}

export default CategoryLoading