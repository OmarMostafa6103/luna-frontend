import React from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row mt-5 border border-gray-500 rounded-lg shadow-lg overflow-hidden">
      {/* النص */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-8 sm:py-10 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="w-8 md:w-10 bg-red-600 h-[3px] dark:bg-red-400"></span>
            <p className="font-semibold text-base md:text-lg uppercase tracking-wide text-gray-800 dark:text-gray-200">
              Our Bestsellers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/collection">
              <p className="border-2 py-2 px-4 md:py-3 md:px-6 rounded-md border-red-600 font-semibold text-base md:text-lg text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                Shop Now
              </p>
            </a>

            <span className="w-8 md:w-10 h-[2px] bg-red-600 dark:bg-red-400"></span>
          </div>
        </div>
      </div>

      {/* الصورة */}
      <img
        src={assets.hero_img}
        alt="Hero Image"
        className="w-full sm:w-1/2 h-[250px] sm:h-[320px] md:h-[400px] object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};

export default Hero;