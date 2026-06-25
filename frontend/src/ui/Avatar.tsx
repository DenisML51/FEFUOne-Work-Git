import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface AvatarProps {
  initials: string;
  src?: string | null | undefined;
  alt?: string | undefined;
  className?: string;
}

export function Avatar({ initials, src, alt, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const showImage = src && !failed;

  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-ink text-xs font-semibold text-white",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? initials}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}
