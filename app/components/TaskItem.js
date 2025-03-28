import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useRouter } from "expo-router";

export default function TaskItem({ task, onToggle, color}) {
  const router = useRouter();
  const [checked, setChecked] = useState(task.completed);

  return (
    <TouchableOpacity
      onPress={() => 
        router.push({
        pathname: `/task/${task._id}`,
        params: { color: encodeURIComponent(color) },
      })}
      className="flex-row items-center p-4 rounded-xl shadow-md"
      style={{ backgroundColor: color }}
    >
      <View className="ml-3 flex-1">
        <Text
          className="text-xl font-semibold"
          style={
            checked
              ? { textDecorationLine: "line-through", color: "#9CA3AF" }
              : { color: "#111827" }
          }
        >
          {task.title}
        </Text>
        <Text
          className="text-lg font-normal"
          numberOfLines={2}
          style={
            checked
              ? { textDecorationLine: "line-through", color: "#D1D5DB" }
              : { color: "#4B5563" }
          }
        >
          {task.content}
        </Text>

        {task.endDate && (
          <Text className="text-xs text-gray-500 mt-1"
          style={
            checked
              ? { textDecorationLine: "line-through", color: "#9CA3AF" }
              : { color: "#111827" }
          }>
            ⏳ Due: {new Date(task.endDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View>
        <BouncyCheckbox
          size={25} 
          isChecked={checked}
          fillColor="#4F46E5"
          unFillColor="transparent"
          iconStyle={{
            borderColor: "#4F46E5",
            borderWidth: 2,
            transform: [{ scale: 1 }], 
          }}
          innerIconStyle={{
            borderWidth: 0,
            transform: [{ scale:1.6 }], 
          }}
          onPress={(isChecked) => {
            setChecked(isChecked);
            onToggle(task._id, isChecked);
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
