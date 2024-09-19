import { cn } from '@/lib/utils'
import LogoSrc from '@/assets/logo.png'
import LogoLightSrc from '@/assets/logo-light.png'

const Logo = ({
    classProps='w-[288px] h-[60px] p-3',
    imgProps='object-contain'
}: {classProps?: string, imgProps?: string}) => {
  return (
    <div className={cn(classProps)}>
         <img src={LogoSrc} className={cn("w-full h-full object-center hidden dark:block", imgProps)}/>
         <img src={LogoLightSrc} className={cn("w-full h-full object-center dark:hidden", imgProps)}/>
    </div>
  )
}

export default Logo