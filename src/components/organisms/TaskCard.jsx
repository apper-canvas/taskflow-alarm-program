import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, onToggle, onEdit, onDelete, categoryColor }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 border-l-4",
        task.completed && "opacity-60"
      )}
      style={{ borderLeftColor: categoryColor }}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox checked={task.completed} onChange={() => onToggle(task.Id)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-base font-semibold text-slate-900 mb-1",
            task.completed && "line-through text-slate-500"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3">
            <PriorityBadge priority={task.priority} />
            
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1.5 text-sm",
                isOverdue ? "text-error font-medium" : "text-slate-600"
              )}>
                <ApperIcon name="Calendar" size={14} />
                <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <ApperIcon name="Tag" size={14} />
              <span className="capitalize">{task.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} className="text-slate-600" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.Id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} className="text-error" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;