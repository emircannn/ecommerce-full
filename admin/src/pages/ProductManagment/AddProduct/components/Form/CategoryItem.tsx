import { SelectItem } from "@/components/ui/select"
import { SelectCategoriesProps } from "@/types"

const CategoryItem = ({v}: {v: SelectCategoriesProps}) => {
  return (
    <div className="mb-2">
        <SelectItem className="" value={v.id.toString()}>{v.name}</SelectItem>
        {v.sub_categories?.map((v, i) => (
        <div key={i} className="pl-3 font-light">
            <CategoryItem
              v={v}
            />
        </div>
        ))}
    </div>
  )
}

export default CategoryItem