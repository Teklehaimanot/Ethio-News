import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useContext, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { baseUrl } from "../../config";
import { login } from "../../state/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ThemeContext } from "../../utilities/ThemeProvider";

const { width } = Dimensions.get("window");
const RegisterAccount = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const basicUrl = baseUrl;

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${basicUrl}/api/v1/user`, {
        name,
        email,
        password,
        confirmPassword,
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
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          >
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            Create Account
          </Text>
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
          Create Account
        </Text>
        <TextInput
          placeholder="Name"
          style={[styles.textInput, { backgroundColor: theme.bg2 }]}
          placeholderTextColor={theme.text2}
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          placeholder="Email"
          style={[styles.textInput, { backgroundColor: theme.bg2 }]}
          placeholderTextColor={theme.text2}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={[styles.textInput, { backgroundColor: theme.bg2 }]}
          placeholderTextColor={theme.text2}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TextInput
          placeholder="Confirm Password"
          style={[styles.textInput, { backgroundColor: theme.bg2 }]}
          placeholderTextColor={theme.text2}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
        />
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.text} />
          ) : (
            <Text
              style={{
                color: theme.text,
                fontWeight: "bold",
                fontSize: 15,
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              Create Account
            </Text>
          )}
        </Pressable>

        <View style={styles.createAccount}>
          <Text style={{ color: theme.icon }}>Have an Account?</Text>
          <Pressable onPress={() => navigation.navigate("login")}>
            <Text style={{ color: theme.icon }}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
    marginHorizontal: 15,
  },
  backIcon: {
    marginRight: 15,
  },
  loginCard: {
    width: width * 0.88,
    marginHorizontal: width * 0.06,
    borderRadius: 10,
    marginVertical: 40,
    padding: 25,
    borderWidth: 0.5,
  },
  textInput: {
    padding: 8,
    marginHorizontal: 5,
    marginVertical: 7,
    borderRadius: 5,
  },
  button: {
    margin: 5,
    borderRadius: 5,
    paddingVertical: 14,
  },
  createAccount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
    alignItems: "center",
  },
});
export default RegisterAccount;
