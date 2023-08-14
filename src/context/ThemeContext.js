// import { createContext, useReducer } from "react";

// export const ThemeContext = createContext();

// const themeReducer = (state, action) => {
//   switch (action.type) {
//     case "CHANGE_MODE":
//       return { ...state, mode: action.payload };

//     default:
//       return state;
//   }
// };

// export function ThemeProvider({ children }) {
//   const [state, dispatch] = useReducer(themeReducer, {
//     mode: "light",
//   });

//   const changeMode = (mode) => {
//     dispatch({ type: "CHANGE_MODE", payload: mode });
//   };

//   return (
//     <ThemeContext.Provider value={{ ...state, changeMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// import { createContext, useContext, useState } from "react";

// export const ThemeContext = createContext();

// export function useTheme() {
//   return useContext(ThemeContext);
// }

// export function ThemeProvider({ children }) {
//   const [isDarkTheme, setIsDarkTheme] = useState(() => {
//     const storedTheme = localStorage.getItem("isDarkTheme");
//     return storedTheme ? JSON.parse(storedTheme) : false;
//   });

//   const changeMode = (mode) => {
//     setIsDarkTheme(mode === "dark");
//     localStorage.setItem("isDarkTheme", JSON.stringify(mode === "dark"));
//   };

//   const mode = isDarkTheme ? "dark" : "light";

//   return (
//     <ThemeContext.Provider value={{ mode, changeMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("isDarkTheme");
      return storedTheme ? JSON.parse(storedTheme) : false;
    }
    return false;
  });

  const changeMode = (mode) => {
    setIsDarkTheme(mode === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("isDarkTheme", JSON.stringify(mode === "dark"));
    }
  };

  const mode = isDarkTheme ? "dark" : "light";

  return (
    <ThemeContext.Provider value={{ mode, changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
