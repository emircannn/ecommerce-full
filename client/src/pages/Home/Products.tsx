import ProductSlider from "@/components/ProductSlider"
import { IProduct } from "@/types"

const Products = ({
    products,
}: {
    products: IProduct[],
}) => {
    

  return (
    <div className="container-wrapper">
        <ProductSlider
        products={products}
    />
    </div>
  )
}

export default Products