import React from 'react';
import Image from 'next/image';

export default function Sponsors() {
    return (
        <div className='bg-red-500/0 w-[100vw] mt-[50px] flex flex-col items-center'>
            <div className='flex flex-col items-center'>
                <p className="font-bold text-[2rem] max-sm:text-[1.5rem]">Our Sponsors</p>
                <p>Generous Support provided by</p>
            </div>
            <div className='bg-green-500/0 justify-center items-center flex flex-wrap gap-[30px] h-auto max-w-[90vw] w-auto mt-[30px]'>
                <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/361112479_1004546300898262_4577794897630667019_n.jpg" alt="Loading..." width={110} height={110} className='' />
            </div>
        </div>
    );
}