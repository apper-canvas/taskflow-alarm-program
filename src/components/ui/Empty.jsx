import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, message, icon = "CheckCircle2", suggestions = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-8 mb-6"
      >
        <ApperIcon name={icon} size={64} className="text-primary" />
      </motion.div>
      <h3 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center mb-6 max-w-md">{message}</p>
      {suggestions.length > 0 && (
        <div className="space-y-2 w-full max-w-md">
          <p className="text-sm font-medium text-slate-700 mb-3">Try these:</p>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <ApperIcon name="Sparkles" size={16} className="text-primary" />
              <span className="text-sm text-slate-700">{suggestion}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Empty;