import styles from "@/styles/SearchResult.module.css";
import FavIconInactive from "../../../public/media/icon-favourite-inactive.svg";

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { useRouter } from "next/router";

import { useFirestore } from "@/hooks/useFirestore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaHeart, FaStar, FaPlayCircle } from "react-icons/fa";

export default function DailyWord() {
  const { fetchData } = useData();
  const { user } = useAuthContext();
  const { favouriteWord, deleteFavourite } = useFirestore("favourites");
  const [favouriteItems, setFavouriteItems] = useState([]);
  const router = useRouter();

  const [randomWord, setRandomWord] = useState("");

  const [wordDetails, setWordDetails] = useState("");

  const getWordDefinition = async (randomWord) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`
      );
      if (response.ok) {
        const data = await response.json();

        const firstDefinition = data?.[0];
        setWordDetails(firstDefinition);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchRandomWord = async () => {
      const predefinedBackupWords = [
        "sinusoidal",
        "enumerate",
        "liquify",
        "Anachronism",
        "Draconian",
        "Pareidolia",
        "Serendipity",
        "Verisimilitude",
        "sarcophagus",
        "Cacophony",
      ];

      // Check if there's a saved word in local storage
      const savedWordData = localStorage.getItem("randomWordData");
      if (savedWordData) {
        const parsedData = JSON.parse(savedWordData);
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - parsedData.timestamp;

        // If the saved word is less than 24 hours old, use it
        if (timeElapsed <= 24 * 60 * 60 * 1000) {
          setRandomWord(parsedData.word);
          await getWordDefinition(parsedData.word);
          return;
        }
      }

      // If no saved word or the saved word is older than 24 hours, fetch a new random word
      const randomIndex = Math.floor(
        Math.random() * predefinedBackupWords?.length
      );
      const randomWord = predefinedBackupWords?.[randomIndex];

      setRandomWord(randomWord);
      await getWordDefinition(randomWord);

      // Save the random word in local storage with a timestamp
      const currentTime = new Date().getTime();
      const wordData = { word: randomWord, timestamp: currentTime };
      localStorage.setItem("randomWordData", JSON.stringify(wordData));
    };

    // Fetch random word on page load
    fetchRandomWord();
  }, []);

  const [audioURL, setAudioURL] = useState("");

  const [audio, setAudio] = useState(false);

  useEffect(() => {
    let hasAudio = false;
    wordDetails?.phonetics?.forEach((phonetic) => {
      if (phonetic.audio && phonetic.audio.trim() !== "") {
        setAudioURL(phonetic.audio);
        hasAudio = true;
      }
    });

    setAudio(hasAudio);
  }, [wordDetails]);

  const handlePlay = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleSynonym = async (searchTerm) => {
    await fetchData(searchTerm);
    router.push("/");
  };

  const handleFavourites = async (wordDetails) => {
    const dataKey = wordDetails?.word;
    const dataName = wordDetails?.word;
    const uid = user.uid;

    if (dataKey) {
      await favouriteWord(dataKey, dataName, uid);
      setFavouriteItems((prevSearches) => [...new Set(prevSearches), dataKey]);
    }
  };

  const handleDelete = async (dataKey) => {
    if (dataKey) {
      await deleteFavourite(dataKey);
      setFavouriteItems((prevSearches) =>
        prevSearches.filter((item) => item !== dataKey)
      );
    }
  };

  useEffect(() => {
    if (user) {
      const fetchBookmarks = async () => {
        const favouritesQuery = query(
          collection(db, "favourites"),
          where("uid", "==", user.uid)
        );

        const favouritesSnapshot = await getDocs(favouritesQuery);

        const existingFavourites = favouritesSnapshot.docs.map((doc) => {
          return { ...doc.data() };
        });

        setFavouriteItems(existingFavourites.map((fav) => fav.dataKey));
      };

      fetchBookmarks();
    }
  }, [user]);

  return (
    <Layout
      title={"WordWise - Daily Word"}
      description={"Discover a new word every day with WordWise."}
      keywords={"daily word, word of the day, vocabulary, definitions, app"}
    >
      <main className={styles.dailyword__component}>
        {!wordDetails && (
          <>
            <h2 className="utility__header loading__header">
              Your daily word is loading...
            </h2>
            {/* <LoadingComponent LoadingAnimation={LoadingAnimation} /> */}
          </>
        )}
        {wordDetails && (
          <h1 className={styles.daily__word}>
            Your daily word is:{" "}
            <span>
              {randomWord} <FaStar fontSize={15} color="#F1C40F" />
            </span>
          </h1>
        )}
        <div className={`${styles.search__component}`}>
          {wordDetails && (
            <>
              <div className={styles.Search__results}>
                <div className={styles.title}>
                  <div className={styles.lead__container}>
                    <h1 className="lead__text">{wordDetails?.word}</h1>
                    <p className={styles.phonetic}>{wordDetails?.phonetic}</p>
                  </div>
                  <div className={styles.play__container}>
                    {audio && (
                      <FaPlayCircle
                        fontSize={50}
                        fill="#a445ed"
                        opacity={0.75}
                        style={{ cursor: "pointer" }}
                        className={styles.action__icon}
                        onClick={handlePlay}
                      />
                    )}

                    {favouriteItems.includes(wordDetails?.word) ? (
                      <FaHeart
                        fill="#a445ed"
                        onClick={() => handleDelete(wordDetails?.word)}
                        style={{ cursor: "pointer", width: 30, height: 30 }}
                        alt="Fav Icon"
                      />
                    ) : (
                      <Image
                        src={FavIconInactive}
                        width={30}
                        height={30}
                        alt="Fav Icon"
                        onClick={() => handleFavourites(wordDetails)}
                        style={{ cursor: "pointer", width: 30, height: 30 }}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.description}>
                  <div>
                    <p className={`${styles.speech__name} regular__text `}>
                      {wordDetails?.meanings?.[0].partOfSpeech}
                    </p>
                    <span className={styles.line}></span>
                  </div>
                  <div className={styles.meaning}>
                    <h3>Meaning</h3>
                    <ul>
                      {wordDetails?.meanings?.[0].definitions
                        .slice(0, 5)
                        .map((def, index) => (
                          <li className="small__text" key={index}>
                            {def.definition}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className={`${styles.synonyms}`}>
                    {wordDetails?.meanings?.[0].synonyms.length >= 1 && (
                      <h3>Synonyms</h3>
                    )}
                    {wordDetails?.meanings?.[0].synonyms
                      .slice(0, 5)
                      .map((searchTerm, index) => (
                        <span
                          onClick={() => handleSynonym(searchTerm)}
                          key={index}
                        >
                          {searchTerm}
                        </span>
                      ))}
                  </div>
                </div>
                {/* TODO SEPERATION */}
                {wordDetails?.[0]?.meanings?.[1] && (
                  <div className={styles.description}>
                    <div>
                      <p className={`${styles.speech__name} regular__text`}>
                        {wordDetails?.meanings[1]?.partOfSpeech}
                      </p>
                      <span className={styles.line}></span>
                    </div>
                    <div className={styles.meaning}>
                      {wordDetails?.meanings[1] && <h3>Meaning</h3>}

                      <ul>
                        {wordDetails?.meanings[1]?.definitions
                          .slice(0, 5)
                          .map((def, index) => (
                            <li className="small__text" key={index}>
                              {def.definition}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className={styles.source}>
                  <span>Source</span>
                  <Link
                    target="_blank"
                    href={wordDetails?.sourceUrls?.[0] || ""}
                  >
                    {wordDetails?.sourceUrls?.[0]}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
