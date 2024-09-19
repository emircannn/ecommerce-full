import { useToast } from "@/hooks/use-toast";
import AddOrUpdateAddress from "@/pages/UserPanel/Address/AddOrUpdateAddress";
import { IAddress } from "@/types"
import request from "@/utils/request";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
const SheetAddress = ({
    data,
    getData,
    setValue,
    value,
    isBilling
}: {
    data: IAddress,
    getData?: () => void,
    setValue: React.Dispatch<React.SetStateAction<IAddress | undefined>>
    value: IAddress | undefined
    isBilling?: boolean
}) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();

    const handleDelete = async() => {
        try {
            setLoading(true);
            const url = `/address/delete?id=${data.id}`;
            const res = await request({url: url, data: {}})
            if(getData) {
                getData()
            }
            toast({
                title: 'İşlem Başarılı.',
                description: res.data.message
            })
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
            title: "İşlem Başarısız!",
            description: err.response.data.message
            })
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="rounded-md border border-border w-full h-fit overflow-hidden">
        <div className="w-full items-start flex gap-3 relative">
            <input onClick={() => setValue(data)} checked={value?.id === data.id} className="w-5 shrink-0 aspect-square !accent-primary ml-5 mt-5" type="radio" name="" id="" />
            <div className="space-y-1 text-sm pl-3 py-5 w-full">
                <p className="font-semibold">{data.title} {data.primary ? '(Varsayılan)' : '' }</p>
                <p className="line-clamp-2">{data.address}</p>
            </div>

            <div className="flex w-[30px] shrink-0 relative h-full"/>
            <button 
            onClick={() => setOpen(!open)}
            className="border-l border-t border-border w-[30px] absolute bottom-0 right-0 aspect-square bg-secondary
            rounded-tl-md flex items-center justify-center duration-300 text-scrx hover:text-white hover:bg-scrx">
                {open ? <IoIosClose/> : <BiDotsVertical />}
            </button>
        </div>
        {
            open && (
                <div className="w-full grid grid-cols-2 border-t border-border">
                    <AddOrUpdateAddress 
                        getData={getData}
                        customButton={
                        <button 
                            className="flex py-2 items-center justify-center border-r text-xs bg-secondary gap-2 hover:bg-scrx hover:text-white duration-300">
                                <Edit size={18}/> Düzenle
                            </button>
                        }
                        data={data}
                        isBilling={isBilling}
                    />
                    <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex py-2 items-center justify-center border-r text-xs bg-secondary gap-2 hover:bg-scrx hover:text-white duration-300"
                    >
                        <Trash size={18}/> Sil
                    </button>
                </div>
            )
        }
    </div>
  )
}

export default SheetAddress