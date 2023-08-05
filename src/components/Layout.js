import Head from "next/head";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "@/styles/Layout.module.css";
import { useTheme } from "@/hooks/useTheme";
import { useFont } from "@/hooks/useFont";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Layout({ title, keywords, description, children }) {
  const { mode } = useTheme();
  const { font } = useFont();
  const { user } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    // Check if there's a user; if not, redirect to the /auth page
    if (!user) {
      // You can customize the route for authentication, e.g., /auth or /login
      router.push("/auth");
    }
  }, [user, router]);
  return (
    <>
      {user && (
        <div className={`${styles.Layout__container} ${mode} ${font}`}>
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
          </Head>
          <Navbar />
          <Sidebar />
          <main className={`${styles.main__section} `}>{children}</main>
        </div>
      )}
    </>
  );
}

Layout.defaultProps = {
  title: "WordWise - Your Ultimate Vocabulary Companion",
  description:
    "Explore, learn, and expand your vocabulary with WordWise, the comprehensive dictionary app.",
  keywords: "dictionary, vocabulary, words, definitions, learning, app",
};
