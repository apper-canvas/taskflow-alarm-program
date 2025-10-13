import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuickAddInput from "@/components/molecules/QuickAddInput";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/organisms/FilterBar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import ConfettiEffect from "@/components/organisms/ConfettiEffect";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || task.category === selectedCategory;
      const matchesStatus = showCompleted ? task.completed : !task.completed;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate": {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "title":
          return a.title.localeCompare(b.title);
        case "createdAt":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [tasks, searchQuery, selectedCategory, sortBy, showCompleted]);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleQuickAdd = async (title) => {
    try {
      const newTask = await taskService.create({ title });
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created!");
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id);
      setTasks((prev) =>
        prev.map((task) => (task.Id === id ? updatedTask : task))
      );
      if (updatedTask.completed) {
        setShowConfetti(true);
        toast.success("Task completed! 🎉");
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.Id, taskData);
        setTasks((prev) =>
          prev.map((task) => (task.Id === editingTask.Id ? updated : task))
        );
        toast.success("Task updated!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks((prev) => [newTask, ...prev]);
        toast.success("Task created!");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(id);
        setTasks((prev) => prev.filter((task) => task.Id !== id));
        toast.success("Task deleted");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl">
              <ApperIcon name="CheckCircle2" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-slate-600">Organize your day with minimal friction</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{activeTasks.length}</div>
              <div className="text-xs text-slate-600">Active</div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{completedTasks.length}</div>
              <div className="text-xs text-slate-600">Completed</div>
            </div>
          </div>
        </motion.header>

        <div className="space-y-4">
          <QuickAddInput onAdd={handleQuickAdd} loading={loading} />
          
          <div className="flex gap-3">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <Button variant="primary" onClick={handleNewTask} className="flex items-center gap-2">
              <ApperIcon name="Plus" size={20} />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>

          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Active Tasks ({activeTasks.length})
              </h2>
            </div>
            <TaskList
              tasks={filteredAndSortedTasks.filter((t) => !t.completed)}
              onToggle={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              categories={categories}
            />
          </div>

          {completedTasks.length > 0 && (
            <div>
              <motion.button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 text-slate-700 hover:text-primary transition-colors mb-4"
              >
                <ApperIcon
                  name={showCompleted ? "ChevronDown" : "ChevronRight"}
                  size={20}
                />
                <h2 className="text-xl font-semibold">
                  Completed Tasks ({completedTasks.length})
                </h2>
              </motion.button>
              <AnimatePresence>
                {showCompleted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <TaskList
                      tasks={filteredAndSortedTasks.filter((t) => t.completed)}
                      onToggle={handleToggleComplete}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      categories={categories}
                      showEmpty={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
      />

      <ConfettiEffect
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
};

export default TaskManager;