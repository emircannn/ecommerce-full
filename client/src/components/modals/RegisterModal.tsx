/* eslint-disable @typescript-eslint/no-explicit-any */


import useRegisterModal from "@/hooks/RegisterModalStore"
import { useState } from "react"
import Modal from "./Modal"
import { FcGoogle } from "react-icons/fc";
import useLoginModal from "@/hooks/LoginModalStore"
import Heading from "@/components/UIX/Heading";
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import SelectComp from "@/components/UIX/SelectComp";
import { Eye, EyeOff } from "lucide-react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { CodeOTP } from "@/components/UIX/CodeOTP";
import { Button } from "@/components/ui/button";
import { Gender } from "@/types";
import { useToast } from "@/hooks/use-toast";
import request from "@/utils/request";

const RegisterModal = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [stage, setStage] = useState(1)
    const [expiryDate, setExpiryDate] = useState(0);
    const [timerKey, setTimerKey] = useState(0);
    const {toast} = useToast()
    const handleLogin = () => {
        registerModal.onClose()
        loginModal.onOpen()
    }

    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: '',
    })

    const body = (
        <div className="flex flex-col gap-4 h-fit">
            <Heading
            title="Hoş geldiniz"
            subTitle="Hesap oluşturmak için gerekli bilgileri doldurun."
            />

            <div className="flex gap-3">
                <div className="space-y-1 w-full">
                    <Label>İsim</Label>
                    <Input
                    placeholder="İsim girin.."
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                    />
                </div>
                <div className="space-y-1 w-full">
                    <Label>Soyisim</Label>
                    <Input
                    placeholder="Soyisim girin.."
                    value={form.surname}
                    onChange={(e) => setForm({...form, surname: e.target.value})}
                    required
                    />
                </div>
            </div>
            <div className="flex max-876:flex-col gap-3">
                <div className="space-y-1 w-full">
                    <Label>Telefon Numarası</Label>
                    <Input
                    placeholder="Başında 0 olmadan (555 555 55 55)"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    required
                    maxLength={10}
                    />
                </div>
                <div className="space-y-1 w-full">
                    <Label>Email</Label>
                    <Input
                    placeholder="Email"
                    value={form.email}
                    type="email"
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                    />
                </div>
            </div>
            <div className="flex max-876:flex-col gap-3">
                <div className="space-y-1 w-full">
                    <Label>Cinsiyet</Label>
                    <SelectComp
                        label="Cinsiyet Seçin"
                        data={[{name: 'Erkek', value: Gender.MAN}, {name: 'Kadın', value: Gender.WOMAN}]}
                        value={form.gender}
                        onValueChange={(e) => setForm({...form, gender: e})}
                    />
                </div>
                <div className="space-y-1 w-full">
                    <Label>Şifre</Label>
                    <div className="w-full relative">
                        <Input
                        placeholder="Şifre"
                        type={show ? 'text' : 'password'}
                        required
                        className="pr-[60px]"
                        value={form.password}
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
            <div className="flex max-876:flex-col gap-3">
                <div className="space-y-1 w-full lg:w-1/2">
                    <Label>Şifre Tekrarı</Label>
                    <div className="w-full relative">
                        <Input
                        placeholder="Şifre"
                        type={show2 ? 'text' : 'password'}
                        required
                        className="pr-[60px]"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                        />
                        <button 
                        onClick={() => setShow2(!show2)}
                        className="right-0 top-0 w-10 aspect-square text-white rounded-md bg-primary absolute flex items-center justify-center">
                            {show2 ? <EyeOff/> : <Eye/>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    const handleRegistration = async() => {
        try {
            setIsLoading(true);
            if(form.name && form.surname && form.phone && form.email && form.confirmPassword && form.password && form.gender) {
                if(form.password !== form.confirmPassword) {
                    toast({title: 'İşlem Başarısız!', description: "Şifreniz Eşleşmiyor."})
                } else {
                    const requestData = {
                        name: `${form.name} ${form.surname}`,
                        phone: `+90${form.phone}`,
                        email: form.email,
                        password: form.password,
                        gender: form.gender
                      };
                    const res = await request({url: '/users/register', data: requestData})

                    if(res.data.error) {
                        toast({title: 'İşlem Başarısız!', description: res.data.message})
                    } else {
                        await handleVerification()
                    }
                }
            } else {
                toast({title: 'İşlem Başarısız!', description: "Tüm alanlar zorunludur."})
            }
        } catch (error: any) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerification = async() => {
        try {
            const res = await request({url: '/auth/send-verification'})
            setStage(2)
            const expiryDateFormat = new Date(res.data.data);
            setExpiryDate(Math.floor((new Date(expiryDateFormat).getTime() - Date.now()) / 1000));
            setIsComplete(false);
            setTimerKey(prevKey => prevKey + 1);
            toast({
                title: "Doğrulama Kodu",
                description: res.data.message,
                duration: 2000
            })
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
                toast({
                    title: "İşlem Başarısız",
                    description: err.response.data.message
                })
        }
    }

    const [isComplete, setIsComplete] = useState(false);
    const formatTime = (remainingTime: number) => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const [code, setCode] = useState('')

    const verification = (
        <div className="flex flex-col items-center justify-center gap-5">
            <p>Email adresinize gönderilen doğrulama kodunu giriniz.</p>
            <CountdownCircleTimer
            isPlaying
            key={timerKey}
            duration={expiryDate}
            initialRemainingTime={expiryDate}
            colors={['#171717', '#171717', '#171717', '#171717']}
            colorsTime={[expiryDate, expiryDate * 0.33, expiryDate * 0.66, 0]}
            onComplete={() => {
                setIsComplete(true);
                return { shouldRepeat: false };
              }}
            >
            {({ remainingTime }) => (
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatTime(remainingTime)}
                </div>
            )}
            </CountdownCircleTimer>

            <CodeOTP
                value={code}
                setValue={setCode}
            />

            <Button disabled={!isComplete} onClick={handleVerification}>Tekrar Gönder</Button>
        </div>
    )

    const footer = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <button className="w-full h-[40px] rounded-md border border-primary relative">
                <span className="p-1 absolute left-4 h-full top-0 flex items-center">
                <FcGoogle size={22}/>
                </span>

                <p className="text-primary font-semibold text-sm">Google ile Kayıt Ol</p>
            </button>

            <p className="text-xs 876:text-sm font-meidum text-third-dark text-center">
            Zaten hesabınız var mı? <b onClick={handleLogin} className="cursor-pointer">Giriş Yap</b>
            </p>
        </div>
    )

    const handleVerifyUser = async() => {
        try {
            const res = await request({url: '/auth/verify-user', data: {code}})
            toast({
                title: "Doğrulama İşlemi Başarılı!",
                description: res.data.message
            })
            registerModal.onClose();
            window.location.href = "/kullanicipaneli/hesap-ayarlarim";
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
                title: "Doğrulama İşlemi Başarısız!",
                description: err.response.data.message
            })
        }
    }

  return (
    <Modal
        title='Kayıt Ol'
        isOpen={registerModal.isOpen}
        onClose={registerModal.onClose}
        onSubmit={stage === 1 ? handleRegistration : handleVerifyUser}
        actionLabel={stage === 1 ? "Devam Et": 'Doğrula'}
        disabled={isLoading}
        body={stage === 1 ? body : verification}
        footer={stage === 1 ? footer : <></>}
    />
  )
}

export default RegisterModal