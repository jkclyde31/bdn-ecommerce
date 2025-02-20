"use client";

import Image from "next/image";
import Link from "next/link";
import { useKeenSlider, KeenSliderInstance } from 'keen-slider/react'
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

interface Slide {
  id: number;
  title: string;
  description: string;
  img: string;
  url: string;
  bg: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Designed with Faith",
    description: "Delivered with Purpose",
    img: "/banner/banner1.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-green-50 to-pink-50",
  },
  {
    id: 2,
    title: "Inspired Designs",
    description: "Impactful Mission",
    img: "/banner/banner2.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-pink-50 to-blue-50",
  },
  {
    id: 3,
    title: "Crafted in Grace",
    description: "Serving with Vision",
    img: "/banner/banner3.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
  },
];

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabled = props.disabled ? "opacity-30 cursor-not-allowed" : "";
  return (
    <button
      onClick={props.onClick}
      className={`hidden md:block absolute top-1/2 ${
        props.left ? "left-2" : "right-2"
      } -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all ${disabled}`}
    >
      {props.left ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      )}
    </button>
  );
}

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(slider: KeenSliderInstance) {
        setCurrentSlide(slider.track.details.rel);
      },
      created(slider: KeenSliderInstance) {
        setLoaded(true);
      },
      loop: true,
      drag: true,
      slides: {
        spacing: 0,
        perView: 1,
      },
    },
    [
      (slider: KeenSliderInstance) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 6000);
        }
        
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  return (
    <div className="h-[calc(100vh-80px)] relative">
      <div ref={sliderRef} className={`keen-slider h-full ${!loaded ? 'opacity-0' : 'opacity-100'}`}>
        {slides.map((slide) => (
          <div
            className={`keen-slider__slide ${slide.bg} h-full flex flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-6 text-center">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                {slide.description}
              </h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-7xl font-semibold">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-3 px-4">
                  SHOP NOW
                </button>
              </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {loaded && instanceRef.current && (
        <>
          <Arrow 
            left 
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            disabled={currentSlide === 0 && !instanceRef.current.options.loop}
          />

          <Arrow
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            disabled={currentSlide === slides.length - 1 && !instanceRef.current.options.loop}
          />

          <div className="absolute m-auto left-[39%] sm:left-1/2 bottom-8 flex gap-4">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`w-3 h-3 rounded-full ring-1 ring-white sm:ring-gray-600 cursor-pointer flex items-center justify-center ${
                  currentSlide === idx ? "scale-150" : ""
                }`}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
              >
                {currentSlide === idx && (
                  <div className="w-[6px] h-[6px] bg-white sm:bg-gray-600 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;