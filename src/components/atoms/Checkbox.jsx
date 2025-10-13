import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onChange}
      className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        checked ? "bg-success border-success" : "bg-white border-slate-300 hover:border-primary",
        className
      )}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <ApperIcon name="Check" size={14} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;