import { useState } from "react"
import Modal from "./Modal"
import useRegisterModal from "@/hooks/RegisterModalStore"
import useLoginModal from "@/hooks/LoginModalStore"
import { FcGoogle } from "react-icons/fc"
import Heading from "@/components/UIX/Heading"
import {Input} from "@/components/ui/input"
import { API_URL } from "@/config"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthProvider"
import { Eye, EyeOff } from "lucide-react"

const LoginModal = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const {toast} = useToast()
 
    const handleRegister = () => {
        loginModal.onClose()
        registerModal.onOpen()
    }

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleGoogle = () => {
        window.location.href = `${API_URL}/api/auth/google/login`;
      };

      const handleLogin = async () => {
        if(form.email && form.password) {
            try {
                setIsLoading(true)
                const res = await login(form);
                toast({
                    title: res.message,
                  })
                  loginModal.onClose();
                  window.location.href = "/kullanicipaneli/hesap-ayarlarim";
            } catch (error) {
                const err = error as { status: number, response: { data: { message: string } } };
                if(err.status === 401) {
                    toast({
                        title: "Giriş İşlemi Başarısız",
                        description: err.response.data.message
                      })
                } else if(err.status === 403) {
                    toast({
                        title: "Yetkisiz Giriş",
                        description: err.response.data.message
                      })
                }
            } finally {
                setIsLoading(false)
            }
        } else {
            toast({
                title: "Zorunlu Alanlar",
                description: 'Lütfen zorunlu alanları doldurunuz'
              })
        }
    }

    const body = (
        <div className="flex flex-col gap-4 h-fit">
            <Heading
            title="Hoş geldiniz"
            subTitle="Giriş yapmak için gerekli bilgileri doldurun."
            />

            <div className="flex flex-col gap-3">
                <Input
                placeholder="Email"
                value={form.email}
                type="email"
                required
                onChange={(e) => setForm({...form, email: e.target.value})}
                />
                <div className="w-full relative">
                <Input
                placeholder="Şifre"
                value={form.password}
                type={show ? 'text' : 'password'}
                required
                className="pr-[60px]"
                onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <button 
                onClick={() => setShow(!show)}
                className="right-0 top-0 w-10 aspect-square text-white rounded-md bg-primary absolute flex items-center justify-center">
                    {show ? <EyeOff/> : <Eye/>}
                </button>
                </div>
            </div>
            
        </div>
    )

    const footer = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <button onClick={handleGoogle} className="w-full h-[40px] rounded-md border border-pr relative">
                <span className="p-1 absolute left-4 h-full top-0 flex items-center">
                <FcGoogle size={22}/>
                </span>

                <p className="text-pr font-semibold text-sm">Google ile Giriş Yap</p>
            </button>

            <p className="text-xs 876:text-sm font-meidum text-third-dark text-center">
            Henüz hesabınız yok mu? <b onClick={handleRegister} className="cursor-pointer">Kayıt Ol</b>
            </p>
        </div>
    )

  return (
    <Modal
        title="Giriş Yap"
        actionLabel="Devam Et"
        isOpen={loginModal.isOpen}
        onClose={loginModal.onClose}
        onSubmit={handleLogin}
        disabled={isLoading}
        body={body}
        footer={footer}
    />
  )
}

export default LoginModal