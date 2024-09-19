import FailIcon from '@/assets/icons/payment_fail.svg'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
const Fail = () => {

    const navigate = useNavigate()

  return (
    <div className="container-wrapper flex flex-col items-center justify-center gap-5 h-[calc(100vh_-_189px)]">
            <Icon
                icon={<FailIcon/>}
                height='150px'
                width='150px'
            /> 

            <p className='text-2xl font-semibold'>Ödeme İşlemi Başarısız!</p>

            <div className='flex gap-5'>
                <Button onClick={() => navigate('/')} variant={'outline'}>
                    Anasayfaya Git
                </Button>
                <Button onClick={() => navigate('/sepet/tamamla')}>
                    Tekrar Dene
                </Button>
            </div>
    </div>
  )
}

export default Fail