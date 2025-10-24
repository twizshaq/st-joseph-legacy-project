"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import vrIcon from "@/public/icons/vr-icon.svg"
import camIcon from "@/public/icons/camera-icon.svg"
import ticketIcon from "@/public/icons/ticket-icon.svg"
import clockIcon from "@/public/icons/clock-icon.svg"
import photoIcon from "@/public/icons/photos-icon.svg"
import quizIcon from "@/public/icons/quiz-icon.svg"
import { stories } from '@/public/data/stories';
import { experiences } from '@/public/data/experiences';

const SoupBowl = () => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(true);
  return (
    <div className='flex flex-col items-center self-center min-h-[100dvh] text-black bg-red-500/0 overflow-hidden'>
      <div className="relative flex flex-col justify-center items-center w-[100vw] max-w-[2000px] w-full h-[55vh] text-white gap-[20px]">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay (optional for text readability) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40" />

      <div className='bg-pink-500/0 z-0 absolute w-[1400px] max-w-[90vw] bottom-[45px]'>
        <p className="font-black text-[3rem] max-md:text-[2rem] text-start leading-[1.2] z-10 mb-[10px] text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]">
        Soup Bowl
        </p>
        <p className="text-[1rem] max-md:text-[1rem] text-start leading-[1.2] z-10 text-shadow-[0px_0px_10px_rgba(0,0,0,0.2)]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </p>


            <div className='absolute flex gap-[15px] left-[0] bottom-[-80px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-row gap-6'>
                <button className="flex items-center py-[13px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={vrIcon} alt="" height={30} className=''/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Explore in AR</p>
                </button>
              </div>
            </div>
      </div>
      {/* Foreground Content */}
      {/* <p className="font-black text-[3rem] max-md:text-[2rem] text-center leading-[1.2] z-10">
        Soup Bowl
      </p> */}

        {/* Dots to show how long the image or video will last */}
        {/* <div className='absolute bottom-[50px] flex flex-row gap-[10px]'>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
          <div className='bg-[#fff] rounded-full h-[7px] w-[15px]'></div>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
          <div className='bg-[#fff]/30 rounded-full h-[7px] w-[7px]'></div>
        </div> */}

      {/* <div className='absolute left-[0] bottom-[-35px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <button className="flex items-center py-[13px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={vrIcon} alt="" height={30} className=''/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Explore in AR</p>
                </button>
              </div>
            </div> */}
      </div>

      <div className='bg-[#E0E0E0] w-[691px] max-w-[80vw] h-[1px] mt-[85px] rounded-full'></div>

      <div className='relative mt-[40px] w-[1400px] max-w-[90vw] bg-green-500/0 flex flex-col overflow-visible isolation-isolate '>
        {/* Blurred color blobs behind Quick Facts */}
        <div aria-hidden className='pointer-events-none absolute inset-0 -z-10 opacity-20'>
          <div className='absolute -top-8 left-[5%] w-[260px] h-[260px] rounded-full bg-[#60A5FA]/40 blur-[90px]'></div>
          <div className='absolute top-6 right-[2%] w-[220px] h-[220px] rounded-full bg-[#F472B6]/40 blur-[90px]'></div>
          <div className='absolute -bottom-10 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full bg-[#34D399]/35 blur-[110px]'></div>
          <div className='absolute bottom-0 left-[18%] w-[180px] h-[180px] rounded-full bg-[#F59E0B]/35 blur-[80px]'></div>
        </div>

        <p className='relative z-10 font-bold text-[2rem]'>Quick Facts</p>
        <div className='relative z-10 flex flex-wrap mt-[30px] gap-[70px] max-sm:gap-[30px]'>

          <div className='flex flex-row gap-[10px]'>
            <Image src={clockIcon} alt="" height={35} className='' />
            <div className='flex flex-col'>
              <p className='text-[.938rem] text-[#747474]'>Best Time</p>
              <p className='text-[1rem]'>Sunrise & Late Afternoon</p>
            </div>
          </div>

          <div className='flex flex-row gap-[10px]'>
            <Image src={camIcon} alt="" height={35} className='' />
            <div className='flex flex-col'>
              <p className='text-[.938rem] text-[#747474]'>Photo Spots</p>
              <p className='text-[1rem]'>Soup Bowl • Bathsheba Rock</p>
            </div>
          </div>

          <div className='flex flex-row gap-[10px]'>
            <span>
              <Image src={ticketIcon} alt="" height={35} className='rotate-[-20deg] mt-[7px]' />
            </span>
            <div className='flex flex-col'>
              <p className='text-[.938rem] text-[#747474]'>Entry Fee</p>
              <p className='text-[1rem]'>Free Access</p>
            </div>
          </div>

        </div>
      </div>

      <div className='flex justify-between w-[1400px] max-w-[90vw] flex-wrap gap-[50px] mt-[80px] mb-[80px] bg-blue-500/0'>
        <div className='flex flex-col max-w-[740px] bg-red-500/0'>
          <p className='font-bold text-[2rem]'>About</p>
          <p>Bathsheba sits along Barbados’ wild Atlantic east coast, framed by dramatic rock formations shaped by centuries of relentless waves and wind. The coastline is famous for its natural rock pools, formed between coral boulders at low tide, creating sheltered pockets of calm amidst the roaring surf. Beyond its striking scenery, Bathsheba is a working fishing community where locals gather for weekend picnics, seaside cricket matches, and casual “liming” under the shade of sea grape trees. On most days, you’ll see brightly painted fishing boats pulled up on the sand, drying nets draped over their sides.</p>
          <br /><br />
          <p className='font-bold text-[2rem]'>History & Cultural Significance</p>
          <p>The name “Bathsheba” is rooted in local lore — some say it recalls the biblical Bathsheba, bathing in beauty, while others link it to the area’s healing mineral-rich waters once believed to have therapeutic benefits. For generations, Bathsheba has been a cultural hub for St. Joseph parish, serving as a meeting place for fishermen, artisans, and surfers alike. The famous Soup Bowl reef break has drawn both local legends and world-class surfers, putting this small village on the international surf map.
          <br /><br />
          Bathsheba’s surroundings form part of the Scotland District, a geologically unique area in the Caribbean where ancient sedimentary rock has been uplifted and eroded into steep hillsides. This fragile landscape has inspired local conservation efforts, with the community actively involved in preserving the area’s heritage and natural beauty. Cultural events, art festivals, and surf competitions here celebrate not just sport, but the deep connection between people, land, and sea.</p>
        </div>


      <div className='flex flex-col'>
        <div className='w-[450px] max-w-full max-sm:w-full'>
          <div className='rounded-[30px] border-[2px] border-[#B8F500] bg-[#F7FFEA] shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden'>
            {/* Header button */}
            <button
              type='button'
              onClick={() => setIsSafetyOpen(v => !v)}
              aria-expanded={isSafetyOpen}
              aria-controls='safety-panel'
              className='w-full flex items-center justify-between gap-3 px-5 py-4'
            >
              <span className='flex items-center gap-3'>
                <span className='font-bold text-[1.25rem] text-black'>Disaster Preparedness</span>
              </span>

            </button>

            {/* Collapsible content */}
            <div
              id='safety-panel'
              className={`${isSafetyOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
            >
              <div className='px-5 pb-5 text-[#1a1a1a]'>
                <p className='text-[0.98rem] leading-[1.5] mb-3'>
                  Seas on the east coast can be rough year‑round. Avoid swimming during heavy swell, keep a safe distance from blowholes, and monitor weather advisories during the hurricane season (June–November).
                </p>
                <ul className='list-disc pl-5 space-y-2 text-[0.98rem]'>
                  <li>Use designated viewpoints for photography and stay off slippery rocks.</li>
                  <li>Park in safe zones away from cliff edges and soft shoulder areas.</li>
                </ul>

                <div className='flex items-start gap-2 mt-4 text-[0.95rem]'>
                  {/* Warning icon */}
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden>
                    <path d='M12 3l9 16H3L12 3Z' stroke='#B8F500' strokeWidth='2' strokeLinejoin='round'/>
                    <path d='M12 9v5' stroke='#B8F500' strokeWidth='2' strokeLinecap='round'/>
                    <circle cx='12' cy='17' r='1.2' fill='#B8F500'/>
                  </svg>
                  <span>
                    <span className='font-medium'>Learn more:</span> Coastal safety & storm readiness
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='w-[450px] max-w-full max-sm:w-full bg-red-500 mt-[40px] h-[170px] rounded-[40px] flex justify-center items-center'>
          <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-row gap-6'>
            <button className="flex items-center py-[13px] pl-[15px] pr-[20px] gap-[10px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={quizIcon} alt="" height={24} className='invert'/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Start Quiz</p>
            </button>
          </div>
        </div>
      </div>


      </div>

      <div className='gap-[50px] mb-[80px] bg-blue-500/0 self-center w-[1400px] max-w-[90vw]'>
        <div className='flex flex-col w-full bg-red-500/0'>
          <p className='font-bold text-[2rem] mb-8'>Local Stories</p>
          
          <div className='flex flex-wrap gap-x-20 gap-y-12'>
            {stories.map((story,index)=>(
            <div className='flex flex-col gap-5' key={index}>
              <p className='font-semibold text-xl'>{story.title}</p>
                <audio controls>
                  <source src={story.src} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
            </div>
            ))}
          </div>
        </div>
        </div>

        

      <div className='mb-[180px]'>
        <div className='flex flex-col text-center mb-[50px]'>
          <p className='font-bold text-[1.75rem]'>Photo & Video Gallery</p>
          <p className='text-[#666]'>A glimpse of the coastline, surf, and tidal pools</p>
        </div>
        <div className='relative flex flex-row justify-center items-end bg-green-500/0 min-h-[360px] sm:min-h-[420px] overflow-visible'>
          {/* Blurred color blobs behind the cards */}
          <div aria-hidden className='pointer-events-none absolute inset-0 z-0'>
            <div className='absolute left-[5%] bottom-[0px] w-[320px] h-[320px] rounded-full bg-[#60A5FA]/40 blur-[90px]'></div>
            {/* <div className='absolute right-[6%] bottom-[10px] w-[300px] h-[300px] rounded-full bg-[#F472B6]/40 blur-[90px]'></div> */}
            {/* <div className='absolute left-1/2 -translate-x-1/2 top-[-10px] w-[360px] h-[360px] rounded-full bg-[#34D399]/35 blur-[100px]'></div> */}
            {/* <div className='absolute left-[22%] top-[0px] w-[220px] h-[220px] rounded-full bg-[#F59E0B]/35 blur-[80px]'></div> */}
          </div>

          {/* Card cluster (scaled down on small screens to keep spacing visually consistent) */}
          <div className='relative w-full flex justify-center items-end z-10 origin-bottom max-sm:scale-[0.76]'>
            <div className='bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-20 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute right-[220px] bottom-[80px] rotate-[7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute left-[220px] bottom-[80px] rotate-[-7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute left-[400px] bottom-[0px] rotate-[7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
            <div className='absolute right-[400px] bottom-[0px] rotate-[-7deg] bg-red-500 border-3 border-white w-[232px] h-[310px] rounded-[50px] z-10 shadow-[0px_0px_20px_rgba(0,0,0,.3)]'></div>
          </div>
        </div>
        <div className='relative bg-green-500 flex flex-col justify-center items-center z-30'>
          <div className="w-[100vw] absolute flex justify-center">
                        <div
                          className={`
                            bg-blue-500/0 bottom-[-100px]
                            absolute w-[1100px]
                            backdrop-blur-[15px] [mask-image:linear-gradient(to_top,black_40%,transparent)] opacity-100 h-[500px]
                          `}
                        ></div>
          
                        {/* <div
                          className={`
                            absolute w-[1500px] ml-[-400px] bg-transparent
                            backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,black_20%,transparent)] backdrop-blur-[20px] opacity-100 h-[500px]
                          `}
                        ></div>
          
                        <div
                          className={`
                            absolute w-[1500px] ml-[-400px] bg-transparent
                            [mask-image:linear-gradient(to_bottom,black_10%,transparent)] backdrop-blur-[5px] opacity-100 h-[160px]
                          `}
                        ></div> */}
                      </div>
            <div className='absolute left-[77px] bottom-[-20px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
              <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
                <button className="flex items-center py-[10px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                  <span className='z-10 fill-[#E0E0E0]'>
                    <Image src={photoIcon} alt="" height={30} className=''/>
                  </span>
                  <p className='font-bold text-[#E0E0E0]'>Open Gallery</p>
                </button>
              </div>
            </div>
          </div>
      </div>

      <div className='mb-[80px] bg-green-500/0 max-w-[90vw]'>
        <p className='font-bold text-[2rem] bg-red-500/0'>Traveler Experiences</p>
        <div className='flex flex-col bg-green-500/0 overflow-x-scroll bg-pink-500/0 '>
          {/* <p className='font-bold text-[2rem] max-sm:px-[5vw]'>Traveler Experiences</p> */}
           <div className='flex  py-[40px] gap-10 bg-red-500/0'>
          {experiences.map((experience,index)=>(
           
              <div className='flex flex-col min-w-[400px] max-w-[350px] max-sm:min-w-[90vw] h-fit bg-[#EDEDED] overflow-hidden p-[20px] border-white border-[2px] rounded-[40px] shadow-[0px_0px_20px_rgba(0,0,0,.1)]' key={index}>
                <div className='flex justify-between'>
                  <div className='flex gap-[10px] items-center'>
                    <Link href="/profile" className='cursor-pointer whitespace-nowrap'>
                      <div className='w-10 h-10 flex items-center justify-center rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] -mr-[1px]'>
                        <div className='bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden'>
                          {/* <Image src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" alt="User profile picture" width={40} height={40} className="w-full h-full object-cover rounded-full" /> */}
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                    </Link>
                    <div className='flex flex-col'>
                      <p className='font-bold text-[#656565] text-[1.05rem]'>{experience.username}</p>
                      <p className='text-base text-neutral-500 font-[500] text-[.8rem] mt-[-4px]'>{new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(experience.upload_date)}</p>
                    </div>
                    
                  </div>
                  <div className='relative bg-blue-500/0 w-[50px] h-[50px] mt-[-3px]'>
                    <div className='absolute bg-red-500/0 overflow-hidden border-white border-[1.5px] h-[45px] w-[45px] rounded-[15px] left-[5px] rotate-[15deg] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] z-[1]'>
                      <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                          </video>
                    </div>
                    <div className='absolute bg-green-500/0 h-[45px] w-[45px] overflow-hidden border-white border-[1.5px] rounded-[15px] left-[-25px] mt-[0px] rotate-[-10deg] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] z-[1]'>
                      <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                          </video>
                    </div>
                    {/* <div className='absolute bg-green-500/0 h-[25px] w-[25px] overflow-hidden border-white border-[1.5px] rounded-[9px] left-[0px] mt-[30px] rotate-[0deg] shadow-[0px_0px_10px_rgba(0,0,0,0.3)] z-[0]'>
                      <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                          </video>
                    </div> */}
                    {/* <div className='absolute bg-pink-500 h-[40px] w-[40px] rounded-[10px] ml-[-15px] rotate-[-10deg] mt-[-1px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'></div> */}
                  </div>
                  {/* <p className='text-base text-neutral-500 font-[500] text-[.8rem\9]'>{new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(experience.upload_date)}</p> */}
                </div>
                {/* <p className='text-[1.1rem] mt-[15px] font-semibold'>{experience.title}</p> */}
                <p className='bg-red-500/0 mt-[10px] font-[400]'>{experience.description}</p>
                {/* <div className='flex justify-start pt-2 gap-x-3'>
                  {experience.images.map((image,index)=>(
                    <img src={image.src} alt={image.alt} className='rounded-[20px] w-20 h-20 border-white border-[1.5px]' key={index}/>
                  ))}
                </div> */}
              </div>
        
          ))}
            </div>
             {/* <button className='relative self-center cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[220px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] mt-16'>
                           <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px]'>
                             <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                              View All Experiences
                             </span>
                            
                           </div>
                         </button> */}
        </div>
        <div className='flex justify-center gap-[10px] bg-red-500/0'>
                          <div className='flex justify-center items-center bg-[#007BFF] h-[40px] w-[40px] font-[700] text-[1.2rem] text-white rounded-[15px]'>
                            1
                          </div>
                          <div className='flex justify-center items-center bg-[#656565]/30 h-[40px] w-[40px] font-[700] text-[1.2rem] text-white rounded-[15px]'>
                            2
                          </div>
                          <div className='flex justify-center items-center bg-[#656565]/30 h-[40px] w-[40px] font-[700] text-[1.2rem] text-white rounded-[15px]'>
                            3
                          </div>
                          <div className='flex justify-center items-center bg-[#656565]/30 h-[40px] w-[40px] font-[700] text-[1.2rem] text-white rounded-[15px]'>
                            4
                          </div>
                          <div className='flex justify-center items-center bg-[#656565]/30 h-[40px] w-[40px] font-[700] text-[1.2rem] text-white rounded-[15px]'>
                            5
                          </div>
                          <div className='flex justify-center items-center bg-[#656565]/30 h-[40px] w-[40px] font-[700] text-[1.2rem] text-white rounded-[15px]'>
                            6
                          </div>
                        </div>
        </div>

      <div className='w-[100vw]'>
        <div className='px-[5.4vw]'>
          <p className='font-bold text-[1.75rem]'>Nearby Sites</p>
          <p className='text-[#666]'>Plan your route across St. Joseph</p>
        </div>
        <div className="flex flex-col w-full overflow-x-auto hide-scrollbar">
          <div className="mt-[10px] flex flex-row items-center min-h-[450px] gap-[30px] w-[100vw] overflow-y-hidden px-[5.4vw]">
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[45px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                    <a href="/parris-hill-murals">
                      <p className="text-white font-bold">Explore Site</p>
                    </a>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[45px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[45px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[45px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
              <div className="relative bg-pink-600 min-h-[370px] min-w-[300px] max-h-[370px] max-w-[300px] rounded-[45px] border-[3.5px] border-white shadow-[4px_4px_15px_rgba(0,0,0,0.2)] p-5 flex flex-col justify-end">
                  <button className="absolute top-4 right-[17px] backdrop-blur-[10px] bg-black/10 rounded-full flex px-[15px] border-2 py-[5px] border-white/15">
                      <p className="text-white font-bold">Explore Site</p>
                  </button>
                  <div className="text-white text-shadow-[4px_4px_15px_rgba(0,0,0,.6)]">
                      <p className="font-bold text-[1.3rem]">Parris Hill Mural</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
              </div>
          </div>
      </div>
      </div>
      
      {/* <p className='font-bold text-[1.5rem]'>Soup Bowl Page</p> */}
    </div>
  );
};

export default SoupBowl;