import MainWrapper from "@/components/MainWrapper"
import Option from "./Option"
import { AddAndUpdateOption } from "./AddAndUpdateOption"
import { Star } from "lucide-react"
import VariantLoading from "./VariantLoading"

const Options = ({
    options,
    getData,
    loading,
    group_id
}: {
    options: {id: string, value: string}[]
    getData: () => void,
    loading: boolean
    group_id: string | number | undefined
}) => {

  return (
    <MainWrapper className="rounded-md border border-border overflow-hidden">
        <div className="w-full bg-lightBg dark:bg-darkPrimaryLight p-5 shrink-0 flex items-center justify-between">
            <p className="font-semibold">Seçenek Değerleri</p>
            <AddAndUpdateOption
                getData={getData}
                group_id={group_id}
            />
        </div>

        <div className="h-full overflow-y-auto flex flex-col gap-3 p-5">
        {
                !loading ?
                options.length > 0 ?
                options.map((v, i) => (
                    <Option
                        key={i}
                        data={v}
                        getData={getData}
                        group_id={group_id}
                    />
                ))
                : (
                    <div className="flex items-center justify-center flex-col w-full h-full gap-3">
                        <Star size={40}/>
                        <p className="text-sm font-semibold">Seçenek değeri bulunamadı...</p>
                    </div>
                )
                :
                [...Array(10)].map((v) => (
                    <VariantLoading
                        key={v}
                    />
                ))
            }
        </div>
    </MainWrapper>
  )
}

export default Options