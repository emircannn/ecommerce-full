import { FC } from "react"
import TextEditor from "./Form/Texteditor"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductFormProps } from "@/types"

interface DescProps {
    setDesc: React.Dispatch<React.SetStateAction<string>>
    desc: string
    form: ProductFormProps
    setForm: React.Dispatch<React.SetStateAction<ProductFormProps>>
}

const DescSeo: FC<DescProps> = ({
    setDesc,
    desc,
    form,
    setForm
}) => {

  return (
    <div className="space-y-5 px-10">
        <div className="space-y-2">
            <Label>Kısa Açıklama (Max 160 Karakter)*</Label>
            <Textarea
            className="resize-none"
            value={form.short_desc}
            maxLength={160}
            onChange={(e) => setForm({...form, short_desc: e.target.value})}
            />
        </div>
        <div className="space-y-2">
            <Label>Açıklama*</Label>
            <div className="w-full h-[450px]">
                <TextEditor
                    setDesc={setDesc}
                    desc={desc}
                />
            </div>
        </div>
    </div>
  )
}

export default DescSeo