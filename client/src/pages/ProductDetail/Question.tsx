import { onlyDate } from "@/utils/helpers"
import { CiUser } from "react-icons/ci"

const Question = () => {

    const currentDate = Date.now()

  return (
    <div className="py-3 border-b border-border w-full space-y-5">
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 aspect-square rounded-full bg-third border flex items-center justify-center">
                        <CiUser size={20} className="text-third-dark"/>
                    </div>
                    <p className="text-xs 876:text-sm font-semibold">E***** Y****</p>
                </div>

                <span className="text-xs 876:text-sm text-third-dark font-medium">
                    {onlyDate(currentDate)}
                </span>
            </div>

            <p className="text-xs 876:text-sm text-third-dark">
            Merhaba! Veronica yatak başlığı çerçevesi 180x200 boyutlarında. Çerçevenin hangi malzemeden yapıldığını ve maksimum taşıma kapasitesinin ne olduğunu öğrenebilir miyim? Teşekkürler!
            </p>
        </div>

        <div className="px-3">
            <div className="flex flex-col gap-3 border-t pt-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 aspect-square rounded-full bg-third border flex items-center justify-center">
                            <CiUser size={20} className="text-third-dark"/>
                        </div>
                        <p className="text-xs 876:text-sm font-semibold">Admin</p>
                    </div>

                    <span className="text-xs 876:text-sm text-third-dark font-medium">
                        {onlyDate(currentDate)}
                    </span>
                </div>

                <p className="text-xs 876:text-sm text-third-dark">
                Merhaba! Veronica yatak başlığı çerçevesi 180x200 boyutlarında olup sağlam metalden üretilmiştir, bu da güvenilirlik ve dayanıklılık sağlar. Maksimum taşıma kapasitesi 300 kg'dır. Başka sorularınız varsa sormaktan çekinmeyin. Yardımcı olmaktan memnuniyet duyarız!
                </p>
            </div>
        </div>
    </div>
  )
}

export default Question