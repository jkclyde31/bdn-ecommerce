// "use client";

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import { WixClientContext } from "@/context/wixContext";
import { useWixClient } from "../../hooks/useWixClient";
import { wixClientServer } from "../../lib/wixClientServer";
import { Suspense, useContext, useEffect } from "react";
import SuperQuality from "@/components/sections/InfoGraphic";
import Services from "@/components/sections/Services";

const HomePage = async () => {

  // TEST (FETCHING ON THE CLIENT COMPONENT)

  // const wixClient = useWixClient()

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const res = await wixClient.products.queryProducts().find();

  //     console.log(res)
  //   };

  //   getProducts();
  // }, [wixClient]);
  

  // TEST (FETCHING ON THE SERVER COMPONENT)

  // const wixClient = await wixClientServer();

  // const res = await wixClient.products.queryProducts().find();

  // console.log(res);

  return (
    <div className="">

  
        <Slider />
  
    
      <div className=" mt-[20px] md:mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">



      <div className='flex flex-col justify-start gap-5'>
        {/* Description Part */}
        <h2 className='text-[24px] md:text-4xl  font-bold'>
          Our <span className='text-primary'> Popular </span> Products
        </h2>
        {/* <p className='lg:max-w-lg mt-2 font-montserrat text-slate-gray'>
          Experience top-notch quality and style with our sought-after
          selections. Discover a world of comfort, design, and value
        </p> */}
      </div>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_FEATURED_CATEGORY_ID!}
            limit={8}
          />
        </Suspense>
      </div>


      {/* <div className="bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] mt-[50px] md:mt-24 py-[50px]">
        <SuperQuality />
      </div> */}

<section className="relative overflow-hidden  py-[25px] md:py-[100px] px-4 bg-shop-bg bg-cover bg-center my-[25px] md:my-[100px] max-w-[1400px] mx-auto">
  {/* Dark Overlay - Only on Mobile */}
  <div className="absolute inset-0 bg-black  bg-opacity-50 max-md:z-0 md:hidden"></div>

  <div className="container mx-auto relative z-10">
    <div className="flex flex-col md:flex-row items-center max-md:text-center">
      {/* Content Area (Left Side) */}
      <div className="md:w-1/2 z-10 p-6">
        <h3 className="text-black md:text-black max-md:text-white font-medium mb-2">SUMMER SALE OFFER</h3>
        <h2 className="text-5xl md:text-6xl font-bold text-black md:text-black max-md:text-white mb-4">
          UP TO 60% <br /> OFF
        </h2>
        <p className="text-black md:text-black max-md:text-white mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodn
        </p>
        <button className="border border-primary hover:bg-primary hover:text-white transition-colors duration-300 text-primary md:text-primary max-md:text-white py-3 px-6 inline-block">
          Grab Deal Now
        </button>
      </div>
      
      {/* Right side - empty space for background image visibility */}
      <div className="md:w-1/2 h-0 md:h-80"></div>
    </div>
  </div>
</section>
    

      {/* Categories */}

      <div className="mt-[50px] md:mt-24">
        {/* <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64  mb-[15px] md:mb-12">
          Categories
        </h1> */}
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>

      <div className="max-w-[1440px] mx-auto mt-[0px] md:mt-24 mb-[0px] md:mb-24">
        <Services/>
      </div>

      
      <div className="md:mt-[50px] md:mt-24c px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className='flex flex-col justify-start gap-5'>
        {/* Description Part */}
        <h2 className='text-[24px] md:text-4xl  font-bold'>
          Our <span className='text-primary'> Popular </span> Products
        </h2>
      </div>


        {/* <h1 className="text-2xl">New Products</h1> */}
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_SHIRT_CATEGORY_ID!}
            limit={8}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;