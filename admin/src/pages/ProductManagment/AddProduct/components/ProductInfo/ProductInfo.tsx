import { PriceType, ProductFormProps, SelectCategoriesProps, SelectManufacturerProps } from "@/types";
import Form from "../Form";
import Photos, { PhotoProps } from "./Photos"

export interface ImageProps {
  data: File | null;
  pre: string | ArrayBuffer | null;
}

export interface ProductInfoProps extends PhotoProps {
  setCategoryName: React.Dispatch<React.SetStateAction<string>>
  categories: SelectCategoriesProps[]
  categoryName: string
  manufacturers: SelectManufacturerProps[]
  manufacturerName: string
  setManufacturerName: React.Dispatch<React.SetStateAction<string>>
  form: ProductFormProps
  setForm: React.Dispatch<React.SetStateAction<ProductFormProps>>
  price: PriceType
  setPrice: React.Dispatch<React.SetStateAction<PriceType>>
  discountPrice: PriceType
  setDiscountPrice: React.Dispatch<React.SetStateAction<PriceType>>
  }

const ProductInfo: React.FC<ProductInfoProps> = ({
  setCategoryName,
  categories,
  categoryName,
  manufacturers,
  manufacturerName,
  setManufacturerName,
  setForm,
  form,
  price,
  setPrice,
  setDiscountPrice,
  discountPrice,
  handleSelectFile,
  handleSelectFiles,
  image,
  images,
  setImage,
  setImages
})=> {
  return (
    <div className="flex justify-center gap-10 px-10">
      <Photos
      image={image}
      images={images}
      setImage={setImage}
      setImages={setImages}
      handleSelectFile={handleSelectFile}
      handleSelectFiles={handleSelectFiles}

      />
      <Form
        setCategoryName={setCategoryName}
        categories={categories}
        categoryName={categoryName}
        manufacturerName={manufacturerName}
        manufacturers={manufacturers}
        setManufacturerName={setManufacturerName}
        setForm={setForm}
        form={form}
        price={price}
        setPrice={setPrice}
        setDiscountPrice={setDiscountPrice}
        discountPrice={discountPrice}
      />
    </div>
  )
}

export default ProductInfo