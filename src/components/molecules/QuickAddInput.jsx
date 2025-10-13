import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const QuickAddInput = ({ onAdd, loading }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onAdd(value.trim());
      setValue("");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          <ApperIcon name="Plus" size={20} />
        </div>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new task... (Press Enter)"
          className="pl-12 pr-12 h-14 text-base shadow-card"
          disabled={loading}
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <ApperIcon name="Send" size={18} />
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

export default QuickAddInput;