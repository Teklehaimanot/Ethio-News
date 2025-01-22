import "react-native-gesture-handler";
import * as React from "react";
import RootNavigator from "./navigators/RootNavigator";
import { Provider } from "react-redux";
import store from "./state/store";
import { QueryClient, QueryClientProvider } from "react-query";
import ThemeProvider from "./utilities/ThemeProvider";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
