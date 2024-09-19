/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useFileHandler } from "@/hooks/useFileHandler";
import { ManufacturerProps } from "@/types";
import request from "@/utils/request";
import { ImageIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

const AddAndUpdateManufacturer = ({
  data,
  getData,
}: {
  data?: ManufacturerProps
  getData?: () => void
}) => {

  const { handleSelectFile, image, setImage } = useFileHandler();
  const [open, setOpen] = useState(false) // Dialog open state
  const [loading, setLoading] = useState(false) // Dialog open state
  const {toast} = useToast()
  const handleSingleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSelectFile(e, (file) => setImage({ data: file, pre: null }), (preview) => setImage((prev) => ({ ...prev, pre: preview })));
  };

  const [name, setName] = useState('')

  const handleSave = async () => {
    try {
      setLoading(true);
  
      let body: any;
      const config: any = {
        url: data ? `/manufacturer/update` : '/manufacturer/create',
      };
  
      if (image.data) {
        body = new FormData();
        body.append('name', name);
        body.append('image', image.data);
        if(data) {
            body.append('id', data.id);
        }
        config.headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        if(data) {
            body = {
                name,
                id: data.id,
              };
        } else {
            body = {
                name,
            };
        }
        config.headers = { 'Content-Type': 'application/json' };
      }
  
      config.data = body;
      if(name) {
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
        setImage({data: null, pre: null})
      } else {
        toast({title: 'İşlem Başarısız!', description: "Marka adı alanı zorunludur."})
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
            setName(data.name)
        }
    }
  }, [data, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {data ?
            <button className="text-xs font-semibold hover:underline">
              Düzenle
            </button>
            : <Button className="w-full" variant="accept">Yeni Ekle</Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Marka {data ? 'Düzenle' : 'Ekle'}</DialogTitle>
          <DialogDescription className="text-xs text-darkPrimary dark:text-white/80">

          </DialogDescription>
          <div className="flex gap-5 flex-col items-center justify-center">
            {/* Image */}
            <div className="w-[150px] bg-lightBg dark:bg-darkPrimaryLight mx-auto shrink-0 aspect-square rounded-full overflow-hidden border border-border relative flex items-center justify-center">
              {
                  image.pre ? (
                      <Image 
                      alt="image" 
                      existSrcSet={false}
                      src={image.pre as string}/>) 
                      : 
                      data?.image ? (
                          <Image 
                          alt="image" 
                          existSrcSet={false}
                          src={`http://localhost:5000/${data.image}`}/>) 
                          :
                      (<div className="flex flex-col gap-3 items-center justify-center">
                          <ImageIcon size={40}/>
                      </div>)
              }

              <input 
              accept="image/*" 
              type="file" 
              className="absolute inset-0 opacity-0" onChange={handleSingleFileChange} />
            </div>
              <div className="space-y-1 w-full">
                  <Label htmlFor="name" className="text-right">
                      Marka Adı
                  </Label>
                  <Input
                      id="name"
                      placeholder="Marka Adı Giriniz..."
                      value={name}
                      required
                      onChange={(e) => setName(e.target.value)}
                  />
              </div> 
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading} type="submit">{data ? 'Güncelle' : 'Oluştur'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAndUpdateManufacturer