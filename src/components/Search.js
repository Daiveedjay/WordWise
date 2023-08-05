import Image from "next/image";
import { useState } from "react";
import SearchIcon from "../../public/media/icon-search.svg";
import styles from "@/styles/Search.module.css";
import { useData } from "@/context/DataContext";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, error, fetchData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchData(searchTerm);
    setSearchTerm("");
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={styles.search__component}>
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <Image
          src={SearchIcon}
          width={15}
          height={15}
          alt="Search Icon"
          onClick={handleSubmit}
        />
      </form>
      {isPending && <div>Loading</div>}
      {data && <div>Data has arrived</div>}
    </>
  );
}
