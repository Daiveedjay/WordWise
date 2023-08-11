import Layout from "@/components/Layout";
import { useCollection } from "@/hooks/useCollection";
import { useData } from "@/context/DataContext";

import styles from "@/styles/Utility.module.css";
import { useRouter } from "next/router";

import { useFirestore } from "@/hooks/useFirestore";
import LoadingComponent from "@/components/Loading";
import LoadingAnimation from "../../../public/media/Loading_animation.json";
import { FaTrash, FaSearch } from "react-icons/fa";
import BaseAnimation from "../../../public/media/Walking_pencil.json";
// import { useAuthContext } from "@/hooks/useAuthContext";
export default function FavouritesPage() {
  const { documents, error, isPending } = useCollection("favourites");

  const { deleteFavourite } = useFirestore("favourites");
  const router = useRouter();
  const { fetchData } = useData();

  const handleClick = async (searchTerm) => {
    await fetchData(searchTerm);
    router.push("/");
  };
  console.log("My docs", documents);

  return (
    <Layout>
      <div className={styles.utility__component}>
        {!isPending && documents?.length <= 0 && (
          <>
            <h2
              style={{
                zIndex: 20,
                margin: "auto",
                position: "relative",
                textAlign: "center",
              }}
            >
              You have no favourite words yet, add some now
            </h2>
            <LoadingComponent LoadingAnimation={BaseAnimation} />
          </>
        )}
        {isPending && <LoadingComponent LoadingAnimation={LoadingAnimation} />}
        {documents?.length > 0 && !isPending && (
          <h1 className="lead__text">Favourites</h1>
        )}

        <ul className={styles.utility__results}>
          {documents &&
            documents.map((doc) => (
              <div className={styles.utility__item} key={doc.dataKey}>
                <li
                  // onClick={() => handleClick(doc.dataName)}
                  className="regular__text"
                >
                  <FaSearch
                    className={styles.search__icon}
                    fontSize={20}
                    fill="#9c9c9c"
                    onClick={() => handleClick(doc.dataName)}
                  />
                  <FaTrash
                    fontSize={20}
                    fill="#9c9c9c"
                    onClick={() => deleteFavourite(doc.dataKey)}
                    className={styles.delete__icon}
                  />
                  {/* <Image
                    title="Remove Bookmark"
                    src={RemoveFavourite}
                    width={25}
                    height={25}
                    alt="Market Favourite Icon"
                  /> */}
                  {doc.dataName}
                </li>
              </div>
            ))}
        </ul>
      </div>
    </Layout>
  );
}
