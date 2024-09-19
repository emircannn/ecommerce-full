import { useAuth } from '@/contexts/AuthProvider';
import { ModeToggle } from '../mode-toggle'
import { Button } from '../ui/button'
import Logo from '../Logo';

const Header = () => {

    const { logout } = useAuth();

  return (
    <header className="mb-5 h-[70px] flex items-center justify-between bg-lightBg dark:bg-darkPrimaryLight rounded-xl px-3">
        <Logo/>

        <div className='flex items-center gap-5'>
            <ModeToggle/>

            <Button onClick={logout}>
                Çıkış Yap
            </Button>
        </div>
      </header>
  )
}

export default Header