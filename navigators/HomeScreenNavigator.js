import { Dimensions } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { color } from "../utilities/Colors";
import Post from "../screens/news/Post";
import CommentScreen from "../screens/comment/CommentScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterAccount from "../screens/auth/RegisterAccount";
import SearchScreen from "../screens/search/SearchScreen";
import ContactUs from "../screens/contactUs/ContactUs";
import DrawerNavigator from "./DrawerNavigator";

const { width } = Dimensions.get("window");

const Stack = createNativeStackNavigator();
const HomeScreenNavigator = ({ navigation }) => {
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
        name="Details"
        component={Post}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="comments"
        component={CommentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signUp"
        component={RegisterAccount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="contactUs"
        component={ContactUs}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default HomeScreenNavigator;
