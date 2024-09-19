import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { VariantOptionsProps, VariantsProps } from '@/types'
import { FC } from 'react'

interface Props {
    options: VariantOptionsProps[]
    disabled: boolean
    variant: VariantsProps,
    setVariants: React.Dispatch<React.SetStateAction<VariantsProps[]>>
  }
  
  const AddedOptionValues: FC<Props> = ({
    options,
    disabled,
    variant,
    setVariants
  }) => {

    const {toast} = useToast()

    const handleAddOrDelete = (v: VariantOptionsProps) => {
        let updatedValues: VariantOptionsProps[];

        if (variant.values.some(_v => _v.id === v.id)) {
            if (variant.values.length === 1) {
                toast({ title: 'İşlem Başarısız', description: "En az bir tane seçenek değeri seçin!" });
                return;
            }
            updatedValues = variant.values.filter(_v => _v.id !== v.id);
        } else {
            updatedValues = [...variant.values, v];
        }

        setVariants(prevVariants => prevVariants.map(vr => 
            vr.id === variant.id 
                ? { ...vr, values: updatedValues } 
                : vr
        ));
    };

    const handleAddAll = () => {
        setVariants(prevVariants => prevVariants.map(vr => 
            vr.id === variant.id 
                ? { ...vr, values: options } 
                : vr
        ));
    };
        
      return (
        <div className="absolute top-0 right-0 h-full">
            <Popover>
                <PopoverTrigger asChild>
                    <Button disabled={disabled} className="h-full" variant="reversedDark">Seçenek Değeri Düzenle</Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] mr-20 space-y-10 bg-lightBg dark:bg-darkPrimaryLight">
                    <p className="text-center dark:text-thirth font-semibold text-sm text-darkPrimary">
                      Seçenek Değeri Düzenle
                    </p>
                    
                    <div className="flex items-center max-h-[450px] overflow-y-auto  flex-wrap gap-2">
                      {
                        options?.map((v, i) => (
                          <div key={i} className={cn("pl-3 pr-9 select-none overflow-hidden relative py-1 rounded-full duration-300 font-semibold flex items-center gap-3",
                            variant.values.includes(v) ? ' text-thirth bg-darkPrimary' : 'bg-white text-darkPrimary dark:bg-thirth'
                          )}>
                            {v.value}
    
                            <button 
                              onClick={() => handleAddOrDelete(v)}
                              className={cn("absolute right-0 h-full w-6 flex items-center justify-center duration-300",
                                variant.values.includes(v) ? 'bg-red-500 text-white' : 'bg-darkPrimary text-thirth'
                              )}>
                              {variant.values.includes(v) ? '-' : '+'}
                            </button>
                          </div>
                        ))
                      }
                    </div>
    
                    <div className="flex justify-end gap-3">
                      <Button onClick={handleAddAll} variant={'primary'}>Tümünü Ekle</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      )
    }

export default AddedOptionValues