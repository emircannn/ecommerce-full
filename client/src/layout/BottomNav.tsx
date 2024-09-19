import useLoginModal from "@/hooks/LoginModalStore";
import { useAuth } from "@/contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import ResponsiveCategoryPopup from "./ResponsiveCategoryPopup";
import { BiBasket, BiHeart, BiHome, BiUser } from "react-icons/bi";
import { ICategory } from "@/types";

const BottomNav = ({
    categories
}: {
    categories: ICategory[]
}) => {

    const loginModal = useLoginModal()
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()

    const userButton = () => {
        if(isAuthenticated) {
            navigate('/kullanicipaneli/siparislerim')
        } else {
            loginModal.onOpen()
        }
    }

    const wishlistButton = () => {
        if(isAuthenticated) {
            navigate('/kullanicipaneli/istek-listesi')
        } else {
            loginModal.onOpen()
        }
    }

  return (
    <div className="fixed left-0 bottom-0 flex flex-col w-full h-fit z-30">
        <span
        className="w-full h-[2px] bg-gradient-to-r from-pr-light to-scrx"
        />
        <div className="w-full h-[50px] shrink-0 grid grid-cols-5 bg-third text-neutral-600">
            <Link 
            to={'/'}
            className="flex flex-col gap-1 px-3 items-center text-xs font-medium justify-center">
                <BiHome size={22} className="text-neutral-600"/>
            </Link>
            <ResponsiveCategoryPopup
                categories={categories}
            />
            <Link 
            to={'/sepet'}
            className="flex flex-col gap-1 px-3 items-center text-xs font-medium justify-center">
                <BiBasket size={22} className="text-neutral-600"/>
            </Link>
            <button 
            onClick={wishlistButton}
            className="flex flex-col gap-1 px-3 items-center text-xs font-medium justify-center">
                <BiHeart size={22} className="text-neutral-600"/>
            </button>
            <button 
            onClick={userButton}
            className="flex flex-col gap-1 px-3 items-center text-xs font-medium justify-center">
                <BiUser size={22} className="text-neutral-600"/>
            </button>
        </div>
    </div>
  )
}

export default BottomNav