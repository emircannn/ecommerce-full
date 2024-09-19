/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Banner from '@/assets/loginbanner.png'
import Image from "@/components/Image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Facebook, Instagram, Linkedin } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast()
    const [show, setShow] = useState(false)

    const [form, setForm] = useState({
        email: '',
        password: ''
    })
  
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        if(form.email && form.password) {
            try {
                const res = await login(form);
                toast({
                    title: res.message,
                    /* description: res.message */
                  })
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
            }
        } else {
            toast({
                title: "Zorunlu Alanlar",
                description: 'Lütfen zorunlu alanları doldurunuz'
              })
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center gap-5">
            <div className="w-[450px] aspect-[636/917] overflow-hidden rounded-xl">
                <Image
                    alt="banner"
                    src={Banner}
                    width={'100%'}
                    height={'100%'}
                />
            </div>

            <div className="w-[450px] aspect-[636/917] p-5 flex flex-col justify-center gap-5">
                <div className="flex justify-start">
                    <ModeToggle/>
                </div>
                <div className=" space-y-2">
                    <h1 className="text-2xl font-semibold">Yönetici Hesabınıza Giriş Yapın</h1>
                    <p className="opacity-75 text-sm">Devam etmek için lütfen yönetici bilgilerinizi girin.</p>
                </div>
                <form onSubmit={handleLogin} className="w-full space-y-5">
                    <div className="w-full space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        value={form.email}
                        id="email" type="email" placeholder="ornek@mail.com" />
                    </div>

                    <div className="w-full space-y-1">
                        <Label htmlFor="password">Şifre</Label>
                        <div className="flex w-full items-center">
                            <Input 
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            value={form.password}
                            id="password" type={show ? 'text' : 'password'} placeholder="*********" />
                            <div 
                            onClick={() => setShow(!show)}
                            className="h-10 aspect-square shrink-0 dark:bg-white bg-darkPrimary cursor-pointer 
                            rounded-sm flex items-center justify-center">
                                {
                                    !show ?
                                    (<Eye size={18} className="text-white dark:text-darkPrimary"/>)
                                    : 
                                    (<EyeOff size={18} className="text-white dark:text-darkPrimary"/>)
                                }
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">Giriş Yap</Button>
                </form>

                <div className="flex flex-col gap-3 items-center mt-5">
                    <p className="uppercase font-semibold text-sm">Sosyal Medya Hesaplarımız</p>

                    <div className="flex items-center justify-center gap-3">
                        <Link className="hover:text-thirth duration-300" to={'/'}>
                                <Instagram/>
                        </Link>
                        <Link className="hover:text-thirth duration-300" to={'/'}>
                                <Facebook/>
                        </Link>
                        <Link className="hover:text-thirth duration-300" to={'/'}>
                                <Linkedin/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
