import Image from "@/components/Image"
import { Checkbox } from "@/components/ui/checkbox"
import { CategoriesProps } from "@/types"
import { AddAndUpdateCategory } from "./AddAndUpdate"
import { API_URL } from "@/config"

const Category = ({
    data,
    handleSelect,
    checked,
    getData
}: {
    data: CategoriesProps
    handleSelect: () => void
    getData?: () => void;
    checked: boolean
}) => {

  return (
    <div className="px-5 py-3 border-border flex items-center text-xs w-full shrink-0 h-fit border rounded-md">
        <div className="pr-3 shrink-0 flex items-center">
            <Checkbox
                onClick={handleSelect}
                checked={checked}
            />
        </div>
        <div className="w-20 shrink-0 aspect-square rounded-md border border-border overflow-hidden">
            {
                data.image ? (
                <Image
                src={`${API_URL}/${data.image}`}
                existSrcSet={false}
                />) : (
                <p className="text-xs w-full h-full flex items-center justify-center">Resim Yok</p>
            )
            }
        </div>
        <div className="w-full line-clamp-2 pl-5">
            {data.name}
        </div>
        <div className="w-60 shrink-0 text-center px-2 truncate">
            {data.parent?.name}
        </div>
        <div className="w-24 shrink-0 text-center px-2 truncate">
            {data.id}
        </div>
        <div className="w-40 shrink-0 text-center px-2 truncate flex items-center justify-center">
            {data.show_home ? 
            <div className="px-3 py-1 rounded-full bg-green-300 text-green-500 font-semibold w-fit">Göster</div> 
            : 
            <div className="px-3 py-1 rounded-full bg-red-300 text-red-900 font-semibold w-fit">Gösterme</div>
            }
        </div>
        <div className="w-12 shrink-0 flex justify-center">
            <AddAndUpdateCategory
                data={data}
                getData={getData}
            />
        </div>
    </div>
  )
}

export default Category