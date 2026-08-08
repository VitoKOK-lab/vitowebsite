"use client";

import * as React from "react";

/**
 * 對應 Claude Design 專案的 image-slot.js:
 * 優先載入 public/assets/ 下的正式設計素材(hero-banner.jpg、
 * celestial-astrolabe-gold.png、motif-gold.png、logo-black.png),
 * 素材尚未放入時以金線 SVG 佔位圖優雅退場。
 */

import { assetUrl } from "./asset";

export function ImageSlot({
  src,
  alt,
  className,
  imgClassName,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback: React.ReactNode;
}) {
  const [missing, setMissing] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // 圖片可能在 hydration 前就已載入失敗(error 事件不會重發),掛載後補檢查
  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <div className={className}>
      {missing ? (
        fallback
      ) : (
        // 靜態輸出 + images.unoptimized,直接用原生 img
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={assetUrl(src)}
          alt={alt}
          className={imgClassName}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}

/** 星盤金線裝飾(celestial-astrolabe-gold 佔位) */
export function AstrolabeArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="rgb(200 164 94)"
      aria-hidden
    >
      <circle cx="200" cy="200" r="190" strokeWidth="1" opacity="0.5" />
      <circle cx="200" cy="200" r="168" strokeWidth="0.75" opacity="0.35" />
      <circle cx="200" cy="200" r="140" strokeWidth="1.5" opacity="0.8" />
      <circle cx="200" cy="200" r="96" strokeWidth="0.75" opacity="0.5" />
      <circle cx="200" cy="200" r="52" strokeWidth="1" opacity="0.9" />
      {/* 刻度環 */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i * Math.PI) / 18;
        const r1 = i % 3 === 0 ? 176 : 182;
        return (
          <line
            key={i}
            x1={200 + r1 * Math.cos(a)}
            y1={200 + r1 * Math.sin(a)}
            x2={200 + 190 * Math.cos(a)}
            y2={200 + 190 * Math.sin(a)}
            strokeWidth="1"
            opacity="0.6"
          />
        );
      })}
      {/* 準線與指針 */}
      <line x1="200" y1="10" x2="200" y2="390" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="200" x2="390" y2="200" strokeWidth="0.5" opacity="0.3" />
      <path
        d="M200 60 L216 200 L200 340 L184 200 Z"
        strokeWidth="1.25"
        opacity="0.85"
      />
      <circle cx="200" cy="200" r="8" fill="rgb(229 201 130)" stroke="none" />
      {/* 星點 */}
      {[
        [116, 96],
        [296, 132],
        [92, 268],
        [312, 292],
        [252, 72],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y} L${x + 1.8} ${y + 1.8} L${x} ${y + 6} L${x - 1.8} ${y + 1.8} L${x - 6} ${y} L${x - 1.8} ${y - 1.8} Z`}
          fill="rgb(229 201 130)"
          stroke="none"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

/** 幾何金紋(motif-gold 佔位) */
export function MotifArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="rgb(200 164 94)"
      aria-hidden
    >
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const cx = 70 + col * 130;
          const cy = 70 + row * 130;
          return (
            <g key={`${row}-${col}`} opacity={0.35 + 0.2 * ((row + col) % 3)}>
              <rect
                x={cx - 42}
                y={cy - 42}
                width="84"
                height="84"
                strokeWidth="1"
                transform={`rotate(45 ${cx} ${cy})`}
              />
              <rect
                x={cx - 26}
                y={cy - 26}
                width="52"
                height="52"
                strokeWidth="0.75"
                transform={`rotate(45 ${cx} ${cy})`}
              />
              <circle cx={cx} cy={cy} r="9" strokeWidth="1" />
            </g>
          );
        })
      )}
    </svg>
  );
}

/** 曜石切面(LUXKEY 曜石系列佔位) */
export function ObsidianArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="rgb(200 164 94)"
      aria-hidden
    >
      <path
        d="M200 48 L318 130 L282 316 L118 316 L82 130 Z"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <path
        d="M200 48 L200 180 L318 130 M200 180 L282 316 M200 180 L118 316 M200 180 L82 130"
        strokeWidth="0.75"
        opacity="0.5"
      />
      <path
        d="M140 100 L166 88"
        stroke="rgb(229 201 130)"
        strokeWidth="2"
        opacity="0.9"
      />
    </svg>
  );
}
