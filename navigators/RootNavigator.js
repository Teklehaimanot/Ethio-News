import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../state/auth/authSlice";
import { StatusBar } from "react-native";
import HomeScreenNavigator from "./HomeScreenNavigator";
import { useFonts } from "expo-font";
import { ThemeContext } from "../utilities/ThemeProvider";

const RootNavigator = () => {
  const [fontsLoaded] = useFonts({
    "Figtree-Regular": require("../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-Bold": require("../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-SemiBold": require("../assets/fonts/Figtree-SemiBold.ttf"),
  });

  const { theme, isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    getUser()
      .then((res) => {
        const { user, token } = JSON.parse(res);
        if (res) {
          dispatch(login({ user, token }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg2 }}>
      {fontsLoaded && (
        <NavigationContainer>
          <StatusBar
            backgroundColor={theme.bg2}
            barStyle={isDark ? "light-content" : "dark-content"}
          />
          <HomeScreenNavigator />
        </NavigationContainer>
      )}
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
