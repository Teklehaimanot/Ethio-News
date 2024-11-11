import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { color } from "../utilities/Colors";
import CustomSidebarMenu from "../components/DrawerContent";
import HomeScreenNavigator from "./HomeScreenNavigator";
import BookMarks from "../screens/bookmarks/BookMarks";
import { View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EvilIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleRefresh = () => {
    navigation.navigate("Home", { refresh: true });
    togglePopup();
  };

  return (
    <Drawer.Navigator
      initialRouteName="News"
      screenOptions={{
        drawerInactiveTintColor: color.primary,
        drawerActiveTintColor: color.secondary,
        drawerActiveBackgroundColor: color.primary,
        drawerItemStyle: { marginVertical: 10 },
        drawerLabelStyle: { fontSize: 16 },
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: color.primary,
        },
        headerTintColor: color.secondary,
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="Home Page"
        component={HomeScreenNavigator}
        options={{
          drawerLabel: "Home",
          title: "Ethiopian News",
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={focused ? color.secondary : color.active}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EvilIcons
                name="search"
                size={28}
                color={color.white}
                onPress={() => navigation.navigate("search")}
                style={{ marginRight: 20 }}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={BookMarks}
        options={{
          drawerLabel: "Bookmarks",
          title: "Bookmarks",
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={20}
              color={focused ? color.secondary : color.active}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
