import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { baseUrl } from "../config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationHandler() {
    const [expoPushToken, setExpoPushToken] = useState("");
    const notificationListener = useRef();
    const responseListener = useRef();
    const basicUrl = baseUrl;


  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);

        // Send token to backend
        fetch(`${baseUrl}/api/v1/pushNotification/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null; // no UI, just logic
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for notifications!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
