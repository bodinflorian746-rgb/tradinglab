import Image from "next/image";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: { width: 160, height: 45 },
  md: { width: 200, height: 57 },
  lg: { width: 240, height: 68 },
} as const;

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const { width, height } = SIZES[size];
  return (
    <Image
      src="/branding/tradescalex-logo.png"
      alt="TradeScaleX"
      width={width}
      height={height}
      priority
      className={`object-contain ${className}`}
    />
  );
}
