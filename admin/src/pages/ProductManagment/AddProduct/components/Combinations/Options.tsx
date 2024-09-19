import { PlusCircle } from "lucide-react"
import OptionValues from "./OptionValues"
import SelectComp from "@/components/SelectComp"
import { VariantGroupsProps, VariantOptionsProps, VariantsProps } from "@/types"
import { FC, useCallback, useEffect, useState } from "react";
import { getVariantOptions } from "../../request";
import { useToast } from "@/components/ui/use-toast";

interface OptionProps {
    variantGroups: VariantGroupsProps[];
    setVariants: React.Dispatch<React.SetStateAction<VariantsProps[]>>
    variants: VariantsProps[]
}

const Options: FC<OptionProps> = ({
    variantGroups,
    setVariants,
    variants,
}) => {

    const [groupId, setGroupId] = useState('')
    const {toast} = useToast()
    const [options, setOptions] = useState<VariantOptionsProps[]>([])
    const [selectedOption, setSelectedOption] = useState<VariantOptionsProps[]>([])

    const handleOptions = useCallback(async() => {
        if(groupId) {
            const res = await getVariantOptions(groupId)
            setOptions(res)
        }
    }, [groupId])

    useEffect(() => {
      handleOptions()
    }, [handleOptions])


    useEffect(() => {
        setSelectedOption([])
    }, [groupId])

    const template = {
        id: groupId,
        name: variantGroups.find((v) => (v.id).toString() === groupId.toString())?.name,
        values: selectedOption
    }

    const addVariants = () => {
        if(groupId) {
            if(!variants.find((v) => v.id === groupId)) {
                if(selectedOption.length > 0) {
                    setVariants([...variants, template])
                    setGroupId('')
                    setSelectedOption([])
                } else {
                    toast({title: 'İşlem Başarısız', description: "En az bir tane seçenek değeri seçin!"})
                }
            } else {
                toast({title: 'İşlem Başarısız', description: "Bu seçenek grubu zaten mevcut!"})
            }
        } else {
            toast({title: 'İşlem Başarısız', description: "Öncelikle seçenek grubunu seçiniz!"})
        }
    }

    const handleDeleteOptions = (id: string) => {
        setSelectedOption(selectedOption.filter((o) => o.id !== id))
    }

  return (
    <div className="flex items-start gap-5">
        <div className="w-1/4 shrink-0">
            <SelectComp
                label="Seçenek Grubu"
                placeholder="Seçenek Grubu Seçiniz"
                data={variantGroups?.map((v) => {return {value: v.id, name: v.name}})}
                value={groupId}
                onValueChange={(e) => setGroupId(e)}
            />
        </div>

        <div className="w-full flex relative pr-[180px] flex-wrap gap-2 min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {
                selectedOption?.map((_, i) => (
                    <div key={i} className="h-full shrink-0 flex items-center gap-3 pl-3 overflow-hidden bg-lightBg dark:bg-darkPrimaryLight rounded-md">
                        <p className="font-medium">{_.value}</p>

                        <button 
                        onClick={() => handleDeleteOptions(_.id.toString())}
                        className="text-[10px] font-semibold px-2 h-full bg-thirth hover:bg-opacity-80 duration-300 text-darkPrimary">Sil</button>
                    </div>
                ))
            }

            <OptionValues
                options={options}
                disabled={!groupId}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />
        </div>

        <button 
        onClick={addVariants}
        className="h-10 aspect-square shrink-0 bg-thirth hover:bg-opacity-80 duration-300 rounded-md flex items-center justify-center">
            <PlusCircle className="text-darkPrimary"/>
        </button>
    </div>
  )
}

export default Options