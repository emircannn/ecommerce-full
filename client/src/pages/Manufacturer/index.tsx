/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICategory, IManufacturer, ProductResponse } from "@/types";
import request from "@/utils/request";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FilterSide from "../Category/FilterSide";
import Product from "@/components/Product";
import Empty from '@/assets/icons/empty-box.svg'
import ProductLoading from "@/components/ProductLoading";
import SelectComp from "@/components/UIX/SelectComp";
import ResponsiveFilter from "../Category/ResponsiveFilter";
import Image from "@/components/Image";
import { API_URL } from "@/config";
import Heading from "@/components/UIX/Heading";
import Icon from "@/components/icon";

const Manufacturer = () => {

    const { seo } = useParams<{ seo: string }>();
    const navigate = useNavigate()
    const [filterLoading, setFilterLaoding] = useState(true)
    const [categories, setCategories] = useState<ICategory[]>([])
    const [manufacturer, setManufacturer] = useState<IManufacturer>()
    const [searchParams, setSearchParams] = useSearchParams({sayfa: '1'});
    const [totalProducts, setTotalProducts] = useState(0)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get('fc')?.split('%2C') || [])    
    const [sort, setSort] = useState('')
    const [review, setReview] = useState('')

    const [page, setPage] = useState(searchParams.get('sayfa') ? parseInt(searchParams.get('sayfa') || '1') : 1)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<ProductResponse>()

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
    
        params.sayfa = page.toString();
    
        setSearchParams(params);
      }, [page, searchParams, setSearchParams]);

    const handleGetProducts = useCallback(async() => {
        if(seo) {
            try {
                setLoading(true);
                const categoryIds = searchParams.get('fc')?.split('%2C') || [];
                const sort = searchParams.get('siralama') || '';
                const page = Number(searchParams.get('sayfa')) || 1;
                const limit = 20;
                const rating = searchParams.get('puan') || '';
                let sortField;
                if (sort === 'artanfiyat' || sort === 'azalanfiyat') {
                sortField = 'price';
                } else if (sort === 'indirimurunler') {
                sortField = 'discount_rate';
                } else {
                sortField = 'createdAt';
                }
                const params: {
                    categoryIds?: string[];
                    sortField?: string;
                    sortBy?: string;
                    page?: number;
                    limit?: number;
                    rating?: string;
                    manufacturerSeo?: string;
                  } = {};
                    if (categoryIds.length) params.categoryIds = categoryIds;
                    if (sort) params.sortField = sortField;
                    if (sort) params.sortBy = sort === 'azalanfiyat' || sort === 'enyeni' || sort === 'indirimurunler' ? 'DESC' : 'ASC';
                    if (page) params.page = page;
                    if (limit) params.limit = limit;
                    if (rating) params.rating = rating;
                    if(seo) params.manufacturerSeo = seo;
                    const res = await  request({url: '/home/manufacturerPage', data: params})
                    setProducts(res.data);
            } catch (error: any) {
                console.log(error)
                navigate('/404')
            } finally {
                setLoading(false);
            }
        }
    }, [navigate, searchParams, seo])

    const handleGetFilters = useCallback(async() => {
        try {
            setFilterLaoding(true);
            const res = await request({url: `/filters/manufacturer?seo=${seo}`, method: 'get'});
            setCategories(res.data.categories)
            setManufacturer(res.data.manufacturer)
            setTotalProducts(res.data.total_products)
        } catch (error: any) {
            console.log(error)
            navigate('/404')
        } finally {
            setFilterLaoding(false);
        }
    }, [seo, navigate])

    useEffect(() => {
        handleGetFilters();
    }, [handleGetFilters])

    useEffect(() => {
        handleGetProducts()
    }, [handleGetProducts])
    

    const addQueryParams = useCallback(() => {
        const currentParams = Object.fromEntries([...searchParams]);
        const newParams = {
            fc: selectedCategories.length > 0 ? encodeURIComponent(selectedCategories.join(',')) : undefined, 
            siralama: sort || undefined, 
            puan: review || undefined,
          };
          for (const [key, value] of Object.entries(newParams)) {
            if (value === undefined) {
                delete currentParams[key];
            } else {
                currentParams[key] = value;
            }
        }
          setSearchParams(currentParams);
      }, [review, searchParams, selectedCategories, setSearchParams, sort])

      useEffect(() => {
        addQueryParams()
      }, [addQueryParams])
      
      const sortArr = [
          {value: 'artanfiyat', name: 'En Düşük Fiyat'},
          {value: 'azalanfiyat', name: 'En Yüksek Fiyat'},
        {value: 'indirimurunler', name: 'En Yeniler'},
        {value: 'enyeni', name: 'İndirim Oranı'},
      ]

  return (
    <main className="container-wrapper py-5 space-y-5">
        <div className="w-full h-fit flex gap-5 rounded-md border border-border p-3">
            <div className="w-14 shrink-0 lg:w-20 aspect-square rounded-full border border-border overflow-hidden">
                <Image
                    src={`${API_URL}/${manufacturer?.image}`}
                    className="object-contain w-full h-full object-center"
                />
            </div>
            <div className="h-14 lg:h-20 flex flex-col gap-5 justify-between lg:py-3">
                <h1 className="text-sm lg:text-xl font-semibold">{manufacturer?.name}</h1>
                <p className="text-xs lg:text-sm font-medium">Toplam Ürün: <b>{totalProducts}</b></p>
            </div>
        </div>
        <div className="flex gap-5">
            <aside className="w-[220px] shrink-0 text-xs max-lg:hidden">
                <FilterSide
                    loading={filterLoading}
                    categories={categories}
                    setSelectedCategories={setSelectedCategories}
                    setReview={setReview}
                    selectedCategories={selectedCategories}
                    review={review}
                    total={products?.total}
                    setPage={setPage}
                />
            </aside>
            <section className="w-full max-lg:px-2 space-y-5">
                {/* SORT FILTER */}
                <div className="w-full flex max-lg:gap-5 justify-end">
                    <ResponsiveFilter
                        loading={filterLoading}
                        categories={categories}
                        setSelectedCategories={setSelectedCategories}
                        setReview={setReview}
                        selectedCategories={selectedCategories}
                        review={review}
                        setPage={setPage}
                    />
                    <div className="lg:w-[200px] w-full z-20">
                    <SelectComp
                        placeholder="Sıralama"
                        label="Sıralama Seç"
                        value={sort}
                        data={sortArr}
                        onValueChange={setSort}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 min-h-[350px] place-content-start">
                {
                        !loading ?
                        products && products?.data?.length > 0 ?
                        products?.data?.map((v, i) => (
                            <Product
                                key={i}
                                data={v}
                            />
                        ))
                        :
                        (<div className="col-span-4 h-[350px] flex items-center justify-center flex-col gap-2">
                            <Icon
                                icon={<Empty/>}
                                width="150px"
                                height="150px"
                                />
                                <Heading
                                title="Sonuç Bulunamadı"
                                subTitle='Bu filtrelemeye ait ürün bulunamadı.'
                                center
                                />
                        </div>)
                        :
                        [...Array(20)].map((_, i) => (
                            <ProductLoading key={i}/>
                        ))
                    }
                </div>
            </section>
        </div>
    </main>
  )
}

export default Manufacturer