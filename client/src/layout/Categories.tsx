import Image from "@/components/Image";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/config";
import { ICategory } from "@/types";
import { Link } from "react-router-dom";


const Categories = ({
    categories,
    loading
}: {
    categories: ICategory[],
    loading: boolean
}) => {

  return (
    <nav id="navigation">
        <ul className="px-5 relative flex items- justify-center gap-5 max-lg:pt-4">
            {
                !loading ?
                    categories?.map((c, i) => (
                        <li key={i} className="group pb-4">
                            <Link to={`/kategori/${c.seo}`} className="text-sm font-semibold hover:opacity-80 duration-300">
                                {c.name}
                            </Link>

                            <div className="absolute z-50 bg-white top-[100%] border border-border h-fit w-full left-0 group-hover:translate-x-0 gap-5 grid grid-cols-12
                            duration-300 translate-x-[-1000%] rounded-b-md shadow-lg p-5">
                                <div className="col-span-9 grid grid-cols-6 gap-5 place-content-start">
                                    {c.home_sub?.map((h, i) => (
                                        <Link to={`/kategori/${h.seo}`} key={i} className="w-full flex flex-col gap-3">
                                            <Image
                                                src={`${API_URL}/${h.image}`}
                                                existSrcSet={false}
                                                wrapperClass="w-full aspect-square rounded-md overflow-hidden group"
                                                className="hover:scale-105 duration-300 w-full h-full object-cover"
                                            />
                                            <p className="text-xs font-semibold text-center">{h.name}</p>
                                        </Link>
                                    ))}
                                </div>
                                <Link to={`/kategori/${c.seo}`} className="col-span-3 aspect-square rounded-md overflow-hidden">
                                    <Image
                                        existSrcSet={false}
                                        src={`${API_URL}/${c.image}`}
                                        className="hover:scale-105 duration-300 w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                        </li>
                    ))
                :
                [...Array(8)].map((_v,i) => (
                    <div key={i} className="pb-4">
                        <Skeleton className="h-[24px] w-[100px] rounded-full"/>
                    </div>
                ))
            }
        </ul>
    </nav>
  )
}

export default Categories