import Image from "next/image";
import PlayIcon from "../../public/media/icon-play.svg";
import { FaPlayCircle, FaHeart } from "react-icons/fa";

import FavIconInactive from "../../public/media/icon-favourite-inactive.svg";
import FavIconActive from "../../public/media/icon-favourite-active.svg";
import styles from "@/styles/SearchResult.module.css";
import Link from "next/link";

import { useData } from "@/context/DataContext";
import { useEffect, useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingComponent from "./Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success(`${dataKey} added to favourites`);
    }
  };

  const handleDelete = async (dataKey) => {
    if (dataKey) {
      await deleteFavourite(dataKey);
      setFavouriteItems((prevSearches) =>
        prevSearches.filter((item) => item !== dataKey)
      );
      toast.success(`${dataKey} removed from favourites`);
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
      <ToastContainer />
      {!data && (
        <h2 className="utility__header">No words searched, search now...</h2>
      )}
      {error && <div>{error}</div>}
      {isPending && <LoadingComponent />}
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
                {/* <Image
                  onClick={() => {
                    if (favouriteItems.includes(data?.[0]?.word)) {
                      handleDelete(data?.[0]?.word);
                    } else {
                      handleFavourites(data);
                    }
                  }}
                  src={
                    favouriteItems.includes(data?.[0]?.word) ? (
                      <FaHeart fontSize={30} fill="#a445ed" />
                    ) : (
                      FavIconInactive
                    )
                  }
                  width={30}
                  height={30}
                  alt="Fav Icon"
                /> */}
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

{
  /* <div className={styles.user__data}>
            <div className={styles.upper__section}></div>
            <div className={styles.lower__section}>
              <div className={styles.image__container}>
                <Image
                  priority
                  src={Avatar}
                  alt="Avatar"
                  width={"auto"}
                  height={"auto"}
                />
              </div>
              <div className={styles.user__details}>
                <h2>DaiveedJay</h2>
                <p>
                  <Image
                    src={StarIcon}
                    alt="Star Icon"
                    width={15}
                    height={15}
                  />
                  Daily Streak: 2
                </p>
                <p>
                  <Image
                    src={GlassesIcon}
                    alt="Glasses Icon"
                    width={15}
                    height={15}
                  />
                  Quiz Points: 17
                </p>
                <button>Log out</button>
              </div>
            </div>
          </div> */
}

{
  /* <ul>
              <li className="small__text">
                A foodstuff made by baking dough made from cereals.
              </li>
              <li className="small__text">
                Food; sustenance; support of life, in general.
              </li>
              <li className="small__text">Any variety of bread.</li>
            </ul> */
}

{
  /* <div className={styles.Search__results}>
        <div className={styles.title}>
          <div className={styles.lead__container}>
            <h1 className="lead__text">keyboard</h1>
            <p className={styles.phonetic}>/ˈkiːbɔːd/</p>
          </div>
          <div className={styles.play__container}>
            <Image src={PlayIcon} width={50} height={50} alt="Play Icon" />
            <Image src={FavIcon} width={30} height={30} alt="Play Icon" />
          </div>
        </div>
        <div className={styles.description}>
          <div>
            <p className={`${styles.speech__name} regular__text `}>Noun</p>
            <span className={styles.line}>Test</span>
          </div>
          <div className={styles.meaning}>
            <h3>Meaning</h3>
            <ul>
              <li className="small__text">
                A foodstuff made by baking dough made from cereals.
              </li>
              <li className="small__text">
                Food; sustenance; support of life, in general.
              </li>
              <li className="small__text">Any variety of bread.</li>
            </ul>
          </div>
          <div className={`${styles.synonyms}`}>
            <h3>Synonyms</h3>
            <span>Bread</span>
            <span>Bread</span>
            <span>Bread</span>
          </div>
        </div>
        <div className={styles.description}>
          <div>
            <p className={`${styles.speech__name} regular__text `}>Verb</p>
            <span className={styles.line}>Test</span>
          </div>
          <div className={styles.meaning}>
            <h3>Meaning</h3>
            <ul>
              <li className="small__text">
                A foodstuff made by baking dough made from cereals.
              </li>
              <li className="small__text">
                Food; sustenance; support of life, in general.
              </li>
              <li className="small__text">Any variety of bread.</li>
            </ul>
          </div>
        </div>
        <div className={styles.source}>
          <span>Source</span>
          <Link href="#">https://en.wiktionary.org/wiki/keyboard</Link>
        </div>
      </div>

      
      <div className={styles.user__data}>
        <div className={styles.upper__section}></div>
        <div className={styles.lower__section}>
          <div className={styles.image__container}>
            <Image src={Avatar} alt="Avatar" width={"auto"} height={"auto"} />
          </div>
          <div className={styles.user__details}>
            <h2>DaiveedJay</h2>
            <p>
              <Image src={StarIcon} alt="Star Icon" width={15} height={15} />
              Daily Streak: 2
            </p>
            <p>
              <Image
                src={GlassesIcon}
                alt="Glasses Icon"
                width={15}
                height={15}
              />
              Quiz Points: 17
            </p>
            <button>Log out</button>
          </div>
        </div>
      </div> */
}

// TODO
// const handlePlay = (data) => {
//     let audioUrl = null;

//     data?.[0]?.phonetics?.forEach((phonetic) => {
//       if (phonetic.audio && phonetic.audio.trim() !== "" && !audioUrl) {
//         audioUrl = phonetic.audio;
//       }
//     });

//     setAudio(audioUrl && audioUrl.trim() !== "");

//     if (audioUrl) {
//       const audio = new Audio(audioUrl);
//       audio.play();
//     }
//   };
