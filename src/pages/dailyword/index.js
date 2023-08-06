import styles from "@/styles/SearchResult.module.css";
import PlayIcon from "../../../public/media/icon-play.svg";

import FavIconInactive from "../../../public/media/icon-favourite-inactive.svg";
import FavIconActive from "../../../public/media/icon-favourite-active.svg";
import StarActive from "../../../public/media/icon-star-gold.svg";
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
import LoadingComponent from "@/components/Loading";

export default function DailyWord() {
  const { fetchData } = useData();
  const { user } = useAuthContext();
  const { favouriteWord, deleteFavourite } = useFirestore("favourites");
  const [favouriteItems, setFavouriteItems] = useState([]);
  const router = useRouter();
  const STORAGE_KEY = "randomWord";
  const API_URL = "https://api.api-ninjas.com/v1/randomword";
  const API_KEY = "ibyuAqQFkdh6QBsOlAD8aQ==uJuhnESr2akR4FH1";

  const [randomWord, setRandomWord] = useState("");

  const getRandomWordFromAPI = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          "X-Api-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const word = data.word || ""; // Extract the word from the API response
      return word;
    } catch (error) {
      console.error("Error fetching random word:", error);
      return "";
    }
  };

  useEffect(() => {
    const updateRandomWord = async () => {
      const newWord = await getRandomWordFromAPI();
      if (newWord) {
        setRandomWord(newWord);
        const currentTime = Date.now();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ word: newWord, timestamp: currentTime })
        );
      }
    };
    // Check if there's a word in local storage and if it's still valid (within 24 hours)
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const { word, timestamp } = storedData;
    const isWordValid =
      word && timestamp && Date.now() - timestamp < 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (isWordValid) {
      setRandomWord(word);
    } else {
      updateRandomWord();
    }

    // Calculate the time until midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;

    // Set up a timer to update the word at midnight
    const timer = setTimeout(() => {
      updateRandomWord();
      // Set a new timer for the next midnight
      const nextMidnight = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const timeUntilNextMidnight = nextMidnight - now;
      setTimeout(updateRandomWord, timeUntilNextMidnight);
    }, timeUntilMidnight);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const [wordDetails, setWordDetails] = useState("");

  // This useEffect will run whenever randomWord changes
  useEffect(() => {
    const fetchWordDefinition = async () => {
      const definition = await getWordDefinition(randomWord);
      console.log("Word Definition:", definition);
    };

    fetchWordDefinition();
  }, [randomWord]);

  const getWordDefinition = async (randomWord) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`
      );
      const data = await response.json();
      // Assuming the API response is an array of definitions, you can extract the first definition
      const firstDefinition = data[0] || "No definition found";
      setWordDetails(firstDefinition);
      // return firstDefinition;
    } catch (error) {
      console.error("Error fetching word definition:", error);
      return "Error fetching definition";
    }
  };

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
    <Layout>
      {/* <div>
        <h1>Your daily word: {randomWord}</h1>
      </div> */}
      <main className={styles.dailyword__component}>
        {!wordDetails && <LoadingComponent />}
        {wordDetails && (
          <h1 className={styles.daily__word}>
            Your daily word is:{" "}
            <span>
              {randomWord}{" "}
              <Image src={StarActive} alt="Star icon" width={15} height={15} />
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
                      <Image
                        onClick={handlePlay}
                        src={PlayIcon}
                        width={50}
                        height={50}
                        alt="Play Icon"
                      />
                    )}
                    <Image
                      onClick={() => {
                        if (favouriteItems.includes(wordDetails?.word)) {
                          handleDelete(wordDetails?.word);
                        } else {
                          handleFavourites(wordDetails);
                        }
                      }}
                      src={
                        favouriteItems.includes(wordDetails?.word)
                          ? FavIconActive
                          : FavIconInactive
                      }
                      width={30}
                      height={30}
                      alt="Fav Icon"
                    />
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
                      {wordDetails?.meanings[0].definitions
                        .slice(0, 5)
                        .map((def, index) => (
                          <li className="small__text" key={index}>
                            {def.definition}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className={`${styles.synonyms}`}>
                    {wordDetails?.meanings[0].synonyms.length >= 1 && (
                      <h3>Synonyms</h3>
                    )}
                    {wordDetails?.meanings[0].synonyms
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
                {wordDetails?.[0]?.meanings[1] && (
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
                  <Link target="_blank" href={wordDetails?.sourceUrls[0]}>
                    {wordDetails?.sourceUrls[0]}
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
