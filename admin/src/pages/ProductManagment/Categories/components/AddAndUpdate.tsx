/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "@/components/Image"
import SelectComp from "@/components/SelectComp"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useFileHandler } from "@/hooks/useFileHandler"
import { CategoriesProps } from "@/types"
import request from "@/utils/request"
import { Edit, ImageIcon } from "lucide-react"
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react"

interface AlertDialogProps {
    data?: CategoriesProps;
    getData?: () => void;
  }
  
  export const AddAndUpdateCategory: FC<AlertDialogProps> = ({
    data,
    getData
  }) => {
    const { handleSelectFile, image, setImage } = useFileHandler();
    const [categories, setCategories] = useState<CategoriesProps[]>([])
    const [categoryName, setCategoryName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [topCategories, setTopCategories] = useState<CategoriesProps[]>([])
    const [topCategory, setTopCategory] = useState('')
    const [topName, setTopName] = useState('')
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false) // Dialog open state
    const {toast} = useToast()
    const getCategories = useCallback(async() => {
        try {
            const res = await request({url: `/category/admin/select?name=${categoryName}`, method: 'get'})
            setCategories(res.data)
        } catch (error: any) {
            throw new Error(error)
        }
    }, [categoryName])
    
      useEffect(() => {
            if(open) {
                getCategories()
            }
      }, [getCategories, open])

      const getTopCategories = useCallback(async() => {
        try {
            const res = await request({url: `/category/admin/select?show=1&name=${topName}`, method: 'get'})
            setTopCategories(res.data)
        } catch (error: any) {
            throw new Error(error)
        }
      }, [topName])

      useEffect(() => {
        if(open) {
            getTopCategories()
        }
      }, [getTopCategories, open])

      const handleSingleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleSelectFile(e, (file) => setImage({ data: file, pre: null }), (preview) => setImage((prev) => ({ ...prev, pre: preview })));
      };

      const handleSave = async () => {
        try {
          setLoading(true);
      
          let body: any;
          const config: any = {
            url: data ? `/category/update` : '/category/create',
          };
      
          if (image.data) {
            body = new FormData();
            body.append('name', name);
            body.append('parentId', parentCategory);
            body.append('homeParent', topCategory);
            body.append('show_home', show ? 1 : 0);
            body.append('image', image.data);
            if(data) {
                body.append('id', data.id);
            }
            config.headers = { 'Content-Type': 'multipart/form-data' };
          } else {
            if(data) {
                body = {
                    name,
                    parentId: parentCategory,
                    homeParent: topCategory,
                    show_home: show ? 1 : 0,
                    id: data.id,
                  };
            } else {
                body = {
                    name,
                    parentId: parentCategory,
                    homeParent: topCategory,
                    show_home: show ? 1 : 0,
                };
            }
            config.headers = { 'Content-Type': 'application/json' };
          }
      
          if(name) {
            config.data = body;
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
          setShow(false)
          setTopCategory('')
          setParentCategory('')
          setImage({data: null, pre: null})
          } else {
            toast({title: 'İşlem Başarısız!', description: "Kategori adı alanı zorunludur."})
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
                setParentCategory(data.parent ? data.parent.id.toString() : '')
                setShow(data.show_home)
                setTopCategory(data.home_parent ? data.home_parent.id.toString() : '')
            }
        }
      }, [data, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {data ?
            <button className="w-10 aspect-square rounded-md flex items-center justify-center bg-thirth hover:bg-opacity-80 duration-300">
                <Edit className="text-darkPrimary"/>
            </button>
            : <Button className="w-full" variant="accept">Yeni Ekle</Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Kategori {data ? 'Düzenle' : 'Ekle'}</DialogTitle>
          <DialogDescription className="text-xs text-darkPrimary dark:text-white/80">
           Resim alanı zorunlu değildir. <br /> Bağlı olduğu kategori; kategorinin, kategori şemasındaki yerini belirler. <br />
           Top Menüde Göster seçeneğini seçmeniz halinde, gösterileceği kategoriyi seçmezseniz, Top Menüde ana kategori olarak gözükür!
          </DialogDescription>
        </DialogHeader>
            <div className="flex gap-5">
                <div className="w-[200px] shrink-0 h-[200px] rounded-md overflow-hidden border border-border relative flex items-center justify-center">
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

                <div className="w-full space-y-5">
                    <div className="space-y-1 w-full">
                        <Label htmlFor="name" className="text-right">
                            Kategori Adı
                        </Label>
                        <Input
                            id="name"
                            placeholder="Kategori Adı Giriniz..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div> 

                    <div className="space-y-1 w-full">
                        <Label htmlFor="parent" className="text-right">
                            Bağlı Olduğu Kategori
                        </Label>
                        <SelectComp
                            searchPlaceholder="Kategori Ara..."
                            label="Kategoriler"
                            data={categories
                                ?.filter((v) => !data || v.id !== data.id) // Eğer data varsa, ID'si eşleşen kategoriyi hariç tut
                                .map((v) => ({ value: v.id.toString(), name: v.name }))
                            }
                            setSearch={setCategoryName}
                            search={categoryName}
                            value={parentCategory}
                            onValueChange={(e) => setParentCategory(e)}
                        />
                    </div> 
                    <div className="space-y-1 w-full flex flex-col gap-1">
                        <Label htmlFor="show">Top Menüde Göster</Label>
                        <Switch checked={show} onClick={() => setShow(!show)} id="show" />
                    </div> 
                    <div className="space-y-1 w-full">
                        <Label htmlFor="top" className="text-right">
                            Gösterileceği Kategori
                        </Label>
                        <SelectComp
                            searchPlaceholder="Kategori Ara..."
                            label="Kategoriler"
                            data={topCategories
                                ?.filter((v) => !data || v.id !== data.id) // Eğer data varsa, ID'si eşleşen kategoriyi hariç tut
                                .map((v) => ({ value: v.id.toString(), name: v.name }))
                            }
                            setSearch={setTopName}
                            search={topName}
                            value={topCategory}
                            onValueChange={(e) => setTopCategory(e)}
                            disabled={!show}
                        />
                    </div> 
                </div>
            </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading} type="submit">{data ? 'Güncelle' : 'Oluştur'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
