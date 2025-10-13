import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200",
        error ? "border-error focus:border-error" : "border-slate-200 focus:border-primary",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;