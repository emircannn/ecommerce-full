/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomNav from '@/layout/BottomNav'
import Header from '@/layout/Header'
import { ICategory } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom'
import request from './request';

const BaseLayout = () => {

  const first = useMediaQuery({ query: '(min-width: 1024px)' });

  const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoding] = useState(true)
    const getCategories = useCallback(async() => {
            try {
                setLoding(true)
                const res = await request({url: '/home/categories', method: 'get'})
                setCategories(res.data);
            } catch (error:any) {
                setLoding(false)
                throw new Error(error)
            } finally {
                setLoding(false)
            }
        }, [])

        useEffect(() => {
            getCategories()
        }, [getCategories])

  return (
    <>  
    <Header
    categories={categories}
    loading={loading}
    />
        <main className='w-full overflow-x-hidden'>
        <Outlet/>
        </main>
        {!first && (<BottomNav categories={categories}/>)}
    </>
  )
}

export default BaseLayout