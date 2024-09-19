import MainWrapper from "@/components/MainWrapper"
import Group from "./Group"
import { VariantGroupsProps } from "@/types"
import { AddAndUpdateGroup } from "./AddAndUpdateGroup"
import VariantLoading from "./VariantLoading"
import { Star } from "lucide-react"

const Groups = ({
    groups,
    selectedGroups,
    setSelectedGroups,
    getData,
    loading
}: {
    groups: VariantGroupsProps[]
    selectedGroups: VariantGroupsProps | undefined
    setSelectedGroups: React.Dispatch<React.SetStateAction<VariantGroupsProps | undefined>>
    getData: () => void,
    loading: boolean
}) => {
  return (
    <MainWrapper className="rounded-md border border-border overflow-hidden">
        <div className="w-full bg-lightBg dark:bg-darkPrimaryLight p-5 shrink-0 flex items-center justify-between">
            <p className="font-semibold">Seçenek Grupları</p>

            <AddAndUpdateGroup
                getData={getData}
            />
        </div>
        <div className="h-full overflow-y-auto flex flex-col gap-3 p-5">
            {
                !loading ?
                groups.length > 0 ?
                groups.map((v, i) => (
                    <Group
                        key={i}
                        data={v}
                        selected={selectedGroups}
                        selectFunc={() => setSelectedGroups(v)}
                        getData={getData}
                    />
                ))
                : (
                    <div className="flex items-center justify-center flex-col w-full h-full gap-3">
                        <Star size={40}/>
                        <p className="text-sm font-semibold">Seçenek grubu bulunamadı...</p>
                    </div>
                )
                :
                [...Array(10)].map((v) => (
                    <VariantLoading
                        key={v}
                        group
                    />
                ))
            }
        </div>
    </MainWrapper>
  )
}

export default Groups