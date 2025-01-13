import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../state/auth/authSlice";
import { StatusBar } from "react-native";
import { color } from "../utilities/Colors";
import HomeScreenNavigator from "./HomeScreenNavigator";

const RootNavigator = () => {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar backgroundColor={color.white} barStyle={"dark-content"} />
        <HomeScreenNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
