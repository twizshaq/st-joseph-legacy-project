import React from 'react';

const ParrisMural = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-[100dvh] text-black'>
      <p className='font-bold text-[1.5rem]'>Parris Hill Mural Page</p>
      <button className='bg-green-500 py-[5px] px-[20px] rounded-full'><a href="/parris-hill-murals/parris-hill-murals-ar">Open AR Experience</a></button>
    </div>
  );
};

export default ParrisMural;