import { NativeModules, Platform, TurboModuleRegistry } from "react-native";
import Constants from "expo-constants";
import { googleWebClientId } from "../config";

// Bridgeless / New Architecture often leaves NativeModules empty for TurboModules.
const hasNativeModule =
  !!NativeModules.RNGoogleSignin ||
  !!TurboModuleRegistry.get?.("RNGoogleSignin");

// Expo Go cannot load the native Google Sign-In module.
const isExpoGo =
  Constants.appOwnership === "expo" ||
  Constants.executionEnvironment === "storeClient";

export const isNativeGoogleSignInAvailable = !isExpoGo && (hasNativeModule || Platform.OS !== "web");

let configured = false;

export async function configureGoogleSignIn() {
  if (isExpoGo || configured) {
    return;
  }

  const { GoogleSignin } = await import(
    "@react-native-google-signin/google-signin"
  );

  GoogleSignin.configure({
    webClientId: googleWebClientId,
    offlineAccess: false,
  });
  configured = true;
}

export async function signInWithGoogleNative() {
  if (isExpoGo) {
    throw new Error(
      "Google Sign-In requires a native build. Run: npx expo run:android"
    );
  }

  const { GoogleSignin, statusCodes } = await import(
    "@react-native-google-signin/google-signin"
  );

  await configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  try {
    const result = await GoogleSignin.signIn();
    // Library v13+ returns { data: { idToken } }; older returns { idToken } at top level.
    const idToken = result?.data?.idToken || result?.idToken;

    if (!idToken) {
      throw new Error("Google sign-in did not return a token.");
    }

    return idToken;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      const cancelled = new Error("Sign-in cancelled");
      cancelled.code = "CANCELLED";
      throw cancelled;
    }

    if (error.code === statusCodes.IN_PROGRESS) {
      const busy = new Error("Sign-in already in progress");
      busy.code = "IN_PROGRESS";
      throw busy;
    }

    if (error.code === "10" || error.code === 10) {
      const devError = new Error(
        Platform.OS === "android"
          ? "Google Sign-In is not configured for this app build. In Google Cloud Console, open your Android OAuth client, set package name to com.teklehaimanot.ethionews, and add your app SHA-1 fingerprint. Then rebuild with: npx expo run:android"
          : "Google Sign-In is not configured for this iOS build."
      );
      devError.code = "DEVELOPER_ERROR";
      throw devError;
    }

    throw error;
  }
}
