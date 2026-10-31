import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, Flame } from 'lucide-react';
import { WeatherCard } from './WeatherCard';

interface HeroBannerProps {
  onExploreMore: () => void;
  onOpenWeeklyDigest: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreMore,
  onOpenWeeklyDigest
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-3xl border border-[#8B2EFF]/30 shadow-2xl transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, #1C102A 0%, #100C14 60%, #170E22 100%)'
      }}
    >
      {/* Background Campus Sunset Image with Gradient Overlay & Parallax */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `scale(1.05) translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`
        }}
      >
        {/* Cinematic Sunset Campus Photography from Unsplash (legal & high res) */}
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
          alt="MIT Campus at Sunset"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter contrast-125"
          onError={(e) => {
            // CSS Fallback if network blocked
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Sunset Ambient Gradient Overlay: Charcoal, Dark Plum, Purple, Sunset Orange */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#100C14] via-[#1B1024]/90 to-[#100C14]/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#100C14] via-transparent to-[#8B2EFF]/15"></div>
      </div>

      {/* Floating Animated Ambient Glows */}
      <div 
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#8B2EFF]/30 to-[#FF38B8]/20 blur-3xl pointer-events-none animate-glow-pulse"
        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
      />
      <div 
        className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-[#FF8A24]/25 via-[#FFC857]/15 to-transparent blur-3xl pointer-events-none"
        style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
      />

      {/* Floating Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#FFC857] opacity-60 animate-float-slow"></span>
        <span className="absolute top-3/4 left-1/3 w-1.5 h-1.5 rounded-full bg-[#FF38B8] opacity-70 animate-float-reverse"></span>
        <span className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-[#B44CFF] opacity-50 animate-float-slow"></span>
        <span className="absolute top-2/3 right-1/5 w-2.5 h-2.5 rounded-full bg-[#22D3A6] opacity-40 animate-float-reverse"></span>
      </div>

      {/* Main Hero Content Grid: Left Text + Right Weather Card */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-center">
        
        {/* Left Side: Welcome Text, Slogan & CTA */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          
          {/* Decorative Slogan Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#8B2EFF]/25 via-[#FF38B8]/20 to-[#FF8A24]/20 border border-[#8B2EFF]/35 backdrop-blur-md shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#FF8A24]" />
            <span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#FFC857] via-[#FF8A24] to-[#FF38B8] bg-clip-text text-transparent">
              Dream Big, Achieve More
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <span className="text-base sm:text-lg font-semibold text-[#B9ADC9] flex items-center gap-2">
              Welcome to <span className="inline-block animate-bounce">👋</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Campus <span className="bg-gradient-to-r from-[#B44CFF] via-[#FF38B8] to-[#FF8A24] bg-clip-text text-transparent">Pulse</span>
            </h1>
            
            {/* Animated Gradient Accent Bar */}
            <div className="w-36 h-1.5 rounded-full bg-gradient-to-r from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] animate-pulse"></div>
          </div>

          <p className="text-base sm:text-lg font-bold text-[#F8F5FF] leading-snug">
            Your one-stop platform for campus life!
          </p>

          <p className="text-xs sm:text-sm text-[#B9ADC9] max-w-lg leading-relaxed">
            Stay connected, never miss an update. Ingest messy WhatsApp notices, track assignment deadlines, vote on campus polls, and collaborate across MIT Campus.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onExploreMore}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] hover:from-[#9D4DFF] hover:via-[#FF4FBF] hover:to-[#FFA04D] text-white font-bold text-sm shadow-lg shadow-[#8B2EFF]/30 hover:shadow-[#FF38B8]/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Explore More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenWeeklyDigest}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1B1024]/80 hover:bg-[#2A163B] border border-[#8B2EFF]/30 hover:border-[#FF38B8]/50 text-white font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FF8A24]" />
              <span>Weekly AI Digest</span>
            </button>
          </div>

        </div>

        {/* Right Side: Weather Card Widget */}
        <div className="lg:col-span-5 w-full">
          <WeatherCard />
        </div>

      </div>
    </div>
  );
};

