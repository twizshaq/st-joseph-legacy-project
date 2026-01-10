import React from 'react';
import Image from 'next/image';

export default function LegacyInfo() {
    return (
        <div className="w-[90vw] max-w-[1500px] text-slate-800 mx-auto mt-[70px] max-sm:mt-[-50px] flex flex-col lg:flex-row gap-12">
            {/* LEFT: Copy */}
            <div className="flex-1 max-w-[700px] max-sm:mt-[100px] flex flex-col">
                <h2 className="font-bold text-[2rem] max-sm:text-[1.5rem] mb-[14px] mt-[]">Unveiling Our Legacy</h2>
                <p className="max-w-[1000px]">
                    &quot;Unveiling Our Legacy&quot; is a community initiative led by the St. Joseph District Emergency Organisation (DEO). We have mapped key landmarks across the parish, from the Parris Hill Mural to historic churches and natural wonders. It is time for you to unlock:
                </p>
                <br />
                <div className="list-disc pl-6 md:pl-12 space-y-2">
                    <li>
                        <b>Our Culture:</b> Dive deep into the stories that make St. Joseph unique.
                    </li>
                    <li>
                        <b>Our Community:</b> Hear the voices of the community and learn directly from them. Join a network of neighbours, artists, and businesses working together to keep St. Joseph safe and thriving.
                    </li>
                    <li>
                        <b>Build Resilience:</b> Don&apos;t just look at the land, understand it. Critical data on local hazards (land slippage, coastal risks) and disaster management tips specific to that spot.
                    </li>
                </div>
                <br />
                {/* <br /> */}
                <div>
                    <p className="font-[700] text-[1.1rem]">Come Take A tour with us - Your Journey Through St. Joseph is Just a Scan Away</p>
                    <br />
                    <div className='list-disc pl-6 md:pl-12 space-y-2'>
                        <li className="font-[700]">Step 1: Find a Landmark</li>
                        <p>Look for the official &quot;Unveiling Our Legacy&quot; signs located at key historical and cultural points throughout St. Joseph. You’ll find them at places like the Parris Hill Mural, our historic churches, and major scenic lookouts.</p>
                        <br />
                        <li className="font-[700]">Step 2: Scan the QR Code</li>
                        <p>Open the camera app on your smartphone and point it at the QR Code on the sign. A link will pop up—simply tap it to unlock a wealth of information curated by the St. Joseph DEO. No special app is required!</p>
                        <br />
                        <li className="font-[700]">Step 3: Discover & Prepare</li>
                        <div>
                            Once the page opens, you can:
                            <div className='list-disc pl-6 md:pl-12 space-y-2 mt-[10px]'>
                                <li>Listen or Read: Dive into the cultural stories and history of that specific spot.</li>
                                <li>Get Safety Smart: View the &quot;Resilience Data&quot; for the area, including hazard tips and the location of the nearest emergency shelter.</li>
                            </div>
                        </div>
                    </div>
                    <br />
                    <p>Can’t make it in person?</p>
                    <p>You don’t have to be in St. Joseph to experience the magic. Use our Virtual Map right here on the website to click on any landmark and access the same rich content and safety resources from anywhere in the world.</p>
                    {/* <li>
                        <b>Our Community:</b> Hear the voices of the community and learn directly from them. Join a network of neighbours, artists, and businesses working together to keep St. Joseph safe and thriving.
                    </li>
                    <li>
                        <b>Build Resilience:</b> Don&apos;t just look at the land, understand it. Critical data on local hazards (land slippage, coastal risks) and disaster management tips specific to that spot.
                    </li> */}
                </div>

                {/* Mobile-Only Collage */}
                <div className="block lg:hidden relative max-w-[90vw] w-[560px] bg-red-500/0 aspect-[14/13] self-center mt-12 max-sm:right-[14px]">
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
                        <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
                        <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
                        <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
                    </div>
                    <div className="absolute w-[41%] h-[58%] top-[2%] right-[5%] rotate-[12deg]">
                        <div className="relative w-full h-full rounded-[30px] border-3 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                            <Image
                                src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG"}
                                alt=''
                                layout="fill"
                                style={{ objectFit: 'cover' }} // Or 'contain', 'fill', etc.
                                />
                        </div>
                    </div>
                    <div className="absolute w-[46%] h-[42%] top-[22%] left-[8%] -rotate-[10deg]">
                        <div className="relative w-full h-full rounded-[30px] border-3 border-white shadow-[0_2px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                            <Image
                                src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-2.JPG"}
                                alt=''
                                layout="fill"
                                style={{ objectFit: 'cover' }} // Or 'contain', 'fill', etc.
                                />
                        </div>
                    </div>
                    <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[12%] -rotate-[2deg]">
                        <div className="relative w-full h-full rounded-[30px] border-3 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                            <Image
                                src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-1.JPG"}
                                alt=''
                                layout="fill"
                                style={{ objectFit: 'cover' }} // Or 'contain', 'fill', etc.
                                />
                        </div>
                    </div>
                </div>

                {/* <h3 className="font-bold text-[2rem] max-sm:text-[1.5rem] mt-8 mb-2">About</h3>
                <p className="">
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="mt-4">
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <p className="mt-6">With some of the popular attractions being</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Tent Bay</li>
                    <li>Soup Bowl</li>
                    <li>Flower Forest Botanical Gardens</li>
                    <li>Andromeda Gardens</li>
                    <li>Hunte&apos;s Gardens</li>
                    <li>Cotton Tower Signal Station</li>
                </ul> */}
            </div>

            {/* RIGHT: Desktop-Only Collage */}
            <div className="hidden lg:block h-full relative flex-1 w-full max-w-[560px] aspect-[14/13] self-center my-12 lg:my-0">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        <div className="absolute w-[50%] h-[54%] top-[-5%] right-[5%] rounded-full bg-gradient-to-br from-[#2780F5]/30 to-[#F527B4]/50 blur-[80px]" />
                        <div className="absolute w-[54%] h-[58%] bottom-[30%] left-[5%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-400/30 blur-[90px]" />
                        <div className="absolute w-[50%] h-[54%] top-[50%] right-[5%] rounded-full bg-gradient-to-br from-[#00FF72]/30 to-[#A0F887]/30 blur-[80px]" />
                        <div className="absolute w-[44%] h-[48%] bottom-[-8%] left-[5%] rounded-full bg-gradient-to-tl from-[#0077FF]/50 to-[#0077FF]/50 blur-[90px]" />
                    </div>
                </div>
                <div className="absolute w-[41%] h-[58%] top-[2%] right-[5%] rotate-[12deg]">
                    <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                        <Image
                            src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/bathseba-1.JPG"}
                            alt=''
                            layout="fill"
                            style={{ objectFit: 'cover' }} // Or 'contain', 'fill', etc.
                            />
                    </div>
                </div>
                <div className="absolute w-[46%] h-[42%] top-[22%] left-[8%] -rotate-[10deg]">
                    <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                        <Image
                            src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-2.JPG"}
                            alt=''
                            layout="fill"
                            style={{ objectFit: 'cover' }} // Or 'contain', 'fill', etc.
                            />
                    </div>
                </div>
                <div className="absolute w-[53%] h-[38%] bottom-[5%] right-[12%] -rotate-[2deg]">
                    <div className="relative w-full h-full rounded-[38px] border-4 border-white shadow-[0_0px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white/50">
                        <Image
                            src={"https://st-joseph-site-assets.s3.us-east-2.amazonaws.com/home-page/joes-river-bridge-1.JPG"}
                            alt=''
                            layout="fill"
                            style={{ objectFit: 'cover' }} // Or 'contain', 'fill', etc.
                            />
                    </div>
                </div>
            </div>
        </div>
    );
}