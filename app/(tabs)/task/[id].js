import { View, Text, TextInput, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { fetchTask, updateTask, deleteTask, fetchTasks } from "../../services/taskService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

export default function TaskDetailsScreen() {
  const { user } = useContext(AuthContext);
  const { id, color } = useLocalSearchParams();
  const router = useRouter();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!user?.token) {
        Alert.alert("Error", "You need to log in first.");
        router.replace("/login");
        return;
      }

      try {
        const task = await fetchTask(id, user.token);
        setTaskTitle(task.title);
        setTaskContent(task.content);
        setEndDate(task.endDate || new Date().toISOString()); 
      } catch (error) {
        console.error(error);
        Alert.alert("Error", error.message);
      } finally {
        setFetching(false);
      }
    };

    loadTask();
  }, [id, user]);

  const refreshTasks = async () => {
    try {
      const updatedTasks = await fetchTasks(user.token);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!taskTitle.trim() || !taskContent.trim()) {
      Alert.alert("Error", "Title and content cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      await updateTask(id, taskTitle, taskContent, endDate, user.token);
      Alert.alert("Success", "Task updated!");
      router.replace({
        pathname: "/",
        params: { refresh: "true" },
      });
    } catch (error) {
      if (error.message.includes("Invalid Token")) {
        Alert.alert("Session Expired", "Please log in again.");
        router.replace("/login");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(id, user.token);
      Alert.alert("Deleted", "Task has been deleted.");
      refreshTasks();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (fetching) return <ActivityIndicator className="pt-[50%]" size="large" color="blue" />;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 pt-[40%]" style={{ backgroundColor: color }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-6 mx-4 mt-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Edit Task</Text>

          <TextInput
            className="border border-gray-300 bg-gray-50 p-3 rounded-lg text-lg mb-4"
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholder="Task Title"
            placeholderTextColor="#6b7280"
          />

          <TextInput
            className="border border-gray-300 bg-gray-50 p-3 rounded-lg text-lg mb-4"
            value={taskContent}
            onChangeText={setTaskContent}
            placeholder="Task Content"
            placeholderTextColor="#6b7280"
            multiline
          />

          <Text className="text-sm text-gray-700 mb-2">
            🗓️ Due: {new Date(endDate).toLocaleString()}
          </Text>

          <TouchableOpacity className="bg-blue-500 p-3 rounded-xl mb-4" onPress={() => setShowDatePicker(true)}>
            <Text className="text-center text-white font-semibold">📅 Change Due Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(endDate)}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate.toISOString());
                }
              }}
            />
          )}

          <TouchableOpacity
            className={`bg-blue-500 py-3 rounded-xl ${loading ? "opacity-50" : ""}`}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text className="text-center text-white font-semibold text-lg">Update Task</Text>
          </TouchableOpacity>

          <View className="my-2" />

          <TouchableOpacity className="bg-red-600 py-3 rounded-xl" onPress={handleDelete}>
            <Text className="text-center text-white font-semibold text-lg">Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
