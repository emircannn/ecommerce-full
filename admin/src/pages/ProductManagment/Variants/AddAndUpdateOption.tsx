/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import request from "@/utils/request"
import { useEffect, useState } from "react"

export function AddAndUpdateOption({
    data,
    getData,
    group_id,
}: {
    data?: {id: string, value:string}
    getData?: () => void
    group_id: string | number | undefined
}) {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const {toast} = useToast()

    const handleSave = async () => {
        try {
          setLoading(true);
      
          let body: any;
          const config: any = {
            url: data ? `/variations/update-option` : '/variations/create-option',
          };
      
          
            if(data) {
                body = {
                    name,
                    id: data.id,
                  };
            } else {
                body = {
                    name,
                    group_id
                };
            }
            config.headers = { 'Content-Type': 'application/json' };
      
          config.data = body;
          if(name && group_id) {
            const res = await request(config);
            if(res.data.error) {
              return toast({title: 'İşlem Başarısız!', description: res.data.message})
            }
            toast({title: 'İşlem Başarılı', description: res.data.message})
            if(getData) {
              getData()
            } 
            setOpen(false); 
            setName('')
          } else {
            toast({title: 'İşlem Başarısız!', description: "Seçenek değeri adı zorunludur."})
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
            toast({title: 'İşlem Başarısız!'})
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if(open) {
            if(data) {
                setName(data.value);
            }
        }
      }, [data, open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {data ? <Button variant={'reversedDark'}>Düzenle</Button> : <Button variant="accept">Ekle</Button>}
      </PopoverTrigger>
      <PopoverContent className="sm:w-[350px]">
        <div className="grid gap-5">
            <h4 className="font-medium leading-none">Seçenek Değeri {data ? 'Düzenle' : 'Ekle'}</h4>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Ad</Label>
              <Input
                id="name"
                className="h-10"
                placeholder="Seçenek Değeri Adı Girin"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          <Button disabled={loading} onClick={handleSave}>
            {data ? 'Güncelle' : 'Ekle'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
