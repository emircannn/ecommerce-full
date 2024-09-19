import Card from "./Card"
import homeCardData from "./sidebar-data/home-data";
import { cn } from "@/lib/utils";
import Logout from '@/assets/icons/logout.svg';
import Icon from "@/components/icon";
import { useAuth } from "@/contexts/AuthProvider";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

export interface DataProps {
    title: string;
    href: string;
    icon: React.ReactNode;
  }

const Sidebar = () => {
    const { logout } = useAuth();
    const first = useMediaQuery({ query: '(max-width: 1024px)' });
    const _1280 = useMediaQuery({ query: '(max-width: 1280px)' });

    const [open, setOpen] = useState(false);

  return (
    <>
    <aside 
    className={cn("w-[300px] lg:w-[250px] text-xs xl:text-sm xl:w-[300px] h-full shrink-0 bg-secondary-foreground gap-2 z-50 p-4 overflow-y-auto flex flex-col justify-between",
      first ? 'fixed top-0 duration-300' : 'rounded-xl', open ? 'left-0' : '-left-[100%]'
    )}>
        <div className="h-full flex flex-col w-full gap-2">
        {
          homeCardData.map((v, i) => (
            <Card
            data={v}
            key={i}/>
          ))
        }
        <button onClick={logout} className={cn("w-full rounded-xl  p-3 flex items-center gap-5 duration-300 text-white hover:bg-third-dark")}>
            <Icon
            icon={<Logout/>}
            width={_1280 ? '20px' : '30px'}
            height={_1280 ? '20px' : '30px'}
            color={'#fff'}
            />

            <p className={cn('text-xs font-semibold truncate',
            )}>Çıkış Yap</p>
        </button>
        </div>

        <p className="text-center text-white text-sm font-semibold shrink-0 dark:text-thirth text-darkPrimary">&copy; <a target="_blank" href="https://dijitalyanki.com/">Dijital Yankı</a> <br /> E-Ticaret Sistemi v.0.1</p>
    </aside>
    {
      first && (
        <button 
        onClick={() => setOpen(!open)}
        className={cn("w-[30px] h-[40px] z-10 bg-scrx rounded-r-xl fixed bottom-0 bg-opacity-80 hover:bg-opacity-100 duration-300 flex items-center justify-center",
          open ? 'left-[300px]' : 'left-0'
        )}>
          <FaArrowAltCircleRight className={cn(open ? 'rotate-180' : '', 'duration-300')}/>
      </button>
      )
    }
    </>
  )
}

export default Sidebar