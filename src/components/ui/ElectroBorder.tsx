import React from "react";

interface ElectroBorderProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  animationSpeed?: number;
  glowBlur?: number;
  auraBlur?: number;
  glow?: boolean;
  aura?: boolean;
  effects?: boolean;
  distortion?: number;
  radius?: number | string;
}

export default function ElectroBorder({
  children,
  className,
  borderColor = "#22d3ee",
  borderWidth = 2,
  animationSpeed = 1,
  glowBlur = 24,
  auraBlur = 48,
  glow = true,
  aura = true,
  effects = true,
  distortion = 1,
  radius = "1rem",
}: ElectroBorderProps) {
  const style = {
    "--eb-color": borderColor,
    "--eb-width": `${borderWidth}px`,
    "--eb-speed": animationSpeed,
    "--eb-glow": `${glowBlur}px`,
    "--eb-aura": `${auraBlur}px`,
    "--eb-distortion": distortion,
    "--eb-radius": typeof radius === "number" ? `${radius}px` : radius,
  } as React.CSSProperties;

  return (
    <div className={`electro-border ${className ?? ""}`} style={style}>
      {aura && <span className="electro-border__aura" aria-hidden="true" />}
      {glow && <span className="electro-border__glow" aria-hidden="true" />}
      {effects && <span className="electro-border__core" aria-hidden="true" />}
      <div className="electro-border__content">{children}</div>
    </div>
  );
}
