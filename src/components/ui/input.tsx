import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-background/10 bg-foreground px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-normal placeholder:text-background/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-background/70 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-error focus-visible:ring-error",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
