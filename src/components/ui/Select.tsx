// src/components/ui/Select.tsx
// This is a basic Select component. For a more robust solution, consider a UI library.
import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn utility is in utils.ts

// Basic Select component (the <select> element)
const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

// For the options within the select
const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.ComponentPropsWithoutRef<"option">
>(({ className, children, ...props }, ref) => (
  <option
    ref={ref}
    className={cn(
      "py-1.5 px-3 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </option>
));
SelectItem.displayName = "SelectItem";

// Simplified Trigger and Value are not strictly necessary for a basic <select> but kept for API consistency
const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-default",
      "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    {/* Simple dropdown icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 opacity-50 ml-2 pointer-events-none"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  // For a real select, this would typically be handled by the browser.
  // This component is mostly a placeholder for visual consistency if you layer styling.
  <div
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] rounded-md bg-popover text-popover-foreground shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectContent.displayName = "SelectContent";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
