import { AlertDialogComp } from '@/components/Alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash } from 'lucide-react'

const TableHead = ({
  handleSelectAllProducts,
  checked,
  handleDelete,
  disabled
}: {
  handleSelectAllProducts: () => void
  handleDelete: () => void
  checked: boolean,
  disabled: boolean
}) => {
  return (
    <div className="flex items-center w-full px-5 text-sm font-semibold pb-5">
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
            Ürün Adı
          </div>
          <div className="w-28 shrink-0 border-r border-border text-center">
            Kategori
          </div>
          <div className="w-28 shrink-0 border-r border-border text-center">
            Stok Kodu
          </div>
          <div className="w-28 shrink-0 border-r border-border text-center">
            Barkod
          </div>
          <div className="w-20 shrink-0 border-r border-border text-center">
            Desi
          </div>
          <div className="w-20 shrink-0 border-r border-border text-center">
            Stok
          </div>
          <div className="w-24 shrink-0 border-r border-border text-center">
            Fiyat
          </div>
          <div className="w-20 shrink-0 text-center">
            Durumu
          </div>
          <div className='w-14 shrink-0'>
            <AlertDialogComp
              handleAccept={handleDelete}
              customButton={
                <button 
                  disabled={disabled}
                  className="w-10 aspect-square disabled:bg-opacity-80 disabled:cursor-not-allowed rounded-md mx-auto bg-red-500 hover:bg-opacity-80 duration-300 flex items-center justify-center">
                    <Trash className='text-white'/>
                  </button>
              }
            />
          </div>
    </div>
  )
}

export default TableHead