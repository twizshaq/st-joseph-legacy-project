// components/CustomCalendar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay,
  setHours,
  setMinutes
} from 'date-fns';
import ArrowIcon from '@/public/icons/arrow-icon'; // Adjust the import path as needed

// --- TIME PICKER SUB-COMPONENT (CORRECTED FOR BLUR) ---
interface TimePickerProps {
  onSelectTime: (time: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM'
];

const TimePicker: React.FC<TimePickerProps> = ({ onSelectTime, onClose, position }) => {
  return (
    // To make backdrop-blur work, the background color and the blur effect
    // must be on the SAME element. The previous nested structure prevented this.
    <div
      className='absolute bg-white/10 backdrop-blur-[10px] rounded-[27px] p-[3px] z-[99] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="w-full bg-black/40 rounded-[25px] overflow-hidden">
      <h3 className="font-bold text-center pt-3 pb-1 text-white">Select Time</h3>
      <div className="flex flex-col max-h-48 overflow-y-auto p-2">
        {availableTimes.map(time => (
          <button
            key={time}
            onClick={() => onSelectTime(time)}
            className="p-2 text-white w-[90px] font-semibold cursor-pointer rounded-[15px] hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};


// --- MAIN CALENDAR COMPONENT (CORRECTED FOR TRANSITION) ---
interface CustomCalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const [timePickerPosition, setTimePickerPosition] = useState<{ top: number; left: number } | null>(null);
  
  // NEW: State to control the visual transition of the calendar's opacity.
  const [isCalendarDimmed, setIsCalendarDimmed] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const calendarRef = useRef<HTMLDivElement>(null);

  // This effect ensures the fade-in and fade-out transitions work correctly.
  useEffect(() => {
    if (isTimePickerOpen) {
      // When the picker opens, wait a moment before applying the dimming effect.
      const timer = setTimeout(() => {
        setIsCalendarDimmed(true);
      }, 20); // A tiny delay is enough for the browser to catch up.
      return () => clearTimeout(timer);
    } else {
      // When the picker closes, remove the dimming effect immediately.
      setIsCalendarDimmed(false);
    }
  }, [isTimePickerOpen]);

  const handleDateClick = (day: Date, event: React.MouseEvent<HTMLDivElement>) => {
    const dayRect = event.currentTarget.getBoundingClientRect();
    const top = dayRect.bottom + window.scrollY + 5;
    const left = dayRect.left + window.scrollX + (dayRect.width / 2);

    setTimePickerPosition({ top, left });
    setTempSelectedDate(day);
    setIsTimePickerOpen(true); // This triggers the useEffect above.
  };
  
  const handleTimeSelect = (time: string) => {
    if (!tempSelectedDate) return;
    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const newDate = setMinutes(setHours(tempSelectedDate, hours), minutes);
    onChange(newDate);
  };
  
  const handleCloseTimePicker = () => {
    setIsTimePickerOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isTimePickerOpen && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, isTimePickerOpen]);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="cursor-pointer p-2 rounded-full hover:bg-white/20 active:bg-white/20 active:scale-95 transition-colors">
        <ArrowIcon className="-rotate-90 invert" />
      </button>
      <span className="font-bold text-lg text-white">{format(currentMonth, 'MMMM yyyy')}</span>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="cursor-pointer p-2 rounded-full hover:bg-white/20 active:bg-white/20 active:scale-95 transition-colors">
        <ArrowIcon className="rotate-90 invert" />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-white font-bold mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const days = eachDayOfInterval({ start: startDate, end: endOfWeek(endOfMonth(currentMonth)) });
    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            onClick={(e) => handleDateClick(day, e)}
            className={`
              p-2 text-center cursor-pointer rounded-full transition-colors duration-200 text-sm font-semibold
              ${!isSameMonth(day, currentMonth) ? 'text-white/40' : 'text-white'}
              ${isSameDay(day, selectedDate) && !isTimePickerOpen ? 'bg-[#007BFF] text-white' : ''}
              ${!isSameDay(day, selectedDate) && isToday(day) ? 'bg-white/20' : ''}
              ${isSameMonth(day, currentMonth) ? 'hover:bg-white/20 active:scale-95 active:bg-white/20' : ''}
            `}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className='bg-white/10 backdrop-blur-[10px] rounded-[43px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
        <div ref={calendarRef} className="relative w-[320px] bg-black/40 rounded-[40px] p-4 z-50 overflow-hidden">
          {/* The class now depends on the new 'isCalendarDimmed' state */}
          <div className={`transition-opacity duration-300 ${isCalendarDimmed ? 'opacity-50' : 'opacity-100'}`}>
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
          </div>
        </div>
      </div>

      {isClient && isTimePickerOpen && timePickerPosition && createPortal(
        <>
          <div className="fixed inset-0 z-50" onClick={handleCloseTimePicker} />
          <TimePicker
            position={timePickerPosition}
            onSelectTime={handleTimeSelect}
            onClose={handleCloseTimePicker}
          />
        </>,
        document.body
      )}
    </>
  );
};

export default CustomCalendar;