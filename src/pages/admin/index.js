import Layout from "@/components/Layout";
import styles from "@/styles/Admin.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useEffect, useMemo, useState } from "react";

import { FaStar, FaTools, FaSave } from "react-icons/fa";
import { useQuizContext } from "@/context/QuizContext";
import { useData } from "@/context/DataContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminPage() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { resetDataAndSearches } = useData();
  const router = useRouter();
  const [avatar, setAvatar] = useState("");
  const [fetched, setFetched] = useState(false);
  const [showChangeIcon, setShowChangeIcon] = useState(false);

  const paramValues = useMemo(
    () => [
      "Midnight",
      "Casper",
      "Gizmo",
      "Callie",
      "Mittens",
      "Zoey",
      "Rascal",
      "Ginger",
      "Annie",
      "Lucy",
      "Molly",
      "George",
      "Garfield",
      "Charlie",
      "Loki",
      "Bandit",
      "Boots",
      "Gracie",
      "Salem",
      "Oliver",
    ],
    []
  );

  // Function to fetch SVG using the API
  const fetchSVG = async function (seed) {
    const apiUrl = `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${seed}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch SVG");
      }
      const svg = await response.text();
      return svg;
    } catch (error) {
     
      return null;
    }
  };

  // Function to select a random string from the array
  const getRandomString = function (arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  // Main function to execute the process

  useEffect(() => {
    // Check if the SVG data already exists in localStorage
    const storedSVG = localStorage.getItem("avatarSVG");

    if (storedSVG) {
      // Use the stored SVG if available
      setAvatar(storedSVG);
      setFetched(true);
    } else {
      // Fetch a new SVG if not stored yet
      const fetchRandomSVG = async function () {
        const randomString = getRandomString(paramValues);
        const svg = await fetchSVG(randomString);
        if (svg) {
          setAvatar(svg);
          setFetched(true);
          localStorage.setItem("avatarSVG", svg);
        }
      };

      fetchRandomSVG();
    }
  }, [paramValues]);

  // Function to fetch a new random SVG when the icon is clicked
  const handleAvatarChange = async () => {
    const randomString = getRandomString(paramValues);
    const svg = await fetchSVG(randomString);
    if (svg) {
      setAvatar(svg);
    }
    setShowChangeIcon(true);
  };

  const handleSave = async () => {
    setShowChangeIcon(false);
    localStorage.removeItem("avatarSVG");
    // Store the SVG data in localStorage
    localStorage.setItem("avatarSVG", avatar);
  };

  const { quizData } = useQuizContext();
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [questionsAttemptedCount, setQuestionsAttemptedCount] = useState(0);

  // Fetch the latest data whenever quizData changes
  useEffect(() => {
    if (quizData) {
      setCorrectAnswersCount(quizData.correctAnswersCount);
      setQuestionsAttemptedCount(quizData.questionsAttemptedCount);
    }
  }, [quizData]);

  return (
    <Layout
      title={"WordWise - Admin Dashboard"}
      description={"Manage and administer your WordWise application."}
      keywords={"admin, dashboard, manage, app administration, tools"}
    >
      <div className={styles.Admin__container}>
        <div className={styles.user__data}>
          <div className={styles.upper__section}>
            <div className={styles.admin__utils}>
              <ThemeToggle />
            </div>
          </div>
          <div className={styles.lower__section}>
            <div className={styles.image__container}>
              <div className={styles.image__item}>
                <Image
                  src={`data:image/svg+xml;base64,${btoa(avatar)}`}
                  alt="Avatar"
                  width={30}
                  height={30}
                  loading="lazy"
                />
              </div>

              <div className={styles.image__changer}>
                <FaTools
                  fill="#a445ed"
                  className={styles.icon__change}
                  fontSize={15}
                  onClick={handleAvatarChange}
                />
              </div>

              {showChangeIcon && (
                <div className={styles.image__saver}>
                  <FaSave
                    fill="#a445ed"
                    className={styles.icon__save}
                    fontSize={15}
                    onClick={handleSave}
                  />
                </div>
              )}
            </div>
            <div className={styles.user__details}>
              <h2>{user?.displayName}</h2>
              <p>
                <FaStar fill="#F1C40F" fontSize={15} />
                Total Points:{" "}
                {+questionsAttemptedCount > 0
                  ? +correctAnswersCount
                  : "No points board yet"}
              </p>
              <p>
                <FaStar fill="#F1C40F" fontSize={15} />
                Test Overall :{" "}
                {+questionsAttemptedCount > 0
                  ? `${+correctAnswersCount}/${+questionsAttemptedCount}`
                  : "No overall yet"}
              </p>
              <p>
                <FaStar fill="#F1C40F" fontSize={15} />
                Test Percentage:
                {+questionsAttemptedCount > 0
                  ? ` ${Math.floor(
                      (+correctAnswersCount / +questionsAttemptedCount) * 100
                    )}%`
                  : " No percentage yet..."}
              </p>

              <button
                onClick={() => {
                  logout();
                  resetDataAndSearches();
                  router.push("/auth");
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
