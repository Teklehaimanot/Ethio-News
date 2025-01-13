import React, { useState } from "react";
import { Dimensions, TextInput, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from "../screens/home/Home";
import { color } from "../utilities/Colors";
import Post from "../screens/news/Post";
// import { useLayoutEffect } from "react";
import CommentScreen from "../screens/comment/CommentScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterAccount from "../screens/auth/RegisterAccount";
import SearchScreen from "../screens/search/SearchScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ContactUs from "../screens/contactUs/ContactUs";
import BookMarks from "../screens/bookmarks/BookMarks";
import DrawerNavigator from "./DrawerNavigator";

const { width } = Dimensions.get("window");

const Stack = createNativeStackNavigator();
const HomeScreenNavigator = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleSearchSubmit = (text) => {
    navigation.navigate("search", { query: text });
    // setSearchText("");
  };

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: color.white,
        },
        headerTintColor: color.black,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bookmarks"
        component={BookMarks}
        options={{
          headerShown: true,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="Details"
        component={Post}
        options={{
          headerShown: false,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="search"
        component={SearchScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: width * 0.8,
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 2,
                backgroundColor: color.gray,
                borderRadius: 15,
              }}
            >
              <TextInput
                style={{
                  backgroundColor: color.gray,
                  width: "90%",
                  borderRadius: 5,
                  paddingHorizontal: 8,
                }}
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearchChange}
                onSubmitEditing={() => handleSearchSubmit(searchText)}
              />
              {searchText && (
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color={color.black}
                  onPress={() => setSearchText("")}
                />
              )}
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="comments"
        component={CommentScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          headerShown: true,
          headerTitle: "Login",
        }}
      />
      <Stack.Screen
        name="signUp"
        component={RegisterAccount}
        options={{
          headerShown: true,
          headerTitle: " SignUp",
        }}
      />
      <Stack.Screen
        name="contactUs"
        component={ContactUs}
        options={{
          headerShown: true,
          headerTitle: " Contact Us",
        }}
      />
    </Stack.Navigator>
  );
};
export default HomeScreenNavigator;
