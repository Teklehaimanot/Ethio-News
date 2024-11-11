import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../utilities/Colors";

const ContactUs = () => {
  const handleEmailPress = () => {
    Linking.openURL("mailto:kelaltech24@gmail.com?subject=Support Request");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+251712284904");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.description}>
        Reach out to us for support or inquiries. We're here to help!
      </Text>

      <View style={styles.contactContainer}>
        <Ionicons name="mail-outline" size={24} color="#0066cc" />
        <TouchableOpacity
          onPress={handleEmailPress}
          style={styles.contactButton}
        >
          <Text style={styles.contactText}>kelaltech24@gmail.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactContainer}>
        <Ionicons name="call-outline" size={24} color="#0066cc" />
        <TouchableOpacity
          onPress={handlePhonePress}
          style={styles.contactButton}
        >
          <Text style={styles.contactText}>+251 71 228 4904</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        We typically respond within 2-3 business days.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: color.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: color.greenGray,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.secondary,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  contactButton: {
    marginLeft: 10,
    flex: 1,
  },
  contactText: {
    fontSize: 18,
    color: color.primary,
    textDecorationLine: "underline",
  },
  note: {
    marginTop: 20,
    color: color.greenGray,
    textAlign: "center",
  },
});

export default ContactUs;
