import { createDrawerNavigator } from "@react-navigation/drawer";
import { color } from "../utilities/Colors";
import CustomSidebarMenu from "../components/DrawerContent";
import HomeScreenNavigator from "./HomeScreenNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import BookMarks from "../screens/bookmarks/BookMarks";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.primary }}>
      <Drawer.Navigator
        initialRouteName="News"
        screenOptions={{
          drawerActiveTintColor: color.secondary,
          drawerActiveBackgroundColor: color.active,
          drawerItemStyle: { marginVertical: 5 },
          drawerLabelStyle: { fontSize: 16 },

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
            title: " Ethiopian News",
          }}
        />
        <Drawer.Screen
          name="Bookmarks"
          component={BookMarks}
          options={{
            drawerLabel: "Bookmarks",
            title: " ",
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default DrawerNavigator;
