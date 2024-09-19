import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContex";
import { useToast } from "@/hooks/use-toast";
import { IProduct } from "@/types";
import request from "@/utils/request";
import { Heart } from "lucide-react";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Buttons = ({
    product
}: {
    product: IProduct
}) => {

    const [quantity, setQuantity] = useState(1);
    const {toast} = useToast()
    const {cartId, handleGetCartCount} = useCart()
    const navigate = useNavigate()

    const updateQuantity = () => {
        const maxQuantity = product.selectedVariant ? product.selectedVariant.stock : product.stock;
        
        const newQuantity = Math.max(1, Math.min(quantity + 1, maxQuantity));
      
        setQuantity(newQuantity);
      };
      
      const decreaseQuantity = () => {
        const newQuantity = Math.max(1, quantity - 1);
      
        setQuantity(newQuantity);
      };

      const formatStock = (): string => {
        const stock = product.selectedVariant ? product.selectedVariant.stock : product.stock;
        if (stock > 100) {
          return '100+';
        } else if (stock > 50) {
          return '50+';
        } else if (stock > 10) {
          return '10+';
        } else {
          return stock.toString();
        }
      };

      const handleAddToCart = async(goToCart?: boolean)=> {
        try {
          const data = {
            cartId: parseInt(cartId),
            productId: Number(product.id),
            quantity,
            combinationId: Number(product.selectedVariant?.id)
          }
          const res = await request({url: '/cart/addToCart', data: data})
          toast({
            title: "İşlem Başarılı.",
            description: res.data.message
          })
          handleGetCartCount()
          if(goToCart) {
            navigate('/sepet')
          }
        } catch (error) {
          const err = error as { status: number, response: { data: { message: string } } };
          toast({
            title: "İşlem Başarısız!",
            description: err.response.data.message
          })
        }
      };

  return (
    <div className="space-y-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-[200px] rounded-md overflow-hidden h-[50px] border border-border flex items-center">
                    <button 
                    onClick={decreaseQuantity}
                    className="h-full w-[50px] flex items-center justify-center bg-third hover:bg-primary duration-300 group">
                        <FaMinus className="group-hover:text-white"/>
                    </button>
                    <div className="w-[100px] flex items-center justify-center flex-col gap-0 leading-tight text-sm">
                        <b>{quantity}</b>
                        <b>Adet</b>
                    </div>
                    <button 
                    onClick={updateQuantity}
                    className="h-full w-[50px] flex items-center justify-center bg-third hover:bg-primary duration-300 group">
                        <FaPlus className="group-hover:text-white"/>
                    </button>
                </div>

                <p>Stok: <b>{formatStock()}</b></p>
            </div>

            <button className="flex rounded-full p-3 bg-scrx text-white hover:bg-white hover:text-scrx duration-300">
                <Heart/>
            </button>
        </div>

        <div className="flex items-center gap-5">
            <Button 
            onClick={() => handleAddToCart(true)}
            variant={'outline'} className="w-full h-[50px]">
                Hemen Al
            </Button>
            <Button 
            onClick={() => handleAddToCart()}
            className="w-full h-[50px]">
                Sepete Ekle
            </Button>
        </div>
    </div>
  )
}

export default Buttons