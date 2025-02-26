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
      <div className="mt-[100px] md:mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">



      <div className='flex flex-col justify-start gap-5'>
        {/* Description Part */}
        <h2 className='text-4xl  font-bold'>
          Our <span className='text-primary'> Popular </span> Products
        </h2>
        <p className='lg:max-w-lg mt-2 font-montserrat text-slate-gray'>
          Experience top-notch quality and style with our sought-after
          selections. Discover a world of comfort, design, and value
        </p>
      </div>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_FEATURED_CATEGORY_ID!}
            limit={8}
          />
        </Suspense>
      </div>


    {/* <div className="bg-primary mt-[50px] md:mt-24">
    <SuperQuality/>
    </div> */}

      <div className="mt-[50px] md:mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64  mb-[15px] md:mb-12">
          Categories
        </h1>
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>

      <div className="max-w-[1440px] mx-auto">
        <Services/>
      </div>

      
      <div className="mt-[50px] md:mt-24c px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className='flex flex-col justify-start gap-5'>
        {/* Description Part */}
        <h2 className='text-4xl  font-bold'>
          Our <span className='text-primary'> Popular </span> Products
        </h2>
        <p className='lg:max-w-lg mt-2 font-montserrat text-slate-gray'>
          Experience top-notch quality and style with our sought-after
          selections. Discover a world of comfort, design, and value
        </p>
      </div>


        {/* <h1 className="text-2xl">New Products</h1> */}
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.NEXT_PUBLIC_SHIRT_CATEGORY_ID!}
            limit={4}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;