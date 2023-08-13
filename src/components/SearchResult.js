import Image from "next/image";
import { FaPlayCircle, FaHeart } from "react-icons/fa";

import FavIconInactive from "../../public/media/icon-favourite-inactive.svg";
import styles from "@/styles/SearchResult.module.css";
import Link from "next/link";

import { useData } from "@/context/DataContext";
import { useEffect, useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingComponent from "./Loading";

import LoadingAnimation from "../../public/media/Loading_animation.json";
import BaseAnimation from "../../public/media/Walking_pencil.json";



export default function SearchResult() {
  const { data, isPending, error, fetchData } = useData();
  const { user } = useAuthContext();
  const { favouriteWord, deleteFavourite } = useFirestore("favourites");

  const [favouriteItems, setFavouriteItems] = useState([]);

  const [audioURL, setAudioURL] = useState("");

  const [audio, setAudio] = useState(false);

  useEffect(() => {
    let hasAudio = false;
    data?.[0]?.phonetics?.forEach((phonetic) => {
      if (phonetic.audio && phonetic.audio.trim() !== "") {
        setAudioURL(phonetic.audio);
        hasAudio = true;
      }
    });

    setAudio(hasAudio);
  }, [data]);

  const handlePlay = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleSynonym = async (searchTerm) => {
    await fetchData(searchTerm);
  };

  const handleFavourites = async (data) => {
    const dataKey = data?.[0]?.word;
    const dataName = data?.[0]?.word;
    const uid = user.uid;

    if (dataKey) {
      await favouriteWord(dataKey, dataName, uid);
      setFavouriteItems((prevSearches) => [...new Set(prevSearches), dataKey]);
      // toast.success(`${dataKey} added to favourites`);
      // console.log("----Test Toast Add---");
    }
  };

  const handleDelete = async (dataKey) => {
    if (dataKey) {
      await deleteFavourite(dataKey);
      setFavouriteItems((prevSearches) =>
        prevSearches.filter((item) => item !== dataKey)
      );
      // toast.success(`${dataKey} removed from favourites`);
      // console.log("----Test Toast Remove---");
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

  const isFavorited = favouriteItems.includes(data?.[0]?.word);
  return (
    <div className={`${styles.search__component}`}>
      
      {!data && (
        <>
          <h2
            style={{ zIndex: 20, margin: "auto" }}
            className="utility__header"
          >
            No words searched, search now...
          </h2>
          <LoadingComponent LoadingAnimation={LoadingAnimation} />
        </>
      )}

      {isPending && <LoadingComponent LoadingAnimation={LoadingAnimation} />}
      {data && (
        <>
          <div className={styles.Search__results}>
            <div className={styles.title}>
              <div className={styles.lead__container}>
                <h1 className="lead__text">{data?.[0]?.word}</h1>
                <p className={styles.phonetic}>{data?.[0]?.phonetic}</p>
              </div>
              <div className={styles.play__container}>
                {audio && (
                  <>
                    <FaPlayCircle
                      fontSize={50}
                      fill="#a445ed"
                      opacity={0.75}
                      onClick={handlePlay}
                      style={{ cursor: "pointer" }}
                    />
                  </>
                )}
                <div>
                  {isFavorited ? (
                    <FaHeart
                      onClick={() => handleDelete(data?.[0]?.word)}
                      fontSize={30}
                      fill="#a445ed"
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <Image
                      onClick={() => handleFavourites(data)}
                      src={FavIconInactive}
                      width={30}
                      height={30}
                      alt="Fav Icon"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.description}>
              <div>
                <p className={`${styles.speech__name} regular__text `}>
                  {data?.[0]?.meanings[0].partOfSpeech}
                </p>
                <span className={styles.line}></span>
              </div>
              <div className={styles.meaning}>
                <h3>Meaning</h3>
                <ul>
                  {data?.[0]?.meanings[0].definitions
                    .slice(0, 5)
                    .map((def, index) => (
                      <li className="small__text" key={index}>
                        {def.definition}
                      </li>
                    ))}
                </ul>
              </div>
              <div className={`${styles.synonyms}`}>
                {data?.[0]?.meanings[0].synonyms.length >= 1 && (
                  <h3>Synonyms</h3>
                )}
                {data?.[0]?.meanings[0].synonyms
                  .slice(0, 5)
                  .map((searchTerm, index) => (
                    <span onClick={() => handleSynonym(searchTerm)} key={index}>
                      {searchTerm}
                    </span>
                  ))}
              </div>
            </div>
            {/* TODO SEPERATION */}
            {data?.[0]?.meanings[1] && (
              <div className={styles.description}>
                <div>
                  <p className={`${styles.speech__name} regular__text`}>
                    {data?.[0]?.meanings[1]?.partOfSpeech}
                  </p>
                  <span className={styles.line}></span>
                </div>
                <div className={styles.meaning}>
                  {data?.[0]?.meanings[1] && <h3>Meaning</h3>}

                  <ul>
                    {data?.[0]?.meanings[1]?.definitions
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
                href={data?.[0]?.sourceUrls[0] || data?.[0]?.sourceUrls[1]}
              >
                {data?.[0]?.sourceUrls[0]}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
