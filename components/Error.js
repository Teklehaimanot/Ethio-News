import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";
import { ThemeContext } from "../utilities/ThemeProvider";

const Error = ({ message, refetch }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.bg,
      }}
    >
      <Text
        style={{
          fontFamily: "Figtree-Regular",
          fontSize: 16,
          color: theme.text2,
        }}
      >
        Error loading data. Please try again.
      </Text>
      <TouchableOpacity onPress={refetch}>
        <Text style={{ color: theme.primary, marginTop: 10 }}>{message}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;
