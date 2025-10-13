import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer",
        error ? "border-error focus:border-error" : "border-slate-200 focus:border-primary",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;