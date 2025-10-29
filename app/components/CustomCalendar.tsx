// components/CustomCalendar.tsx
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
import ArrowIcon from '@/public/icons/arrow-icon'; // Adjust the import path as needed

// Define the types for the component's props
interface CustomCalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    onChange(day); // Update the state in the parent component
    onClose(); // Close the calendar popup
  };

  // Effect to handle clicks outside of the calendar to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={prevMonth} className="p-2 cursor-pointer rounded-full active:bg-gray-300/60 hover:bg-gray-300/60 transition-colors">
        <ArrowIcon className="-rotate-90 invert" />
      </button>
      <span className="font-bold text-lg text-[#fff]">{format(currentMonth, 'MMMM yyyy')}</span>
      <button onClick={nextMonth} className="p-2 cursor-pointer rounded-full active:bg-gray-300/60 hover:bg-gray-300/60 transition-colors">
        <ArrowIcon className="rotate-90 invert" />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid font-bold grid-cols-7 gap-1 text-center text-sm text-white mb-2">
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
              p-2 text-center cursor-pointer rounded-full transition-colors text-sm font-[600]
              ${!isSameMonth(day, currentMonth) ? 'text-[#444]/60' : 'text-white'}
              ${isSameDay(day, selectedDate) ? 'bg-[#007BFF] text-white hover:bg-blue-600' : ''}
              ${!isSameDay(day, selectedDate) && isToday(day) ? 'bg-gray-200' : ''}
              ${!isSameDay(day, selectedDate) && isSameMonth(day, currentMonth) ? 'hover:bg-gray-300/60 active:bg-gray-300/60' : ''}
            `}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='bg-white/10 backdrop-blur-[10px] rounded-[43px] p-[3px] shadow-[0px_0px_10px_rgba(0,0,0,0.2)]'>
        <div ref={calendarRef} className="top-full w-[320px] bg-black/40 border border-gray-200 rounded-[40px] p-4 z-50">
        {renderHeader()}
        {renderDaysOfWeek()}
        {renderCells()}
        </div>
    </div>
  );
};

export default CustomCalendar;