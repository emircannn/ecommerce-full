import AddOrUpdateAddress from "@/pages/UserPanel/Address/AddOrUpdateAddress"
import { IAddress } from "@/types"
import SelectAddressSheet from "./SelectAddressSheet"

const Adresses = ({
    addresses,
    invoiceAddress,
    individualAddress,
    handleGetAddresses,
    setInvoiceAddress,
    setIndividualAddress
}: {
    addresses: IAddress[]
    invoiceAddress: IAddress | undefined
    individualAddress: IAddress | undefined
    handleGetAddresses: () => void;
    setInvoiceAddress: React.Dispatch<React.SetStateAction<IAddress | undefined>>
    setIndividualAddress: React.Dispatch<React.SetStateAction<IAddress | undefined>>
}) => {
  return (
    <div className="p-5 rounded-md border border-border shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
            <p className="font-semibold">Teslimat Adresim</p>
            {addresses.length > 0 ? 
            individualAddress ?
                (<div className="space-y-3 p-3 rounded-md border border-border">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{individualAddress.title} / {individualAddress.district}</p>
                        <SelectAddressSheet
                            addresses={addresses}
                            getData={handleGetAddresses}
                            value={individualAddress}
                            setValue={setIndividualAddress}
                        />
                    </div>
                    <p className="text-sm font-medium line-clamp-1 truncate">{individualAddress.address}</p>
                </div>)
            :
            (
                <div className="w-full h-[78px] flex items-center justify-center p-3 rounded-md border border-border">
                    <SelectAddressSheet
                        addresses={addresses}
                        getData={handleGetAddresses}
                        buttonName="Seç"
                        value={individualAddress}
                        setValue={setIndividualAddress}
                    />
                </div>
            )
            :
            (<div className="w-full h-[78px] flex items-center justify-center p-3 rounded-md border border-border">
                <AddOrUpdateAddress
                    getData={handleGetAddresses}
                />
            </div>
            )    
        }
        </div>
        <div className="space-y-2">
            <p className="font-semibold">Fatura Adresim</p>
            {addresses.length > 0 ? 
            invoiceAddress ?
                (<div className="space-y-3 p-3 rounded-md border border-border">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{invoiceAddress.title} / {invoiceAddress.district}</p>
                        <SelectAddressSheet
                        addresses={addresses}
                        getData={handleGetAddresses}
                        value={invoiceAddress}
                        setValue={setInvoiceAddress}
                        isBilling
                        />
                    </div>
                    <p className="text-sm font-medium line-clamp-1 truncate">{invoiceAddress.address}</p>
                </div>)
                :
                (
                    <div className="w-full h-[78px] flex items-center justify-center p-3 rounded-md border border-border">
                        <SelectAddressSheet
                        addresses={addresses}
                        getData={handleGetAddresses}
                        buttonName="Seç"
                        value={invoiceAddress}
                        setValue={setInvoiceAddress}
                        isBilling
                        />
                    </div>
                )
                :
                (<div className="w-full h-[78px] flex items-center justify-center p-3 rounded-md border border-border">
                    <AddOrUpdateAddress
                        getData={handleGetAddresses}
                        isBilling
                    />
                </div>
                )    
            }
        </div>
    </div>
  )
}

export default Adresses