import { IProduct } from "@/types"
import Collapsible from "./Collapsible"
import Question from "./Question"

const CollapsibleWrapper = ({
    product
}: {
    product: IProduct
}) => {

    const desc = (
        <p className="text-xs 876:text-sm text-third-dark" dangerouslySetInnerHTML={{__html: product.desc}}/>
    ) 

    const tableProps = (
        <div className="text-xs font-semibold 876:text-sm text-third-dark w-full">
            <p className="text-center">Henüz değerlendirme yapılmamış</p>
        </div>
    )

    const question = (
        <div>
            <Question/>
        </div>
    )

  return (
    <div className="w-full border border-border">
        <Collapsible
            title="Ürün Açıklaması"
            collapsesibleSide={desc}
        />
        <Collapsible
            title="Değerlendirmeler"
            collapsesibleSide={tableProps}
        />
        <Collapsible
            title="Soru & Cevap"
            collapsesibleSide={question}
        />
    </div>
  )
}

export default CollapsibleWrapper