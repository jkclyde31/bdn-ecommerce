'use client'

// Services.tsx
import { StaticImageData } from 'next/image';
import { services } from "@/constants";
import ServiceCard from "../ServiceCard";
import { useState, useRef, useEffect } from 'react';

type Service = {
  imgURL: StaticImageData;
  label: string;
  subtext: string;
}

const Services: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Show left arrow if we've scrolled right
      setShowLeftArrow(container.scrollLeft > 20);
      
      // Show right arrow if we haven't reached the end
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 20;
      setShowRightArrow(!isAtEnd);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      // Check on resize too
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className='max-container px-[15px] py-8 relative'>
      {/* Arrows only visible on mobile */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10 sm:hidden bg-white/70 rounded-full p-2 shadow-md'
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className='absolute right-4 top-1/2 transform -translate-y-1/2 z-10 sm:hidden bg-white/70 rounded-full p-2 shadow-md'
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className='flex overflow-x-auto gap-4 sm:gap-9 pb-6 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide'
      >
        {services.map((service: Service) => (
          <ServiceCard key={service.label} {...service} />
        ))}
      </div>
    </section>
  );
};

export default Services;