import React from "react";

interface PaskibraEmblemProps {
  className?: string;
  size?: number;
  customLogoUrl?: string;
}

export function PaskibraEmblem({
  className = "",
  size = 64,
  customLogoUrl,
}: PaskibraEmblemProps) {
  if (!customLogoUrl) {
    return null;
  }

  const logoSrc = customLogoUrl;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoSrc}
        alt="Logo Lambang PASGRADA"
        className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-200"
        loading="eager"
        onError={(e) => {
          // Fallback if custom logo fails to load
          const target = e.currentTarget;
          if (target.src !== "/assets/pasgrada-logo.svg") {
            target.src = "/assets/pasgrada-logo.svg";
          }
        }}
      />
    </div>
  );
}
