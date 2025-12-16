import React from 'react';

const TourDetailsSkeleton = () => {
  return (
    <div className="bg-white p-3 mt-8 w-[1200px] max-w-[95vw] flex flex-col lg:flex-row gap-6 shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px] animate-pulse">
      
      {/* COLUMN 1: IMAGE PLACEHOLDER */}
      <div className="relative w-full h-[300px] lg:w-[370px] lg:h-auto shrink-0">
        <div className="h-full w-full bg-gray-200 rounded-[35px]" />
        {/* Optional: Dot indicators placeholder */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-[10px]">
          <div className="h-[8px] w-[8px] bg-gray-300 rounded-full" />
          <div className="h-[8px] w-[8px] bg-gray-300 rounded-full" />
          <div className="h-[8px] w-[8px] bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* COLUMN 2: INFO TEXT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 pt-2">
        <div>
          {/* "Tour" Label */}
          <div className="h-4 w-12 bg-gray-200 rounded mb-2" />
          {/* Title */}
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-3" />
          {/* Duration/Price Pills */}
          <div className="flex flex-wrap gap-2">
            <div className="h-7 w-24 bg-gray-200 rounded-full" />
            <div className="h-7 w-24 bg-gray-200 rounded-full" />
          </div>
          {/* Divider */}
          <div className="w-full mt-4 mb-0 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-6">
          {/* Description */}
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-4/5 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Trip Info / Timeline Stops */}
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded-full shrink-0" />
                  </div>
                  {/* Stop Text */}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="h-3 w-1/3 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
            {/* View All Button */}
            <div className="h-8 w-32 bg-gray-200 rounded-full mt-4 mx-auto" />
          </div>
        </div>
      </div>

      {/* COLUMN 3: BOOKING FORM */}
      <div className="w-full lg:w-1/3 h-full flex flex-col gap-4">
        {/* Date Picker Button */}
        <div className="h-[76px] w-full bg-gray-200 rounded-[30px]" />

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            {/* Name */}
            <div className="h-[52px] w-full bg-gray-200 rounded-[20px]" />
            {/* Guest Count Dropdown */}
            <div className="h-[52px] w-[90px] bg-gray-200 rounded-[20px] shrink-0" />
          </div>
          {/* Phone */}
          <div className="h-[52px] w-full bg-gray-200 rounded-[20px]" />
          {/* Email */}
          <div className="h-[52px] w-full bg-gray-200 rounded-[20px]" />
          {/* Text Area */}
          <div className="h-24 w-full bg-gray-200 rounded-[20px]" />
        </div>

        {/* Book Button */}
        <div className="mt-0 flex justify-center w-full">
           <div className="h-[56px] w-full bg-gray-300 rounded-full" />
        </div>
      </div>

    </div>
  );
};

export default TourDetailsSkeleton;