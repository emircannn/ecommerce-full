import Image from "@/components/Image";
import { API_URL } from "@/config";
import { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Slider from "react-slick";

const ImagesWrapper = ({
    image,
    images
}: {
    image: string | undefined,
    images: string[] | undefined;
}) => {

    const [selectedImage, setSelectedImage] = useState(0)

    const mergeImageArrays = (image: string | undefined, images: string[] | undefined): string[] => {
    
      if (!image && !images) return [];
  
      if (!images) return image ? [image] : [];
  
      if (!image) return images;
  
      return [image, ...images];
  };

  const imagesArr = mergeImageArrays(image, images);

      interface ArrowButtonProps {
        onClick: () => void;
      }
      
      const PrevBtn : React.FC<ArrowButtonProps> = ({onClick}) => {
        return (
            <button 
              onClick={onClick} 
              className="absolute top-0 !left-0 h-full w-[35px] shrink-0 bg-third-dark hover:bg-primary duration-300 text-white flex items-center justify-center">
                <BiChevronLeft size={28}/>
              </button>
        );
      };
      const NextBtn: React.FC<ArrowButtonProps> = ({onClick}) => {
        return (
            <button 
            onClick={onClick} 
            className="absolute top-0 !right-0 h-full w-[35px] shrink-0 bg-third-dark hover:bg-primary duration-300 text-white flex items-center justify-center">
              <BiChevronRight size={28}/>
            </button>
        );
      };
    
      const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        className: 'slider-size animate-fade slider-padding',
        nextArrow: <NextBtn onClick={() => {}}/>,
        prevArrow: <PrevBtn onClick={() =>  {}}/>,
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
          }
        ]
      };

  return (
    <div className="space-y-5">
        <div className="relative w-full aspect-square rounded-md overflow-hidden">
            <Image
                src={`${API_URL}/${imagesArr[selectedImage]}`}
                className="object-contain w-full h-full object-center"
            />
        </div>

        {images && images?.length > 2 ? 
        <div className="w-full aspect-[5/1] 876:aspect-[7/1] overflow-hidden">
          <Slider {...settings}>
              {
                imagesArr?.map((v, i) => (
                  <div key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`px-2 flex h-full duration-300 cursor-pointer ${i !== selectedImage ? 'opacity-70' : 'opacity-100'}`}>
                    <Image
                        src={`${API_URL}/${v}`}
                    />
                  </div>
                ))
              }
          </Slider>
        </div> : null}
    </div>
  )
}

export default ImagesWrapper