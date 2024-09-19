/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingScreen from "@/components/UIX/LoadingScreen"
import { cn } from "@/lib/utils"
import { IProduct, Variant } from "@/types"
import request from "@/utils/request"
import { useCallback, useEffect, useState } from "react"


const Variants = ({
    variants,
    product,
    setProduct
}: {
    variants: Variant[] | undefined,
    product: IProduct
    setProduct: React.Dispatch<React.SetStateAction<IProduct | undefined>>
}) => {

    const [selectedValues, setSelectedValues] = useState<Map<string, number>>(
        new Map()
    );
    const [commonCombinations, setCommonCombinations] = useState<string[]>([])

    const [loading, setLoading] = useState(false);

    // Ortak `combinations` değerlerini hesaplayan fonksiyon
    const getCommonCombinations = useCallback(() => {
        if (selectedValues.size === 0) return [];

        // Seçilen varyantları filtreleyin
        const selectedVariants = Array.from(selectedValues.entries()).map(([groupId, valueId]) =>
            variants?.find(v => v.id === groupId)?.values?.find(v => v.id === valueId)
        ).filter(v => v !== undefined);

        if (selectedVariants.length === 0) return [];

        // İlk varyantın combinations değerlerini alın
        let commonCombination = new Set(selectedVariants[0]?.combinations || []);

        // Diğer varyantların combinations değerleriyle kesiştirin
        selectedVariants.slice(1).forEach(v => {
            const variantCombinations = v?.combinations || [];
            commonCombination = new Set([...commonCombination].filter(c => variantCombinations.includes(c)));
        });

        return setCommonCombinations([...commonCombination]);
    }, [selectedValues, variants]);

    useEffect(() => {
        getCommonCombinations()
    }, [getCommonCombinations])

    const handleVariantSelect = (groupId: string, valueId: number) => {
        setSelectedValues(prev => {
            const newValues = new Map(prev);
            newValues.set(groupId, valueId);
            return newValues;
        });
    };

    const updateSelectedValuesByCombinationId = useCallback(() => {
        const selectedVariantId = product.selectedVariant?.id;
        
        if (selectedVariantId) {
            const newSelectedValues = new Map<string, number>();
    
            variants?.forEach(variant => {
                variant.values.forEach(value => {
                    if (value.combinations.includes(selectedVariantId.toString())) {
                        newSelectedValues.set(variant.id, value.id);
                    }
                });
            });
    
            setSelectedValues(newSelectedValues);
        }
    }, [product.selectedVariant, variants]);
    
    
    useEffect(() => {
        updateSelectedValuesByCombinationId()
    }, [updateSelectedValuesByCombinationId])

    const handleGetCombinations = useCallback(async() => {
        if (product.selectedVariant?.id.toString() !== commonCombinations[0] && commonCombinations.length > 0) {
            try {
                setLoading(true);
                const res = await request({url: `/comnbinations/selectedComb?id=${commonCombinations}`, method: 'get'})
                setProduct({...product, selectedVariant: res.data})
            } catch (error: any) {
                throw new Error(error);
            } finally {
                setLoading(false);
            }
        }
    }, [commonCombinations, product, setProduct])

    useEffect(() => {
        handleGetCombinations()
    }, [handleGetCombinations])

  return (
    <div className="space-y-5">
        {
            variants?.map((v, i) => (
                <div className="space-y-3" key={i}>
                    <p className="font-semibold">{v.name}</p>
                    <div className="flex items-center flex-wrap gap-3">
                        {v.values?.map((_, i) => (
                            <button 
                            onClick={() => handleVariantSelect(v.id, _.id)}
                            key={i} 
                            className={cn("px-5 py-2 text-sm font-medium rounded-md border border-border hover:bg-third duration-300",
                                product.selectedVariant && _.combinations.includes(product.selectedVariant.id.toString()) ? 
                                'bg-scrx text-white hover:text-primary' : ''
                            )}>
                                {_.value}
                            </button>
                        ))}
                    </div>
                </div>
            ))
        }

        {loading && (<LoadingScreen className="opacity-50"/>)}
    </div>
  )
}

export default Variants