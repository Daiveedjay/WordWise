import Layout from "@/components/Layout";
import LoadingComponent from "@/components/Loading";
import { useData } from "@/context/DataContext";
import BaseAnimation from "../../../public/media/Walking_pencil.json";
import styles from "@/styles/Utility.module.css";
import { useRouter } from "next/router";

export default function HistoryPage() {
  const router = useRouter();
  const { searches, fetchData } = useData();

  const handleClick = async (searchTerm) => {
    await fetchData(searchTerm);
    router.push("/");
  };

  const searchesArray = [...searches].reverse();

  return (
    <Layout>
      <div className={styles.utility__component}>
        {searchesArray.length === 0 && (
          <>
            <h2
              style={{
                zIndex: 20,
                margin: "auto",
                position: "relative",
                textAlign: "center",
              }}
              className="utility__header"
            >
              No words searched, search now...
            </h2>
            <LoadingComponent LoadingAnimation={BaseAnimation} />
          </>
        )}

        {searchesArray.length > 0 && <h1 className="lead__text">History</h1>}

        <ul className={styles.utility__results}>
          {searches &&
            searchesArray.map((searchTerm) => (
              <li
                onClick={() => handleClick(searchTerm)}
                key={searchTerm}
                className="regular__text"
              >
                {searchTerm}
              </li>
            ))}
        </ul>
      </div>
    </Layout>
  );
}
