import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { color } from "../utilities/Colors";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../state/auth/authSlice";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { baseUrl } from "../config";

const BASE_URL = baseUrl;

console.log(BASE_URL);
const CustomSidebarMenu = (props) => {
  const BASE_PATH =
    "https://firebasestorage.googleapis.com/v0/b/ndmc-mobile-5a8b5.appspot.com/o/profileImage";
  const proileImage =
    "%2Fplaystore-icon.png?alt=media&token=932b1226-aa06-4547-9e56-dff558b63496";

  const { user } = useSelector((state) => state.auth);
  const basicUrl = BASE_URL;
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const response = await axios.get(
      `${basicUrl}/api/v1/user/logout/${user.id}`
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
  // console.log(basicUrl);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <View
        style={{
          backgroundColor: color.white,
          paddingBottom: 30,

          borderColor: color.white,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.05,
          shadowRadius: 3.05,
          elevation: 1,
          marginBottom: 40,
        }}
      >
        <Image
          source={{ uri: BASE_PATH + proileImage }}
          style={styles.sideMenuProfileIcon}
        />
        {user ? (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: color.fontColor,
                paddingHorizontal: 20,
                fontFamily: "Figtree-Regular",
                fontSize: 20,
                lineHeight: 20,
              }}
            >
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </Text>
            <Text
              style={{
                color: color.sourceColor,
                fontFamily: "Figtree-Regular",
                fontSize: 16,
                lineHeight: 20,
              }}
            >
              {user.email}
            </Text>
          </View>
        ) : (
          ""
        )}
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Contact Us"
          onPress={() => props.navigation.navigate("contactUs")}
          icon={() => <AntDesign name="mail" size={20} color={color.primary} />}
          labelStyle={styles.drawerItemText}
        />
        <DrawerItem
          label="Rate Us"
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.teklehaimanot.ethionews"
            )
          }
          icon={() => (
            <AntDesign name="staro" size={20} color={color.primary} />
          )}
          labelStyle={styles.drawerItemText}
        />

        {!user ? (
          <DrawerItem
            label="Login"
            onPress={() => props.navigation.navigate("login")}
            icon={() => (
              <AntDesign name="login" size={24} color={color.primary} />
            )}
            labelStyle={styles.drawerItemText}
          />
        ) : (
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={() => (
              <AntDesign
                name="logout"
                size={24}
                color={color.primary}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            )}
            labelStyle={styles.drawerItemText}
          />
        )}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: "center",
    backgroundColor: color.cameraBackground,
    margin: 20,
  },
  customItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: color.primary,
  },
  customLogout: {
    padding: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CustomSidebarMenu;
