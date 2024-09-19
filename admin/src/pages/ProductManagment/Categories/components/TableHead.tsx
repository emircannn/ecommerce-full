import { Checkbox } from "@/components/ui/checkbox"

const TableHead = ({
    handleSelectAllProducts,
    checked,
  }: {
    handleSelectAllProducts: () => void
    checked: boolean,
  }) => {
  return (
    <div className="flex items-center w-full pl-5 text-sm font-semibold pb-5 pr-7">
        <div className="pr-3 shrink-0 flex items-center">
            <Checkbox
                checked={checked}
                onClick={handleSelectAllProducts}
            />
        </div>

        <div className="w-20 shrink-0 text-center">
            Görsel
        </div>
        <div className="w-full border-r border-border pl-5">
            Kategori Adı
        </div>
        <div className="w-60 shrink-0 border-r border-border text-center">
            Bağlı Olduğu Kategori
        </div>
        <div className="w-24 shrink-0 border-r border-border text-center">
            ID
        </div>
        <div className="w-40 shrink-0 text-center">
            Top Menüde Göster
        </div>
        <div className="w-12 shrink-0 text-center">
            
        </div>
    </div>
  )
}

export default TableHead