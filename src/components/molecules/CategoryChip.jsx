import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const CategoryChip = ({ category, active, onClick, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        active
          ? "text-white shadow-md"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200",
        className
      )}
      style={active ? { backgroundColor: category.color, focusRing: category.color } : {}}
    >
      {category.name}
    </motion.button>
  );
};

export default CategoryChip;