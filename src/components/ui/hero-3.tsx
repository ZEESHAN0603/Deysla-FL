"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "../../lib/utils";

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export interface BrandImageItem {
  name: string;
  logo: string;
  category?: string;
}

export interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images?: string[];
  brandItems?: BrandImageItem[];
  className?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
}

// Reusable Action Button styled with DEYSLA brand theme
const ActionButton = ({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) => {
  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="mt-4 sm:mt-5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#ff5e00] to-[#0052cc] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all focus:outline-hidden cursor-pointer"
    >
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

// The main animated marquee hero component
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images = [],
  brandItems,
  className,
  onCtaClick,
  ctaHref,
}) => {
  // Prepare cards: either from brandItems or plain images
  const cardsToDisplay: BrandImageItem[] =
    brandItems && brandItems.length > 0
      ? brandItems
      : images.map((src, i) => ({ name: `Brand ${i + 1}`, logo: src }));

  // Duplicate for seamless infinite marquee loop
  const duplicatedItems = [...cardsToDisplay, ...cardsToDisplay];

  return (
    <section
      className={cn(
        "relative w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[530px] overflow-hidden bg-slate-950 text-white flex flex-col items-center justify-between text-center px-4 pt-8 sm:pt-10 pb-4",
        className
      )}
    >
      {/* Background Cyber Grid & Radiant Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,94,0,0.22),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,82,204,0.25),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Top Content Zone */}
      <div className="z-10 flex flex-col items-center max-w-3xl mx-auto px-4 mt-1">
        {/* Tagline Badge */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] sm:text-xs font-mono font-semibold text-cyan-300 backdrop-blur-md shadow-2xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{tagline}</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight drop-shadow-md"
        >
          {typeof title === "string" ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.25 }}
          className="mt-3 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
        >
          {description}
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.35 }}
        >
          <ActionButton onClick={onCtaClick} href={ctaHref}>
            {ctaText}
          </ActionButton>
        </motion.div>
      </div>

      {/* Animated Brand Logo Marquee Showcase */}
      <div className="relative w-full mt-6 sm:mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex gap-3.5 sm:gap-5 py-2.5"
          animate={{
            x: ["0%", "-50%"],
            transition: {
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="relative w-36 sm:w-44 md:w-48 h-20 sm:h-24 md:h-26 flex-shrink-0 bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/40 shadow-md hover:shadow-lg hover:border-orange-400 transition-all flex flex-col items-center justify-center group"
              style={{
                rotate: `${index % 2 === 0 ? -1.2 : 1.2}deg`,
              }}
            >
              <div className="w-full h-11 sm:h-13 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-700 tracking-tight text-center truncate max-w-full mt-0.5">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedMarqueeHero;
