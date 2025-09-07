import React from "react";
import { cn } from "@/lib/utils";

export const PulsatingButton = React.forwardRef((
  {
    className,
    children,
    pulseColor = "255, 255, 255",
    duration = "1.5s",
    ...props
  },
  ref,
) => {
  return (
    <button
      ref={ref}
      className={cn(
        "relative cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center overflow-visible",
        className
      )}
      style={{
        "--pulse-color": pulseColor,
        "--duration": duration,
        animation: `pulsate ${duration} infinite`,
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
});

PulsatingButton.displayName = "PulsatingButton";