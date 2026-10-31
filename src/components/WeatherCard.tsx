import React from 'react';
import { CloudSun, MapPin, Calendar, Sparkles, Wind, Droplets } from 'lucide-react';
import { getCurrentDateFormatted } from '../utils/dateUtils.ts';

export const WeatherCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#2D1645]/90 via-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/35 shadow-2xl backdrop-blur-xl group hover:border-[#FF38B8]/50 transition-all duration-300">
      {/* Ambient glowing orb */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-[#FF8A24]/30 via-[#FF38B8]/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

      {/* Header: Location & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#100C14]/70 border border-[#8B2EFF]/30 text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#FF8A24]" />
          <span className="font-bold text-white tracking-wide">Moradabad</span>
          <span className="text-[10px] text-[#B9ADC9]">Campus Zone</span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30">
          Demo Weather
        </span>
      </div>

      {/* Main Temp & Animated Weather Icon */}
      <div className="flex items-center justify-between gap-4 my-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              24
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FFC857] to-[#FF8A24] bg-clip-text text-transparent">
              °C
            </span>
          </div>
          <p className="text-sm font-semibold text-[#F8F5FF] mt-1 flex items-center gap-1.5">
            <span>Partly Cloudy</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A6]"></span>
          </p>
        </div>

        {/* Animated Sun & Cloud Illustration */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Glowing Sun behind */}
          <div className="absolute top-2 right-2 w-11 h-11 rounded-full bg-gradient-to-tr from-[#FF8A24] to-[#FFC857] shadow-lg shadow-[#FF8A24]/50 animate-pulse"></div>
          {/* Cloud in front */}
          <CloudSun className="relative z-10 w-16 h-16 text-[#F8F5FF] drop-shadow-[0_8px_12px_rgba(139,46,255,0.4)] animate-float-slow" />
        </div>
      </div>

      {/* Weather Metrics & Current Date */}
      <div className="pt-3 border-t border-[#8B2EFF]/20 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#B9ADC9]">
          <Calendar className="w-3.5 h-3.5 text-[#FF38B8]" />
          <span className="truncate">{getCurrentDateFormatted()}</span>
        </div>
        <div className="flex items-center justify-end gap-2 text-[#B9ADC9]">
          <Wind className="w-3.5 h-3.5 text-[#22D3A6]" />
          <span>8 km/h • 64%</span>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-center text-[#B9ADC9]/60 font-mono">
        Simulated campus meteorological feed • MIT Moradabad
      </div>
    </div>
  );
};

