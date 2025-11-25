"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, Crown, Shield } from 'lucide-react';
import UploadModal from '@/app/components/UploadModal'; 
import { CrownIcon } from '@/public/icons/crown-icon'

import Navigation from '@/app/components/ProfileNav';

// --- Mock Data ---
const topThree = [
  { rank: 2, name: 'sarah_j', points: 1500, img: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg', color: 'border-gray-300' },
  { rank: 1, name: 'king_david', points: 2000, img: 'https://i.pinimg.com/736x/d4/aa/92/d4aa9219d018d5fea71a647303b71e62.jpg', color: 'border-yellow-400' },
  { rank: 3, name: 'mikey_p', points: 1300, img: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg', color: 'border-orange-400' },
];

const runnersUp = [
  { rank: 4, name: 'jessica_w', points: 1100, img: 'https://i.pinimg.com/736x/87/bb/6f/87bb6feec00fb1ff38c0f828630956b1.jpg', gradient: 'from-purple-200/50 to-gray-50', shields: 3 },
  { rank: 5, name: 'tom_travels', points: 1100, img: 'https://i.pinimg.com/736x/fb/f1/d2/fbf1d2a2c9767c53aec9c6258ca51d8a.jpg', gradient: 'from-orange-100/50 to-gray-50', shields: 3 },
  { rank: 6, name: 'island_girl', points: 1100, img: 'https://i.pinimg.com/736x/18/bf/03/18bf03651fb073494e87f7c07952ccf0.jpg', gradient: 'from-teal-100/50 to-gray-50', shields: 0 },
  { rank: 7, name: 'barbados_fan', points: 1100, img: 'https://i.pinimg.com/736x/9c/03/4d/9c034d03d8db6ee172bcf6fe25de24ca.jpg', gradient: 'from-pink-200/50 to-gray-50', shields: 0 },
  { rank: 8, name: 'surfer_dude', points: 1100, img: 'https://i.pinimg.com/736x/0b/42/39/0b42396dc5e5b8ca43bef1102b9a9fdb.jpg', gradient: 'from-blue-100/50 to-gray-50', shields: 0 },
  { rank: 9, name: 'explorer_99', points: 1100, img: 'https://i.pinimg.com/736x/c2/d9/d1/c2d9d1ba6373b685f8f737b10fa57611.jpg', gradient: 'from-indigo-200/50 to-gray-50', shields: 0 },
  { rank: 10, name: 'green_thumb', points: 1100, img: 'https://i.pinimg.com/1200x/ea/3a/90/ea3a90596d8f097fb9111c06501aa1f8.jpg', gradient: 'from-green-100/50 to-gray-50', shields: 0 },
];

const currentUser = { rank: 54, name: 'username', points: 1100, img: 'https://i.pinimg.com/736x/d4/aa/92/d4aa9219d018d5fea71a647303b71e62.jpg', gradient: 'from-gray-100 to-gray-50' };

export default function LeaderboardPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      
      {/* --- Upload Modal --- */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

        <Navigation />


      <div className="w-full max-w-7xl flex gap-8 p-4 md:p-8 mt-36 max-sm:mt-40">

        
        {/* --- Main Content Area --- */}
        <div className="flex-1 w-full max-w-[600px] mx-auto">
          
          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-16 relative bg-red-500/0">
             {/* Rank 2 */}
             <div className="flex flex-col items-center z-10">
                <div className="relative mt-[40px]">
                    <div className="relative w-20 h-20 rounded-full border-3 border-gray-300 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                        <Image src={topThree[0].img} alt="Rank 2" layout="fill" objectFit="cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-[1rem] font-bold border-2 border-white">
                        2
                    </div>
                </div>
                <span className="font-bold mt-5 text-[1rem] text-gray-900">{topThree[0].name}</span>
                <span className="text-[.9rem] text-gray-500 font-[500]">{topThree[0].points} pts</span>
             </div>

             {/* Rank 1 */}
             <div className="flex flex-col items-center z-20 mb-[20px]">
                <div className="relative">
                    <div className='absolute rotate-[-18deg] top-[-50px] z-10'>
                        <CrownIcon size={62} color="#ffa600ff" className='drop-shadow-[0px_0px_4px_rgba(0,0,0,0.3)]'/>
                    </div>
                    <div className="relative w-28 h-28 rounded-full border-3 border-[#ffa600ff] overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                        <Image src={topThree[1].img} alt="Rank 1" layout="fill" objectFit="cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#ffa600ff] text-white w-8 h-8 rounded-full flex items-center justify-center text-[1rem] font-bold border-2 border-white">
                        1
                    </div>
                </div>
                <span className="font-bold mt-5 text-[1rem] text-gray-900">{topThree[1].name}</span>
                <span className="text-[.9rem] text-gray-500 font-[500]">{topThree[1].points} pts</span>
             </div>

             {/* Rank 3 */}
             <div className="flex flex-col items-center z-10">
                <div className="relative">
                    <div className="relative w-20 h-20 rounded-full border-3 border-orange-400 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                        <Image src={topThree[2].img} alt="Rank 3" layout="fill" objectFit="cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[1rem] font-bold border-2 border-white">
                        3
                    </div>
                </div>
                <span className="font-bold mt-4 text-gray-900">{topThree[2].name}</span>
                <span className="text-[.9rem] text-gray-500 font-[500]">{topThree[2].points} pts</span>
             </div>
          </div>

          {/* List Ranks (4-10) */}
          <div className="space-y-5">
            {runnersUp.map((user) => (
                
                // <div className="mb-40 bottom-6">
            <div key={user.rank} className='bg-white/10 max-sm:backdrop-blur-[0px] overflow-hidden backdrop-blur-[0px] rounded-[29px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,.1)]'>

                {/* --- The Blurred Background Border Layer --- */}
                    <div className='absolute inset-y-0 left-0 w-[250px] z-0 [mask-image:linear-gradient(to_right,black_0%,transparent)]'>
                        {/* The Image */}
                        <div className="relative w-full h-full">
                             <Image 
                                src={user.img} 
                                alt="background" 
                                layout="fill" 
                                objectFit="cover"
                                className="blur-[10px] scale-125" // scale-125 helps hide edge artifacts
                             />
                        </div>
                        {/* The Fade Mask */}
                        {/* <div className="absolute bg-gradient-to-r from-transparent via-gray-100/50 to-gray-100"></div> */}
                    </div>
                
                {/* Parent Container: Added transform-gpu to fix corner clipping */}
                <div className="flex relative items-center overflow-hidden justify-between p-3 pr-6 rounded-[27px] bg-[#EDEDED] transform-gpu">
                    
                    {/* --- The Blurred Background Layer --- */}
                    <div className='absolute inset-y-0 left-0 w-[200px] z-0 [mask-image:linear-gradient(to_right,black_40%,transparent)]'>
                        {/* The Image */}
                        <div className="relative w-full h-full">
                             <Image 
                                src={user.img} 
                                alt="background" 
                                layout="fill" 
                                objectFit="cover"
                                className="blur-[30px] scale-150 opacity-[.7]" // scale-125 helps hide edge artifacts
                             />
                        </div>
                        {/* The Fade Mask */}
                        {/* <div className="absolute bg-gradient-to-r from-transparent via-gray-100/50 to-gray-100"></div> */}
                    </div>

                    {/* --- The Content (z-10 to sit on top) --- */}
                    <div className="flex items-center gap-4 z-10 relative">
                        <span className="w-5 bg-red-500/0 text-center font-bold text-black text-[1.3rem] mx-0">{user.rank}</span>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image src={user.img} alt={user.name} layout="fill" objectFit="cover" />
                        </div>
                        <div className='flex flex-col'>
                            <span className="font-bold text-black text-[1rem]">{user.name}</span>
                            <span className="font-[500] text-[.9rem] text-gray-600 z-10 relative">{user.points} pts</span>
                        </div>
                    </div>
                    
                    {/* <span className="font-[500 text-[.9rem] text-black z-10 relative">{user.points} pts</span> */}
                    <div className='flex gap-1'>
                        <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/NicePng_clash-royale-crown-png_2883164.png" alt='badge' height={30} width={30}/>
                        {/* <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/NicePng_clash-royale-crown-png_2883164.png" alt='badge' height={23} width={23}/>
                        <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/NicePng_clash-royale-crown-png_2883164.png" alt='badge' height={23} width={23}/> */}
                    </div>
                </div>
            </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] bg-gray-300 flex-1"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Rank</span>
            <div className="h-[1px] bg-gray-300 flex-1"></div>
          </div>

          {/* Current User Rank */}
          <div className="mb-40 bottom-6">
            <div className='bg-white/10 max-sm:backdrop-blur-[0px] overflow-hidden backdrop-blur-[0px] rounded-[29px] p-[3px] shadow-[0px_0px_20px_rgba(0,0,0,.1)]'>

                {/* --- The Blurred Background Border Layer --- */}
                    <div className='absolute inset-y-0 left-0 w-[250px] z-0 [mask-image:linear-gradient(to_right,black_0%,transparent)]'>
                        {/* The Image */}
                        <div className="relative w-full h-full">
                             <Image 
                                src={currentUser.img} 
                                alt="background" 
                                layout="fill" 
                                objectFit="cover"
                                className="blur-[10px] scale-125" // scale-125 helps hide edge artifacts
                             />
                        </div>
                        {/* The Fade Mask */}
                        {/* <div className="absolute bg-gradient-to-r from-transparent via-gray-100/50 to-gray-100"></div> */}
                    </div>
                
                {/* Parent Container: Added transform-gpu to fix corner clipping */}
                <div className="flex relative items-center overflow-hidden justify-between p-3 pr-6 rounded-[27px] bg-[#EDEDED] transform-gpu">
                    
                    {/* --- The Blurred Background Layer --- */}
                    <div className='absolute inset-y-0 left-0 w-[200px] z-0 [mask-image:linear-gradient(to_right,black_40%,transparent)]'>
                        {/* The Image */}
                        <div className="relative w-full h-full">
                             <Image 
                                src={currentUser.img} 
                                alt="background" 
                                layout="fill" 
                                objectFit="cover"
                                className="blur-[30px] scale-150 opacity-[.7]" // scale-125 helps hide edge artifacts
                             />
                        </div>
                        {/* The Fade Mask */}
                        {/* <div className="absolute bg-gradient-to-r from-transparent via-gray-100/50 to-gray-100"></div> */}
                    </div>

                    {/* --- The Content (z-10 to sit on top) --- */}
                    <div className="flex items-center gap-4 z-10 relative">
                        <span className="w-5 bg-red-500/0 text-center font-bold text-black text-[1.3rem] mx-0">{currentUser.rank}</span>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image src={currentUser.img} alt={currentUser.name} layout="fill" objectFit="cover" />
                        </div>
                        <div className='flex flex-col'>
                            <span className="font-bold text-black text-[1rem]">{currentUser.name}</span>
                            <span className="font-[500] text-[.9rem] text-gray-600 z-10 relative">{currentUser.points} pts</span>
                        </div>
                    </div>
                    
                    <div className='flex gap-1'>
                        <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/NicePng_clash-royale-crown-png_2883164.png" alt='badge' height={30} width={30}/>
                        {/* <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/NicePng_clash-royale-crown-png_2883164.png" alt='badge' height={23} width={23}/>
                        <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/NicePng_clash-royale-crown-png_2883164.png" alt='badge' height={23} width={23}/> */}
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}