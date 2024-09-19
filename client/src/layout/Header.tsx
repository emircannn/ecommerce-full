import Search from './Search'
import { CiUser, CiHeart  } from "react-icons/ci";
import Categories from './Categories';
import useLoginModal from '@/hooks/LoginModalStore';
import { BiCart, BiLogoWhatsapp } from 'react-icons/bi';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContex';
import { ICategory } from '@/types';
import { useUser } from '@/contexts/UserContext';

const Header = ({
    categories,
    loading
}: {
    categories: ICategory[]
    loading: boolean
}) => {

    const loginModal = useLoginModal()
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()
    const {user} = useUser()
    const first = useMediaQuery({ query: '(min-width: 1024px)' });

    const {cartCount} = useCart()

    const userButton = () => {
        if(isAuthenticated) {
            navigate('/kullanicipaneli/siparislerim')
        } else {
            loginModal.onOpen()
        }
    }

    const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(word => word[0].toUpperCase())
          .join('');
      };

  return (
    <header className="z-30 max-lg:sticky max-lg:top-0 max-lg:py-2 lg:pt-4 flex flex-col border-b border-border bg-white">
        <div className='container-wrapper'>
        <ul className='flex items-center justify-end font-medium max-md:text-xs text-sm px-5 gap-5'>
            <li className='hover:opacity-80 duration-300'>
                <a href="/">Kurumsal</a>
            </li>
            <li className='hover:opacity-80 duration-300'>
                <a href="/">Blog</a>
            </li>
            <li className='hover:opacity-80 duration-300'>
                <a href="tel:0555 555 55" className='flex items-center gap-2'>
                <BiLogoWhatsapp size={24}/>
                0555 555 55 55
                </a>
            </li>
        </ul>
        {first && ( <Separator className='my-4'/>)}
        <div className={cn("grid grid-cols-2 lg:grid-cols-3 items-center max-xl:px-3")}>
            <div className="w-full">
                <Link to={'/'} className='text-xl font-semibold'>LOGO</Link>
            </div>

            <div className='w-full'>
                <Search/>
            </div>

            <div className='flex items-center gap-3 justify-end max-lg:hidden text-xs xl:text-sm'>
                <button 
                    onClick={() => navigate('/sepet')}
                    className='flex relative items-center gap-2 font-medium px-4 py-2 hover:bg-third rounded-full duration-300'>
                    <BiCart size={22} className="text-neutral-600"/>
                    {first ? 'Sepet' : ''}

                    <span className='absolute top-0 -right-2 text-xs font-semibold bg-primary text-white w-5 flex items-center justify-center aspect-square shrink-0 rounded-full'>
                        {cartCount}
                    </span>
                </button>
                {isAuthenticated &&
                ( <button onClick={() => navigate('/kullanicipaneli/istek-listesi')} className='flex items-center gap-2 font-medium px-4 py-2 hover:bg-third rounded-full duration-300'>
                    <CiHeart size={22} className="text-neutral-600"/>
                    {first ? 'İstek Listesi' : ''}
                </button>)}
                    {
                        user && isAuthenticated ?
                        (
                            <button onClick={userButton} className='font-semibold bg-gradient-to-tr from-red-400 to-purple-900 p-2 text-white rounded-full'>
                                {getInitials(user.name)}
                            </button>
                        )
                        :
                        (
                            <button onClick={userButton} className='flex items-center gap-2  font-medium px-4 py-2 hover:bg-third rounded-full duration-300'>
                            <CiUser size={22} className="text-neutral-600"/>
                            {first ? 'Giriş': ''}
                        </button>
                        )
                    }
            </div>
        </div>
        {first && ( <Separator className='my-4'/>)}
            {
                first && ( 
                    <Categories
                    categories={categories}
                    loading={loading}
                    />
                )
            }
        </div>
    </header>
  )
}

export default Header