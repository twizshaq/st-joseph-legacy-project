"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Assets
import FacebookIcon from "@/public/icons/facebook-icon";
import loadingIcon from '@/public/loading-icon.png';

export default function Footer() {
    const [email, setEmail] = useState("");
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const handleJoinClick = async () => {
        if (!isValid) return;
        setIsSubmitting(true);
        setSubmissionMessage("");

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            setSubmissionMessage("Configuration error. Please try again later.");
            setIsSubmitting(false);
            return;
        }
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        try {
            const { error } = await supabase
                .from('subscribers')
                .insert({ email: email.trim() });

            if (error) throw error;

            setSubmissionMessage("Thank you for subscribing!");
            setEmail("");

        } catch (error: any) {
            if (error.code === '23505') {
                setSubmissionMessage("This email is already subscribed.");
            } else {
                console.error('Subscription error:', error);
                setSubmissionMessage("An error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className='bg-blue-900 text-white w-full mt-[100px] py-12 px-[4vw]'>
            <div className='max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10'>
                
                {/* Column 1: Identity & Contact 
                    FIX: Added 'items-center text-center' for mobile, and 'lg:items-start lg:text-left' for desktop.
                */}
                <div className='flex flex-col gap-4 items-center text-center lg:items-start lg:text-left'>
                    <h3 className='font-bold text-xl'>Unveiling Our Legacy</h3>
                    <p className='text-blue-200 text-sm'>A District Emergency Organization (DEO) Project.</p>
                    <div className="flex flex-col gap-1"> 
                        <h4 className='font-semibold mb-2'>Contact Us</h4>
                        {/* FIX: Removed invalid max-md class from href */}
                        <Link href="mailto:stjoseph.legacy@deo.gov.bb" className='text-blue-200 text-sm hover:underline'>
                            stjoseph.legacy@deo.gov.bb
                        </Link>
                        <p className='text-blue-200 text-sm'>(246) 123-4567</p>
                    </div>
                    <div>
                        <div className='flex items-center gap-4 mt-3'>
                            <Link href="https://www.instagram.com/dem.barbados" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                                <Image src="/icons/instagram-icon.svg" alt="Instagram Icon" height={35} width={35} />
                            </Link>
                            <Link href="https://www.facebook.com/dem246/" target="_blank" rel="noopener noreferrer" className='text-blue-300 hover:text-white'>
                                <FacebookIcon color="#FFFFFF" height={30} width={30} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Column 2: Get Involved + Stay Connected */}
                <div className='flex flex-col-reverse items-center lg:items-center gap-[40px]'>
                    {/* Get Involved */}
                    <div className='flex flex-col gap-4 w-full'>
                        <h3 className='font-bold text-xl text-center'>Get Involved</h3>
                        <ul className='space-y-2 text-blue-200 text-center'>
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
                        <button className='relative hover:scale-105 transition-transform duration-100 transform self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[180px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                            <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px]'>
                                <span className='text-white font-bold text-[1.1rem] bg-clip-text bg-[linear-gradient(to_right,#007BFF,#feb47b)]'>
                                    Contribute
                                </span>
                                <Image src="/icons/handheart-icon.svg" alt="Contribute" width={18} height={18} className='invert' />
                            </div>
                        </button>
                    </div>

                    {/* Stay Connected */}
                    <div className='flex flex-col gap-4 items-center lg:items-center w-full'>
                        <h3 className='font-bold text-xl'>Stay Connected</h3>
                        <p className='text-blue-200 text-sm text-center max-sm:max-w-[400px]'>Subscribe to our newsletter for project updates and email blasts.</p>
                        <div className="h-hit w-fit flex items-center justify-end relative mb-[0px]">
                            <input
                                type="email"
                                className="border-[2px] border-white/10 backdrop-blur-[5px] text-white font-semibold rounded-[30px] py-[15px] pl-[20px] pr-[130px] max-w-[80vw] w-[350px] outline-none bg-black/20"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={handleJoinClick}
                                disabled={isSubmitting || !isValid}
                                className={`
                                    absolute rounded-full py-[10px] px-[22px] mr-[7px] font-semibold
                                    transition-colors
                                    ${isSubmitting
                                        ? 'bg-transparent'
                                        : isValid
                                            ? 'bg-[#007BFF] hover:[#002347] text-white filter shadow-[0_0_7px_rgba(0,123,255,0.5)]'
                                            : 'bg-[#777]/30 text-white/30'
                                    }
                                    ${isSubmitting || !isValid ? "cursor-not-allowed" : "cursor-pointer"}
                                `}
                            >
                                {isSubmitting && (
                                    <div className="absolute inset-0 flex justify-end items-center right-[10px]">
                                        <Image src={loadingIcon} alt="Loading..." className="animation" width={26} height={26} />
                                    </div>
                                )}
                                <span className={isSubmitting ? 'invisible' : 'visible'}>
                                    Subscribe
                                </span>
                            </button>
                        </div>
                        {submissionMessage && (
                            <p className={`text-sm mt-2 lg:text-center font-bold w-full ${submissionMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                                {submissionMessage}
                            </p>
                        )}
                    </div>
                </div>

                {/* Column 3: Navigation */}
                <div className='flex flex-col gap-4 text-center lg:text-right'>
                    <h3 className='font-bold text-xl'>Navigate</h3>
                    <ul className='space-y-2 text-blue-200'>
                        <li><Link href="/credits" className='hover:text-[#feb47b] transition-colors'>Behind the Project</Link></li>
                        <li><Link href="/feedback" className='hover:text-[#feb47b] transition-colors'>Leave Feedback</Link></li>
                        <li><Link href="/tours" className='hover:text-[#feb47b] transition-colors'>Book a Tour</Link></li>
                        <li><Link href="/map" className='hover:text-[#feb47b] transition-colors'>Virtual Map</Link></li>
                        <li><Link href="/about-us" className='hover:text-[#feb47b] transition-colors'>About Us</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='max-w-7xl mx-auto mt-10 pt-8 border-t border-blue-800 flex flex-col lg:flex-row lg:justify-between items-center lg:items-center text-sm text-blue-300'>
                <p>© 2025 DEO Project. All Rights Reserved.</p>
                <div className='flex gap-4 mt-4 lg:mt-0'>
                    <Link href="/privacy" className='hover:text-white transition-colors'>Privacy Policy</Link>
                    <Link href="/terms" className='hover:text-white transition-colors'>Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};