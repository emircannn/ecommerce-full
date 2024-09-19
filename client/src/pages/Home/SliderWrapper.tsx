import Image from "@/components/Image";
import { API_URL } from "@/config";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Slider from "react-slick";

const SliderWrapper = () => {

    interface ArrowButtonProps {
        onClick: () => void;
      }
      
      const PrevBtn : React.FC<ArrowButtonProps> = ({onClick}) => {
        return (
          <div className="absolute top-0 left-3 h-full w-fit flex items-center 876:left-6 z-30">
            <button 
          onClick={onClick} 
          className=" w-8 876:w-14 aspect-square shrink-0 bg-primary/50 hover:bg-secondary duration-300 hover:text-primary text-white rounded-full flex items-center justify-center">
            <BiChevronLeft size={28}/>
          </button>
          </div>
        );
      };
      const NextBtn: React.FC<ArrowButtonProps> = ({onClick}) => {
        return (
          <div className="absolute top-0 right-3 h-full w-fit flex items-center 876:right-6 z-30">
          <button 
          onClick={onClick} 
          className=" w-8 876:w-14 aspect-square shrink-0 bg-primary/50 hover:bg-secondary duration-300 hover:text-primary text-white rounded-full flex items-center justify-center">
            <BiChevronRight size={28}/>
          </button>
          </div>
        );
      };
    

      const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 4000,
        fade: true,
        className: 'slider-size animate-fade',
        pauseOnHover: false,
        nextArrow: <NextBtn onClick={() => {}}/>,
        prevArrow: <PrevBtn onClick={() => {}}/>,
      };

  return (
    <section
        className="w-full shrink-0 aspect-[1920/725] bg-secondary relative"
    >
         <Slider {...settings}>
            <Image
                src={`${API_URL}/uploads/slider/slider3.png`}
            />
            <Image
                src={`${API_URL}/uploads/slider/slider1.png`}
            />
            <Image
                src={`${API_URL}/uploads/slider/slider2.png`}
            />
         </Slider>
    </section>
  )
}

export default SliderWrapper