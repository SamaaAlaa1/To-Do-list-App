import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import { AuthContext } from "../../context/AuthContext";
import "../../global.css";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_URL = "https://fake-form.onrender.com/api/todo";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    completed: false,
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
    if (!user?.token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setFetching(true);

    try {
      // console.log( user.token);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // console.log("Fetched tasks:", response.data.data);
      setTasks(response.data.data || []);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to fetch tasks.");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

 
  const updateTaskStatus = async (taskId, completed) => {
    if (!user?.token) {
      router.replace("/login");
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/${taskId}`,
        { completed },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response?.data || error.message
      );
    }
    fetchTasks();
  };

  const addTask = async () => {
    if (!newTask.title.trim() || !newTask.content.trim()) {
      Alert.alert("Error", "Title and content are required!");
      return;
    }

    const formattedEndDate =
      newTask.endDate instanceof Date
        ? newTask.endDate.toISOString()
        : new Date().toISOString();

    try {
      const response = await axios.post(
        `${API_URL}/`,
        { ...newTask, endDate: formattedEndDate },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      setTasks((prevTasks) => [...prevTasks, response.data.task]);
      setNewTask({
        title: "",
        content: "",
        endDate: new Date().toISOString(),
        completed: false,
      });
      setShowInput(false);
      Keyboard.dismiss();
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to add task.");
    }
    fetchTasks();
  };

 

  const removeTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to delete task.");
    }
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const pastelColors = ["#E0BBE4", "#C2C3F3", "#AED7ED", "#E8DCF4", "#CDE7F0"];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-yellow-50 pt-[15%] pb-[8%] px-2">
        <Text className="text-2xl font-bold text-brown-700 text-center mb-4">
          To-Do List
        </Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item?._id || Math.random().toString()}
          renderItem={({ item, index }) => {
            if (!item) return null;
            const colorClass = pastelColors[index % pastelColors.length];

            return (
              <View className="p-4 rounded-lg shadow-md mb-3">
                <TaskItem
                  task={item}
                  onToggle={updateTaskStatus}
                  onDelete={removeTask}
                  color={colorClass}
                />
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {showInput && (
              <View className="bg-white p-4 rounded-lg shadow-md mt-4">
                <TextInput
                  value={newTask.title}
                  onChangeText={(text) =>
                    setNewTask({ ...newTask, title: text })
                  }
                  placeholder="Task Title"
                  className="w-full border border-gray-300 p-2 rounded-md mb-2 bg-gray-50"
                />
                <TextInput
                  value={newTask.content}
                  onChangeText={(text) =>
                    setNewTask({ ...newTask, content: text })
                  }
                  placeholder="Task Content"
                  className="w-full border border-gray-300 p-2 rounded-md mb-2 bg-gray-50"
                />

                <Text className="text-sm text-gray-700 mb-2">
                  🗓️ Due:{" "}
                  {newTask.endDate
                    ? new Date(newTask.endDate).toLocaleString() 
                    : new Date().toLocaleString()}{" "}
                </Text>

                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="p-2 bg-[#F6EBCF] rounded-XL mb-2"
                >
                  <Text className="text-center font-bold text-brown-700">
                    📅 Pick a Due Date
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={
                      newTask.endDate ? new Date(newTask.endDate) : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setNewTask({
                          ...newTask,
                          endDate: selectedDate.toISOString(),
                        });
                      }
                    }}
                  />
                )}

                <TouchableOpacity
                  onPress={addTask}
                  className="p-3 bg-[#7BBBFE] rounded-xl items-center"
                >
                  <Text className="text-white font-bold">➕ Add Task</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setShowInput(!showInput)}
              className="mt-4 p-4 bg-[#0E1836] rounded-2xl items-center"
            >
              <Text className="text-white font-bold">
                {showInput ? "❌ Cancel" : "➕ New Task"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
