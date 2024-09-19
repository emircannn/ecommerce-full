/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FilterSide from "./FilterSide";
import request from "@/utils/request";
import { useCallback, useEffect, useState } from "react";
import { ICategory, IManufacturer, ProductResponse } from "@/types";
import { BreadcrumbComponent } from "../ProductDetail/Breadcrumb";
import SelectComp from "@/components/UIX/SelectComp";
import Product from "@/components/Product";
import ProductLoading from "@/components/ProductLoading";
import Empty from '@/assets/icons/empty-box.svg'
import { PaginationComp } from "@/components/PaginationComp";
import ResponsiveFilter from "./ResponsiveFilter";
import Icon from "@/components/icon";
import Heading from "@/components/UIX/Heading";

const Category = () => {
    const { seo } = useParams<{ seo: string }>();
    const navigate = useNavigate()
    const [filterLoading, setFilterLaoding] = useState(true)
    const [categories, setCategories] = useState<ICategory[]>([])
    const [manufacturers, setManufacturers] = useState<IManufacturer[]>([])
    const [breadcrumbs, setBreadcrumbs] = useState<{name: string, link: string}[]>([])
    const [searchParams, setSearchParams] = useSearchParams({sayfa: '1'});

    const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get('fc')?.split('%2C') || [])
    const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(searchParams.get('fm')?.split('%2C') || [])    
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
        try {
            
            setLoading(true);
            const categoryIds = searchParams.get('fc')?.split('%2C') || [];
            const manufacturerIds = searchParams.get('fm')?.split('%2C') || [];
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
                manufacturerIds?: string[];
                sortField?: string;
                sortBy?: string;
                page?: number;
                limit?: number;
                rating?: string;
                categorySeo?: string;
              } = {};
                if (categoryIds.length) params.categoryIds = categoryIds;
                if (manufacturerIds.length) params.manufacturerIds = manufacturerIds;
                if (sort) params.sortField = sortField;
                if (sort) params.sortBy = sort === 'azalanfiyat' || sort === 'enyeni' || sort === 'indirimurunler' ? 'DESC' : 'ASC';
                if (page) params.page = page;
                if (limit) params.limit = limit;
                if (rating) params.rating = rating;
                if(seo) params.categorySeo = seo;
                const res = await  request({url: '/home/categoryPage', data: params})
                setProducts(res.data);
        } catch (error: any) {
            console.log(error)
            navigate('/')
        } finally {
            setLoading(false);
        }
    }, [navigate, searchParams, seo])

    const handleGetFilters = useCallback(async() => {
        try {
            setFilterLaoding(true);
            const res = await request({url: `/filters/category?seo=${seo}`, method: 'get'});
            setCategories(res.data.subCategories)
            setBreadcrumbs(res.data.breadcrumbs)
            setManufacturers(res.data.manufacturers)
        } catch (error: any) {
            throw new Error(error);
        } finally {
            setFilterLaoding(false);
        }
    }, [seo])

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
            fm: selectedManufacturers.length > 0 ? encodeURIComponent(selectedManufacturers.join(',')) : undefined, 
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
      }, [review, searchParams, selectedCategories, selectedManufacturers, setSearchParams, sort])

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
        {/* Breadcrumb & Sort */}
        <div className="flex lg:items-center lg:justify-between max-lg:flex-col px-2 lg:px-5 gap-5">
            <BreadcrumbComponent breadcrumbs={breadcrumbs}/>

            <div className="w-full max-lg:flex max-lg:gap-5 lg:w-[200px]">
            <ResponsiveFilter
                loading={filterLoading}
                categories={categories}
                manufacturers={manufacturers}
                setSelectedCategories={setSelectedCategories}
                setSelectedManufacturers={setSelectedManufacturers}
                setReview={setReview}
                selectedCategories={selectedCategories}
                selectedManufacturers={selectedManufacturers}
                review={review}
                setPage={setPage}
            />
            <SelectComp
                placeholder="Sıralama"
                label="Sıralama Seç"
                value={sort}
                data={sortArr}
                onValueChange={setSort}
            />
            </div>
        </div>
        <div className="flex gap-5">
            {/* Filtre */}
            <aside className="w-[220px] shrink-0 text-xs max-lg:hidden">
                <FilterSide
                    loading={filterLoading}
                    categories={categories}
                    manufacturers={manufacturers}
                    setSelectedCategories={setSelectedCategories}
                    setSelectedManufacturers={setSelectedManufacturers}
                    setReview={setReview}
                    selectedCategories={selectedCategories}
                    selectedManufacturers={selectedManufacturers}
                    review={review}
                    total={products?.total}
                    setPage={setPage}
                />
            </aside>
            {/* Products Wrapper */}
            <section className="w-full max-lg:px-2">

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-5 min-h-[550px] place-content-start">
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
                        (<div className="col-span-4 h-[550px] flex items-center justify-center flex-col gap-2">
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

                {products && products?.totalPages > 1 &&
                <div className="flex justify-center">
                    <PaginationComp
                        setPage={setPage}
                        currentPage={page}
                        totalPages={products.totalPages}
                    />
                </div>
                }
            </section>
        </div>
    </main>
  )
}

export default Category