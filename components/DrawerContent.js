import React, { useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  Switch,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../state/auth/authSlice";
import axios from "axios";
import { baseUrl } from "../config";
import { ThemeContext } from "../utilities/ThemeProvider"; // Import ThemeContext
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const BASE_URL = baseUrl;

const CustomSidebarMenu = (props) => {
  const BASE_PATH =
    "https://firebasestorage.googleapis.com/v0/b/ndmc-mobile-5a8b5.appspot.com/o/profileImage";
  const profileImage =
    "%2Fplaystore-icon.png?alt=media&token=932b1226-aa06-4547-9e56-dff558b63496";

  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/v1/user/logout/${user.id}`
    );
    const { data } = response;
    if (data) {
      dispatch(logout());
      AsyncStorage.removeItem("token");
    } else {
      dispatch(logout());
      AsyncStorage.removeItem("token");
    }
  };

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1.2, { duration: 150 });
    setTimeout(() => {
      scale.value = withTiming(1, { duration: 150 });
    }, 150);
  }, [isDark]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(isDark ? 1 : 0.8, { duration: 150 }),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={[styles.profileContainer, { backgroundColor: theme.bg2 }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Image
            source={{ uri: BASE_PATH + profileImage }}
            style={styles.sideMenuProfileIcon}
          />
          <Animated.View
            style={[
              animatedStyle,
              {
                alignSelf: "center",
                marginVertical: 10,
                marginRight: 20,
              },
            ]}
          >
            <MaterialIcons
              style={{
                padding: 10,
                borderRadius: 50,
              }}
              name={isDark ? "dark-mode" : "light-mode"}
              size={28}
              color={isDark ? theme.active : theme.primary}
              onPress={toggleTheme}
            />
          </Animated.View>
        </View>
        {user ? (
          <View style={{ marginHorizontal: 20 }}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </Text>
            <Text style={[styles.userEmail, { color: theme.text2 }]}>
              {user.email}
            </Text>
          </View>
        ) : null}
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Contact Us"
          onPress={() => props.navigation.navigate("contactUs")}
          icon={() => <AntDesign name="mail" size={20} color={theme.text} />}
          labelStyle={[styles.drawerItemText, { color: theme.text }]}
        />
        <DrawerItem
          label="Rate Us"
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.teklehaimanot.ethionews"
            )
          }
          icon={() => <AntDesign name="staro" size={20} color={theme.text} />}
          labelStyle={[styles.drawerItemText, { color: theme.text }]}
        />

        {!user ? (
          <DrawerItem
            label="Login"
            onPress={() => props.navigation.navigate("login")}
            icon={() => <AntDesign name="login" size={24} color={theme.text} />}
            labelStyle={[styles.drawerItemText, { color: theme.text }]}
          />
        ) : (
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={() => (
              <AntDesign
                name="logout"
                size={24}
                color={theme.text}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            )}
            labelStyle={[styles.drawerItemText, { color: theme.text }]}
          />
        )}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    paddingBottom: 30,
    borderColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 3.05,
    elevation: 1,
    marginBottom: 40,
  },
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 70,
    height: 70,
    borderRadius: 50,
    alignSelf: "center",
    margin: 20,
  },
  userName: {
    fontFamily: "Figtree-Regular",
    fontSize: 20,
    lineHeight: 20,
  },
  userEmail: {
    fontFamily: "Figtree-Regular",
    fontSize: 16,
    lineHeight: 20,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomSidebarMenu;
