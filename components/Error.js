import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";

const Error = ({ message, refetch }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontFamily: "Figtree-Regular",
          fontSize: 16,
          color: color.sourceColor,
        }}
      >
        Error loading data. Please try again.
      </Text>
      <TouchableOpacity onPress={refetch}>
        <Text style={{ color: color.primary, marginTop: 10 }}>{message}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;
