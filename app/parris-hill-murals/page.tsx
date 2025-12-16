import React from 'react';
import Link from 'next/link';

const ParrisMural = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-[100dvh] text-black'>
      <p className='font-bold text-[1.5rem]'>Parris Hill Mural Page</p>
      <button className='bg-green-500 py-[5px] px-[20px] rounded-full'><Link href="/parris-hill-murals/parris-hill-murals-ar">Open AR Experience</Link></button>
    </div>
  );
};

export default ParrisMural;