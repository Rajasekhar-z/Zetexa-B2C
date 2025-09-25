import { useEffect, useRef } from "react";
import {
  Headphones,
  Wifi,
  Infinity,
  CardSim,
  Signal
} from "lucide-react";

const features = [
  {
    icon: <Headphones className="text-black w-5 h-5" aria-hidden="true" />,
    text: "24x7 Customer Service",
  },
  {
    icon: <Wifi className="text-black w-5 h-5" aria-hidden="true" />,
    text: "Hotspot Sharing",
  },
  {
    icon: <Infinity className="text-black w-5 h-5" aria-hidden="true" />,
    text: "One eSIM for lifetime",
  },
  {
    icon: <CardSim className="text-black w-5 h-5" aria-hidden="true" />,
    text: "Magic SIM Available",
  },
  {
    icon: (
      <span className="flex items-center gap-0.5">
        <Signal className="text-black w-4 h-4" aria-hidden="true" />
      </span>
    ),
    text: "Data + Voice + SMS",
  },
];

export default function FeaturesMarqueeRibbon() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let start = 0;
    let trackWidth = track.scrollWidth;
    let containerWidth = track.offsetWidth;

    // Update widths on resize
    const handleResize = () => {
      if (!trackRef.current) return;
      trackWidth = trackRef.current.scrollWidth;
      containerWidth = trackRef.current.offsetWidth;
    };

    window.addEventListener("resize", handleResize);

    const step = () => {
      if (!trackRef.current) return;
      start -= 1; // speed in px per frame
      // When the leftmost edge of the track has fully scrolled out, reset
      if (Math.abs(start) >= (trackWidth / 2)) {
        start = 0;
      }
      trackRef.current.style.transform = `translateX(${start}px)`;
      animationRef.current = requestAnimationFrame(step);
    };

    // Duplicate the features to allow seamless looping
    // (already done in render, so nothing to do here)

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Duplicate features to allow seamless scroll
  // We need at least 2x the features to make the loop seamless
  const repeatedFeatures = [...features, ...features, ...features, ...features];

  return (
    <section
      className="overflow-hidden bg-[var(--brand-secondary-color,#f3f4f6)] w-full"
      role="region"
      aria-label="Key Features"
    >
      <div
        className="flex py-4 space-x-8 whitespace-nowrap will-change-transform transition-none"
        ref={trackRef}
        style={{
          // Prevent text selection while scrolling
          userSelect: "none",
        }}
      >
        {repeatedFeatures.map((f, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-black font-medium"
          >
            {f.icon}
            {f.text}
          </span>
        ))}
      </div>
    </section>
  );
}
