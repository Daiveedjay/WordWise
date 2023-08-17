import Head from "next/head";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "@/styles/Layout.module.css";
import { useTheme } from "@/hooks/useTheme";
import { useFont } from "@/hooks/useFont";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Layout({ title, keywords, description, children }) {
  const { mode } = useTheme();
  const { font } = useFont();
  const { user, authIsReady } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    // Check if there's a user; if not, redirect to the /auth page
    if (!user && authIsReady) {
      router.push("/auth");
    }
  }, [user, router, authIsReady]);

  const shapeVariants = {
    initial: {
      clipPath: "polygon(68% 8%, 92% 5%, 94% 51%, 92% 97%, 45% 62%, 63% 36%)",
    },
    animate: {
      clipPath: "polygon(5% 94%, 7% 9%, 77% 73%, 93% 86%, 12% 95%, 92% 6%)",
    },
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear",
    },
  };

  return (
    <>
      {user && (
        <div className={`${styles.Layout__container} ${mode} `}>
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
          </Head>
          <div className={styles.shaper__wrapper}>
            <motion.div
              variants={shapeVariants}
              initial="initial"
              animate="animate"
              className={styles.shape}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            ></motion.div>
          </div>
          <Navbar />
          <Sidebar />
          <AnimatePresence mode="wait">
            <motion.main
              initial="initialState"
              animate="animateState"
              exit="exitState"
              transition={{ duration: 0.75 }}
              key={router.route}
              variants={{
                initialState: {
                  opacity: 0,
                },
                animateState: {
                  opacity: 1,
                },
                exitState: {
                  opacity: 0,
                },
              }}
              className={`${styles.main__section} ${font}`}
            >
              {children}
            </motion.main>
          </AnimatePresence>
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
