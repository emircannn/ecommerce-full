import { Button } from "@/components/ui/button"
import Options from "./Options"
import CombinationValues from "./CombinationValues"
import { FC, useCallback, useEffect, useState } from "react"
import { getVariantGroups } from "../../request"
import { VariantGroupsProps, VariantsProps, CombinationsProps as CombinationsPropss } from "@/types"
import AddedOptions from "./Added/AddedOptions"

interface CombinationsProps {
    setVariants: React.Dispatch<React.SetStateAction<VariantsProps[]>>
    variants: VariantsProps[]
    getCombinations: () => void;
    combinations: CombinationsPropss[];
    setCombinations: React.Dispatch<React.SetStateAction<CombinationsPropss[]>>
}

const Combinations: FC<CombinationsProps> = ({
    setVariants,
    variants,
    getCombinations,
    combinations,
    setCombinations
}) => {

    const [variantGroups, setVariantGroups] = useState<VariantGroupsProps[]>([])

    const setGroups = useCallback(async() => {
        const groups = await getVariantGroups()
        setVariantGroups(groups)
    }, [])

    useEffect(() => {
        setGroups()
    }, [setGroups])
    

    const handleDeleteVariant = (id: string) => {
        setVariants(variants.filter((v) => v.id !== id));
    }

    const handleDeleteCombination = (index: number) => {
        setCombinations(prevCombinations => 
            prevCombinations.filter((_, i) => i !== index)
        );
    };
    

  return (
    <div className="space-y-5 px-10">
        <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="space-y-2">
                <p className="font-semibold">Seçenek Grupları</p>
                <p className="text-sm opacity-80">(Seçenekleri belirleyin ve detay bilgileri girebilmek için “Kombinasyon Hesapla” butonuna tıklayın.)</p>
            </div>

            <Button 
                onClick={getCombinations}
            variant={'primary'}>Kombinasyon Hesapla</Button>
        </div>

        <div className="space-y-3">
            <Options
                variantGroups={variantGroups}
                setVariants={setVariants}
                variants={variants}
            />

            {
                variants?.map((v, i) => (
                    <AddedOptions
                        key={i}
                        variant={v}
                        setVariants={setVariants}
                        handleDeleteVariant={() => handleDeleteVariant(v.id.toString())}
                    />
                ))
            }
        </div>

        <div className="space-y-3 !mt-20">
            {
                combinations?.map((combination, i) => (
                    <CombinationValues
                        key={i}
                        combination={combination}
                        handleDeleteCombination={() => handleDeleteCombination(i)}
                        setCombinations={setCombinations}
                        index={i}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default Combinations