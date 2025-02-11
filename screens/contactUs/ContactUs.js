import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ThemeContext } from "../../utilities/ThemeProvider";

const { width } = Dimensions.get("window");
const ContactUs = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
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
    <View style={[styles.container, { backgroundColor: theme.bg2 }]}>
      <View style={[styles.header, { backgroundColor: theme.bg2 }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          >
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: theme.text }]}>Contact Us</Text>
        </View>
      </View>
      <View style={[styles.contactUscontainer, { borderColor: theme.text2 }]}>
        <View style={styles.emailCard}>
          <Text style={[styles.emailText, { color: theme.text }]}>Email</Text>
          <TouchableOpacity
            onPress={handleEmailPress}
            style={{ paddingHorizontal: 15 }}
          >
            <Ionicons name="mail-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleEmailPress}
          style={{ paddingHorizontal: 15 }}
        >
          <Text
            style={{
              color: theme.primary,
              fontFamily: "Figtree-Regular",
              fontSize: 16,
              lineHeight: 19.2,
            }}
          >
            kelaltech24@gmail.com
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.contactUscontainer, { borderColor: theme.text2 }]}>
        <View style={styles.emailCard}>
          <Text style={[styles.emailText, { color: theme.text }]}>
            Pone number
          </Text>
          <TouchableOpacity
            onPress={handlePhonePress}
            style={{ paddingHorizontal: 15 }}
          >
            <Ionicons name="call-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handlePhonePress}
          style={{ paddingHorizontal: 15 }}
        >
          <Text
            style={{
              color: theme.primary,
              fontFamily: "Figtree-Regular",
              fontSize: 16,
              lineHeight: 19.2,
            }}
          >
            +251 71 228 4904
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.contactUscontainer, { borderColor: theme.text2 }]}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 15,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleTelegramPress}
            style={{
              marginRight: 20,
              backgroundColor: theme.active,
              borderRadius: 100,
            }}
          >
            <FontAwesome name="telegram" size={40} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTikTokPress}>
            <FontAwesome5 name="tiktok" size={40} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    // elevation: 1,
  },
  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
    marginHorizontal: 15,
  },
  backIcon: {
    marginRight: 15,
    paddingHorizontal: width * 0.04,
    paddingVertical: 6,
  },

  contactUscontainer: {
    width: width * 0.92,
    marginHorizontal: "auto",
    borderWidth: 0.5,

    paddingVertical: 30,
    borderRadius: 8,
    marginTop: 25,
  },
  emailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "auto",
    paddingHorizontal: 15,
  },
  emailText: {
    fontFamily: "Figtree-Regular",
    fontSize: 18,
    lineHeight: 19.2,
    paddingBottom: 10,
  },
});

export default ContactUs;
