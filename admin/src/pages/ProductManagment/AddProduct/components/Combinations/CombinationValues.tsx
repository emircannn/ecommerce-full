/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CombinationsProps } from "@/types"
import { Trash2 } from "lucide-react"
import CurrencyInput from "react-currency-input-field"
import { getBarcode, getSku } from "../../request"

const CombinationValues = ({
  combination,
  handleDeleteCombination,
  setCombinations,
  index
}: {
  combination: CombinationsProps;
  handleDeleteCombination: () => void;
  setCombinations: React.Dispatch<React.SetStateAction<CombinationsProps[]>>
  index: number
}) => {

  const handlePriceChange = (newPrice: any) => {
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].price = newPrice.float;
      updatedVariants[index].priceValue = newPrice.value;
      return updatedVariants;
    });
  };

  const handleQuantityChange = (stock: number) => {
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      if(stock > 0) {
        updatedVariants[index].stock = stock;
      } else {
        updatedVariants[index].stock = null;
      }
      return updatedVariants;
    });
  };

  const handleWeightChange = (newWeight: number) => {
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      if(newWeight >= 0) {
        updatedVariants[index].weight = newWeight;
      } else {
        updatedVariants[index].weight = null
      }
      return updatedVariants;
    });
  };
  const handleSpecialChange = (newSpecial: any) => {
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].special = newSpecial.float;
      updatedVariants[index].specialValue = newSpecial.value;
      return updatedVariants;
    });
  };
  
  const handleCreateBarcode = async() => {
    const res = await getBarcode()
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].barcode = res.barcode;
      return updatedVariants;
    });
  };
  const handleCreateSku = async() => {
    const res = await getSku()
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].sku = res.sku;
      return updatedVariants;
    });
  };

  const handleChangeBarcode = (newBarcode: string) => {
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].barcode = newBarcode;
      return updatedVariants;
    });
  };
  const handleChangeSku = (newSku: string) => {
    setCombinations((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].sku = newSku;
      return updatedVariants;
    });
  };

  return (
    <div className="flex gap-3 w-full">
      <div className="w-full flex flex-col gap-5">
        <div className="w-full bg-lightBg dark:bg-darkPrimaryLight p-2 rounded-xl flex items-center flex-wrap gap-2">
          {combination.variant_values?.map((v, i) => (
            <div key={i}        
            className="py-2 px-3 bg-white dark:bg-darkPrimary rounded-xl text-darkPrimary dark:text-thirth font-semibold text-sm">
              {v.value}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full px-3">
          <div className="flex flex-col items-center gap-3 w-full">
            <Label>Stok Kodu*</Label>
            <div className="flex items-center gap-1 w-full">
              <Input 
              value={combination.sku}
              onChange={(e) => handleChangeSku(e.target.value)}
              placeholder="Stok Kodu Giriniz"/>
              <button 
              onClick={handleCreateSku}
              className="h-[40px] aspect-square flex items-center justify-center text-xs font-semibold text-darkPrimary
              bg-thirth hover:bg-opacity-80 duration-300 rounded-full">auto</button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <Label>Barkod*</Label>
            <div className="flex items-center gap-1 w-full">
              <Input 
              value={combination.barcode}
              onChange={(e) => handleChangeBarcode(e.target.value)}
              placeholder="Barkod Giriniz"/>
              <button 
              onClick={handleCreateBarcode}
              className="h-[40px] aspect-square flex items-center justify-center text-xs font-semibold text-darkPrimary
              bg-thirth hover:bg-opacity-80 duration-300 rounded-full">auto</button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <Label>Desi</Label>
            <Input 
            value={combination.weight ? combination.weight : ''}
            min={1}
            onChange={(e) => handleWeightChange(parseInt(e.target.value))}
            type="number" placeholder="Desi Bilgisi Giriniz"/>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <Label>Stok*</Label>
            <Input 
            value={combination.stock ? combination.stock : ''}
            min={1}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            type="number" placeholder="Stok Bilgisi Giriniz"/>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <Label>Fiyat*</Label>
            <CurrencyInput
                    placeholder="₺ 100,00"
                    decimalSeparator=","
                    groupSeparator="."
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    allowDecimals
                    prefix="₺ "
                    value={combination.priceValue}
                    onValueChange={(_value, _name, values) => handlePriceChange(values)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <Label>İndirimli Fiyat</Label>
            <CurrencyInput
                    placeholder="₺ 90,00"
                    decimalSeparator=","
                    groupSeparator="."
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    allowDecimals
                    prefix="₺ "
                    value={combination.specialValue}
                    onValueChange={(_value, _name, values) => handleSpecialChange(values)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
          </div>
        </div>
      </div>

      <button 
        onClick={handleDeleteCombination}
        className="shrink-0 w-[40px] hover:opacity-80 duration-300 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center">
        <Trash2 className="text-white"/>
      </button>
    </div>
  )
}

export default CombinationValues