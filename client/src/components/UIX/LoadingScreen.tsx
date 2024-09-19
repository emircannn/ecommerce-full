import { cn } from '@/lib/utils'
import { Hourglass } from 'lucide-react'
const LoadingScreen = ({
  className
}: {
  className?: string
}) => {
  return (
    <div className={cn('bg-secondary inset-0 fixed z-50 flex items-center justify-center', className)}>
      <Hourglass size={50} className='animate-spin !opacity-100'/>
    </div>
  )
}

export default LoadingScreen