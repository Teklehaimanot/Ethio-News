import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../utilities/Colors";
import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const { width } = Dimensions.get("window");
const ContactUs = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL("mailto:kelaltech24@gmail.com?subject=Support Request");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+251712284904");
  };
  const handleTelegramPress = () => {
    Linking.openURL("https://t.me/Kelal_tech");
  };

  const handleTikTokPress = () => {
    Linking.openURL("https://www.tiktok.com/@ethiopian__news");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="arrow-left"
            size={24}
            color={color.fontColor}
            onPress={() => navigation.goBack()}
            style={{ marginRight: 15 }}
          />
          <Text style={styles.title}>Contact Us</Text>
        </View>
      </View>
      <View style={styles.contactUscontainer}>
        <View style={styles.emailCard}>
          <Text style={styles.emailText}>Email</Text>
          <Ionicons name="mail-outline" size={24} color={color.primary} />
        </View>
        <TouchableOpacity
          onPress={handleEmailPress}
          style={{ paddingHorizontal: 15 }}
        >
          <Text style={{ color: color.primary }}>kelaltech24@gmail.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactUscontainer}>
        <View style={styles.emailCard}>
          <Text style={styles.emailText}>Pone number</Text>
          <Ionicons name="call-outline" size={24} color={color.primary} />
        </View>
        <TouchableOpacity
          onPress={handlePhonePress}
          style={{ paddingHorizontal: 15 }}
        >
          <Text style={{ color: color.primary }}>+251 71 228 4904</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactUscontainer}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 15,
            alignItems: "center",
          }}
        >
          {/* <TouchableOpacity
            onPress={handleEmailPress}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="mail-outline" size={32} color={color.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePhonePress}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="call-outline" size={32} color={color.fontColor} />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={handleTelegramPress}
            style={{ marginRight: 20 }}
          >
            <FontAwesome name="telegram" size={28} color={color.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTikTokPress}>
            <FontAwesome5 name="tiktok" size={28} color={color.fontColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    backgroundColor: color.white,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  title: {
    color: color.fontColor,
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
  },

  contactUscontainer: {
    width: width * 0.92,
    marginHorizontal: "auto",
    borderWidth: 0.5,
    borderColor: color.sourceColor,
    paddingVertical: 30,
    borderRadius: 8,
    marginTop: 25,
    // height: 80,
  },
  emailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "auto",
    paddingHorizontal: 15,
  },
  emailText: {
    fontFamily: "Figtree-Regular",
    fontSize: 16,
    lineHeight: 19.2,
    color: color.fontColor,
    paddingBottom: 10,
  },
});

export default ContactUs;
