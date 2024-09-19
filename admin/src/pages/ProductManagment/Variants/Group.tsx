/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VariantGroupsProps } from "@/types"
import { AddAndUpdateGroup } from "./AddAndUpdateGroup"
import request from "@/utils/request"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialogComp } from "@/components/Alert"

const Group = ({
    data,
    selected,
    selectFunc,
    getData
}: {
    data: VariantGroupsProps
    selected: VariantGroupsProps | undefined,
    selectFunc: () => void
    getData: () => void
}) => {
 
    const {toast} = useToast()

    const handleDelete = async () => {
        try {
            const res = await request({url:  `/variations/delete-group?id=${data.id}`, data: {}})
            if(res.data.error) {
                toast({title:'İşlem başarısız!', description: res.data.message})
            }  else {
                toast({title:'İşlem başarılı.', description: res.data.message})
                getData()
            }
        } catch (error: any) {
            throw new Error(error)
        }
    }

  return (
    <div className="pb-2 border-b border-border w-full flex items-center justify-between">
        <p className={cn("text-sm font-semibold duration-300", selected?.id === data.id ? 'text-thirth' : 'text-darkPrimary dark:text-white')}>{data.name}</p>
        <div className="flex items-center gap-3">
            <Button onClick={selectFunc} variant={'primary'}>
                Seç
            </Button>
            <AddAndUpdateGroup
                getData={getData}
                data={data}
            />
            <AlertDialogComp
                customButton={
                    <Button variant={'reject'}>
                        Sil
                    </Button>
                }
                title="Seçenek grubunu silmek istediğinize emin misiniz?"
                handleAccept={handleDelete}
            />
        </div>
    </div>
  )
}

export default Group