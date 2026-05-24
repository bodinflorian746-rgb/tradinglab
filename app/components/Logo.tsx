import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  // Conservé pour compat API. La tagline fait partie du PNG officiel.
  showTagline?: boolean;
}

// Tailles responsives :
//   sm  → navbar (160px mobile, 200px desktop)
//   md  → footer (200px)
//   lg  → hero (320px)
// Ratio strictement préservé via h-auto + intrinsic dimensions.
const SIZE_CLASSES = {
  sm: "w-[160px] md:w-[200px]",
  md: "w-[200px]",
  lg: "w-[320px]",
} as const;

const LOGO_SRC = "/branding/tradescalex-logo.png";
const LOGO_INTRINSIC = { width: 1536, height: 614 } as const;

export default function Logo({ size = "md" }: LogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="TradeScaleX"
      width={LOGO_INTRINSIC.width}
      height={LOGO_INTRINSIC.height}
      priority
      className={`${SIZE_CLASSES[size]} h-auto max-w-full object-contain select-none`}
    />
  );
}
