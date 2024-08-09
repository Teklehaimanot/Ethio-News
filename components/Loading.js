import React from "react";
import { ActivityIndicator, View } from "react-native";
import { color } from "../utilities/Colors";

const Loading = ({ size }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={size ? size : "large"} color={color.primary} />
    </View>
  );
};

export default Loading;
