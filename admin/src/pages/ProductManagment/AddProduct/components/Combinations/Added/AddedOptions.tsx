import { VariantOptionsProps, VariantsProps } from "@/types"
import { Trash } from "lucide-react"
import AddedOptionValues from "./AddedOptionValues"
import { useCallback, useEffect, useState } from "react"
import { getVariantOptions } from "../../../request"
import { useToast } from "@/components/ui/use-toast"

const AddedOptions = ({
    variant, 
    setVariants,
    handleDeleteVariant
}: {
    variant: VariantsProps,  
    handleDeleteVariant: () => void; 
    setVariants: React.Dispatch<React.SetStateAction<VariantsProps[]>>
}) => {

    const [options, setOptions] = useState<VariantOptionsProps[]>([])
    const {toast} = useToast()

    const handleOptions = useCallback(async() => {
        if(variant.id) {
            const res = await getVariantOptions(variant.id.toString())
            setOptions(res)
        }
    }, [variant.id])

    useEffect(() => {
      handleOptions()
    }, [handleOptions])

    //* deger silme
    const handleDelete = (v: VariantOptionsProps) => {
        if (variant.values.length === 1) {
            toast({ title: 'İşlem Başarısız', description: "En az bir tane seçenek değeri seçin!" });
            return;
        }

        const updatedValues = variant.values.filter(_v => _v.id !== v.id);

        setVariants(prevVariants => prevVariants.map(vr => 
            vr.id === variant.id 
                ? { ...vr, values: updatedValues } 
                : vr
        ));
    };

  return (
    <div className="flex items-start gap-5">
        <div className="w-1/4 shrink-0">
            <div className="inputClass">
                {variant.name}
            </div>
        </div>

        <div className="w-full flex relative pr-[210px] flex-wrap gap-2 min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {
                variant?.values?.map((_, i) => (
                    <div key={i} className="h-full shrink-0 flex items-center gap-3 pl-3 overflow-hidden bg-lightBg dark:bg-darkPrimaryLight rounded-md">
                        <p className="font-medium">{_.value}</p>

                        <button 
                        onClick={() => handleDelete(_)}
                        className="text-[10px] font-semibold px-2 h-full bg-thirth hover:bg-opacity-80 duration-300 text-darkPrimary">Sil</button>
                    </div>
                ))
            }

            <AddedOptionValues
                disabled={!variant.id}
                setVariants={setVariants}
                variant={variant}
                options={options}
            />
        </div>

        <button 
        onClick={handleDeleteVariant}
        className="h-10 aspect-square shrink-0 bg-red-500 hover:bg-opacity-80 duration-300 rounded-md flex items-center justify-center">
            <Trash className="text-white"/>
        </button>
    </div>
  )
}

export default AddedOptions