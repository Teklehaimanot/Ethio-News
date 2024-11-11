import { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { color } from "../utilities/Colors";
import CustomSidebarMenu from "../components/DrawerContent";
import HomeScreenNavigator from "./HomeScreenNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import BookMarks from "../screens/bookmarks/BookMarks";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Modal, View, Text, Button, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
    // <SafeAreaView style={{ flex: 1, backgroundColor: color.primary }}>
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
                onPress={() => navigation.navigate("search")}
                style={{ marginRight: 20 }}
              />
              {/* <Entypo
                  name="dots-three-vertical"
                  size={18}
                  color={color.white}
                  onPress={togglePopup}
                  style={{ marginRight: 10 }}
                /> */}
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
    //</SafeAreaView>{showPopup && (
    // <Modal
    //   transparent={true}
    //   animationType="slide"
    //   visible={showPopup}
    //   onRequestClose={togglePopup}
    // >
    //   <View
    //     style={{
    //       flex: 1,
    //       backgroundColor: "rgba(0, 0, 0, 0.5)",
    //     }}
    //   >
    //     <View
    //       style={{
    //         width: width * 0.35,
    //         padding: 10,
    //         backgroundColor: color.secondary,
    //         borderRadius: 5,
    //         left: width * 0.65,
    //         top: 0,
    //       }}
    //     >
    //       {/* <Text style={{ fontSize: 18, marginBottom: 10 }}>Popup Menu</Text> */}
    //       <Button title="Refresh Home" onPress={handleRefresh} />
    //       {/* <Button title="Close" onPress={togglePopup} /> */}
    //     </View>
    //   </View>
    // </Modal>
    //)}
    // </SafeAreaView>
  );
};

export default DrawerNavigator;
