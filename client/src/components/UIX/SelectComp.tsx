import { FC } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "@/components/ui/input"

interface SelectProps {
    placeholder?: string
    searchPlaceholder?: string
    search?: string
    setSearch?: React.Dispatch<React.SetStateAction<string>>
    label: string
    data: {value: string, name: string}[]
    onValueChange: (value: string) => void
    value: string,
    disabled?: boolean
}

const SelectComp: FC<SelectProps> = ({
    placeholder="Seç",
    searchPlaceholder="ara...",
    search, 
    setSearch,
    label,
    data,
    onValueChange,
    value,
    disabled=false
}) => {
  return (
    <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
            {
                setSearch && (
                    <div className="p-2">
                        <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}/>
                    </div>
                )
            }
            <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                { data?.length > 0 ?
                    data?.map((v,i) => (
                        <SelectItem key={i} className="" value={v.value}>{v.name}</SelectItem>
                    ))
                : 
                <p className="text-xs font-semibold text-center py-5">Veri Bulunamadı...</p>
                }
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}

export default SelectComp