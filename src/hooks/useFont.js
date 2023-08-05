import { useContext } from "react";
import { FontContext } from "@/context/FontContext";

export const useFont = () => {
  const context = useContext(FontContext);

  if (context === undefined) {
    throw new Error("useFont() must be inside the FontProvider");
  }

  return context;
};
