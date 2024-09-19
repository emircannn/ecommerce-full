import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SelectCategory from "./SelectCategory"
import { Button } from "@/components/ui/button"
import CurrencyInput from 'react-currency-input-field';
import { PriceType, ProductFormProps, SelectCategoriesProps, SelectManufacturerProps } from "@/types";
import { FC } from "react";
import { getBarcode, getSku } from "../../request";
import SelectComp from "@/components/SelectComp";

interface FormProps {
    setCategoryName: React.Dispatch<React.SetStateAction<string>>
    categories: SelectCategoriesProps[],
    categoryName: string;
    manufacturers: SelectManufacturerProps[]
    manufacturerName: string
    setManufacturerName: React.Dispatch<React.SetStateAction<string>>
    form: ProductFormProps
    setForm: React.Dispatch<React.SetStateAction<ProductFormProps>>
    price: PriceType
    setPrice: React.Dispatch<React.SetStateAction<PriceType>>
    discountPrice: PriceType
    setDiscountPrice: React.Dispatch<React.SetStateAction<PriceType>>
}

const Form: FC<FormProps> = ({
    setCategoryName,
    categories,
    categoryName,
    manufacturers,
    manufacturerName,
    setManufacturerName,
    setForm,
    form,
    setPrice,
    price,
    setDiscountPrice,
    discountPrice
}) => {

    const handleSku = async() => {
        const sku = await getSku()
        setForm({...form, sku: sku.sku})
    }

    const handleBarcode = async() => {
        const barcode = await getBarcode()
        setForm({...form, barcode: barcode.barcode})
    }

  return (
    <div className="w-[550px] space-y-3 mr-20">
        <div className="space-y-1">
            <Label>Ürün Adı*</Label>
            <Input 
            onChange={(e) => setForm({...form, name: e.target.value})}
            value={form.name}
            placeholder="Ürün Adı"/>
        </div>

        <div className="space-y-1">
            <Label>Kategori*</Label>
            <SelectCategory
                setCategoryName={setCategoryName}
                categoryName={categoryName}
                categories={categories}
                onValueChange={(e: string) => setForm({...form, category: e})}
                value={form.category}
            />
        </div>

        <div className="space-y-1">
            <Label>Barkod*</Label>
            <div className="flex items-center gap-3">
                <Input 
                onChange={(e) => setForm({...form, barcode: e.target.value})}
                value={form.barcode}
                placeholder="Ürün Barkodu"/>
                <Button onClick={handleBarcode} variant={'primary'} className="w-[157px] shrink-0">Barkod Oluştur</Button>
            </div>
        </div>

        <div className="space-y-1">
            <Label>Stok Kodu*</Label>
            <div className="flex items-center gap-3">
                <Input 
                onChange={(e) => setForm({...form, sku: e.target.value})}
                value={form.sku}
                placeholder="Stok Kodu"/>
                <Button onClick={handleSku} variant={'primary'}>Stok Kodu Oluştur</Button>
            </div>
        </div>

        <div className="space-y-1">
            <Label>Marka</Label>
            <div className="flex items-center gap-3">
                <SelectComp
                    search={manufacturerName}
                    setSearch={setManufacturerName}
                    label="Markalar"
                    placeholder="Marka Seçiniz"
                    searchPlaceholder="Marka ara..."
                    data={manufacturers?.map((v) => {
                        return {value: v.id, name: v.name}
                    })}
                    onValueChange={(e: string) => setForm({...form, manufacturer: e})}
                    value={form.manufacturer}
                />
                <Button className="w-[157px] shrink-0" variant={'primary'}>Yoksa Ekle</Button>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
                <Label>Stok*</Label>
                <Input 
                onChange={(e) => setForm({...form, stock: Number(e.target.value)})}
                value={form.stock}
                min={1} type="number" placeholder="100"/>
            </div>
            <div className="space-y-1">
                <Label>Sevk*</Label>
                <Input 
                onChange={(e) => setForm({...form, mpn: Number(e.target.value)})}
                value={form.mpn}
                min={1} type="number" placeholder="30"/>
            </div>
            <div className="space-y-1">
                <Label>Desi</Label>
                <Input 
                onChange={(e) => setForm({...form, weight: Number(e.target.value)})}
                value={form.weight}
                min={1} type="number" placeholder="1"/>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <Label>Liste Fiyatı*</Label>
                <CurrencyInput
                    placeholder="₺ 100,00"
                    decimalSeparator=","
                    groupSeparator="."
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    allowDecimals
                    prefix="₺ "
                    value={price?.value}
                    onValueChange={(_value, _name, values) => {
                        if (values) {
                          setPrice({
                            float: values.float,
                            formatted: values.formatted,
                            value: values.value
                          });
                        }
                      }}
                    className="inputClass"
                />
            </div>

            <div className="space-y-1">
                <Label>İndirimli Fiyat</Label>
                <CurrencyInput
                    placeholder="₺ 90,00"
                    decimalSeparator=","
                    groupSeparator="."
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    allowDecimals
                    prefix="₺ "
                    value={discountPrice?.value}
                    onValueChange={(_value, _name, values) => {
                        if (values) {
                          setDiscountPrice({
                            float: values.float,
                            formatted: values.formatted,
                            value: values.value
                          });
                        }
                      }}
                    className="inputClass"
                />
            </div>
        </div>
    </div>
  )
}

export default Form