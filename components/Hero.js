"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const images = ["/image (1).jpeg", "/image (2).jpeg", "/image (3).jpeg"];
  const texts = ["Collections", "Accessories"];

  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      setCurrentText((prev) => (prev + 1) % 2); // Explicitly use 2 instead of texts.length
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[700px] w-full overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[2000ms] transform ${
            index === currentImage
              ? "opacity-100 scale-110"
              : "opacity-0 scale-100"
          }`}
        >
          <Image
            src={image}
            alt={`Background ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative h-full max-w-[1380px] mx-auto px-6 py-8">
        <div
          className={`flex flex-col items-center lg:items-start justify-end h-full pb-20 transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <button className="bg-white text-black px-4 py-2 rounded-md text-sm lg:text-xs font-medium mb-6">
            OFFICIAL WEBSITE
          </button>

          <h1 className="text-4xl lg:text-5xl font-extrabold font-luxury leading-tight text-gold text-center lg:text-left mb-8">
            Discover Your <br /> Favourite <br />
            <span className="relative inline-block min-h-[1.5em]">
              <span
                className={`absolute lg:left-0 -left-[85px]  transition-all duration-500 ${
                  currentText === 0
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Collections.
              </span>
              <span
                className={`absolute -left-[85px] lg:left-0 transition-all duration-500 ${
                  currentText === 1
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Accessories.
              </span>
            </span>
          </h1>

          <Link href="/categories">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md flex items-center space-x-2 text-lg lg:text-base">
              <svg
                className="w-6 h-6 lg:w-5 lg:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4L4.3 5H2m7 9v9a1 1 0 001 1h4a1 1 0 001-1v-9m-6 0h6"
                ></path>
              </svg>
              <span>Shop Now</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
