import { createContext, useReducer } from "react";

export const FontContext = createContext();

const fontReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_FONT":
      return { ...state, font: action.payload };

    default:
      return state;
  }
};

export function FontProvider({ children }) {
  const [state, dispatch] = useReducer(fontReducer, {
    font: "default",
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


