/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "@/components/UIX/LoadingScreen";
import { IProduct } from "@/types";
import request from "@/utils/request";
import { useCallback, useEffect, useState } from "react";
import { BreadcrumbComponent } from "./Breadcrumb";
import ImagesWrapper from "./Images";
import RatingComp from "./RatingComp";
import { formatDateWithDayInTurkish, priceMasking } from "@/utils/helpers";
import Variants from "./Variants";
import Buttons from "./Buttons";
import CollapsibleWrapper from "./CollapsibleWrapper";

const ProductDetail = () => {
    const { seo } = useParams<{ seo: string }>();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState<IProduct>()
    const [breadcrumbs, setBreadcrumbs] = useState<{name: string, link: string}[]>([]);

    const getProductDetail = useCallback(async() => {
        try {
            setLoading(true)
            const res = await request({url: `/home/product?seo=${seo}`, method: 'get'})
            setProduct(res.data.product)
            setBreadcrumbs(res.data.breadcrumbs)
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                navigate('/404');
                } else {
                throw new Error(err);
                }
        } finally {
            setLoading(false);
        }
    }, [navigate, seo])

    useEffect(() => {
      getProductDetail()
    }, [getProductDetail])
    
    const currentDate = new Date();
    const daysToAdd = product?.mpn ? Number(product.mpn) : 0;
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    if(loading) {
        return <LoadingScreen/>
    }

    if(!loading && !product) {
        navigate('/404');
        return null;
    }

  return (
    <main className="container-wrapper space-y-5 py-5 max-xl:px-3 max-lg:pb-[50px]">
        <BreadcrumbComponent breadcrumbs={breadcrumbs} />

        <section className=" flex max-lg:flex-col gap-5">
            <div className="w-full lg:w-[50%] shrink-0">
                <ImagesWrapper
                    image={product?.image}
                    images={product?.images}
                />
            </div>

            <div className="w-full p-5 rounded-md lg:border border-border flex flex-col justify-between gap-5">
                <div className="space-y-5">
                    <h1 className="text-lg font-semibold line-clamp-2">
                        {product?.manufacturer && <Link to={`/marka/${product?.manufacturer?.seo}`} className="text-scrx">{product?.manufacturer?.name}</Link>} {product?.name}
                    </h1>
                    <p className="text-sm text-end font-semibold">
                        Stok Kodu: {product?.selectedVariant?.sku ?? product?.sku}
                    </p>
                    <div className="flex items-center gap-3">
                        <RatingComp
                            value={product?.rating ? product?.rating : 0}
                        />
                        <span className="text-sm hover:underline text-scrx cursor-pointer">{product?.rate_count} değerlendirme</span>
                    </div>

                    {/* PRICE */}
                    <div className="">
                        {product?.selectedVariant ? (
                            product.selectedVariant.special && (
                                <div className="flex items-center gap-3">
                                    <p className="line-through font-medium">{priceMasking(product.selectedVariant.price)}</p>
                                    <span className="font-semibold text-scrx">{product.selectedVariant.discount_rate}%</span>
                                </div>
                            )
                        ) : (
                            product?.special && (
                                <div className="flex items-center gap-3">
                                    <p className="line-through font-medium">{priceMasking(product.price)}</p>
                                    <span className="font-semibold text-scrx">{product.discount_rate}%</span>
                                </div>
                            )
                        )}

                        <p className="font-semibold text-2xl">
                            {priceMasking(
                                product?.selectedVariant?.special ?? product?.special ?? product?.price ?? 0
                            )}
                        </p>
                        <p className="text-sm mt-2 font-medium">
                        Tahmini Teslim Süresi: <b>{formatDateWithDayInTurkish(currentDate)}</b>
                        </p>
                    </div>

                    {product && product!.variants!.length > 0 ?
                        (<Variants
                        variants={product?.variants}
                        product={product}
                        setProduct={setProduct}
                    />)
                    :
                    <p className="text-sm opacity-80 font-medium">{product?.short_desc}</p>
                }

                </div>
                    {product && 
                        (<Buttons product={product}/>)
                    }
            </div>
        </section>

        <div className="lg:my-10">
        <CollapsibleWrapper
            product={product!}
        />
        </div>
    </main>
  )
}

export default ProductDetail