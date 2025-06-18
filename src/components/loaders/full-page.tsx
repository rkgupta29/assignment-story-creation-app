import { Loader2 } from "lucide-react";

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
      <Loader2 className="h-6 w-6 animate-spin" />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}
