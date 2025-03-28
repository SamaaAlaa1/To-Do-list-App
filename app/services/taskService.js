import axios from "axios";

const API_URL = "https://fake-form.onrender.com/api/todo";

export const fetchTasks = async (token) => {
  if (!token) throw new Error("Authentication failed. Please log in again.");

  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched tasks:", response.data.data); 
    return response.data.data || []; 
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch tasks.");
  }
};

export const fetchTask = async (id, token) => {
  if (!token) throw new Error("Authentication failed. Please log in again.");

  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching task:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch task.");
  }
};

export const updateTask = async (id, taskTitle, taskContent, token) => {
  if (!token) throw new Error("Authentication failed. Please log in again.");

  try {
    await axios.patch(
      `${API_URL}/${id}`,
      { title: taskTitle, content: taskContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update task.");
  }
};

export const deleteTask = async (id, token) => {
  if (!token) throw new Error("Authentication failed. Please log in again.");

  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete task.");
  }
};
