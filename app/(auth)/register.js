import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import axios from "axios";
import icon from "../../assets/icon.png";

export default function RegisterScreen() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Attempting to register...");

      const response = await axios.post(
        "https://fake-form.onrender.com/api/todo/register",
        { email, password }
      );

      if (response.data.success) {
        login(response.data.token);
        Alert.alert("Success", "Account created successfully!");
        router.replace("/");
      } else {
        Alert.alert("Registration Failed", "Something went wrong.");
      }
    } catch (error) {
      console.log("Error response:", error.response?.data);
      console.log("Error message:", error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#B8AAFF]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-white rounded-2xl px-8 pb-8 w-11/12 max-w-md shadow-lg items-center">
            <View className="items-center">
              <Image source={icon} className="w-72 h-72" resizeMode="contain" />
            </View>

            <Text className="text-2xl font-semibold text-gray-800 mb-4">Create Account</Text>

            <TextInput
              className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 bg-gray-100"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              className="w-full border border-gray-300 p-4 mt-4 rounded-xl text-gray-800 bg-gray-100"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {loading ? (
              <ActivityIndicator size="large" color="blue" className="mt-4" />
            ) : (
              <TouchableOpacity
                onPress={handleRegister}
                className="bg-[#8d7aed] w-full mt-6 p-4 rounded-xl items-center shadow-md"
              >
                <Text className="text-white font-semibold text-lg">Register</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => router.replace("/login")}
              className="mt-4"
            >
              <Text className="text-blue-600 underline">
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
