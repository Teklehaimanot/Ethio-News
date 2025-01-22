import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemeContext } from "../utilities/ThemeProvider";

const Loading = ({ size }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={size ? size : "large"} color={theme.primary} />
    </View>
  );
};

export default Loading;
