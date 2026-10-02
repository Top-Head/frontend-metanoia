"use client";

import { useState } from "react";
import clsx from "clsx";

interface HeroVideoProps {
  src: string;
  className?: string;
}

export function HeroVideo({ src, className }: HeroVideoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      preload="metadata"
      onError={() => setHasError(true)}
      className={clsx(
        "h-full w-full object-cover motion-reduce:hidden",
        hasError && "hidden",
        className
      )}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}