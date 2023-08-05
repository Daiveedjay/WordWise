import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";
import { FontProvider } from "@/context/FontContext";
import { AuthContextProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <DataProvider>
          <FontProvider>
            <Component {...pageProps} />
          </FontProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
