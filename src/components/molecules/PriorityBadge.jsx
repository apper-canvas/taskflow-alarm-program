import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const variants = {
    high: "bg-error",
    medium: "bg-warning",
    low: "bg-slate-400"
  };

  const labels = {
    high: "High",
    medium: "Medium",
    low: "Low"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", variants[priority])}></div>
      <span className="text-sm text-slate-600">{labels[priority]}</span>
    </div>
  );
};

export default PriorityBadge;