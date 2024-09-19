import { cn } from "@/lib/utils"

const Stage = ({
    stage
}: {
    stage: number
}) => {

    const stages = [
        {name: 'Temel Ürün Bilgileri', number: 1, isActive: stage === 1},
        {name: 'Açıklama', number: 2, isActive: stage === 2},
        {name: 'Seçenek Ekle', number: 3, isActive: stage === 3},
        {name: 'Ön İzleme ve Onay', number: 4, isActive: stage === 4},
    ]

  return (
    <div className="w-full py-5 shrink-0 px-20 bg-lightBg dark:bg-darkPrimaryLight rounded-xl flex items-center justify-between">
        {stages.map((v, i) => (
            <div key={i} className="flex items-center gap-3">
            <span 
            className={cn("rounded-full w-8 aspect-square flex items-center justify-center text-sm font-semibold",
                v.isActive ? 'bg-thirth text-darkPrimary' : 'bg-white text-darkPrimary dark:bg-darkPrimary dark:text-white'
            )}>
                {v.number}
            </span>

            <p className={cn("text-sm font-semibold ", 
                v.isActive ? 'text-darkPrimary dark:text-thirth' : ''
            )}>{v.name}</p>
        </div>
        ))}
    </div>
  )
}

export default Stage