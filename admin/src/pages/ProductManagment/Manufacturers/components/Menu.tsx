import { AlertDialogComp } from "@/components/Alert"
import SelectComp from "@/components/SelectComp"
import { Input } from "@/components/ui/input"
import { Filter, FilterX } from "lucide-react"
import { useState } from "react"
import AddAndUpdateManufacturer from "./AddAndUpdateManufacturer"
import { Button } from "@/components/ui/button"
import { SetURLSearchParams } from "react-router-dom"

const Menu = ({
    handleSelectAllManufacturers,
    total,
    handleDelete,
    getData,
    disabled,
    setSearchParams,
    searchParams,
    setPage
}: {
    handleSelectAllManufacturers: () => void,
    getData: () => void,
    handleDelete: () => void,
    total: number
    disabled: boolean
    setSearchParams: SetURLSearchParams
    searchParams: URLSearchParams,
    setPage: React.Dispatch<React.SetStateAction<number>>
}) => {

    const [name, setName] = useState('')
    const [image, setImage] = useState('')

    const addQueryParams = () => {
        setPage(1)
        const currentParams = Object.fromEntries([...searchParams]);
        const newParams = {
            name: name,
            hasImage: image,
          };
          for (const [key, value] of Object.entries(newParams)) {
            if (value) {
              currentParams[key] = value;
            }
          }
          setSearchParams(currentParams);
      };

      const handleClearFilter = () => {
        setSearchParams({limit: '12', page: '1'})
        setName('')
        setImage('')
      }

  return (
    <div className="w-full h-[60px] rounded-xl shadow-lg border border-border overflow-hidden flex">
        <div className="w-full py-2.5 pl-5 flex items-center gap-28">
            <p className="text-sm shrink-0">
                Marka adeti: <b>{total}</b>
            </p>

            <div className="grid grid-cols-5 gap-3 w-full px-5"> 
                <Input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Marka Adı"
                />
                <SelectComp
                placeholder="Resim Durumu"
                label="Resim Durumu"
                onValueChange={(e) => setImage(e)}
                value={image}
                data={[{name: 'Var', value: 'true'}, {name: 'Yok', value: 'false'}]}
                />
                <AddAndUpdateManufacturer
                    getData={getData}
                />
                <Button onClick={handleSelectAllManufacturers} variant={'outline'}>Hepsini Seç</Button>
                <AlertDialogComp
                buttonVariant={'reject'}
                handleAccept={handleDelete}
                buttonClass="w-full"
                title="Markaları Silmek İstediğnize Emin Misiniz?"
                disabled={disabled}
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