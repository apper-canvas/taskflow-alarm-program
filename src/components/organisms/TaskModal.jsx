import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const TaskModal = ({ isOpen, onClose, onSave, task, categories }) => {
  const [formData, setFormData] = useState({
title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "personal",
    project: "General"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        priority: task.priority,
category: task.category,
        project: task.project
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        category: "personal",
        project: "General"
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-slate-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-600" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <FormField label="Task Title" error={errors.title} required>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
                error={errors.title}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
              />
            </FormField>

            <FormField label="Due Date">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </FormField>

            <FormField label="Priority">
              <Select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormField>

            <FormField label="Category">
              <Select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.Id} value={category.name}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </option>
                ))}
              </Select>
</FormField>

            <FormField label="Project" required>
              <Input
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                placeholder="Enter project name"
              />
            </FormField>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;