import Image from "@/components/Image";
import { Checkbox } from "@/components/ui/checkbox";
import { ManufacturerProps } from "@/types";
import AddAndUpdateManufacturer from "./AddAndUpdateManufacturer";
import { API_URL } from "@/config";

const Manufacturer = ({
    data,
    handleSelect,
    checked,
    getData
}: {
    data: ManufacturerProps
    handleSelect: () => void
    getData?: () => void;
    checked: boolean
}) => {
  return (
    <div className="w-full h-fit p-5 rounded-xl border border-b shadow-lg flex flex-col gap-5">
        <div className="flex items-center justify-between">
            <Checkbox
                onClick={handleSelect}
                checked={checked}
            />

            <AddAndUpdateManufacturer
                data={data}
                getData={getData}
            />
        </div>

        <div className="w-28 shrink-0 bg-lightBg dark:bg-darkPrimaryLight aspect-square rounded-full border border-border overflow-hidden mx-auto">
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
        <p className="text-center font-semibold text-lg">{data.name}</p>
    </div>
  )
}

export default Manufacturer