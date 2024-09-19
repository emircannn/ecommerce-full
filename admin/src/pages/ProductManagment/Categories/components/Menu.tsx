import { AlertDialogComp } from "@/components/Alert"
import { Input } from "@/components/ui/input"
import { Filter, FilterX } from "lucide-react"
import { AddAndUpdateCategory } from "./AddAndUpdate"
import { SetURLSearchParams } from "react-router-dom"
import { useState } from "react"
import SelectComp from "@/components/SelectComp"

const Menu = ({
    total,
    handleDelete,
    disabled,
    handleGetCategories,
    setSearchParams,
    searchParams,
    setPage
}: {
    total: number,
    handleDelete: () => void,
    handleGetCategories: () => void,
    disabled: boolean
    setSearchParams: SetURLSearchParams
    searchParams: URLSearchParams
    setPage: React.Dispatch<React.SetStateAction<number>>
}) => {

    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [showHome, setShowHome] = useState('')

    const addQueryParams = () => {
        const currentParams = Object.fromEntries([...searchParams]);
        setPage(1)
        const newParams = {
            name: name,
            hasImage: image, 
            showHome: showHome,
          };
          for (const [key, value] of Object.entries(newParams)) {
            if (value) {
              currentParams[key] = value;
            }
          }
          setSearchParams(currentParams);
      };

      const handleClearFilter = () => {
        setSearchParams({limit: '10', page: '1'})
        setName('')
        setShowHome('')
        setImage('')
      }

  return (
    <div className="w-full h-[60px] rounded-xl shadow-lg border border-border overflow-hidden flex">
        <div className="w-full py-2.5 pl-5 flex items-center gap-20">
            <p className="text-sm shrink-0">
                Kategori adeti: <b>{total}</b>
            </p>

            <div className="grid grid-cols-5 gap-3 w-full px-5">  
                <Input 
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Kategori Adı"
                />
                <SelectComp
                placeholder="Top Menüde Göster"
                label="Top Menüde Göster"
                onValueChange={(e) => setShowHome(e)}
                value={showHome}
                data={[{name: 'Göster', value: 'true'}, {name: 'Gösterme', value: 'false'}]}
                />
                <SelectComp
                placeholder="Resim Durumu"
                label="Resim Durumu"
                onValueChange={(e) => setImage(e)}
                value={image}
                data={[{name: 'Var', value: 'true'}, {name: 'Yok', value: 'false'}]}
                />
                <AddAndUpdateCategory
                    getData={handleGetCategories}
                />
                <AlertDialogComp
                buttonVariant={'reject'}
                buttonClass="w-full"
                handleAccept={handleDelete}
                disabled={disabled}
                title="Kategorileri Silmek İstediğnize Emin Misiniz?"
                />
            </div>
        </div>

        <div className="flex items-center gap-2 px-5 shrink-0 bg-lightBg dark:bg-darkPrimaryLight">
            <button 
            onClick={addQueryParams}
            className="filter-button">
                <Filter className="text-white"/>
            </button>
            <button 
            onClick={handleClearFilter}
            className="filter-clear-button">
                <FilterX className="text-white"/>
            </button>
        </div>
    </div>
  )
}

export default Menu