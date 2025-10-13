import tasksData from "../mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const taskService = {
  getAll: async () => {
    await delay(300);
    return [...tasks];
  },

  getById: async (id) => {
    await delay(200);
    const task = tasks.find((t) => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  create: async (taskData) => {
    await delay(300);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
dueDate: taskData.dueDate || null,
      priority: taskData.priority || "medium",
      category: taskData.category || "personal",
      project: taskData.project || "General",
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    await delay(300);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = {
...tasks[index],
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      return { ...tasks[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(200);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  },

  toggleComplete: async (id) => {
    await delay(200);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      tasks[index].completedAt = tasks[index].completed ? new Date().toISOString() : null;
      tasks[index].updatedAt = new Date().toISOString();
      return { ...tasks[index] };
    }
    return null;
  }
};

export default taskService;