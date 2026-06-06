"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface OptimizedImageSource {
  url?: string;
  path?: string;
  width: number;
  format?: "webp" | "avif" | "jpeg";
}

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  variants?: OptimizedImageSource[];
  fallbackSrc?: string;
}

function getVariantUrl(variant: OptimizedImageSource) {
  return variant.url || variant.path;
}

function buildSrcSet(variants: OptimizedImageSource[] = []) {
  return [...variants]
    .sort((a, b) => a.width - b.width)
    .map((variant) => {
      const url = getVariantUrl(variant);
      return url ? `${url} ${variant.width}w` : "";
    })
    .filter(Boolean)
    .join(", ");
}

export function OptimizedImage({
  src,
  alt,
  variants = [],
  fallbackSrc,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = "lazy",
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const srcSet = useMemo(() => buildSrcSet(variants), [variants]);
  const shouldUseVariants = Boolean(srcSet) && currentSrc !== fallbackSrc;

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      loading={loading}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
      {...(shouldUseVariants ? { srcSet } : {})}
    />
  );
}
