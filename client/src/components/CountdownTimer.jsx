import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function FlipCountdown({ targetDate, message }) {
  const target = dayjs(targetDate);

  const calculateTimeDifference = () => target.diff(dayjs(), "seconds");
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeDifference());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeDifference());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isPast = timeRemaining < 0;
  const absoluteTimeRemaining = Math.abs(timeRemaining);

  const formatTime = (seconds) => {
    const days = String(Math.floor(seconds / (60 * 60 * 24))).padStart(2, "0");
    const hours = String(
      Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
    ).padStart(2, "0");
    const minutes = String(Math.floor((seconds % (60 * 60)) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return { days, hours, minutes, secs };
  };

  const time = formatTime(absoluteTimeRemaining);

  return (
    <div className="h-auto flex items-center justify-center bg-transparent">
      {/* Desktop View */}
      <div className="hidden md:flex flex-col items-center space-y-6">
        <h1 className={`text-2xl text-center font-bold text-white/80 mb-3 glow-effect`}>
          {message}
        </h1>
        
        <div className="flex items-center space-x-6">
          <TimeSegment label="DAYS" value={time.days} isPast={isPast} />
          <SeparatorDots isPast={isPast} />
          <TimeSegment label="HOURS" value={time.hours} isPast={isPast} />
          <SeparatorDots isPast={isPast} />
          <TimeSegment label="MINUTES" value={time.minutes} isPast={isPast} />
          <SeparatorDots isPast={isPast} />
          <TimeSegment label="SECONDS" value={time.secs} isPast={isPast} />
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col items-center space-y-4 px-4 w-full">
        <h1 className={`text-2xl text-center font-bold text-white/80 mb-3 glow-effect`}>
          {message}
        </h1>

        <div className="w-full max-w-xs flex gap-3 items-center justify-center">
          <TimeSegment label="DAYS" value={time.days} isPast={isPast} />
          <TimeSegment label="HRS" value={time.hours} isPast={isPast} />
          <TimeSegment label="MIN" value={time.minutes} isPast={isPast} />
          <TimeSegment label="SEC" value={time.secs} isPast={isPast} />
        </div>
      </div>
    </div>
  );
}

const TimeSegment = ({ label, value, isPast }) => (
  <div className="flex flex-col items-center">
    <div className="flex space-x-1">
      {[...value].map((digit, index) => (
        <div 
          key={index}
          className={`w-8 h-12 md:w-16 md:h-20 flex items-center justify-center 
            text-xl md:text-2xl font-mono font-bold
            border-2 ${isPast ? "border-pink-600 text-pink-600" : "border-blue-600 text-blue-600"}
            rounded-md md:rounded-lg`}
        >
          {digit}
        </div>
      ))}
    </div>
    <span className={`text-xs md:text-sm mt-1 ${isPast ? "text-pink-600" : "text-blue-600"}`}>
      {label}
    </span>
  </div>
);

const SeparatorDots = ({ isPast }) => (
  <div className="flex mb-5 flex-col justify-center space-y-2">
    <div className={`w-2 h-2 rounded-full ${isPast ? "bg-pink-600" : "bg-blue-600"}`}></div>
    <div className={`w-2 h-2 rounded-full ${isPast ? "bg-pink-600" : "bg-blue-600"}`}></div>
  </div>
);
