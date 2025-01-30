import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import { color } from "../../utilities/Colors";
import { TextInput } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

import { baseUrl } from "../../config";
import { login } from "../../state/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ThemeContext } from "../../utilities/ThemeProvider";

const webClientId =
  "399442306679-aemld02ftrr8rl4ga0f60ec2d6uesm2e.apps.googleusercontent.com";
const androidClientId =
  "399442306679-5licg5fgohae0m5cgair3jq0jbuqj5i2.apps.googleusercontent.com";
const iosClientId =
  "399442306679-3bj7gff3epft8f3032mg5tk4u5ra04g9.apps.googleusercontent.com";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const basicUrl = baseUrl;
  const config = { webClientId, androidClientId, iosClientId };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(config);

  const handleTokken = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("accessToken", token);
    }
  };

  useEffect(() => {
    handleTokken();
  }, [response]);

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${basicUrl}/api/v1/user/login`, {
        email,
        password,
      });
      if (data) {
        const { user, token } = data;
        const jsonUser = JSON.stringify(data);
        AsyncStorage.setItem("token", jsonUser);
        setErrors(false);
        setIsLoading(false);
        dispatch(login({ user, token }));
        navigation.navigate("Home");
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.error);
        setIsLoading(false);
      } else {
        alert("Error setting up the request:", error.message);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg2 }]}>
      <View style={[styles.header, { backgroundColor: theme.bg2 }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          >
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Login</Text>
        </View>
      </View>
      <View style={[styles.loginCard, { borderColor: theme.text2 }]}>
        <Text
          style={{
            color: theme.error,
          }}
        >
          {errors}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            color: theme.primary,
            paddingHorizontal: 5,
            fontSize: 20,
          }}
        >
          Login
        </Text>
        <TextInput
          placeholder="Email"
          style={[
            styles.textInput,
            { backgroundColor: theme.bg, color: theme.text },
          ]}
          placeholderTextColor={theme.text2}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={[
            styles.textInput,
            { backgroundColor: theme.bg, color: theme.text },
          ]}
          placeholderTextColor={theme.text2}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.active} />
          ) : (
            <Text
              style={{
                color: theme.active,
                fontWeight: "bold",
                fontSize: 15,
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              Login
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.createAccount}>
          <Text style={{ color: theme.primary }}>New user?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("signUp")}>
            <Text style={{ color: theme.primary }}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: theme.primary,
          width: width * 0.5,
          marginHorizontal: "auto",
          paddingVertical: 20,
          borderRadius: 5,
          paddingVertical: 14,
        }}
        disabled={!request}
        title="Sign in with Google"
        onPress={() => {
          promptAsync();
        }}
      >
        <Text
          style={{
            color: theme.active,
            textAlign: "center",
            fontFamily: "Figtree-Bold",
            fontSize: 16,
          }}
        >
          Sign in with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    // elevation: 1,
  },
  backIcon: {
    marginRight: 15,
    paddingHorizontal: width * 0.04,
    paddingVertical: 6,
  },
  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
    marginHorizontal: 15,
  },
  loginCard: {
    width: width * 0.88,
    marginHorizontal: width * 0.06,
    borderRadius: 10,
    marginVertical: 40,
    padding: 25,
    borderWidth: 0.5,

    borderRadius: 15,
  },
  textInput: {
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 7,
    borderRadius: 5,
  },
  button: {
    margin: 5,
    borderRadius: 5,
    paddingVertical: 10,
  },
  createAccount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
  },
});
export default LoginScreen;
