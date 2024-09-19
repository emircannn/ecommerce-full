/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Heading from "@/components/UIX/Heading"
import { cn } from "@/lib/utils"
import request from "@/utils/request"
import { useCallback, useEffect, useState } from "react"

const Menu = ({setStatus, status, setPage} : {
    status: number | null
    setStatus : React.Dispatch<React.SetStateAction<null | number>>
    setPage: React.Dispatch<React.SetStateAction<number>>
}) => {
    const [statusArr, setStatusArr] = useState<{id: number, name: string}[]>([])
    const getStatus = useCallback(async () => {
        try {
            const res = await request({url: '/filters/status', method: 'get'})
            setStatusArr(res.data)
        } catch (error:any) {
            throw new Error(error)
        }
    }, [])

    useEffect(() => {
        getStatus()
    }, [getStatus])

  return (
    <div className="space-y-5 w-full overflow-hidden">
        <Heading 
            title="Siparişlerim"
        />
        <div className="max-w-full overflow-x-auto hideScroll flex items-center gap-3">
            <button 
            onClick={() => {setStatus(null), setPage(1)}}
            className={cn('px-4 py-2 text-xs shrink-0 font-semibold border rounded-md duration-300', !status ? 'border-scrx text-scrx' : 'border-border text-secondary-foreground')}
            >
                Tümü
            </button>
            {
                statusArr?.map((v) => (
                    <button 
                    onClick={() => {setStatus(v.id), setPage(1)}}
                    className={cn('px-4 py-2 text-xs shrink-0 font-semibold border rounded-md duration-300', v.id === status ? 'border-scrx text-scrx' : 'border-border text-secondary-foreground')}
                    key={v.id}>
                        {v.name}
                    </button>
                ))
            }
        </div>
    </div>
  )
}

export default Menu