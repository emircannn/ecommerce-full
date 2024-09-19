/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Skeleton } from "@/components/ui/skeleton"
import { ICategory, IManufacturer } from "@/types"
import { Search, Star } from "lucide-react"

export const SelectItem = ({
    name,
    value,
    labelName,
    checked,
    onChange,
    setPage,
}: {
    name?: string
    value: string
    labelName: string
    checked: boolean
    onChange: React.ChangeEventHandler<HTMLInputElement>
    setPage: React.Dispatch<React.SetStateAction<number>>
}) => {
    return (
        <label htmlFor={value} className="flex items-center gap-2">
            <input 
            name={name}
            id={value}
            value={value}
            checked={checked}
            onChange={onChange}
            onClick={() => setPage(1)}
            className="accent-scrx"
            type="checkbox" />
            <p className="font-medium">{labelName}</p>
        </label>
    )
}

export const FilterInput = ({
    id
}: {
    id: string
}) => {
    return (
        <label htmlFor={id} className="w-full flex h-8 rounded-md border border-border hover:bg-secondary duration-300 cursor-pointer">
            <div className="h-full aspect-square shrink-0 flex items-center justify-center">
                <Search className="text-third-dark" size={18}/>
            </div>
            <input 
            id={id}
            name={id}
            placeholder="Filtrele"
            className="w-full border-none outline-none text-xs placeholder:text-third-dark"
            type="text" />
        </label>
    )
}

export const LoadingComp = () => {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="shrink-0 w-[13px] aspect-square rounded-sm"/>
            <Skeleton className="w-full h-4 rounded-full"/>
        </div>
    )
}

const FilterSide = ({
    loading,
    categories,
    manufacturers,
    selectedCategories, 
    setSelectedCategories,  
    selectedManufacturers,  
    setSelectedManufacturers,           
    review,                
    setReview, 
    total,
    setPage,
    isManufacturer=false
}: {
    loading: boolean
    categories: ICategory[]
    manufacturers?: IManufacturer[]
    selectedCategories: string[]
    setSelectedCategories: (value: string[]) => void
    selectedManufacturers?: string[]
    setSelectedManufacturers?: (value: string[]) => void
    review: string                       
    setReview: (value: string) => void
    total: number | undefined 
    setPage: React.Dispatch<React.SetStateAction<number>> 
    isManufacturer?: boolean
}) => {

    const reviewFilterArr = [
        {name: '4 yıldız ve üzeri', value: '4'},
        {name: '3 yıldız ve üzeri', value: '3'},
        {name: '2 yıldız ve üzeri', value: '2'},
        {name: '1 yıldız ve üzeri', value: '1'},
    ]

    const handleCheckboxChange = (value: string, type: 'categories' | 'manufacturers') => {
        if (type === 'categories') {
            // @ts-expect-error
            setSelectedCategories((prevCategories: string[]) => {
                if (prevCategories.includes(value)) {
                    // Kategori varsa, çıkart
                    return prevCategories.filter((category: string) => category !== value);
                } else {
                    // Kategori yoksa, ekle
                    return [...prevCategories, value];
                }
            });
        } else if (type === 'manufacturers') {
            // @ts-expect-error
            setSelectedManufacturers((prevManufacturers: string[]) => {
                if (prevManufacturers.includes(value)) {
                    // Üretici varsa, çıkart
                    return prevManufacturers.filter((manufacturer: string) => manufacturer !== value);
                } else {
                    // Üretici yoksa, ekle
                    return [...prevManufacturers, value];
                }
            });
        }
    };
    
    

  return (
    <div className="w-full border border-border rounded-md">
        <div className="py-2 px-3">
            <b>{total || 0}</b> ürün
        </div>
        <div className="py-2 space-y-3 border-t border-border">
            <div className="flex items-center justify-between px-3">
                <b className="">Kategori</b>
                {
                    selectedCategories.length > 0 && (
                    <button  
                        onClick={() => setSelectedCategories([])}
                        className="text-scrx hover:underline">Temizle
                    </button>
                    )
                }
            </div>
            <div className="px-3">
                <FilterInput
                    id="categorySearch"
                />
            </div>
            <div className="px-3 space-y-2 max-h-[200px] overflow-y-auto">
                {
                    !loading ?
                    categories.length > 0 ?
                    categories?.map((v, i) => (
                        v &&
                        <SelectItem
                            key={i}
                            value={v.id.toString()}
                            labelName={v.name}
                            name="category"
                            checked={selectedCategories.includes(v.id.toString())}
                            onChange={() => handleCheckboxChange(v.id.toString(), 'categories')}
                            setPage={setPage}
                        />
                    ))
                    :
                    (<p className="text-center py-3">Kategori Bulunamadı...</p>)
                    :
                    [...Array(4)].map((_, i) => (
                        <LoadingComp
                            key={i}
                        />
                    ))
                }
            </div>
        </div>
        {!isManufacturer && selectedManufacturers && setSelectedManufacturers ?
        (<div className="py-2 space-y-3 border-t border-border">
            <div className="flex items-center justify-between px-3">
                <b className="">Marka</b>
                {
                    selectedManufacturers.length > 0 && (
                    <button  
                        onClick={() => setSelectedManufacturers([])}
                        className="text-scrx hover:underline">Temizle
                    </button>
                    )
                }
            </div>
            <div className="px-3">
                <FilterInput
                    id="manufacturerSearch"
                />
            </div>
            <div className="px-3 space-y-2 max-h-[200px] overflow-y-auto">
                {   !loading ?
                    manufacturers && manufacturers.length > 0 ?
                    manufacturers?.map((v, i) => (
                        v &&
                        <SelectItem
                            key={i}
                            value={v.id.toString()}
                            labelName={v.name}
                            name="manufacturer"
                            checked={selectedManufacturers.includes(v.id.toString())}
                            onChange={() => handleCheckboxChange(v.id.toString(), 'manufacturers')}
                            setPage={setPage}
                        />
                    ))
                    :
                    (<p className="text-center py-3">Marka Bulunamadı...</p>)
                    :
                    [...Array(4)].map((_, i) => (
                        <LoadingComp
                            key={i}
                        />
                    ))
                }
            </div>
        </div>)
        : null}
        <div className="py-2 space-y-3 border-t border-border">
            <div className="flex items-center justify-between px-3">
                <b className="">Değerlendirme</b>
                {
                    review && (
                    <button  
                        onClick={() => setReview('')}
                        className="text-scrx hover:underline">Temizle
                    </button>
                    )
                }
            </div>
            <div className="px-3 space-y-2 max-h-[270px] overflow-y-auto">
                {
                    reviewFilterArr.map((v, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input 
                            className="accent-scrx"
                            name="star" 
                            id="star" 
                            type="radio" 
                            checked={v.value === review}
                            onChange={() => setReview(v.value)}
                            onClick={() => setPage(1)}
                            value={v.value} />
                            <div className="flex gap-1 items-center">
                            <Star size={14}/>
                            <p className="font-medium">{v.name}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default FilterSide