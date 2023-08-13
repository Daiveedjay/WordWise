import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";
import { FontProvider } from "@/context/FontContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { QuizProvider } from "@/context/QuizContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <DataProvider>
          <FontProvider>
            <QuizProvider>
              <ToastContainer autoClose={2500} />
              <Component {...pageProps} />
            </QuizProvider>
          </FontProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
