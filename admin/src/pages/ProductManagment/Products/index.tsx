/* eslint-disable @typescript-eslint/no-explicit-any */
import MainWrapper from "@/components/MainWrapper"
import Menu from "./components/Menu"
import { PaginationComp } from "@/components/PaginationComp"
import { useCallback, useEffect, useState } from "react"
import TableHead from "./components/TableHead"
import Product from "./components/Product"
import { useSearchParams } from "react-router-dom"
import { ProductListResponse } from "@/types"
import ProductLoading from "./components/ProductLoading"
import { Box } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import request from "@/utils/request"

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams({limit: '10', page: '1'});
  const {toast} = useToast()
  const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page') || '1') : 1)
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    params.page = page.toString();

    setSearchParams(params);
  }, [page, searchParams, setSearchParams]);

  const [products, setProducts] = useState<ProductListResponse>();

  const handleGetProducts = useCallback(async () => {
    setLoading(true);
    const name = searchParams.get('name') || '';
    const sku = searchParams.get('sku') || '';
    const categoryIds = searchParams.get('categoryIds')?.split(',') || [];
    const manufacturerIds = searchParams.get('manufacturerIds')?.split(',') || [];
    const sortField = searchParams.get('sortField') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const page = searchParams.get('page') || '';
    const limit = searchParams.get('limit') || '10';
    const hasImage = searchParams.get('hasImage');
    const isActive = searchParams.get('isActive');

    const params: {
      name?: string;
      sku?: string;
      categoryIds?: string[];
      manufacturerIds?: string[];
      sortField?: string;
      sortBy?: string;
      page?: string;
      limit?: string;
      hasImage?: string;
      isActive?: string;
    } = {};
    if (name) params.name = name;
    if (sku) params.sku = sku;
    if (categoryIds.length) params.categoryIds = categoryIds;
    if (manufacturerIds.length) params.manufacturerIds = manufacturerIds;
    if (sortField) params.sortField = sortField;
    if (sortBy) params.sortBy = sortBy;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (hasImage) params.hasImage = hasImage;
    if (isActive) params.isActive = isActive;

    try {
      const response = await  request({url: '/product/admin/products', params, method: 'get'})
      setProducts(response?.data);
      setLoading(false)
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  }, [searchParams])

  useEffect(() => {

    handleGetProducts();
  }, [handleGetProducts]);
  
  const handleSelectAllProducts = () => {
    if(products?.data.length === selectedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products?.data?.map((product) => product.id) || []);
    }
  }

  const handleSelectProduct = (id: number) => {
    if(!selectedProducts.includes(id)) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter((product) => product !== id));
    }
  }

  const handleUpdateStatus = async(isActive: boolean) => {
    try {
      const res = await request({url: '/product/update-status', data: {productIds: selectedProducts,isActive}})
      if(res?.data.error) {
        toast({title: 'İşlem Başarısız', description: res.data.message})
      } else {
        toast({title: 'İşlem Başarılı', description: res?.data.message})
        handleGetProducts();
        setSelectedProducts([])
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const handleDelete = async() => {
    try {
      const res = await request({url: '/product/delete', data: {ids: selectedProducts}})
      if(res?.data.error) {
        toast({title: 'İşlem Başarısız', description: res?.data.message})
      } else {
        toast({title: 'İşlem Başarılı', description: res?.data.message})
        handleGetProducts();
        setSelectedProducts([])
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <MainWrapper>
      <Menu
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        total={products?.total || 0}
        handleOpen={() => handleUpdateStatus(true)}
        handleClose={() => handleUpdateStatus(false)}
        disabled={selectedProducts.length === 0}
      />
      <MainWrapper className="px-10 overflow-y-auto">
        <TableHead
          handleSelectAllProducts={handleSelectAllProducts}
          checked={products?.data ? selectedProducts.length === products.data.length && 
            selectedProducts.length !== 0 ? true : false : false}
          handleDelete={handleDelete}
          disabled={selectedProducts.length === 0}
        />
        <div className="overflow-y-auto flex flex-col gap-3">
          {
            !loading ? 
            products && products?.data.length > 0  ?
                products?.data?.map((v) => (
                  <Product
                    key={v.id}
                    data={v}
                    handleSelect={() => handleSelectProduct(v.id)}
                    selectedProducts={selectedProducts}
                  />
                ))
                :
                (<div className="flex flex-col items-center justify-center gap-3 h-full">
                  <Box size={40}/>
                  <p className="text-xl font-semibold">Ürün Bulunamadı!</p>
                </div>)
            :
            [...Array(4)].map((_, i) => (
              <ProductLoading key={i}/>
            ))
          }
        </div>
      </MainWrapper>
        <PaginationComp
          totalPages={products?.totalPages || 1}
          currentPage={page}
          setPage={setPage}
        />
    </MainWrapper>
  )
}

export default Products