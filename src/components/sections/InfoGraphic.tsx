import React from 'react';
import { shoe8 } from '../../../public/assets/images';

import { everlast_bg, specail_product } from '../../../public/assets/images';

// Define types for image imports if they don't have type definitions
// declare module "../assets/images" {
//   const shoe8: string;
//   const everlast_bg: string;
//   const specail_product: string;
//   export { shoe8, everlast_bg, specail_product };
// }

// Define type for Button component props if not already defined
interface ButtonProps {
  label: string;
}

const SuperQuality: React.FC = () => {
  return (
    <section
      id='about-us'
      className='flex justify-between items-center max-lg:flex-col gap-10 w-full max-w-[1400px] mx-auto'
    >
      {/* LEFT SIDE */}
      <div className='flex flex-1 flex-col'>
        <h2 className='font-palanquin capitalize text-4xl lg:max-w-lg font-bold text-primary'>
          We Provide You
          <span className='text-main-secondary'> Super </span>
          <span className='text-main-secondary'>Quality </span> Products
        </h2>

        <p className='lg:max-w-lg info-text2'>
          Ensuring premium comfort and style, our meticulously crafted gears
          is designed to elevate your experience, providing you with unmatched
          quality, innovation, and a touch of elegance.
        </p>
        <p className='mt-6 lg:max-w-lg info-text2'>
          Our dedication to detail and excellence ensures your satisfaction
        </p>
        {/* <div className='mt-11'>
          <Button label='View details' />
        </div> */}
      </div>

      {/* RIGHT SIDE */}
      <div className='flex-1 flex justify-center items-center'>
        <img
          src={specail_product.src }
          alt='product detail'
          width={570}
          height={522}
          className='object-contain'
        />
      </div>
    </section>
  );
};

export default SuperQuality;