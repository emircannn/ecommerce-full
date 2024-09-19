import { Skeleton } from "@/components/ui/skeleton"

const VariantLoading = ({
    group=false
}: {
    group?: boolean
}) => {
  return (
    <div className="pb-2 border-b border-border w-full flex items-center justify-between gap-3">
        <p className="w-2/5 h-[14px] overflow-hidden rounded-full">
            <Skeleton className="w-full h-full"/>
        </p>

        <div className="flex items-center gap-3">
            {group && 
            (<div className="w-[58px] h-[40px] rounded-md overflow-hidden">
                <Skeleton className="w-full h-full"/>
            </div>)}
            <div className="w-[88px] h-[40px] rounded-md overflow-hidden">
                <Skeleton className="w-full h-full"/>
            </div>
            <div className="w-[48px] h-[40px] rounded-md overflow-hidden">
                <Skeleton className="w-full h-full"/>
            </div>
        </div>
    </div>
  )
}

export default VariantLoading