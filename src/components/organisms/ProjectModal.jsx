import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    name_c: "",
    description_c: "",
    Tags: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name_c: project.name_c || "",
        description_c: project.description_c || "",
        Tags: project.Tags || ""
      });
    } else {
      setFormData({
        name_c: "",
        description_c: "",
        Tags: ""
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name_c.trim()) {
      newErrors.name_c = "Project name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
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
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="FolderOpen" size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {project ? "Edit Project" : "New Project"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-6">
              <FormField label="Project Name" required error={errors.name_c}>
                <Input
                  value={formData.name_c}
                  onChange={(e) => handleChange('name_c', e.target.value)}
                  placeholder="Enter project name"
                  className={errors.name_c ? 'border-error' : ''}
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={formData.description_c}
                  onChange={(e) => handleChange('description_c', e.target.value)}
                  placeholder="Describe your project..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </FormField>

              <FormField label="Tags" className="space-y-2">
                <Input
                  value={formData.Tags}
                  onChange={(e) => handleChange('Tags', e.target.value)}
                  placeholder="e.g., Development, Design, Marketing (comma-separated)"
                />
                <p className="text-xs text-slate-500">
                  Separate multiple tags with commas
                </p>
              </FormField>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              <ApperIcon name="Save" size={18} className="mr-2" />
              {project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;