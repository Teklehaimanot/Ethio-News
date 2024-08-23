import { createDrawerNavigator } from "@react-navigation/drawer";
import { color } from "../utilities/Colors";
import CustomSidebarMenu from "../components/DrawerContent";
import HomeScreenNavigator from "./HomeScreenNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import BookMarks from "../screens/bookmarks/BookMarks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";

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
                  onPress={() => alert("This is a button!")}
                  style={{ marginRight: 20 }}
                />
                <Entypo
                  name="dots-three-vertical"
                  size={18}
                  color={color.white}
                  onPress={() => alert("This is a button!")}
                  style={{ marginRight: 10 }}
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
            title: " ",
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default DrawerNavigator;
