import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import Empty from "@/components/ui/Empty";

const TaskList = ({ tasks, onToggle, onEdit, onDelete, categories, showEmpty = true }) => {
  const getCategoryColor = (categoryName) => {
    const category = categories.find((c) => c.name === categoryName);
    return category ? category.color : "#6366F1";
  };

  if (tasks.length === 0 && showEmpty) {
    return (
      <Empty
        title="No tasks yet"
        message="Add your first task to get started with TaskFlow"
        icon="CheckCircle2"
        suggestions={[
          "Complete project proposal by Friday",
          "Buy groceries for the week",
          "Call dentist for appointment"
        ]}
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            categoryColor={getCategoryColor(task.category)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;