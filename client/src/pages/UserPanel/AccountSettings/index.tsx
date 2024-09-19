import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Heading from "@/components/UIX/Heading"
import SelectComp from "@/components/UIX/SelectComp"
import { useUser } from "@/contexts/UserContext"
import { useToast } from "@/hooks/use-toast"
import { Gender } from "@/types"
import request from "@/utils/request"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"

const AccountSettings = () => {

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
    })

    const {toast} = useToast()
    const {user, handleGetUser} = useUser()

    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)

    const [changePassword, setChangePassword] = useState({
        newPassword: '',
        oldPassword: ''
    })

    useEffect(() => {
      if(user) {
        setForm({
            email: user.email,
            gender: user.gender || '',
            name: user.name,
            phone: user.phone?.split('+90')[1] || '',
        })
      }
    }, [user])

    const handleChangePassword = async() => {
        try {
            const res = await request({url: '/auth/change-password', data: changePassword})
            toast({
                title: "İşlem Başarılı.",
                description: res.data.message
            })
            handleGetUser()
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
                title: "İşlem Başarısız!",
                description: err.response.data.message
            })
        }
    }

    const handleUpdateUser = async() => {
        try {
            const updatedData = {
                ...form, 
                phone: `+90${form.phone}`
            }
            if (updatedData.phone === user?.phone) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                delete updatedData.phone;
            }
            const res = await request({url: '/users/update', data: updatedData})
            toast({
                title: "İşlem Başarılı",
                description: res.data.message
            })
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
                title: "İşlem Başarısız!",
                description: err.response.data.message
            })
        }
    }

  return (

        <div className="lg:w-1/2 mx-auto w-full py-5 space-y-5 lg:p-3">
            <Heading
                title="Hesap Ayarlarım"
            />
            <div className="flex gap-3">
                <div className="space-y-1 w-full">
                    <Label>İsim Soyisim</Label>
                    <Input
                    placeholder="İsim Soyisim girin.."
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                    />
                </div>
                <div className="space-y-1 w-full">
                    <Label>Cinsiyet</Label>
                    <SelectComp
                        label="Cinsiyet Seçin"
                        data={[{name: 'Erkek', value: Gender.MAN}, {name: 'Kadın', value: Gender.WOMAN}]}
                        value={form.gender}
                        onValueChange={(e) => setForm({...form, gender: e})}
                    />
                </div>
            </div>
            <div className="flex max-xl:flex-col gap-3">
                <div className="space-y-1 w-full">
                    <Label>Telefon Numarası</Label>
                    <Input
                    placeholder="Başında 0 olmadan (555 555 55 55)"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    required
                    maxLength={10}
                    minLength={10}
                    />
                </div>
                <div className="space-y-1 w-full">
                    <Label>Email</Label>
                    <Input
                    placeholder="Email"
                    value={form.email}
                    disabled
                    type="email"
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleUpdateUser}>Güncelle</Button>
            </div>
            <Heading
                title="Şifre Güncelle"
            />
            <div className="flex max-xl:flex-col gap-3">
                <div className="space-y-1 w-full xl:w-1/2">
                    <Label>Mevcut Şifre</Label>
                    <div className="w-full relative">
                        <Input
                        placeholder="Mevcut Şifre"
                        type={show ? 'text' : 'password'}
                        required
                        className="pr-[60px]"
                        value={changePassword.oldPassword}
                        onChange={(e) => setChangePassword({...changePassword, oldPassword: e.target.value})}
                        />
                        <button 
                        onClick={() => setShow(!show)}
                        className="right-0 top-0 w-10 aspect-square text-white rounded-md bg-primary absolute flex items-center justify-center">
                            {show ? <EyeOff/> : <Eye/>}
                        </button>
                    </div>
                </div>
                <div className="space-y-1 w-full xl:w-1/2">
                    <Label>Yeni Şifre</Label>
                    <div className="w-full relative">
                        <Input
                        placeholder="Yeni Şifre"
                        type={show2 ? 'text' : 'password'}
                        required
                        className="pr-[60px]"
                        value={changePassword.newPassword}
                        onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
                        />
                        <button 
                        onClick={() => setShow2(!show2)}
                        className="right-0 top-0 w-10 aspect-square text-white rounded-md bg-primary absolute flex items-center justify-center">
                            {show2 ? <EyeOff/> : <Eye/>}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleChangePassword}>Güncelle</Button>
            </div>
        </div>
  )
}

export default AccountSettings