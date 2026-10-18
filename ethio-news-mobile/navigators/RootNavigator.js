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
  const [fontsLoaded, fontError] = useFonts({
    "Figtree-Regular": require("../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-Bold": require("../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-SemiBold": require("../assets/fonts/Figtree-SemiBold.ttf"),
  });

  const { theme, isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (fontError) {
      console.log("Font load error, continuing with system fonts:", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    getUser()
      .then((res) => {
        if (!res) return;
        const parsed = JSON.parse(res);
        if (parsed?.user && parsed?.token) {
          dispatch(login({ user: parsed.user, token: parsed.token }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const getUser = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg2 }}>
      {ready && (
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
