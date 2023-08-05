import styles from "@/styles/Home.module.css";
import Layout from "@/components/Layout";

import SearchResult from "@/components/SearchResult";

export default function Home() {
  return (
    <Layout>
      <div className={`${styles.main__container}`}>
        <div className={`${styles.Home__result}`}>
          <SearchResult />
        </div>
      </div>
    </Layout>
  );
}
