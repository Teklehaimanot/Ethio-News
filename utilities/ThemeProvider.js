import React, { createContext, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark
    ? {
        bg: "#18191A",
        bg2: "#242526",
        text: "#ffffff",
        text2: "#B3B3B3",
        primary: "#2D78A4",
        active: "#ffffff",
        icon: "#1877F2",
        error: "red",
      }
    : {
        bg: "#ffffff",
        bg2: "#ffffff", //efefef
        text: "#191919",
        text2: "#B3B3B3",
        primary: "#2D78A4",
        active: "#ffffff",
        icon: "#1877F2",
        error: "red",
      };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
