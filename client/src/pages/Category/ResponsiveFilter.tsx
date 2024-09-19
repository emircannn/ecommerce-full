/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cn } from "@/lib/utils"
import { Filter, Star, X } from "lucide-react"
import { useState } from "react"
import { FilterInput, LoadingComp, SelectItem } from "./FilterSide"
import { ICategory, IManufacturer } from "@/types"

const ResponsiveFilter = ({
    loading,
    categories,
    manufacturers,
    selectedCategories, 
    setSelectedCategories,  
    selectedManufacturers,  
    setSelectedManufacturers,           
    review,                
    setReview, 
    setPage
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
    setPage: React.Dispatch<React.SetStateAction<number>> 
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
    const [open, setOpen] = useState(false)
  return (
    <>
    <button 
    onClick={() => setOpen(!open)}
    className="w-full h-[40px] lg:hidden rounded-md border border-border text-sm hover:bg-secondary duration-300 flex items-center justify-center gap-3">
        <Filter size={20}/>
        Filtrele
    </button>

    {
        open && (
            <div 
            onClick={() => setOpen(!open)}
            className="fixed inset-0 bg-black/50 z-[55] animate-fade"/>
        )
    }

    <div className={cn('fixed top-0 bg-white text-xs w-[250px] z-[56] h-full overflow-y-auto duration-300 p-3 space-y-5', open ? 'left-0' : '-left-[100%]')}>
        <div className="flex items-center justify-between gap-5">
            <b className="text-base">Filtrele</b>
            <button
                onClick={() => setOpen(!open)}
            >
                <X/>
            </button>
        </div>
        <div className="hiddenScroll h-[calc(100vh_-_68px)] overflow-y-auto">
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
        {
            manufacturers && selectedManufacturers && setSelectedManufacturers ?
            <div className="py-2 space-y-3 border-t border-border">
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
                    manufacturers.length > 0 ?
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
        </div>
        : null
        }
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
    </div>
    </>
  )
}

export default ResponsiveFilter