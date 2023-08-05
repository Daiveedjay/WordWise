import Layout from "@/components/Layout";
import { useData } from "@/context/DataContext";

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
  console.log(searchesArray, "current");
  return (
    <Layout>
      <div className={styles.utility__component}>
        {searchesArray.length === 0 && (
          <h2 className="utility__header">
            You have no history in your current session to show
          </h2>
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
