// components/room-view/SimpleCalendar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isBefore, 
  startOfDay, 
  differenceInDays, 
  isAfter 
} from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface SimpleCalendarProps {
  selectedRange: DateRange;
  onRangeSelect: (checkIn: Date | null, checkOut: Date | null) => void;
  bookedDates?: Date[];
  onClose?: () => void;
}

export default function SimpleCalendar({ 
  selectedRange, 
  onRangeSelect, 
  bookedDates = [], 
  onClose 
}: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  
  // Initialize with selected dates
  useEffect(() => {
    if (selectedRange.checkIn) {
      setCurrentMonth(selectedRange.checkIn);
    }
  }, []);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const today = startOfDay(new Date());
    
    // Don't allow selection of past dates or booked dates
    if (isBefore(date, today) || isDateBooked(date)) return;

    // If no check-in date is selected, or if we're selecting a new range
    if (!selectedRange.checkIn || (selectedRange.checkIn && selectedRange.checkOut)) {
      // Start new selection
      onRangeSelect(date, null);
    } else if (selectedRange.checkIn && !selectedRange.checkOut) {
      // Selecting check-out
      if (isBefore(date, selectedRange.checkIn)) {
        // If clicked date is before check-in, swap them
        onRangeSelect(date, selectedRange.checkIn);
      } else {
        // Normal check-out selection
        onRangeSelect(selectedRange.checkIn, date);
      }
      // Auto-close after selecting both dates
      if (onClose) setTimeout(() => onClose(), 300);
    }
  };

  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const isDateInRange = (date: Date): boolean => {
    if (!selectedRange.checkIn || !selectedRange.checkOut) return false;
    return (
      (isAfter(date, selectedRange.checkIn) || isSameDay(date, selectedRange.checkIn)) &&
      (isBefore(date, selectedRange.checkOut) || isSameDay(date, selectedRange.checkOut))
    );
  };

  const isDateStart = (date: Date): boolean => {
    return selectedRange.checkIn ? isSameDay(date, selectedRange.checkIn) : false;
  };

  const isDateEnd = (date: Date): boolean => {
    return selectedRange.checkOut ? isSameDay(date, selectedRange.checkOut) : false;
  };

  const getDayClassName = (date: Date): string => {
    const baseClasses = "w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-xs font-medium transition-all duration-200";
    const today = startOfDay(new Date());
    const isToday = isSameDay(date, today);
    const isPast = isBefore(date, today);
    const booked = isDateBooked(date);
    const inRange = isDateInRange(date);
    const isStart = isDateStart(date);
    const isEnd = isDateEnd(date);

    if (booked) {
      return `${baseClasses} bg-red-50 text-red-400 cursor-not-allowed opacity-50`;
    }

    if (isPast) {
      return `${baseClasses} bg-gray-50 text-gray-400 cursor-not-allowed`;
    }

    if (isStart || isEnd) {
      return `${baseClasses} bg-[#283862] text-white font-bold rounded-full`;
    }

    if (inRange) {
      return `${baseClasses} bg-[#283862]/20 text-[#283862]`;
    }

    if (isToday) {
      return `${baseClasses} bg-[#c23535]/10 text-[#c23535] font-bold rounded-full border border-[#c23535]/30`;
    }

    if (!isSameMonth(date, currentMonth)) {
      return `${baseClasses} text-gray-300`;
    }

    return `${baseClasses} text-gray-700 hover:bg-gray-100 hover:rounded-full cursor-pointer`;
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const clearDates = () => {
    onRangeSelect(null, null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-[320px] max-w-[95vw] mx-auto">
      {/* Header */}
      <div className="bg-[#283862] text-white p-4">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <FaChevronLeft size={14} />
          </button>
          <h3 className="text-sm font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Next month"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
        
        
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-xs font-bold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const booked = isDateBooked(day);
            
            return (
              <div key={dayKey} className="flex justify-center">
                <button
                  onClick={() => handleDateClick(day)}
                  className={getDayClassName(day)}
                  disabled={isBefore(day, startOfDay(new Date())) || booked}
                  title={booked ? "Not available" : format(day, 'MMMM d, yyyy')}
                >
                  {format(day, 'd')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#283862]"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-100"></div>
              <span className="text-gray-600">Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
        <button
          onClick={clearDates}
          className="px-3 py-1.5 text-xs text-gray-600 hover:text-[#c23535] font-medium rounded hover:bg-gray-100 transition-colors"
        >
          Clear dates
        </button>
        
        <div className="flex gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 font-medium rounded hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#283862] hover:bg-[#1e2c4e] text-white text-xs font-bold rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}