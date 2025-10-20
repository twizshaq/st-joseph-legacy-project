
'use client'

import React, { useState, useRef } from "react";
import { SlidersHorizontal, ArrowRight, Clock, DollarSign, Leaf, Waves, Landmark, Mountain, Trees, MapPin, Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import sortIcon from '@/public/icons/sort-icon.svg';
import searchIcon from '@/public/icons/search-icon.svg';
import starIcon from '@/public/icons/star-icon.svg';
import houseIcon from '@/public/icons/house-icon.svg';
import ArrowIcon from '@/public/icons/arrow-icon';
import photoIcon from "@/public/icons/photos-icon.svg"
import profileIcon from "@/public/icons/profile-icon.svg"


export default function ToursPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center text-black"
      onClick={(e) => {
      if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    }}
    >

      <div className="relative bg-red-500/0 justify-center gap-[100px] w-[1500px] max-w-[90vw] flex flex-wrap-reverse overflow-visible mb-[130px] mt-[200px] max-sm:mt-[150px] ">
      {/* Gradient Blob Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-[250px] h-[250px] bg-gradient-to-br from-pink-300/40 to-indigo-300/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Video Section */}
      <div className="flex gap-[20px] md:gap-[40px] items-center bg-transparent overflow-visible relative z-10">
  {/* Card 1: Smaller by default, scales up on medium screens */}
  <div className="bg-gradient-to-br from-white to-gray-100 max-w-[170px] min-w-[170px] h-[240px] md:max-w-[300px] md:min-w-[300px] md:h-[400px] rounded-[36px] md:rounded-[60px] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
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
  {/* Container for the two smaller cards */}
  <div className="flex flex-col gap-[20px] md:gap-[20px]">
    {/* Card 2: Smaller by default */}
    <div className="relative bg-gradient-to-br from-white to-gray-100 max-w-[150px] min-w-[150px] h-[180px] md:max-w-[250px] md:min-w-[250px] md:h-[300px] rounded-[36px] md:rounded-[60px] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* <Image src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.portobelloinstitute.com%2Fwhat-are-the-different-types-of-tour-guide&psig=AOvVaw3JG3PXKL2ZAPakOt9_tmQf&ust=1760984237573000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCYg9vvsJADFQAAAAAdAAAAABAE" alt=""/> */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
      </video> */}
    </div>
    {/* Card 3: Smaller by default */}
    <div className="bg-gradient-to-br from-white to-gray-100 max-w-[150px] min-w-[150px] h-[120px] md:max-w-[250px] md:min-w-[250px] md:h-[200px] rounded-[36px] md:rounded-[60px] border-[3px] border-white shadow-[0px_0px_15px_rgba(0,0,0,0.15)] overflow-hidden transform hover:scale-105 transition-transform duration-300">
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
</div>

      {/* Text and Info Section */}
      <div className="flex flex-col max-w-[600px] relative z-10">
        <div className="flex flex-col">
          <p className="font-bold text-[4rem] max-sm:text-[2.5rem] max-sm:leading-[60px] leading-[80px]">Discover St. Joseph&apos;s Hidden Wonders</p>
          <p className="text-gray-700 mt-4 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis venenatis ex, ultricies dapibus leo pulvinar sit amet. Praesent pharetra aliquet vehicula. Praesent et diam nunc. Suspendisse et magna et enim facilisis congue quis in nulla. Pellentesque quam nisl, bibendum bibendum vehicula a.</p>
        </div>
        <div className="flex mt-[20px] gap-[10px]">
          <div className="bg-[#EDEDED] px-[15px] py-[10px] rounded-[40px] border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transform hover:scale-105 duration-300">
            <p className="font-[600] text-[1rem] text-gray-800">3 Unique Tours</p>
          </div>
          <div className="bg-[#EDEDED] px-[15px] py-[10px] rounded-[40px] border-[2px] border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] transform hover:scale-105 duration-300">
            <p className="font-[600] text-[1rem] text-gray-800">4.9 Star Ratings</p>
          </div>
        </div>
      </div>
    </div>


      <div className='flex justify-center gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px] relative' onClick={() => setIsPopupOpen(true)}>
        <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)] flex flex-row gap-6'>
          <button
            className="cursor-pointer flex items-center py-[10px] pl-[13px] pr-[10px] gap-[3px] justify-center rounded-full bg-[#333]/10 backdrop-blur-[5px] active:bg-[#333]/20 z-[10]"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopupOpen(true);
            }}
          >
            <p className='font-bold text-[#000]'>Select a Tour</p><span><ArrowIcon className="rotate-180" color="#000" /></span>
          </button>
        </div>
        {isPopupOpen && (
          <div
            ref={popupRef}
            className="absolute top-full mt-2 bg-[#fff]/30 rounded-[35px] border-[2px] border-white backdrop-blur-[30px] p-[7px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] w-[250px] flex flex-wrap z-[40] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <button
                className="flex items-center gap-[10px] p-2 hover:bg-black/10 cursor-pointer rounded-[25px]"
                onClick={() => setIsPopupOpen(false)}
              >
                <div className="overflow-hidden bg-pink-500 min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] border-[1.5px] border-white rounded-[17px]">
                  {/* <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                        </video> */}
                </div>
                {/* <Image src="/path/to/cliffs-image.jpg" alt="Cliffs, Coastlines, & Canopies" width={50} height={50} /> */}
                <p className="text-wrap text-left font-[500]">Cliffs, Coastlines, & Canopies</p>
              </button>
              <button
                className="flex items-center gap-[10px] p-2 hover:bg-black/10 cursor-pointer rounded-[25px]"
                onClick={() => setIsPopupOpen(false)}
              >
                <div className="overflow-hidden bg-pink-500 min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] border-[1.5px] border-white rounded-[17px]">
                  {/* <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                        </video> */}
                </div>
                {/* <Image src="/path/to/gardens-image.jpg" alt="The Gardens of St. Joseph Circuit" width={50} height={50} /> */}
                <p className="text-wrap text-left font-[500]">The Gardens of St. Joseph Circuit</p>
              </button>
              <button
                className="flex items-center p-2 gap-[10px] hover:bg-black/10 cursor-pointer rounded-[25px] bg-red-500/0"
                onClick={() => setIsPopupOpen(false)}
              >
                <div className="overflow-hidden bg-pink-500 min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] border-[1.5px] border-white rounded-[17px]">
                  {/* <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source src="https://shaq-portfolio-webapp.s3.us-east-1.amazonaws.com/deo-header-vid.mp4" type="video/mp4" />
                        </video> */}
                </div>
                {/* <Image src="/path/to/gardens-image.jpg" alt="The Gardens of St. Joseph Circuit" width={50} height={50} /> */}
                <p className="text-wrap text-left font-[500]">The Gardens of St. Joseph Circuit</p>
              </button>
            </div>
          </div>
        )}
      </div>

          {/* tour details  */}
          <div className="bg-white p-[10px] mt-[30px] gap-[20px] max-w-[92vw] flex flex-wrap shadow-[0px_0px_20px_rgba(0,0,0,.1)] rounded-[45px] overflow-hidden">

            {/* tour details - IMAGES  */}
            <div className="relative bg-red-500/0 flex h-full  rounded-l-[40px] overflow-hidden gap-[10px]">
              <div className="bg-green-500/0 flex flex-col h-full w-[200px] gap-[5px] rounded-l-[35px] justify-between">
                <div className="bg-pink-500 w-full h-[230px] rounded-[10px] rounded-tl-[35px]"></div>
                <div className="bg-blue-500 w-full h-[230px] rounded-[10px] rounded-bl-[35px] self-end"></div>
              </div>

              <div className="flex flex-col w-[150px] bg-purple-500/0 justify-between">
                <div className="bg-green-500 w-full h-[23.5%] self-end rounded-[10px] rounded-tr-[35px]"></div>
                <div className="bg-pink-500 w-full h-[23.5%] self-end rounded-[10px]"></div>
                <div className="bg-yellow-500 w-full h-[23.5%] self-end rounded-[10px]"></div>
                <div className="bg-purple-500 w-full h-[23.5%] self-end rounded-[10px] rounded-br-[35px]"></div>
              </div>
              <div className='absolute flex gap-[15px] right-[10px] bottom-[10px] cursor-pointer whitespace-nowrap rounded-full p-[3px]'>
                <div className='bg-white/10 backdrop-blur-[3px] rounded-full p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-row gap-6'>
                  <button className="cursor-pointer flex items-center py-[7px] pl-[10px] pr-[15px] gap-[5px] justify-center rounded-full bg-black/40 backdrop-blur-[5px] active:bg-black/30 shadow-lg z-[10]">
                    <p className='font-bold text-[#fff]'>See all photos</p>
                  </button>
                </div>
              </div>
            </div>


            {/* tour details - INFO  */}
            <div className="bg-blue-500/0 max-w-[450px] h-full">
              <div className="flex flex-col">
                <p className="">Tour</p>
                <p className="font-[700] text-[1.5rem]">Cliffs, Coastlines, & Canopies</p>
                <div className=" bg-black/10 w-[80%] mt-[10px] mb-[10px] h-[1px]"/>
              </div>
              <div className="flex flex-col gap-[30px]"> 
                <div>
                  <p className="text-[1.25rem] font-[700]">Description</p>
                  <p className="">commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
                <div>
                  <p className="text-[1.25rem] font-[700]">Stopss</p>
                  <p className="">commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
              </div>
            </div>


            <div className="bg-pink-500/0 overflow-hidden h-full">
            {/* <div className="h-[70%] w-[1px] bg-black/10 absolute "/> */}
              <button className="cursor-pointer">
                <div className="flex flex-col items-start">
                  <p className="flex items-center">Select a date <span className=""><ArrowIcon className="rotate-180" color="#000" /></span></p>
                  <p className="font-[700] mt-[-5px] text-[1.125rem]">October <span className="text-[#656565] font-[400]">2025</span></p>
                </div>
                <div className="bg-red-500/0 flex gap-[20px] mt-[5px]">
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Mon</p>
                    <p>12</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Tues</p>
                    <p className="bg-[#007BFF] rounded-full py-[1px] pt-[2px] px-[4.5px] text-white">12</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Wed</p>
                    <p>12</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Thurs</p>
                    <p>12</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Fri</p>
                    <p>12</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Sat</p>
                    <p>12</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-[500]">Sun</p>
                    <p>12</p>
                  </div>
                </div>
              </button>
              <div className="mt-[20px] mb-[10px]">
                <div className="flex items-center gap-[10px]">
                  <input type="text" className="p-[2px] px-[15px] bg-[#EDEDED] rounded-[20px] h-[50px] w-[261px] outline-none font-[500]" placeholder="Full Name" />
                  <button className="cursor-pointer pl-[3px] bg-[#EDEDED] flex justify-center gap-[3px] items-center rounded-[20px] h-[50px] w-[80px]">
                    <span className="rotate-[0deg] opacity-[.7]"><Image src={profileIcon} alt="drop down arrow" height={22} /></span>
                    <span><ArrowIcon className="rotate-180 h-[25px] w-[25px] opacity-[.7]" color="#656565" /></span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <input type="text" className="p-[2px] px-[15px] bg-[#EDEDED] rounded-[20px] h-[50px] w-[350px] mx-[] outline-none font-[500]" placeholder="Phone Number" />
                <input type="text" className="p-[2px] px-[15px] bg-[#EDEDED] rounded-[20px] h-[50px] w-[350px] outline-none font-[500]" placeholder="Email" />
                <textarea name="" id="" placeholder="Additional Notes (Optional)" className="resize-none w-[350px] outline-none h-[100px] font-[500] p-[15px] bg-[#EDEDED] rounded-[20px]"></textarea>
              </div>
              <div className="bg-red-400/0 w-[100%] mt-[10px] flex justify-end">
                <button className='relative self-center mr-[3px] active:bg-black/30 cursor-pointer whitespace-nowrap rounded-full p-[3px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                  <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[30px] py-[10px]'>
                    <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                      Book Tour
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Things to know */}
          <div className="w-[1500px] max-w-[90vw] mt-[100px]">
            <div className="flex flex-col mb-[30px]">
              <p className="font-[700] text-[1.75rem]">Things to Know</p>
              <p className="max-w-[600px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> 
            </div>
            <div className="flex justify-between gap-[30px] bg-red-500/0 max-ttk-wrap2:flex-wrap max-ttk-wrap:bg-red-500/0 max-ttk-wrap:justify-start max-sm:gap-y-[30px]">

              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>

              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              <div className="bg-[#EDEDED] gap-[3px] max-sm:w-[90vw] max-ttk-wrap:w-[calc(50%-15px)] flex flex-col items-center border-white border-[2px] rounded-[45px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden transform hover:scale-105 duration-300">
                <Image src={houseIcon} alt="star icon" height={30}/>
                <p className="text-[#656565] text-center font-[600] text-[1.1rem]">House Rules</p>
                <p className="text-center max-w-[300px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. 
                </p>
              </div>
              
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-red-500/0 w-[1500px] max-w-[90vw] mt-[100px]">
            <div className="text-[1.75rem] mb-[30px]">
              <span className="font-[700]">Reviews - </span>
              <span className="font-[500] text-[#656565]">Cliffs, Coastlines, & Canopies</span>
            </div>
            <div>
              <div className="bg-[#EDEDED] w-[407px] max-sm:w-[90vw] h-fit border-white border-[2px] rounded-[40px] shadow-[0px_0px_20px_rgba(0,0,0,.1)] p-[15px] overflow-hidden">
                <div className="flex justify-between items-start mb-[15px]">
                  <div className="bg-blue-500/0 flex items-center gap-[10px]">

                    <Link href="/profile" className='cursor-pointer whitespace-nowrap'>
                    <div className='w-11 h-11 flex items-center justify-center rounded-full bg-[linear-gradient(to_right,#007BFF,#66B2FF)] p-[2px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] -mr-[1px]'>
                      <div className='bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden'>
                        {/* <Image src={avatarUrl} alt="User profile picture" width={40} height={40} className="w-full h-full object-cover rounded-full" /> */}
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

                    <div>
                      <p className="font-[600] text-[1.1rem] text-[#656565]">Twizshaq</p>
                      <p className="font-[500] text-[.8rem] text-[#656565]">Sep 12, 2025</p>
                    </div>
                  </div>
                  <div className="flex gap-[0px]">
                    <Image src={starIcon} alt="star icon" height={30}/>
                    <Image src={starIcon} alt="star icon" height={30}/>
                    <Image src={starIcon} alt="star icon" height={30}/>
                    <Image src={starIcon} alt="star icon" height={30}/>
                    <Image src={starIcon} alt="star icon" height={30}/>
                  </div>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                </p>
              </div>
            </div>
          </div>

        
        {/* FOOTER */}
        <footer className='bg-blue-900 text-white w-full mt-[100px] py-12 px-[4vw]'>
          <div className='max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* Column 1: Identity & Contact */}
            <div className='flex flex-col gap-4'>
              <h3 className='font-bold text-xl'>Unveiling Our Legacy</h3>
              <p className='text-blue-200 text-sm'>A District Emergency Organization (DEO) Project.</p>
              <div>
                <h4 className='font-semibold mb-2'>Contact Us</h4>
                <a href="mailto:stjoseph.legacy@deo.gov.bb" className='text-blue-200 text-sm hover:underline'>stjoseph.legacy@deo.gov.bb</a>
                <p className='text-blue-200 text-sm'>(246) 123-4567</p>
              </div>
              <div>
                <div className='flex items-center gap-4 mt-3'>
                  <a href="https://www.instagram.com/dem.barbados" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                    <Image src="/icons/instagram-icon.svg" alt="" height={35} width={35}/>
                  </a>
                  <a href="https://www.facebook.com/dem246/" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                    <Image src="/icons/facebook-icon.svg" alt="" height={30} width={30}/>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Get Involved + Stay Connected */}
            <div className='flex flex-col-reverse items-start lg:items-center gap-[40px] lg:ml-[25px] ml-0'>
              {/* Get Involved */}
              <div className='flex flex-col gap-4 w-full'>
                <h3 className='font-bold text-xl lg:text-center'>Get Involved</h3>
                <ul className='space-y-2 text-blue-200 lg:text-center'>
                  <li>
                    <Link
                      href="https://forms.gle/DKHMGcmQttoztAgr9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className='hover:text-[#feb47b] transition-colors'
                    >
                      Volunteer Sign-up
                    </Link>
                  </li>
                </ul>
                <button className='relative lg:self-center cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[180px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                  <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px]'>
                    <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                      Contribute
                    </span>
                    <Image src="/icons/handheart-icon.svg" alt="Loading..." width={18} height={18} className='invert' />
                  </div>
                </button>
              </div>

              {/* Stay Connected */}
              <div className='flex flex-col gap-4 items-start lg:items-center w-full'>
                <h3 className='font-bold text-xl'>Stay Connected</h3>
                <p className='text-blue-200 text-sm lg:text-center'>Subscribe to our newsletter for project updates and email blasts.</p>
                {/* Simple input/button (non-functional here) */}
                <div className="h-hit w-fit flex items-center justify-end relative mb-[0px]">
                  <input
                    type="email"
                    className="border-[2px] border-white/10 backdrop-blur-[5px] text-white font-semibold rounded-[30px] py-[15px] pl-[20px] pr-[130px] max-w-[80vw] w-[350px] outline-none bg-black/20"
                    placeholder="Your Email"
                  />
                  <button
                    className={`
                      absolute cursor-pointer rounded-full py-[10px] px-[22px] mr-[7px] font-semibold bg-[#007BFF] text-white filter shadow-[0_0_7px_rgba(0,123,255,0.5)]
                    `}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className='flex flex-col gap-4 text-left lg:text-right'>
              <h3 className='font-bold text-xl'>Navigate</h3>
              <ul className='space-y-2 text-blue-200'>
                <li><a href="/about" className='hover:text-[#feb47b] transition-colors'>About the Project</a></li>
                <li><a href="/map" className='hover:text-[#feb47b] transition-colors'>Virtual Map</a></li>
                <li><a href="/tours" className='hover:text-[#feb47b] transition-colors'>Tours</a></li>
                <li><a href="/faq" className='hover:text-[#feb47b] transition-colors'>FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='max-w-7xl mx-auto mt-10 pt-8 border-t border-blue-800 flex flex-col lg:flex-row lg:justify-between items-start lg:items-center text-sm text-blue-300'>
            <p>© 2025 DEO Project. All Rights Reserved.</p>
            <div className='flex gap-4 mt-4 lg:mt-0'>
              <a href="/privacy" className='hover:text-white transition-colors'>Privacy Policy</a>
              <a href="/terms" className='hover:text-white transition-colors'>Terms of Service</a>
            </div>
          </div>
        </footer>

    </div>
  );
}
