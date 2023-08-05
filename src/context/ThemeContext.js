// import { createContext, useEffect, useReducer } from "react";

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
//     mode: localStorage.getItem("mode") || "light",
//   });

//   useEffect(() => {
//     localStorage.setItem("mode", state.mode);
//   }, [state.mode]);
//   const changeMode = (mode) => {
//     dispatch({ type: "CHANGE_MODE", payload: mode });
//   };
//   return (
//     <ThemeContext.Provider value={{ ...state, changeMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

import { createContext, useReducer } from "react";

export const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_MODE":
      return { ...state, mode: action.payload };

    default:
      return state;
  }
};

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, {
    mode: "light",
  });

  const changeMode = (mode) => {
    dispatch({ type: "CHANGE_MODE", payload: mode });
  };

  return (
    <ThemeContext.Provider value={{ ...state, changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
