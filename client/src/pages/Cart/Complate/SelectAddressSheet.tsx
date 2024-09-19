import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { IAddress } from "@/types"
import { useState } from "react"
import SheetAddress from "./SheetAddress"
import AddOrUpdateAddress from "@/pages/UserPanel/Address/AddOrUpdateAddress"

const SelectAddressSheet = ({
    addresses,
    getData,
    buttonName='Ekle / Değiştir',
    setValue,
    value,
    isBilling
}: {
    addresses: IAddress[],
    getData?: () => void
    buttonName?: string
    setValue: React.Dispatch<React.SetStateAction<IAddress | undefined>>
    value: IAddress | undefined
    isBilling?: boolean
}) => {

    const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-xs font-semibold text-scrx">{buttonName}</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adreslerim</SheetTitle>
        </SheetHeader>
            <div className="space-y-3 py-5">
                {
                    addresses.map((v, i) => (
                        <SheetAddress
                            key={i}
                            data={v}
                            getData={getData}
                            value={value}
                            setValue={setValue}
                            isBilling={isBilling}
                        />
                    ))
                }

                <div className="w-full !mt-5 flex justify-end">
                    <AddOrUpdateAddress 
                        getData={getData}
                        isBilling={isBilling}
                    />
                </div>
            </div>
      </SheetContent>
    </Sheet>
  )
}

export default SelectAddressSheet