/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { AddAndUpdateOption } from "./AddAndUpdateOption"
import { useToast } from "@/components/ui/use-toast"
import request from "@/utils/request"
import { AlertDialogComp } from "@/components/Alert"

const Option = ({
  data,
  getData,
  group_id
}: {
  data: {id: string, value:string}
  getData: () => void
  group_id: string | number | undefined
}) => {

  const {toast} = useToast()

    const handleDelete = async () => {
        try {
            const res = await request({url:  `/variations/delete-option?id=${data.id}`, data: {}})
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
        <p className="text-sm font-semibold">{data.value}</p>
        <div className="flex items-center gap-3">
              <AddAndUpdateOption
                data={data}
                getData={getData}
                group_id={group_id}
              />
            <AlertDialogComp
                customButton={
                    <Button variant={'reject'}>
                        Sil
                    </Button>
                }
                title="Seçenek değerini silmek istediğinize emin misiniz?"
                handleAccept={handleDelete}
            />
        </div>
    </div>
  )
}

export default Option