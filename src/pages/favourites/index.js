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
        {error && <div>{error}</div>}
        {!isPending && documents?.length <= 0 && (
          <>
            <h2 className="utility__header loading__header">
              You have no favourite words yet, add some now
            </h2>
            <LoadingComponent LoadingAnimation={BaseAnimation} />
          </>
        )}
        {isPending && (
          <>
            <div>
              <h1>Loading your favourite words</h1>
            </div>
            <LoadingComponent LoadingAnimation={LoadingAnimation} />
          </>
        )}

        {documents?.length > 0 && !isPending && (
          <h1 className="lead__text">Favourites</h1>
        )}

        <ul className={styles.utility__results}>
          {documents &&
            documents.map((doc) => (
              <div className={styles.utility__item} key={doc.dataKey}>
                <li style={{ cursor: "default" }} className="regular__text">
                  <FaSearch
                    className={styles.search__icon}
                    fontSize={20}
                    fill="#e5d6d6"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClick(doc.dataName)}
                  />
                  <FaTrash
                    fontSize={20}
                    fill="#e5d6d6"
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteFavourite(doc.dataKey)}
                    className={styles.delete__icon}
                  />

                  {doc.dataName}
                </li>
              </div>
            ))}
        </ul>
      </div>
    </Layout>
  );
}
