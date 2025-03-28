import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import axios from "axios";

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
        const token = response.data.token;
        login(token);
        console.log("Token received:", token);
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
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold ">Register</Text>
      <TextInput
        className="w-80 border p-2 mt-4 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-80 border p-2 mt-4 rounded"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" color="blue" className="mt-4" />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
    </View>
  );
}
