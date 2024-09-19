import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { AddressType, BillingType, IAddress } from "@/types"
import request from "@/utils/request"
import { PlusCircle } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import SelectCompForAdres from "./SelectCompForAdres"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type FormState = {
    title: string;
    primary: boolean;
    tax_no: string | undefined;
    city_id: string;
    city: string;
    district: string;
    district_id: string;
    neighborhoods: string;
    neighborhoods_id: string;
    address: string;
    name: string;
    lastname: string;
    phone: string;
    tck_no?: string;
    company_name?: string | undefined;
    tax_office?: string | undefined;
    address_type: AddressType;
    billing_type?: BillingType; // billing_type opsiyonel hale getirildi
  };

interface City {
    id: number;
    name: string;
  }
interface District {
    id: number;
    city_id: number;
    name: string;
  }

  interface Neighborhoods {
    id: number;
    district_id: number;
    name: string;
  }

const AddOrUpdateAddress = ({
    data,
    getData,
    isBilling=false,
    customButton
}: {
    data?: IAddress,
    getData?: () => void;
    isBilling?: boolean;
    customButton?: React.ReactNode
}) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const {toast} = useToast()

        const [form, setForm] = useState<FormState>({
            title: '',            // title alanı
            primary: true,       // primary alanı (boolean)
            tax_no: '',           // tax_no alanı (nullable olabilir)
            city_id: '',          // city_id alanı
            city: '',             // city alanı
            district: '',         // district alanı
            district_id: '',      // district_id alanı
            neighborhoods: '',    // neighborhoods alanı
            neighborhoods_id: '', // neighborhoods_id alanı
            address: '',          // address alanı
            name: '',          // address alanı
            lastname: '',          // address alanı
            phone: '',          // address alanı
            tck_no: '',          // address alanı
            company_name: '',          // address alanı
            tax_office: '', 
            address_type: isBilling ? AddressType.BILLING : AddressType.DELIVERY,
            billing_type: BillingType.INDIVIDUAL || undefined         // address alanı
          });

          useEffect(() => {
            if(data && open) {
                setForm({
                    title: data.title,
                    address: data.address,
                    address_type: data.address_type,
                    billing_type: data.billing_type,
                    city: data.city,
                    city_id: data.city_id.toString(),
                    company_name: data.company_name,
                    district: data.district,
                    district_id: data.district_id.toString(),
                    lastname: data.lastname,
                    name: data.name,
                    neighborhoods: data.neighborhoods,
                    neighborhoods_id: data.neighborhoods_id.toString(),
                    phone: data.phone,
                    primary: data.primary,
                    tax_no: data.tax_no,
                    tax_office: data.tax_office,
                    tck_no: data.tck_no,
                });
            }
          }, [data, open])

        const [cities, setCities] = useState<City[]>([])
        const [districts, setDistricts] = useState<District[]>([])
        const [neighborhoods, setNeighborhoods] = useState<Neighborhoods[]>([])

        const getCities = useCallback(async () => {
        try {
            const response = await request({url: '/address/cities', method: 'get'});
            setCities(response.data);
        } catch (err) {
            console.error(err);
        }
        }, []);

        const getDistricts = useCallback(async () => {
        if(form.city_id) {
            try {
                const response = await request({url: `/address/districts?city_id=${form.city_id}`, method: 'get'});
                setDistricts(response.data);
                } catch (err) {
                console.error(err);
                }
        }
        }, [form.city_id]);

        const getNeighborhoods = useCallback(async () => {
        if(form.district_id) {
            try {
                const response = await request({url: `/address/neighborhoods?district_id=${form.district_id}`, method: 'get'});
                setNeighborhoods(response.data);
                } catch (err) {
                console.error(err);
                }
        }
        }, [ form.district_id]);

        useEffect(() => {
        getCities()
        }, [getCities])

        useEffect(() => {
        getDistricts()
        }, [getDistricts])

        useEffect(() => {
        getNeighborhoods()
        }, [getNeighborhoods])

        const handleBillingTypeChange = (value: BillingType) => {
            setForm((prevForm) => ({
              ...prevForm,
              billing_type: value,
            }));
          };

          useEffect(() => {
            const city = cities.find(c => c.id === parseInt(form.city_id))?.name || '';
            const district = districts.find(c => c.id === parseInt(form.district_id))?.name || '';
            const neighborhood = neighborhoods.find(c => c.id === parseInt(form.neighborhoods_id))?.name || '';
        
            if (form.city !== city || form.district !== district || form.neighborhoods !== neighborhood) {
                setForm(prevForm => ({
                    ...prevForm,
                    neighborhoods: neighborhood,
                    city: city,
                    district: district
                }));
            }
        }, [cities, districts, neighborhoods, form.city_id, form.district_id, form.neighborhoods_id, form.city, form.district, form.neighborhoods]);

          const handleSubmit = async () => {
            try {
                setLoading(true);
              const updatedForm = {
                ...form,
                phone: `+90${form.phone}`
              };
              const url = data ? `/address/update?id=${data.id}` : '/address/add';
              const res = await request({url: url, data: updatedForm})
              toast({title: 'İşlem Başarılı.', description: res.data.message})
              if(getData) {
                getData()
              }
              setOpen(false)
            } catch (error) {
                const err = error as { status: number, response: { data: { message: string } } };
                toast({
                title: "İşlem Başarısız!",
                description: err.response.data.message
                })
            } finally {
                setLoading(false);
            }
          };
        

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {customButton ? customButton : (
                <Button className="flex items-center gap-3">
                    <PlusCircle/> <p>Yeni Ekle</p>
                </Button>
            )
            }
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
                <DialogTitle>{data ? 'Adres Güncelle' : 'Adres Ekle'}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[550px] overflow-y-auto p-3 lg:p-5 space-y-5">
                <div className="w-full h-[50px] rounded-xl p-1 bg-slate-200 text-sm font-medium flex items-center">
                    <div 
                    onClick={() => setForm({...form, address_type: AddressType.DELIVERY})}
                    className={cn('w-1/2 h-full duration-300 rounded-xl flex items-center justify-center select-none cursor-pointer', form.address_type === AddressType.DELIVERY ? 'bg-primary text-white' : 'text-primary')}>
                        Teslimat Adresi
                    </div>
                    <div 
                    onClick={() => setForm({...form, address_type: AddressType.BILLING})}
                    className={cn('w-1/2 h-full duration-300 rounded-xl flex items-center justify-center select-none cursor-pointer', form.address_type === AddressType.BILLING ? 'bg-primary text-white' : 'text-primary')}>
                        Fatura Adresi
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="col-span-2">
                        <Input onChange={(e) => setForm({...form, title: e.target.value})} value={form.title} placeholder='Başlık'/>
                    </div>
                    <Input onChange={(e) => setForm({...form, name: e.target.value})} value={form.name} placeholder='Ad'/>
                    <Input onChange={(e) => setForm({...form, lastname: e.target.value})} value={form.lastname} placeholder='Soyad'/>
                    <Input maxLength={10} onChange={(e) => setForm({...form, phone: e.target.value})} value={form.phone} placeholder='Telefon (Başında 0 olmadan)'/>
                    <SelectCompForAdres
                        data={cities}
                        onValueChange={(e) => setForm({...form, city_id: e})}
                        value={form.city_id}
                        label="Şehirler"
                        placeholder="Şehir Seçin"
                    />
                    <SelectCompForAdres
                        data={districts}
                        onValueChange={(e) => setForm({...form, district_id: e})}
                        value={form.district_id}
                        label="İlçeler"
                        placeholder="İlçe Seçin"
                        disabled={form.city_id === ''}
                    />
                    <SelectCompForAdres
                        data={neighborhoods}
                        onValueChange={(e) => setForm({...form, neighborhoods_id: e})}
                        value={form.neighborhoods_id}
                        label="Mahalleler/Semtler"
                        placeholder="Mahalle/Semt Seçin"
                        disabled={form.district_id === ''}
                    />

                    <div className="col-span-2">
                        <Textarea onChange={(e) => setForm({...form, address: e.target.value})} value={form.address} placeholder='Açık Adres'/>
                    </div>

                    <div className="col-span-2 flex items-center justify-center gap-3 py-2">
                        <Checkbox
                        checked={form.primary}
                        onClick={() => setForm({...form, primary: !form.primary})}
                        id="primary" />
                        <label
                        htmlFor="primary"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Varsayılan Adres
                        </label>
                    </div>

                    {
                    form.address_type === AddressType.BILLING && (
                    <div className="col-span-2 flex flex-col gap-2 px-3">
                        <span className="text-start font-semibold">Fatura Tipi</span>
                        <RadioGroup onValueChange={handleBillingTypeChange}  
                        value={form.billing_type}
                        defaultValue={BillingType.INDIVIDUAL} className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem checked={form.billing_type === BillingType.INDIVIDUAL} 
                            value={BillingType.INDIVIDUAL} id="r1" />
                            <Label htmlFor="r1">Bireysel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem checked={form.billing_type === BillingType.CORPORATE} 
                            value={BillingType.CORPORATE} id="r2" />
                            <Label htmlFor="r2">Kurumsal</Label>
                        </div>
                        </RadioGroup>

                        {
                        form.billing_type === BillingType.INDIVIDUAL ? 
                        (
                        <Input onChange={(e) => setForm({...form, tck_no: e.target.value})} value={form.tck_no} placeholder='TC Kimlik No'/>
                        )
                        :
                        (
                            <div className="flex flex-col gap-3 py-3">
                            <Input onChange={(e) => setForm({...form, company_name: e.target.value})} value={form.company_name} placeholder='Firma Adı'/>
                            <Input onChange={(e) => setForm({...form, tax_office: e.target.value})} value={form.tax_office} placeholder='Vergi Dairesi'/>
                            <Input onChange={(e) => setForm({...form, tax_no: e.target.value})} value={form.tax_no} placeholder='Vergi No'/>
                            </div>
                        )
                        }
                    </div>
                    )
                }
                </div>
            </div>
            <DialogFooter>
                <Button 
                onClick={handleSubmit}
                disabled={loading}
                type="submit">
                    {data ? 'Güncelle' : 'Ekle'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddOrUpdateAddress