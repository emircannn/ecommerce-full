/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react"
import Stage from "./components/Stage"
import { Button } from "@/components/ui/button"
import ProductInfo from "./components/ProductInfo/ProductInfo"
import DescSeo from "./components/DescSeo"
import Combinations from "./components/Combinations"
import { CombinationsProps, PriceType, ProductFormProps, SelectCategoriesProps, SelectManufacturerProps, VariantsProps } from "@/types"
import { useFileHandler } from "@/hooks/useFileHandler"
import { useToast } from "@/components/ui/use-toast"
import { createProduct, handleCombinations } from "./request"
import { validateCombinations } from "@/utils/helpers"
import Preview from "./components/Preview"
import ProductLoading from "./components/ProductLoading"
import MainWrapper from "@/components/MainWrapper"
import request from "@/utils/request"



const AddProduct = () => {

  const [stage, setStage] = useState(1)
  const {toast} = useToast()
  const { handleSelectFile, handleSelectFiles, image, setImage, images, setImages } = useFileHandler();

  const [categories, setCategories] = useState<SelectCategoriesProps[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [manufacturers, setManufacturers] = useState<SelectManufacturerProps[]>([])
  const [manufacturerName, setManufacturerName] = useState('')
  const [variants, setVariants] = useState<VariantsProps[]>([])
  const [combinations, setCombinations] = useState<CombinationsProps[]>([])
  const [form, setForm] = useState<ProductFormProps>({
    name: '',
    short_desc: '',
    sku: '',
    barcode: '',
    mpn: '',
    stock: '',
    weight: '',
    category: '',
    manufacturer: '',
  })

  const [desc, setDesc] = useState('')

  const [price, setPrice] = useState<PriceType>({
    float: null,
    formatted: '',
    value: ''
  })
  const [discountPrice, setDiscountPrice] = useState<PriceType>({
    float: null,
    formatted: '',
    value: ''
  })

  const handleCategories = useCallback(async () => {
    try {
      const res = await request({url: `category/select-all?name=${categoryName}`, method: 'get'})
      setCategories(res.data)
    } catch (err: any) {
      throw new Error(err)
    }
  }, [categoryName])

  const handleManufacturers = useCallback(async () => {
    try {
      const res = await request({url: `manufacturer/select-all?name=${manufacturerName}`, method: 'get'})
      setManufacturers(res.data)
    } catch (err: any) {
      throw new Error(err)
    }
  }, [manufacturerName])

  useEffect(() => {
    handleManufacturers()
  }, [handleManufacturers])

  useEffect(() => {
    handleCategories()
  }, [handleCategories])
 
  const [isDisabled, setIsDisabled] = useState(true)

  const checkFieldsAndSetDisabled = useCallback(() => {
    if(stage === 1) {
      if(!form.name || !form.category || !image.data || !form.sku || !form.barcode || !form.mpn || !form.stock || !price.float) {
        setIsDisabled(true)
      } else {
        setIsDisabled(false)
      }
    } else if (stage === 2) {
      if(!form.short_desc || !desc) return setIsDisabled(true)
        else return setIsDisabled(false)
    } else if (stage === 3) {
      if (combinations.length === 0) {
        setIsDisabled(false);
        return;
      }
      const requiredFields = ['price', 'stock', 'barcode', 'sku'] as (keyof CombinationsProps)[];

      const hasEmptyFields = combinations.some((variant) =>
        requiredFields.some((field) => !variant[field])
      );

    setIsDisabled(hasEmptyFields);
    }
  }, [desc, 
    form.barcode, 
    form.category, 
    form.mpn, 
    form.name, 
    form.short_desc, 
    form.sku, 
    form.stock, 
    image.data, 
    price.float, 
    stage,
    combinations])

  useEffect(() => {
    checkFieldsAndSetDisabled()
  }, [checkFieldsAndSetDisabled])
  
  const [loading, setLoading] = useState(false)

  const handleProgress = async() => {
    if(stage < 4) {
      if(stage === 1) {
        if(price.float && discountPrice.float) {
          if(price.float < discountPrice.float) {
            return toast({title: 'Geçersiz Fiyat Bilgisi', description: 'İndirimli fiyat, normal fiyattan yüksek olamaz!'})
          } else if (price.float === discountPrice.float) {
            return toast({title: 'Geçersiz Fiyat Bilgisi', description: 'İndirimli fiyat, normal fiyat ile aynı olamaz!'})
          }
        }
      } else if(stage === 3) {
        const isValid = validateCombinations(combinations)
        if(!isValid) {
          return toast({title: 'Kombinasyon Hatası', description: 'Seçenek indirimli fiyatı, normal fiyat ile aynı veya yüksek olamaz!'})
        }
      }
      setStage(stage+1)
    } else if (stage === 4) {
      if(price.float) {
        setLoading(true)
        const res = await createProduct({
          form, 
          desc, 
          image, 
          images, 
          discount_price:discountPrice.float, 
          price: price.float,
          combinations
        })
        toast({title: res.message})
        setLoading(false)
      }
    }
  }


  const getCombinations = async() => {
    if(variants.length > 0) {
      const res = await handleCombinations(variants)
      setCombinations(res)
      toast({title: 'İşlem başarılı', description: 'Kombinasyon başarıyla hesaplandı.'})
    } else {
      toast({title: 'İşlem başarısız.', description: 'En az bir tane seçenek eklemelisiniz!'})
    }
  }

  return (
    <MainWrapper>
      <Stage stage={stage}/>

      <div className="overflow-y-auto">
        {stage === 1 && (
          <ProductInfo
          image={image}
          images={images}
          setImage={setImage}
          setImages={setImages}
          categories={categories}
          setCategoryName={setCategoryName}
          categoryName={categoryName}
          manufacturerName={manufacturerName}
          manufacturers={manufacturers}
          setManufacturerName={setManufacturerName}
          setForm={setForm}
          form={form}
          setPrice={setPrice}
          price={price}
          setDiscountPrice={setDiscountPrice}
          discountPrice={discountPrice}
          handleSelectFile={handleSelectFile}
          handleSelectFiles={handleSelectFiles}
          />
        )}
        {stage === 2 && (
          <DescSeo
          setDesc={setDesc}
          desc={desc}
          setForm={setForm}
          form={form}
          />
        )}
        {stage === 3 && (
          <Combinations
          setVariants={setVariants}
          variants={variants}
          getCombinations={getCombinations}
          combinations={combinations}
          setCombinations={setCombinations}
          />
        )}
        {stage === 4 && (
          <Preview
            form={form}
            combinations={combinations}
            desc={desc}
            image={image}
            images={images}
            price={price.float}
            special={discountPrice.float}
            manufacurers={manufacturers}
          />
        )}
      </div>

      <div className="flex items-center justify-end shrink-0 px-10 gap-3">
        {stage > 1 && (
          <Button 
          variant={'reversedDark'}
          onClick={() => setStage(stage-1)}
          >
            Geri
          </Button>
        )}
        <Button 
        variant={'primary'}
        onClick={handleProgress}
        disabled={isDisabled || loading}
        >
          {stage === 4  ? 'Oluştur' : 'Devam Et'}
        </Button>
      </div>

      {
        loading && (
          <ProductLoading/>
        )
      }
    </MainWrapper>
  )
}

export default AddProduct