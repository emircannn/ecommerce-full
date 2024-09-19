/* eslint-disable @typescript-eslint/no-explicit-any */
import MainWrapper from "@/components/MainWrapper"
import { PaginationComp } from "@/components/PaginationComp"
import Menu from "./components/Menu"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { ManufacturerListResponse } from "@/types"
import request from "@/utils/request"
import { Star } from "lucide-react"
import Manufacturer from "./components/Manufacturer"
import ManufacturerLoading from "./components/ManufacturerLoading"

const Manufacturers = () => {

  const [searchParams, setSearchParams] = useSearchParams({limit: '12', page: '1'});
  const {toast} = useToast()
  const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page') || '1') : 1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    params.page = page.toString();

    setSearchParams(params);
  }, [page, searchParams, setSearchParams]);

  const [manufacturers, setManufacturers] = useState<ManufacturerListResponse>();
  const [selectedManufacturers, setSelectedManufactueres] = useState<number[]>([]);

  const handleGetManufacturers = useCallback(async () => {
    setLoading(true);
    const name = searchParams.get('name') || '';
    const page = searchParams.get('page') || '';
    const limit = searchParams.get('limit') || '12';
    const hasImage = searchParams.get('hasImage');

    const params: {
      name?: string;
      page?: string;
      limit?: string;
      hasImage?: string;
    } = {};
    if (name) params.name = name;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (hasImage) params.hasImage = hasImage;

    try {
      const response = await  request({url: '/manufacturer/admin/manufacturers', params, method: 'get'})
      setManufacturers(response.data);
      setLoading(false)
    } catch (error) {
      console.error('There was an error fetching the manufacturers!', error);
    }
  }, [searchParams])

  useEffect(() => {
    handleGetManufacturers()
  }, [handleGetManufacturers])

  const handleSelectAllManufacturers = () => {
    if(manufacturers?.data.length === selectedManufacturers.length) {
      setSelectedManufactueres([])
    } else {
      setSelectedManufactueres(manufacturers?.data?.map((c) => parseInt(c.id)) || []);
    }
  }

  const handleSelectCategory = (id: number) => {
    if(!selectedManufacturers.includes(id)) {
      setSelectedManufactueres([...selectedManufacturers, id]);
    } else {
        setSelectedManufactueres(selectedManufacturers.filter((c) => c !== id));
    }
  }

  const handleDelete = async() => {
    try {
      const res = await request({url: '/manufacturer/delete', data: {ids: selectedManufacturers}})
      if(res?.data.error) {
        toast({title: 'İşlem Başarısız', description: res?.data.message})
      } else {
        toast({title: 'İşlem Başarılı', description: res?.data.message})
        handleGetManufacturers();
        setSelectedManufactueres([])
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <MainWrapper>
      <Menu
        handleSelectAllManufacturers={handleSelectAllManufacturers}
        total={manufacturers?.total || 0}
        handleDelete={handleDelete}
        getData={handleGetManufacturers}
        disabled={selectedManufacturers.length === 0}
        setPage={setPage}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <MainWrapper className="px-10 overflow-y-auto">
        
        <div className="overflow-y-auto grid grid-cols-3 place-content-start gap-3 pr-2">
        {
                !loading ? 
                manufacturers && manufacturers?.data.length > 0  ?
                manufacturers?.data?.map((v) => (
                    <Manufacturer
                        key={v.id}
                        data={v}
                        handleSelect={() => handleSelectCategory(parseInt(v.id))}
                        checked={selectedManufacturers.includes(parseInt(v.id))}
                        getData={handleGetManufacturers}
                    />
                    ))
                    :
                    (<div className="flex flex-col items-center justify-center gap-3 h-full">
                    <Star size={40}/>
                    <p className="text-xl font-semibold">Marka Bulunamadı!</p>
                    </div>)
                :
                [...Array(9)].map((_, i) => (
                <ManufacturerLoading key={i}/>
                ))
            }
        </div>
      </MainWrapper>
      <PaginationComp
        currentPage={page}
        setPage={setPage}
        totalPages={manufacturers?.totalPages || 1}
        />
    </MainWrapper>
  )
}

export default Manufacturers