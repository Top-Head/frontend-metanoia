"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export function CourseThumb({ title, image, className }: { title: string; image?: string; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  const showImage = Boolean(image) && failed !== image;
  const letters = title
    .split(/\s+/)
    .filter((word) => word.length > 2 || /^[A-Z0-9]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-rail font-display font-semibold text-white",
        className
      )}
    >
      {showImage ? (
        <Image src={image!} alt="" fill unoptimized sizes="96px" onError={() => setFailed(image!)} className="object-cover" />
      ) : (
        letters || title.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}
