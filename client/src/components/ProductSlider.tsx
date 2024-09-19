import Slider from 'react-slick';
import Product from './Product';
import { IProduct } from '@/types';

const ProductSlider = ({
    products
}: {
    products: IProduct[]
}) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        className: 'slider-size animate-fade',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 360,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };

  return (
        <div className="w-full pb-8">
        <Slider {...settings}>
          {
            products?.map((v, i) => (
              <div key={i} className="px-2 w-full">
                <Product
                key={i}
                data={v}
                />
              </div>
            ))
          }
        </Slider>
      </div>
  )
}

export default ProductSlider