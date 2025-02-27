// ServiceCard.tsx
import React from 'react';
import { StaticImageData } from 'next/image';

type ServiceCardProps = {
  imgURL: StaticImageData;
  label: string;
  subtext: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imgURL, label, subtext }) => {
  return (
    <div className='flex-shrink-0 sm:flex-1 w-[280px] sm:w-[350px] rounded-[5px] shadow-3xl px-8 sm:px-10 py-12 sm:py-16 bg-secondary backdrop-blur-sm'>
      <div className='w-11 h-11 flex justify-center items-center bg-primary rounded-full'>
        <img src={imgURL.src} alt={label} width={24} height={24} />
      </div>
      <h3 className='mt-5 font-palanquin text-2xl sm:text-3xl leading-normal font-bold'>
        {label}
      </h3>
      <p className='mt-3 break-words font-montserrat text-base sm:text-lg leading-normal text-slate-gray'>
        {subtext}
      </p>
    </div>
  );
};

export default ServiceCard;