import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "data-mark" | "wordmark" | "connection-graph" | "trending-line" | "d-bars" | "d-trend" | "d-nodes" | "d-chart" | "d-pulse";
  size?: number;
  className?: string;
}

/**
 * Logo component with multiple design variants
 * All variants use currentColor for theme compatibility
 */
export function Logo({ variant = "data-mark", size = 28, className }: LogoProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: cn("shrink-0", className),
    "aria-hidden": true as const,
  };

  switch (variant) {
    // Option A: Abstract bar chart / data visualization element
    case "data-mark":
      return (
        <svg {...commonProps}>
          {/* Three bars of different heights with rounded tops */}
          <rect
            x="4"
            y="18"
            width="6"
            height="10"
            rx="2"
            fill="currentColor"
            opacity="0.6"
          />
          <rect
            x="13"
            y="10"
            width="6"
            height="18"
            rx="2"
            fill="currentColor"
            opacity="0.8"
          />
          <rect
            x="22"
            y="4"
            width="6"
            height="24"
            rx="2"
            fill="currentColor"
          />
        </svg>
      );

    // Option B: Stylized "d" with geometric accent (for danalytics)
    case "wordmark":
      return (
        <svg {...commonProps}>
          {/* Stylized lowercase 'd' with accent bar */}
          <path
            d="M22 6V26H18V24.5C16.8 25.8 15.2 26.5 13.5 26.5C9.4 26.5 6 23 6 18.5C6 14 9.4 10.5 13.5 10.5C15.2 10.5 16.8 11.2 18 12.5V6H22ZM14 22.5C16.2 22.5 18 20.7 18 18.5C18 16.3 16.2 14.5 14 14.5C11.8 14.5 10 16.3 10 18.5C10 20.7 11.8 22.5 14 22.5Z"
            fill="currentColor"
          />
          {/* Accent line */}
          <rect
            x="22"
            y="6"
            width="4"
            height="4"
            rx="1"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      );

    // Option C: Nodes connected by lines (data relationships)
    case "connection-graph":
      return (
        <svg {...commonProps}>
          {/* Connection lines */}
          <path
            d="M8 24L16 16M16 16L24 8M16 16L24 24M16 16L8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Center node */}
          <circle cx="16" cy="16" r="4" fill="currentColor" />
          {/* Corner nodes */}
          <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="24" cy="8" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="8" cy="24" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.7" />
        </svg>
      );

    // Option D: Upward trend with data point
    case "trending-line":
      return (
        <svg {...commonProps}>
          {/* Trend line going up */}
          <path
            d="M4 24L12 16L18 20L28 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Data points */}
          <circle cx="12" cy="16" r="2.5" fill="currentColor" opacity="0.5" />
          <circle cx="18" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
          {/* Highlight point at peak */}
          <circle cx="28" cy="8" r="3" fill="currentColor" />
          {/* Arrow head at the end */}
          <path
            d="M24 6L28 8L26 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      );

    // Hybrid: "d" with bar chart rising from the stem
    case "d-bars":
      return (
        <svg {...commonProps}>
          {/* Stylized 'd' */}
          <path
            d="M20 4V28H16V26C14.8 27.3 13.2 28 11.5 28C7.4 28 4 24.5 4 20C4 15.5 7.4 12 11.5 12C13.2 12 14.8 12.7 16 14V4H20ZM12 24C14.2 24 16 22.2 16 20C16 17.8 14.2 16 12 16C9.8 16 8 17.8 8 20C8 22.2 9.8 24 12 24Z"
            fill="currentColor"
          />
          {/* Mini bar chart on right side */}
          <rect x="23" y="20" width="3" height="8" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="27" y="14" width="3" height="14" rx="1" fill="currentColor" opacity="0.7" />
        </svg>
      );

    // Hybrid: "d" with trend line through it
    case "d-trend":
      return (
        <svg {...commonProps}>
          {/* Stylized 'd' */}
          <path
            d="M20 4V28H16V26C14.8 27.3 13.2 28 11.5 28C7.4 28 4 24.5 4 20C4 15.5 7.4 12 11.5 12C13.2 12 14.8 12.7 16 14V4H20ZM12 24C14.2 24 16 22.2 16 20C16 17.8 14.2 16 12 16C9.8 16 8 17.8 8 20C8 22.2 9.8 24 12 24Z"
            fill="currentColor"
          />
          {/* Trend line going up */}
          <path
            d="M6 26L14 20L22 22L28 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.6"
          />
          {/* Endpoint dot */}
          <circle cx="28" cy="10" r="2.5" fill="currentColor" />
        </svg>
      );

    // Hybrid: "d" with connected nodes
    case "d-nodes":
      return (
        <svg {...commonProps}>
          {/* Stylized 'd' */}
          <path
            d="M18 4V28H14V26C12.8 27.3 11.2 28 9.5 28C5.4 28 2 24.5 2 20C2 15.5 5.4 12 9.5 12C11.2 12 12.8 12.7 14 14V4H18ZM10 24C12.2 24 14 22.2 14 20C14 17.8 12.2 16 10 16C7.8 16 6 17.8 6 20C6 22.2 7.8 24 10 24Z"
            fill="currentColor"
          />
          {/* Connection lines */}
          <path
            d="M22 10L26 18M26 18L30 12M26 18L28 26"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Nodes */}
          <circle cx="22" cy="10" r="2.5" fill="currentColor" opacity="0.6" />
          <circle cx="26" cy="18" r="3" fill="currentColor" />
          <circle cx="30" cy="12" r="2" fill="currentColor" opacity="0.6" />
          <circle cx="28" cy="26" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      );

    // Hybrid: "d" with pie/donut chart element
    case "d-chart":
      return (
        <svg {...commonProps}>
          {/* Stylized 'd' */}
          <path
            d="M18 4V28H14V26C12.8 27.3 11.2 28 9.5 28C5.4 28 2 24.5 2 20C2 15.5 5.4 12 9.5 12C11.2 12 12.8 12.7 14 14V4H18ZM10 24C12.2 24 14 22.2 14 20C14 17.8 12.2 16 10 16C7.8 16 6 17.8 6 20C6 22.2 7.8 24 10 24Z"
            fill="currentColor"
          />
          {/* Donut chart segment */}
          <circle
            cx="25"
            cy="16"
            r="5"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M25 11A5 5 0 0 1 30 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    // Hybrid: "d" with data pulse/signal
    case "d-pulse":
      return (
        <svg {...commonProps}>
          {/* Stylized 'd' */}
          <path
            d="M18 4V28H14V26C12.8 27.3 11.2 28 9.5 28C5.4 28 2 24.5 2 20C2 15.5 5.4 12 9.5 12C11.2 12 12.8 12.7 14 14V4H18ZM10 24C12.2 24 14 22.2 14 20C14 17.8 12.2 16 10 16C7.8 16 6 17.8 6 20C6 22.2 7.8 24 10 24Z"
            fill="currentColor"
          />
          {/* Pulse/signal line */}
          <path
            d="M21 18H23L24 12L26 24L28 16H30"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    default:
      return null;
  }
}

export type { LogoProps };
