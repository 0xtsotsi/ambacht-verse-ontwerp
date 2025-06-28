"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingBookingWidgetProps {
  className?: string
  onBookingClick?: () => void
}

export function FloatingBookingWidget({ 
  className, 
  onBookingClick 
}: FloatingBookingWidgetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    if (onBookingClick) {
      onBookingClick()
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
        className
      )}
    >
      {/* Main Widget Container */}
      <div
        className={cn(
          "relative bg-gradient-to-br from-white to-[#FFEFDA] rounded-3xl shadow-2xl",
          "border border-[#CC5D00]/20 backdrop-blur-sm",
          "transition-all duration-300 ease-out cursor-pointer group",
          "hover:shadow-[0_25px_50px_-12px_rgba(204,93,0,0.25)]",
          "hover:scale-105 hover:rotate-1",
          isHovered && "scale-105 rotate-1"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label="Reserveer vandaag - Open booking formulier"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {/* Elegant Corner Accent */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#CC5D00] rounded-full opacity-80 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2B4040] rounded-full" />
        
        {/* Content Container with Superior Typography Hierarchy */}
        <div className="px-8 py-6 space-y-4">
          {/* Primary Header - Baskerville Elegance */}
          <div className="text-center space-y-2">
            <h3 className={cn(
              "font-serif text-2xl font-bold text-[#2B4040] leading-tight",
              "tracking-tight"
            )}>
              Reserveer
            </h3>
            <div className={cn(
              "font-serif text-3xl font-black text-[#CC5D00] leading-none",
              "tracking-wider drop-shadow-sm"
            )}>
              Vandaag
            </div>
          </div>

          {/* Visual Separator with Hierarchy */}
          <div className="flex items-center justify-center space-x-2 py-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#CC5D00] to-transparent" />
            <ChefHat className="w-4 h-4 text-[#CC5D00]" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#CC5D00] to-transparent" />
          </div>

          {/* Secondary Information - Balanced Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3 text-[#2B4040]">
              <Calendar className="w-4 h-4 opacity-70" />
              <span className="font-sans text-sm font-medium tracking-wide">
                Beschikbaarheid Controleren
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-3 text-[#2B4040]">
              <Clock className="w-4 h-4 opacity-70" />
              <span className="font-sans text-xs font-normal opacity-80 tracking-wider">
                Binnen 24 uur reactie
              </span>
            </div>
          </div>

          {/* Call-to-Action with Sophisticated Spacing */}
          <div className="pt-2">
            <div className={cn(
              "bg-gradient-to-r from-[#CC5D00] to-[#BB3A3C] rounded-2xl",
              "px-6 py-3 transform transition-all duration-200",
              "group-hover:shadow-lg group-hover:scale-105"
            )}>
              <span className={cn(
                "block text-center font-sans text-sm font-bold text-white",
                "tracking-widest uppercase letter-spacing-2"
              )}>
                Check Uw Datum
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Professional Glow Effect */}
        <div className={cn(
          "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300",
          "bg-gradient-to-br from-[#CC5D00]/5 to-[#2B4040]/5",
          "group-hover:opacity-100"
        )} />
      </div>

      {/* Floating Animation Indicator */}
      <div className={cn(
        "absolute -bottom-2 left-1/2 transform -translate-x-1/2",
        "w-2 h-2 bg-[#CC5D00] rounded-full opacity-60",
        "animate-bounce"
      )} />
    </div>
  )
}