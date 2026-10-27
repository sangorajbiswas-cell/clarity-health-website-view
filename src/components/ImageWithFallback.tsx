import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string };

export function ImageWithFallback({ src, onError, ...props }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <img
      {...props}
      src={failedSrc === src || !src.trim() ? "/gym-fallback.svg" : src}
      onError={(event) => {
        if (failedSrc !== src) setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
