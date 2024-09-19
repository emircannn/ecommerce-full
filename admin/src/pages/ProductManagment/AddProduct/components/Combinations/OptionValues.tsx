import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { VariantOptionsProps } from "@/types"
import { FC } from "react"

interface Props {
  options: VariantOptionsProps[]
  disabled: boolean
  setSelectedOption: React.Dispatch<React.SetStateAction<VariantOptionsProps[]>>
  selectedOption: VariantOptionsProps[]
}

const OptionValues: FC<Props> = ({
  options,
  disabled,
  selectedOption,
  setSelectedOption
}) => {

  const handleAddAll = () => {
    setSelectedOption(options)
  }

  const handleDeleteAll = () => {
    setSelectedOption([])
  }

  const handleAddOrDelete = (v: VariantOptionsProps) => {
    if(selectedOption.includes(v)) {
      setSelectedOption(selectedOption.filter(_v => _v.id !== v.id))
    } else {
      setSelectedOption([...selectedOption, v])
    }
  }


  return (
    <div className="absolute top-0 right-0 h-full">
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={disabled} className="h-full" variant="reversedDark">Seçenek Değeri Seç</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] mr-20 space-y-10 bg-lightBg dark:bg-darkPrimaryLight">
                <p className="text-center dark:text-thirth font-semibold text-sm text-darkPrimary">
                  Seçenek Değeri Ekle/Çıkar
                </p>
                
                <div className="flex items-center max-h-[450px] overflow-y-auto  flex-wrap gap-2">
                  {
                    options?.map((v, i) => (
                      <div key={i} className={cn("pl-3 pr-9 select-none overflow-hidden relative py-1 rounded-full duration-300 font-semibold flex items-center gap-3",
                        selectedOption.includes(v) ? ' text-thirth bg-darkPrimary' : 'bg-white text-darkPrimary dark:bg-thirth'
                      )}>
                        {v.value}

                        <button 
                          onClick={() => handleAddOrDelete(v)}
                          className={cn("absolute right-0 h-full w-6 flex items-center justify-center duration-300",
                            selectedOption.includes(v) ? 'bg-red-500 text-white' : 'bg-darkPrimary text-thirth'
                          )}>
                          {selectedOption.includes(v) ? '-' : '+'}
                        </button>
                      </div>
                    ))
                  }
                </div>

                <div className="flex justify-end gap-3">
                  <Button onClick={handleDeleteAll} variant={'reversed'}>Tümünü Çıkar</Button>
                  <Button onClick={handleAddAll} variant={'primary'}>Tümünü Ekle</Button>
                </div>
            </PopoverContent>
        </Popover>
    </div>
  )
}

export default OptionValues