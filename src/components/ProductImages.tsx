"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col space-y-4">
      {/* Main image container with aspect ratio instead of fixed height */}
      <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[16/9]">
        <Image
          src={items[index].image?.url}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain rounded-md"
          priority
        />
      </div>
      
      {/* Thumbnail images with consistent spacing */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {items.map((item: any, i: number) => (
          <div
            className={`relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${
              i === index ? "border-blue-500" : "border-gray-200"
            }`}
            key={item._id}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.image?.url}
              alt=""
              fill
              sizes="25vw"
              className="object-cover p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;