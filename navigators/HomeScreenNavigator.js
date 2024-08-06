import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/home/Home";
import { color } from "../utilities/Colors";

const Stack = createNativeStackNavigator();
const HomeScreenNavigator = ({ navigation }) => {
  // useLayoutEffect(() => {
  //   const unsubscribe = navigation.addListener("state", (e) => {
  //     const route = e.data.state.routes[e.data.state.index];
  //     const index = route === null ? 0 : route?.state?.index;

  //     if (index === 1 || index === 2) {
  //       navigation.setOptions({
  //         drawerLockMode: "locked-closed",
  //         headerShown: false,
  //       });
  //     } else {
  //       navigation.setOptions({
  //         drawerLockMode: "unlocked",
  //         headerShown: true,
  //       });
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: color.primary,
        },
        headerTintColor: color.black,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="details"
        component={Home}
        options={{
          headerShown: true,
          headerTitle: "News",
        }}
      />
    </Stack.Navigator>
  );
};
export default HomeScreenNavigator;
