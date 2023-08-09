import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";
import { FontProvider } from "@/context/FontContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";
export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <DataProvider>
          <FontProvider>
            <QuizProvider>
              <Component {...pageProps} />
            </QuizProvider>
          </FontProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
