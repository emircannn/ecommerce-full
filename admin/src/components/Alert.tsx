import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FC } from "react"
  
  interface AlertDialogProps {
    buttonVariant?: "link" | "accept" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "primary" | "reversed" | "reversedDark" | "gradient" | "reject" | null | undefined
    buttonName?: string,
    title?: string
    handleAccept: () => void
    desc?: string
    buttonClass?: string
    disabled?: boolean,
    customButton?: React.ReactNode
}

export const AlertDialogComp: FC<AlertDialogProps> = ({
    buttonVariant = "default",
    buttonName = "Sil",
    title='Bu işlemi gerçekleştirmek istediğinize emin misiniz?',
    handleAccept,
    desc='Bu işlem onaylandıktan sonra geri alınamaz.',
    buttonClass,
    disabled=false,
    customButton
  }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {customButton ? customButton :  <Button disabled={disabled} className={cn(buttonClass)} variant={buttonVariant}>{buttonName}</Button>}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {desc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>Onayla</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  