import React from "react";
import { View, Text, Button, StyleSheet, Alert, Image } from "react-native";

const BookMarks = () => {
  const handleButtonClick = () => {
    Alert.alert("Feature Coming Soon!", "Stay tuned for updates.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bookmarks Feature is Under Development</Text>
      <Button title="Notify Me" onPress={handleButtonClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 18,
  },
});

export default BookMarks;
