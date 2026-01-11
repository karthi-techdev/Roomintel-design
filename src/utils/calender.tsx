// components/room-view/SimpleCalendar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
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

  useEffect(() => {
    if (selectedRange.checkIn) {
      setCurrentMonth(selectedRange.checkIn);
    }
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isDateBooked = (date: Date) =>
    bookedDates.some(bookedDate => isSameDay(bookedDate, date));

  const handleDateClick = (date: Date) => {
    const today = startOfDay(new Date());

    if (
      isBefore(date, today) ||
      isDateBooked(date) ||
      !isSameMonth(date, currentMonth)
    ) return;

    if (!selectedRange.checkIn || selectedRange.checkOut) {
      onRangeSelect(date, null);
    } else {
      if (isBefore(date, selectedRange.checkIn)) {
        onRangeSelect(date, selectedRange.checkIn);
      } else {
        onRangeSelect(selectedRange.checkIn, date);
      }
      if (onClose) setTimeout(onClose, 300);
    }
  };

  const isInRange = (date: Date) =>
    selectedRange.checkIn &&
    selectedRange.checkOut &&
    (isAfter(date, selectedRange.checkIn) || isSameDay(date, selectedRange.checkIn)) &&
    (isBefore(date, selectedRange.checkOut) || isSameDay(date, selectedRange.checkOut));

  const getDayClass = (date: Date) => {
    const base = "w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-xs font-medium";

    if (!isSameMonth(date, currentMonth))
      return `${base} text-gray-300 bg-gray-50 cursor-not-allowed`;

    if (isDateBooked(date))
      return `${base} bg-red-100 text-red-400 cursor-not-allowed`;

    if (selectedRange.checkIn && isSameDay(date, selectedRange.checkIn))
      return `${base} bg-[#283862] text-white font-bold rounded-full`;

    if (selectedRange.checkOut && isSameDay(date, selectedRange.checkOut))
      return `${base} bg-[#283862] text-white font-bold rounded-full`;

    if (isInRange(date))
      return `${base} bg-[#283862]/20 text-[#283862]`;

    if (isSameDay(date, new Date()))
      return `${base} border border-[#c23535] text-[#c23535] rounded-full`;

    return `${base} text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer`;
  };

  // Proper calendar grid (Sunday aligned)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-[320px]">

      {/* Header */}
      <div className="bg-[#283862] text-white p-4 flex justify-between items-center">
        <button onClick={prevMonth}><FaChevronLeft /></button>
        <span className="font-bold">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={nextMonth}><FaChevronRight /></button>
      </div>

      {/* Days */}
      <div className="p-4">
        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-500 mb-2">
          {dayNames.map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map(d => (
            <button
              key={d.toISOString()}
              onClick={() => handleDateClick(d)}
              disabled={!isSameMonth(d, currentMonth) || isDateBooked(d)}
              className={getDayClass(d)}
            >
              {format(d, "d")}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3 flex justify-between bg-gray-50">
        <button onClick={() => onRangeSelect(null, null)} className="text-xs">Clear</button>
        <button onClick={onClose} className="bg-[#283862] text-white text-xs px-4 py-1 rounded">Done</button>
      </div>
    </div>
  );
}
