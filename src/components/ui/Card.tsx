// src/components/ui/Card.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn utility is in utils.ts

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card", // Your defined utility class from globals.css
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
