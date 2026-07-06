import "react-native-gesture-handler";
import * as React from "react";
import RootNavigator from "./navigators/RootNavigator";
import { Provider } from "react-redux";
import store from "./state/store";
import { QueryClient, QueryClientProvider } from "react-query";
import ThemeProvider from "./utilities/ThemeProvider";
import NotificationHandler from "./utilities/NotificationHandler";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationHandler />
          <RootNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
