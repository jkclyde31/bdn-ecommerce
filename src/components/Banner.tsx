"use client"


import { useState } from "react";
import { shoes } from "../constants";
import { StaticImageData } from "next/image";
import { e1 } from "../../public/assets/images";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

// Type definitions
interface ShoeImageURL {
  thumbnail: StaticImageData;
  bigShoe: StaticImageData;
}

interface ShoeCardProps {
  index: number;
  imgURL: ShoeImageURL;
  changeBigShoeImage: (shoe: StaticImageData) => void;
  bigShoeImg: StaticImageData;
}

const Hero: React.FC = () => {
  const [bigShoeImg, setBigShoeImg] = useState<StaticImageData>(e1);

  return (
    <section
      id='home'
      className='w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-w-[1440px] mx-auto '
    >
      <div className='relative xl:w-2/5 flex flex-col justify-center items-start w-full max-xl:padding-x pt-28'>
        <h1 className='mt-10 text-green-900 text-8xl text-main-text max-sm:text-[72px] max-sm:leading-[82px] font-bold'>
          <span className='xl:text-main-text xl:whitespace-nowrap relative pr-10'>
            Gear Up for
          </span>
          <br />
          <span className='text-main-secondary inline-block mt-3'>Victory</span>
        </h1>
        <p className='font-montserrat text-black text-lg leading-8 mt-6 mb-14 sm:max-w-sm '>
          Find Everything You Need to Dominate Your Sport. Browse our Curated Collection of Sports Essentials.
        </p>
        <button className="flex justify-center items-center gap-2 px-7 py-4 border font-montserrat text-lg leading-none rounded-full text-green-700 border-green-700">
          Shop now
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      <div className='relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-main bg-hero bg-cover bg-center'>
<img
  src={bigShoeImg.src}
  alt='shoe collection'
  width={610}
  height={502}
  className='object-contain relative'
/>

<div className='flex sm:gap-6 gap-4 absolute -bottom-[5%] sm:left-[10%] max-sm:px-6 z-10'>
  {shoes.map((shoe: ShoeImageURL, index: number) => (
    <div key={index}>
      <ProductCard
        imgURL={shoe}
        changeBigShoeImage={(newShoe: StaticImageData) => setBigShoeImg(newShoe)}
        bigShoeImg={bigShoeImg}
      />
    </div>
  ))}
</div>
      </div>
    </section>
  );
};

export default Hero;



