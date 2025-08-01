import { Loader2 } from "lucide-react";
import BrandLogo from "../BrandLogo";

export default function FullPageLoader({
  text,
  direction = "right",
}: {
  text?: string;
  direction?: "right" | "left" | "top" | "bottom";
}) {
  const containerStyles = {
    right: "flex-row",
    left: "flex-row-reverse",
    top: "flex-col-reverse",
    bottom: "flex-col",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${containerStyles[direction]} gap-2`}
    >
      <BrandLogo height={400} width={400} />
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      {text && <p className="text-base text-primary font-medium">{text}</p>}
    </div>
  );
}
