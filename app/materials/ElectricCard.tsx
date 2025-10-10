"use client";

import Link from "next/link";

interface ElectricCardProps {
  title: string;
  price: string;
  image?: string;
  link: string;
}

export default function ElectricCard({
  title,
  price,
  image,
  link,
}: ElectricCardProps) {
  return (
    <Link
      href={link}
      className="relative group cursor-pointer flex justify-center"
    >
      {/* Electric Turbulence Filter */}
      <svg className="absolute pointer-events-none">
        <defs>
          <filter
            id="turbulent-displace"
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise1"
              seed="1"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dy"
                values="700;0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise2"
              seed="2"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dy"
                values="0;-700"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feComposite
              in="offsetNoise1"
              in2="offsetNoise2"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="offsetNoise2"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {/* Card Container */}
      <div
        className="relative w-full h-[460px] rounded-3xl border-2 border-[#dd8448]/60 
          overflow-hidden transition-transform duration-500 hover:-translate-y-3"
        style={{
          background:
            "linear-gradient(-30deg, rgba(221,132,72,0.25), transparent, rgba(221,132,72,0.25)), linear-gradient(to bottom, #1a1a1a, #0e0e0e)",
        }}
      >
        {/* Outer electric glow */}
        <div className="absolute inset-0 rounded-3xl border-2 border-[#dd8448] blur-sm opacity-40 animate-pulse" />

        {/* Inner Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#050505]" />

        {/* Overlay shimmer glow */}
        <div className="absolute inset-0 rounded-3xl opacity-40 mix-blend-overlay bg-gradient-to-tr from-[#dd8448]/30 via-transparent to-[#dd8448]/20 filter blur-2xl pointer-events-none" />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col h-full justify-between text-center text-white">
          {/* Image Section */}
          <div className="w-full h-56 border-b border-[#dd8448]/30 overflow-hidden rounded-t-3xl">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                📘 No Cover
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-200 group-hover:text-[#dd8448] transition-colors duration-300 truncate">
              {title}
            </h3>
            <p className="text-2xl font-bold text-[#dd8448] mt-2">৳ {price}</p>
            <button
              className="mt-5 py-2 px-6 rounded-xl bg-[#dd8448] text-white font-semibold 
                shadow-md hover:bg-[#c4743f] transition-all duration-300"
            >
              বিস্তারিত দেখুন
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
