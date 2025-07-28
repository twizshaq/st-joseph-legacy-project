import React from 'react';

const GuidedTour = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-[100dvh] text-black'>
    <div className='w-[90vw]'>
        <p className='font-bold text-[1.5rem] text-center'>Guided Tour Page</p>
        <p className='font-bold text-[1.5rem] text-center'>To add:</p>
        <br /><br />
        <p className='font-bold text-[1rem] text-center'>name (input field)</p>
        <br />
        <p className='font-bold text-[1rem] text-center'>amount of people (drop down field)</p>
        <br />
        <p className='font-bold text-[1rem] text-center'>calender dates (can use component from like shadcn)</p>
        <br />
        <p className='font-bold text-[1rem] text-center'>maybe an always on screen div that shows the price as they add trips or people</p>
        <br />
        <p className='font-bold text-[1rem] text-center'>an area for the user to plan their trip (shaq wants to work on this)</p>
      </div>
    </div>
  );
};

export default GuidedTour;