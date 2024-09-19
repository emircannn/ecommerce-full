import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const SelectCompForAdres = ({
    placeholder,
    value,
    onValueChange,
    label,
    disabled,
    data
}: {
    placeholder: string
    value: string
    data: {id: number, name: string}[]
    onValueChange: (e: string) => void
    disabled?: boolean
    label: string

}) => {
  return (
    <Select disabled={disabled} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {
                data?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))
            }
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}

export default SelectCompForAdres