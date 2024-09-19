import Modal from "@/components/modals/Modal"
import { Button } from "@/components/ui/button"
import { CodeOTP } from "@/components/UIX/CodeOTP"
import { useUser } from "@/contexts/UserContext"
import { useToast } from "@/hooks/use-toast"
import request from "@/utils/request"
import { Hourglass } from "lucide-react"
import { useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"

const VerifyUser = () => {

    const [open, setOpen] = useState(false)
    const {toast} = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [expiryDate, setExpiryDate] = useState(0);
    const [timerKey, setTimerKey] = useState(0);
    const [loading, setLoading] = useState(true)
    const {handleGetUser} = useUser()

    const handleVerification = async() => {
        setOpen(true);
        try {
            setLoading(true);
            const res = await request({url: '/auth/send-verification'})
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
        } finally {
            setLoading(false);
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

    const handleVerifyUser = async() => {
        try {
            setIsLoading(true);
            const res = await request({url: '/auth/verify-user', data: {code}})
            toast({
                title: "Doğrulama İşlemi Başarılı!",
                description: res.data.message
            })
            setOpen(false);
            handleGetUser();
        } catch (error) {
            const err = error as { status: number, response: { data: { message: string } } };
            toast({
                title: "Doğrulama İşlemi Başarısız!",
                description: err.response.data.message
            })
        } finally {
            setIsLoading(false);
         }
    }

    const loadingComp = (
        <div className="w-full h-[392px] flex items-center justify-center">
            <Hourglass className='animate-spin'/>
        </div>
    )

  return (
    <>
    <div className="w-full text-sm text-center py-2 bg-red-300 text-red-900 px-3">
        Email adresiniz doğrulanmamış, lütfen email adresinizi <b onClick={handleVerification} className="underline cursor-pointer">doğrulayın.</b>
    </div>
    <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Email Doğrulama"
        actionLabel="Doğrula"
        body={loading ? loadingComp : verification}
        onSubmit={handleVerifyUser}
        disabled={isLoading}
    />
    </>
  )
}

export default VerifyUser