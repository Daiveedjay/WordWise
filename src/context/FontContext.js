import React, { createContext, useReducer } from "react";

export const FontContext = createContext();

const fontReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_FONT":
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedFont", action.payload);
      }
      return { ...state, font: action.payload };

    default:
      return state;
  }
};

export function FontProvider({ children }) {
  const selectedFont =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedFont") || "default"
      : "default";

  const [state, dispatch] = useReducer(fontReducer, {
    font: selectedFont,
  });

  const changeFont = (font) => {
    dispatch({ type: "CHANGE_FONT", payload: font });
  };

  return (
    <FontContext.Provider value={{ ...state, changeFont }}>
      {children}
    </FontContext.Provider>
  );
}
