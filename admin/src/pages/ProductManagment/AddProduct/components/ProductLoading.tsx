import { Hourglass } from "lucide-react"

const ProductLoading = () => {
  return (
    <div className="fixed inset-0 bg-white/50 dark:bg-darkPrimaryLight/50 flex items-center justify-center">
        <div className="w-[350px] aspect-video rounded-xl bg-white dark:bg-darkPrimary border border-border flex items-center justify-center p-5 flex-col gap-5">
            <Hourglass className="animate-spin" size={40}/>
            <p className="text-sm font-semibold">Ürün yükleniyor, lütfen bekleyin...</p>
        </div>
    </div>
  )
}

export default ProductLoading