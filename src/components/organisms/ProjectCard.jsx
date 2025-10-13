import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const tags = project.Tags ? project.Tags.split(',').map(t => t.trim()).filter(t => t) : [];
  
  const tagColors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-yellow-100 text-yellow-700',
    'bg-indigo-100 text-indigo-700'
  ];

  const getTagColor = (index) => tagColors[index % tagColors.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {project.name_c || "Untitled Project"}
            </h3>
            {project.CreatedOn && (
              <p className="text-xs text-slate-500">
                Created {format(new Date(project.CreatedOn), "MMM d, yyyy")}
              </p>
            )}
          </div>
          <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
            <ApperIcon name="FolderOpen" size={20} className="text-primary" />
          </div>
        </div>

        {/* Description */}
        {project.description_c && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {project.description_c}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(index)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Edit" size={16} />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.Id)}
            className="flex-1 flex items-center justify-center gap-2 text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;