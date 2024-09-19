import { useEffect, useState } from "react"
import Card, { DataProps } from "./Card"
import homeCardData from "./sidebar-data/home-data"
import { useLocation } from "react-router-dom";
import productsCardData from "./sidebar-data/product-managment";

const Sidebar = () => {
  const {pathname} = useLocation();
  const [currentData, setCurrentData] = useState<DataProps[]>(homeCardData)
  
  useEffect(() => {
    if(pathname.includes('urun-yonetimi')) {
      setCurrentData(productsCardData)
    } else {
      setCurrentData(homeCardData)
    }
  }, [pathname])
  
  
  return (
    <aside className="w-[300px] h-full shrink-0 rounded-xl bg-lightBg dark:bg-darkPrimaryLight gap-2 p-4 overflow-y-auto flex flex-col justify-between">
        <div className="h-full flex flex-col w-full gap-2">
        {
          currentData.map((v, i) => (
            <Card 
            data={v}
            key={i}/>
          ))
        }
        </div>

        <p className="text-center text-sm font-semibold shrink-0 dark:text-thirth text-darkPrimary">&copy; <a target="_blank" href="https://dijitalyanki.com/">Dijital Yankı</a> <br /> E-Ticaret Sistemi v.0.1</p>
    </aside>
  )
}

export default Sidebar