import { useState } from "react";
import { HeartPulse } from "lucide-react";

export function ClinicImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Illustrative clinic image"}
        className={`flex items-center justify-center bg-sage-100 text-forest-700 ${className}`}
      >
        <HeartPulse size={32} strokeWidth={1.4} aria-hidden />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
