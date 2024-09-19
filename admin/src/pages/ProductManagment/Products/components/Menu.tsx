/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectComp from "@/components/SelectComp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoriesProps, ManufacturerProps } from "@/types"
import request from "@/utils/request"
import { Filter, FilterX } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { SetURLSearchParams } from "react-router-dom"

const Menu = ({
    setSearchParams,
    searchParams,
    total,
    handleClose,
    handleOpen,
    disabled
}: {
    setSearchParams: SetURLSearchParams
    searchParams: URLSearchParams
    total: number,
    handleOpen: () => void
    handleClose: () => void
    disabled: boolean
}) => {

    const [name, setName] = useState('')
    const [sku, setSku] = useState('')
    const [image, setImage] = useState('')
    const [isActive, setIsActive] = useState('')
    const [categories, setCategories] = useState<CategoriesProps[]>([])
    const [categoryName, setCategoryName] = useState('')
    const [selectedCategory, setSelectedcategory] = useState('')
    const [manufacturers, setManuFacturers] = useState<ManufacturerProps[]>([])
    const [manufacturerName, setManufacturerName] = useState('')
    const [selectedManufacturer, setSelectedManufacturer] = useState('')
    const [selectedSort, setSelectedSort] = useState('')
    const sort = [
        {value: '1', name: 'Artan Fiyat'},
        {value: '2', name: 'Azalan Fiyat'},
        {value: '3', name: 'Eski Yüklenen'},
        {value: '4', name: 'Yeni Yüklenen'},
    ]

  const addQueryParams = () => {
    const currentParams = Object.fromEntries([...searchParams]);
    const newParams = {
        name: name,
        categoryIds: selectedCategory, 
        manufacturerIds: selectedManufacturer, 
        sku: sku,
        sortField: selectedSort === '1' || selectedSort === '2' ? 'price' : 'createdAt',
        sortBy: selectedSort === '1' || selectedSort === '3' ? 'ASC' : 'DESC',
        hasImage: image, 
        isActive: isActive
      };
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          currentParams[key] = value;
        }
      }
      setSearchParams(currentParams);
  }

  const handleClearFilter = () => {
    setSearchParams({limit: '10', page: '1'})
    setName('')
    setSku('')
    setImage('')
    setIsActive('')
    setSelectedcategory('')
    setSelectedManufacturer('')
  }

  const getCategories = useCallback(async() => {
    try {
        const res = await request({url: `/category/admin/select?name=${categoryName}`, method: 'get'})
        setCategories(res.data)
    } catch (error: any) {
        throw new Error(error)
    }
  }, [categoryName])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  const getManufacturers = useCallback(async() => {
    try {
        const res = await request({url: `/manufacturer/admin/select?name=${manufacturerName}`, method: 'get'})
        setManuFacturers(res.data)
    } catch (error: any) {
        throw new Error(error)
    }
  }, [manufacturerName])

  useEffect(() => {
    getManufacturers()
  }, [getManufacturers])
  

  return (
    <div className="w-full h-[120px] rounded-xl shadow-lg border border-border overflow-hidden flex">
        <div className="w-full p-5 flex items-center gap-20">
            <div className="shrink-0 w-fit space-y-2">
                <p className="text-sm font-semibold">Hızlı Filitre</p>
                <p className="text-sm">
                    Ürün adeti: <b>{total}</b>
                </p>
            </div>

            <div className="w-full grid grid-cols-4 gap-2">
                <SelectComp
                    placeholder="Kategori Seç"
                    searchPlaceholder="Kategori Ara..."
                    label="Kategoriler"
                    data={categories?.map((v) => ({value: v.id.toString(), name: v.name}))}
                    setSearch={setCategoryName}
                    search={categoryName}
                    value={selectedCategory}
                    onValueChange={(e) => setSelectedcategory(e)}
                />
                <SelectComp
                    placeholder="Marka Seç"
                    searchPlaceholder="Makra Ara..."
                    label="Markalar"
                    data={manufacturers?.map((v) => ({value: v.id, name: v.name}))}
                    setSearch={setManufacturerName}
                    search={manufacturerName}
                    value={selectedManufacturer}
                    onValueChange={(e) => setSelectedManufacturer(e)}
                />
                <SelectComp
                placeholder="Sıralama"
                label="Sıralama"
                data={sort}
                onValueChange={(e) => setSelectedSort(e)}
                value={selectedSort}
                />
                <SelectComp
                placeholder="Ürün Durumu"
                label="Ürün Durumu"
                onValueChange={(e) => setIsActive(e)}
                value={isActive}
                data={[{name: 'Açık', value: 'true'}, {name: 'Kapalı', value: 'false'}]}
                />
                <SelectComp
                placeholder="Resim Durumu"
                label="Resim Durumu"
                onValueChange={(e) => setImage(e)}
                value={image}
                data={[{name: 'Var', value: 'true'}, {name: 'Yok', value: 'false'}]}
                />
                <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ürün Adı"/>

                <Input 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Stok Kodu"/>
                <div className="grid grid-cols-2 gap-2">
                    <Button 
                    disabled={disabled}
                    onClick={handleOpen}
                    variant={'accept'} className="w-full">
                        Aç
                    </Button>
                    <Button
                    disabled={disabled} 
                    onClick={handleClose}
                    variant={'reject'} className="w-full">
                        Kapat
                    </Button>
                </div>
            </div>
        </div>
        <div className="h-full w-[60px] bg-lightBg shrink-0 dark:bg-darkPrimaryLight flex flex-col gap-2 items-center justify-center">
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