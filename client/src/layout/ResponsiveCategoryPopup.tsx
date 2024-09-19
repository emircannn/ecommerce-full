import Image from "@/components/Image"
import { API_URL } from "@/config"
import { cn } from "@/lib/utils"
import { ICategory } from "@/types"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { BiCategory } from "react-icons/bi"
import { Link } from "react-router-dom"

const ResponsiveCategoryPopup = ({
    categories
}: {
    categories: ICategory[]
}) => {
    const [open, setOpen] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState<ICategory>()

    useEffect(() => {
        if(categories.length > 0) {
            setSelectedCategory(categories[0])
        }
    }, [categories])
    

  return (
    <>
        <button 
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1 px-3 items-center text-xs font-medium justify-center">
            <BiCategory size={22} className="text-neutral-600"/>
        </button>

        <div className={cn('fixed left-0 w-full h-full bg-white !z-[999] rounded-t duration-300', open ? 'top-0' : 'top-[150%]' )}>
            <div className="px-5 py-3 flex items-center justify-between border-b border-border">
                <p className="font-semibold">Kategoriler</p>
                <button onClick={() => setOpen(!open)}><X/></button>
            </div>
            <div className="w-full h-[calc(100vh_-_49px)] flex">
                <div className="h-full bg-secondary w-[76px] shrink-0 p-2 space-y-2 overflow-y-auto">
                    {categories.map((v, i) => (
                        <div onClick={() => setSelectedCategory(v)} key={i} className="flex flex-col justify-center items-center gap-2 w-full">
                            <div className="w-full aspect-square rounded-md overflow-hidden">
                                <Image
                                    src={`${API_URL}/${v.image}`}
                                />
                            </div>
                            <p className={cn("text-xs text-center", v.id === selectedCategory?.id ? 'font-semibold' : 'font-medium')}>{v.name}</p>
                        </div>
                    ))}
                </div>
                {selectedCategory &&
                (<div className="w-full grid grid-cols-3 gap-3 p-3 place-content-start">
                    <Link className="col-span-3 text-sm font-semibold" to={`/kategori/${selectedCategory.seo}`}>{selectedCategory.name}</Link>
                    {
                        selectedCategory.home_sub?.map((v, i) => (
                            <Link onClick={() => setOpen(false)} to={`/kategori/${v.seo}`} key={i} className="w-full flex flex-col gap-2">
                                <div className="w-full aspect-square rounded-md overflow-hidden">
                                <Image
                                    src={`${API_URL}/${v.image}`}
                                />
                                </div>
                                <p className="text-xs font-semibold text-center">{v.name}</p>
                            </Link>
                        ))
                    }
                </div>)
                }
            </div>
        </div>
    </>
  )
}

export default ResponsiveCategoryPopup