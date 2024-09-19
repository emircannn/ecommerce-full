import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { SelectCategoriesProps } from "@/types"
import { FC } from "react"
import CategoryItem from "./CategoryItem"
  
  interface SelectCategoryProps {
    setCategoryName: React.Dispatch<React.SetStateAction<string>>
    categories: SelectCategoriesProps[]
    categoryName: string
    onValueChange: (value: string) => void
    value: string
}

const SelectCategory:FC<SelectCategoryProps> = ({
    setCategoryName,
    categories,
    categoryName,
    onValueChange,
    value
}) => {
  return (
    <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategori Seç" />
        </SelectTrigger>

        <SelectContent>
            <div className="p-2">
                <Input 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Kategori ara..."/>
            </div>
            <SelectGroup>
                <SelectLabel>Kategoriler</SelectLabel>
                    {
                        categories?.map((v, i) => (
                            <CategoryItem 
                            key={i}
                            v={v}
                            />
                        ))
                    }
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}

export default SelectCategory