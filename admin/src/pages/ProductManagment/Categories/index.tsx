/* eslint-disable @typescript-eslint/no-explicit-any */
import MainWrapper from "@/components/MainWrapper"
import Menu from "./components/Menu"
import { PaginationComp } from "@/components/PaginationComp"
import TableHead from "./components/TableHead"
import request from "@/utils/request"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "react-router-dom"
import { CategoryListResponse } from "@/types"
import { AppWindow } from "lucide-react"
import Category from "./components/Category"
import CategoryLoading from "./components/CategoryLoading"

const Categories = () => {

  const [searchParams, setSearchParams] = useSearchParams({limit: '10', page: '1'});
  const {toast} = useToast()
  const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page') || '1') : 1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    params.page = page.toString();

    setSearchParams(params);
  }, [page, searchParams, setSearchParams]);

  const [categories, setCategories] = useState<CategoryListResponse>();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleGetCategories = useCallback(async () => {
    setLoading(true);
    const name = searchParams.get('name') || '';
    const page = searchParams.get('page') || '';
    const limit = searchParams.get('limit') || '10';
    const hasImage = searchParams.get('hasImage');
    const showHome = searchParams.get('showHome');

    const params: {
      name?: string;
      page?: string;
      limit?: string;
      hasImage?: string;
      showHome?: string;
    } = {};
    if (name) params.name = name;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (hasImage) params.hasImage = hasImage;
    if (showHome) params.showHome = showHome;

    try {
      const response = await  request({url: '/category/admin/categories', params, method: 'get'})
      setCategories(response.data);
      setLoading(false)
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  }, [searchParams])

  useEffect(() => {
    handleGetCategories()
  }, [handleGetCategories])
  
  const handleSelectAllCategories = () => {
    if(categories?.data.length === selectedCategories.length) {
      setSelectedCategories([])
    } else {
        setSelectedCategories(categories?.data?.map((c) => c.id) || []);
    }
  }

  const handleSelectCategory = (id: number) => {
    if(!selectedCategories.includes(id)) {
        setSelectedCategories([...selectedCategories, id]);
    } else {
        setSelectedCategories(selectedCategories.filter((c) => c !== id));
    }
  }

  const handleDelete = async() => {
    try {
      const res = await request({url: '/category/delete', data: {ids: selectedCategories}})
      if(res?.data.error) {
        toast({title: 'İşlem Başarısız', description: res?.data.message})
      } else {
        toast({title: 'İşlem Başarılı', description: res?.data.message})
        handleGetCategories();
        setSelectedCategories([])
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <MainWrapper>
        <Menu 
            total={categories?.total || 0}
            handleDelete={handleDelete}
            disabled={selectedCategories.length === 0}
            handleGetCategories={handleGetCategories}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            setPage={setPage}
        />
        <MainWrapper className="px-10 overflow-y-auto">
            <TableHead
                handleSelectAllProducts={handleSelectAllCategories}
                checked={categories?.data ? selectedCategories.length === categories.data.length && 
                    selectedCategories.length !== 0 ? true : false : false}
            />
            <div className="overflow-y-auto flex flex-col gap-3 pr-2">
            {
                !loading ? 
                categories && categories?.data.length > 0  ?
                    categories?.data?.map((v) => (
                    <Category
                        key={v.id}
                        data={v}
                        handleSelect={() => handleSelectCategory(v.id)}
                        checked={selectedCategories.includes(v.id)}
                        getData={handleGetCategories}
                    />
                    ))
                    :
                    (<div className="flex flex-col items-center justify-center gap-3 h-full">
                    <AppWindow size={40}/>
                    <p className="text-xl font-semibold">Kategori Bulunamadı!</p>
                    </div>)
                :
                [...Array(5)].map((_, i) => (
                <CategoryLoading key={i}/>
                ))
            }
            </div>
        </MainWrapper>
        <PaginationComp
            totalPages={categories?.totalPages || 1}
            setPage={setPage}
            currentPage={page}
        />
    </MainWrapper>
  )
}

export default Categories