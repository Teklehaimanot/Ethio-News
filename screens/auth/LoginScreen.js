import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";

import { baseUrl } from "../../config";
import { login } from "../../state/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ThemeContext } from "../../utilities/ThemeProvider";
import {
  configureGoogleSignIn,
  isNativeGoogleSignInAvailable,
  signInWithGoogleNative,
} from "../../utilities/googleSignIn";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    configureGoogleSignIn().catch(() => {});
  }, []);

  const completeSignIn = useCallback(
    async (idToken) => {
      const { data } = await axios.post(`${baseUrl}/api/v1/user/googleSignIn`, {
        idToken,
      });

      if (data) {
        const { user, token } = data;
        await AsyncStorage.setItem("token", JSON.stringify(data));
        dispatch(login({ user, token }));
        navigation.navigate("Home");
      }
    },
    [dispatch, navigation]
  );

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrors("");

      if (!isNativeGoogleSignInAvailable) {
        setErrors(
          "Google Sign-In needs a native app build (not Expo Go). Run: cd ethio-news-mobile && npx expo run:android"
        );
        return;
      }

      const idToken = await signInWithGoogleNative();
      await completeSignIn(idToken);
    } catch (error) {
      if (error.code === "CANCELLED" || error.code === "IN_PROGRESS") {
        return;
      }
      setErrors(
        error.response?.data?.error ||
          error.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setIsLoading(false);
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
          <Text style={[styles.title, { color: theme.text }]}>Sign in</Text>
        </View>
      </View>

      <View style={[styles.loginCard, { borderColor: theme.text2 }]}>
        {errors ? (
          <Text style={{ color: theme.error, marginBottom: 12 }}>{errors}</Text>
        ) : null}

        <Text style={[styles.heading, { color: theme.primary }]}>
          Welcome back
        </Text>
        <Text style={[styles.subtitle, { color: theme.text2 }]}>
          Sign in with your Google account to like posts, comment, and bookmark
          news.
        </Text>

        <TouchableOpacity
          style={[styles.googleButton, { backgroundColor: theme.bg }]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <>
              <AntDesign name="google" size={22} color="#DB4437" />
              <Text style={[styles.googleButtonText, { color: theme.text }]}>
                Sign in with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={[styles.hint, { color: theme.text2 }]}>
          You can browse news without signing in.
        </Text>
        {!isNativeGoogleSignInAvailable ? (
          <Text style={[styles.devHint, { color: theme.text2 }]}>
            Google blocks sign-in inside Expo Go. Install a dev build with{" "}
            <Text style={{ fontFamily: "Figtree-SemiBold" }}>
              npx expo run:android
            </Text>
            .
          </Text>
        ) : null}
      </View>
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
    marginVertical: 40,
    padding: 25,
    borderWidth: 0.5,
    borderRadius: 15,
  },
  heading: {
    fontFamily: "Figtree-Bold",
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Figtree-Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleButtonText: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 16,
  },
  hint: {
    fontFamily: "Figtree-Regular",
    fontSize: 13,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 18,
  },
  devHint: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 17,
  },
});

export default LoginScreen;
