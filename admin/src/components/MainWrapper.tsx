import { cn } from "@/lib/utils"

const MainWrapper = ({children, className='gap-5'} : {children: React.ReactNode, className?: string}) => {
  return (
    <main className={cn("w-full h-full grid grid-rows-[auto,1fr,auto]", className)}>
        {children}
    </main>
  )
}

export default MainWrapper