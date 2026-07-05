"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * GSAP motion layer for the landing page. Wraps server-rendered content in a
 * `display:contents` scope (no layout impact) and animates elements by data-attr:
 *   data-hero          → staggered intro on load
 *   data-float         → gentle infinite float (hero phone)
 *   data-reveal        → single element reveal on scroll
 *   data-reveal-group  → children revealed with a stagger on scroll
 * Honors prefers-reduced-motion (skips all motion, content stays visible).
 */
export function LandingMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Hero intro
      gsap.from("[data-hero]", {
        y: 26,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.05,
      });

      // Hero phone — soft continuous float
      gsap.to("[data-float]", {
        y: -12,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Single-element scroll reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // Grid/list reveals — stagger the children
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          y: 26,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });

      // Floating WhatsApp button — pop in
      gsap.from("[data-wa-fab]", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.9,
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
