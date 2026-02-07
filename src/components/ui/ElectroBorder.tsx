import React, { useId } from "react";

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
  const filterId = useId();
  const svgRadius = typeof radius === "number" ? radius : 16;
  const strokeWidth = Math.max(2, borderWidth);
  const distortionScale = Math.max(4, 10 * distortion);
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
      {effects && (
        <svg
          className="electro-border__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id={`${filterId}-noise`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="1"
                seed="3"
                result="noise"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={distortionScale} />
            </filter>
          </defs>
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx={svgRadius}
            ry={svgRadius}
            fill="none"
            stroke="var(--eb-color)"
            strokeWidth={strokeWidth}
            filter={`url(#${filterId}-noise)`}
          />
        </svg>
      )}
      <div className="electro-border__content">{children}</div>
    </div>
  );
}
