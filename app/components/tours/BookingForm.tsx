'use client'

import React, { useState, useRef, useEffect } from 'react';
import { format } from "date-fns";
import CustomCalendar from "@/app/components/tours/CustomCalendar"; 
import { ProfileIcon } from "@/public/icons/profile-icon"; 
import ArrowIcon from '@/public/icons/arrow-icon'; 
import { Tour } from '@/app/types/tours';
import { createClient } from '@/lib/supabase/client';

interface BookingFormProps {
  tour: Tour;
  user: any;
  guestCount: number;
  onGuestChange: (n: number) => void;
}

export default function BookingForm({ tour, user, guestCount, onGuestChange }: BookingFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBook = async () => {
    if (!fullName || !email || !phone) return alert("Fill all fields.");
    setIsBooking(true);
    try {
      const { error } = await supabase.from('bookings').insert([{
        tour_id: tour.id,
        user_id: user?.id || null,
        full_name: fullName, email, phone, notes,
        booking_date: selectedDate.toISOString(),
        guest_count: guestCount,
        total_price: tour.price * guestCount
      }]);
      if (error) throw error;
      alert("Booking successful!");
      setFullName(""); setEmail(""); setPhone(""); setNotes("");
    } catch (e:any) {
      alert("Error: " + e.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="w-full lg:w-1/3 h-full relative flex flex-col gap-4">
      <div>
        <button className="cursor-pointer bg-[#F5F5F5] hover:bg-[#E0E0E0] active:bg-[#E0E0E0] flex w-full text-left p-4 rounded-[30px]" onClick={() => setIsCalendarOpen(true)}>
          <div className="flex flex-col">
            <p className="flex items-center text-sm">Select a date & time <ArrowIcon className="rotate-180" color="#000" /></p>
            <p className="font-bold text-lg mt-[-2px]">{format(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <p className="absolute right-4 self-end font-[500] text-[#656565] text-[1.1rem]">{format(selectedDate, 'p')}</p>
        </button>
        <div className="absolute z-20">
          {isCalendarOpen && <CustomCalendar selectedDate={selectedDate} onChange={(d) => {setSelectedDate(d); setIsCalendarOpen(false)}} onClose={() => setIsCalendarOpen(false)} />}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <input type="text" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          
          <div ref={dropdownRef} className="relative">
            <button onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)} className="cursor-pointer flex items-center gap-2 p-1 pr-1 pl-4 bg-[#F5F5F5] hover:bg-[#E0E0E0] active:bg-[#E0E0E0] rounded-[20px] h-13 w-full sm:w-auto">
              <ProfileIcon size={24} color="#000000a5" />
              
              {/* --- UPDATED SECTION START --- */}
              <span className="flex items-center justify-center font-[600] text-[#000]/70 text-[1.1rem] min-w-[26px]">
                {guestCount === 10 ? (
                  <div className="relative">
                    10
                    <span className="absolute top-[-2px] right-[-8px] text-[0.65rem] font-bold">+</span>
                  </div>
                ) : (
                  guestCount
                )}
              </span>
              {/* --- UPDATED SECTION END --- */}

              <div className="pr-1"><svg className={`h-7 w-7 opacity-70 transition-transform ${isGuestDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></div>
            </button>
            {isGuestDropdownOpen && (
              <div className='absolute ml-[7px] bg-white/10 mt-[5px] backdrop-blur-[10px] rounded-[28px] p-[3px] z-[99] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]'>
                <div className="bg-black/40 rounded-[25px] w-[85px] max-h-48 overflow-y-auto pb-2 pt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button 
                      key={n} 
                      className="block w-[90%] mx-auto cursor-pointer text-white p-2 hover:bg-white/20 active:bg-white/20 active:scale-[.95] rounded-[17px] font-[600]" 
                      onClick={() => { onGuestChange(n); setIsGuestDropdownOpen(false); }}
                    >
                      {/* You can also apply the styling here if desired, but "10 +" text is usually clearer for lists */}
                      {n === 10 ? "10 +" : n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <input type="tel" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="email" className="p-3 px-4 bg-[#F5F5F5] rounded-[20px] h-13 w-full outline-none font-medium" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea placeholder="Notes" className="resize-none w-full outline-none h-24 font-medium p-3 px-4 bg-[#F5F5F5] rounded-[20px]" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      </div>

      <div className="mt-0 flex justify-center">
        <button onClick={handleBook} disabled={isBooking} className={`active:scale-97 w-full cursor-pointer rounded-full p-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] ${isBooking ? 'opacity-50' : ''}`}>
          <div className='flex justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full py-[15px]'>
            <span className='text-white font-bold text-[1.1rem]'>{isBooking ? "Processing..." : "Book Tour"}</span>
          </div>
        </button>
      </div>
    </div>
  );
}