import { createDrawerNavigator } from "@react-navigation/drawer";
import { color } from "../utilities/Colors";
import CustomSidebarMenu from "../components/DrawerContent";
import BookMarks from "../screens/bookmarks/BookMarks";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/home/Home";
import { useContext } from "react";
import { ThemeContext } from "../utilities/ThemeProvider";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Drawer.Navigator
      initialRouteName="News"
      screenOptions={{
        drawerInactiveTintColor: theme.text,
        drawerActiveTintColor: theme.active,
        drawerActiveBackgroundColor: theme.primary,
        drawerItemStyle: { marginVertical: 10 },
        drawerLabelStyle: { fontSize: 16 },
        headerShown: false,
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen
        name="Home Page"
        component={Home}
        options={{
          drawerLabel: "Home",
          title: "Ethiopian News",
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={focused ? theme.active : theme.text}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={BookMarks}
        options={{
          drawerLabel: "Bookmarks",
          title: "Bookmarks",
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={20}
              color={focused ? theme.active : theme.text}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
