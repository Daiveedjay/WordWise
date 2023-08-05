import Layout from "@/components/Layout";
import { useCollection } from "@/hooks/useCollection";
import { useData } from "@/context/DataContext";

import styles from "@/styles/Utility.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import RemoveFavourite from "../../../public/media/icon-heart-break.svg";
import { useFirestore } from "@/hooks/useFirestore";

// import { useAuthContext } from "@/hooks/useAuthContext";
export default function FavouritesPage() {
  const { documents, error } = useCollection("favourites");

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
        {documents?.length < 0 && (
          <h2>You have no favourite words yet, add some now</h2>
        )}
        {documents?.length > 0 && <h1 className="lead__text">Favourites</h1>}

        <ul className={styles.utility__results}>
          {documents &&
            documents.map((doc) => (
              <div className={styles.utility__item} key={doc.dataKey}>
                <li
                  // onClick={() => handleClick(doc.dataName)}
                  className="regular__text"
                >
                  <Image
                    title="Remove Bookmark"
                    src={RemoveFavourite}
                    width={25}
                    height={25}
                    alt="Market Favourite Icon"
                    onClick={() => deleteFavourite(doc.dataKey)}
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
