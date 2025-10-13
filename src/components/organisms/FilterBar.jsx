import { motion } from "framer-motion";
import CategoryChip from "@/components/molecules/CategoryChip";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 shadow-card space-y-4"
    >
      <div className="flex flex-wrap gap-2">
        <CategoryChip
          category={{ name: "All", color: "#6366F1" }}
          active={!selectedCategory}
          onClick={() => onCategoryChange(null)}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category.Id}
            category={{ name: category.name_c, color: category.color_c }}
            active={selectedCategory === category.name_c}
            onClick={() => onCategoryChange(category.name_c)}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        <ApperIcon name="SlidersHorizontal" size={20} className="text-slate-600" />
        <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="createdAt">Recently Added</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Alphabetical</option>
        </Select>
      </div>
    </motion.div>
  );
};

export default FilterBar;