"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { categoryVisual } from "./category-visual";

interface CourseCoverProps {
  image?: string;
  categorySlug?: string;
  className?: string;
  iconSize?: number;
}

export function CourseCover({ image, categorySlug, className, iconSize = 28 }: CourseCoverProps) {
  const [failed, setFailed] = useState<string | null>(null);
  const { icon: Icon, tone } = categoryVisual(categorySlug);
  const showImage = Boolean(image) && failed !== image;

  return (
    <div className={clsx("relative overflow-hidden", !showImage && ["flex items-center justify-center", tone], className)}>
      {showImage ? (
        <Image
          src={image!}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, 100vw"
          onError={() => setFailed(image!)}
          className="object-cover"
        />
      ) : (
        <Icon size={iconSize} />
      )}
    </div>
  );
}
