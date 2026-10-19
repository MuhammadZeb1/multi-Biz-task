
import api from "./api";

const getTasks = async (filters = {}) => {
  const response = await api.get("/tasks", { params: filters });
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

const updateTask = async ({ id, data }) => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

const getDashboard = async () => {
  const response = await api.get("/tasks/dashboard");
  return response.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboard,
};

export default taskService;
