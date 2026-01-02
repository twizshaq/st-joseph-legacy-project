// components/DatePicker.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  isSameDay
} from 'date-fns';
import ArrowIcon from '@/public/icons/arrow-icon'; 

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDateClick = (day: Date) => {
    onChange(day); // Select the date immediately
    onClose();     // Close the popup
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button 
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
        className="cursor-pointer p-2 rounded-full hover:bg-white/20 active:bg-white/20 active:scale-95 transition-colors"
      >
        <ArrowIcon className="-rotate-90" />
      </button>
      <span className="font-bold text-lg text-white">{format(currentMonth, 'MMMM yyyy')}</span>
      <button 
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
        className="cursor-pointer p-2 rounded-full hover:bg-white/20 active:bg-white/20 active:scale-95 transition-colors"
      >
        <ArrowIcon className="rotate-90" />
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
            onClick={() => handleDateClick(day)}
            className={`
              p-2 text-center cursor-pointer rounded-full transition-colors duration-200 text-sm font-semibold
              ${!isSameMonth(day, currentMonth) ? 'text-white/40' : 'text-white'}
              ${isSameDay(day, selectedDate) ? 'bg-[#007BFF] text-white' : ''}
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
    <div className='bg-white/10 rounded-[43px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
      <div ref={calendarRef} className="relative w-[320px] bg-[#424242] rounded-[40px] p-4 z-50 overflow-hidden">
        <div>
          {renderHeader()}
          {renderDaysOfWeek()}
          {renderCells()}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;