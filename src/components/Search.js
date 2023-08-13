import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/Search.module.css";
import { useData } from "@/context/DataContext";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, error, fetchData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searchTerm.trim() !== "") {
      await fetchData(searchTerm);
      setSearchTerm("");

      // Check if data is empty (no results)
      if (error) {
        toast.error("No results found for the search term.");
      }
    } else {
      toast.error("Search term is empty. Please enter a valid term.");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className={styles.search__component}>
        <input
          type="text"
          placeholder="Get curious, find a word..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />

        <FaSearch
          fontWeight={400}
          fill="#a445ed"
          fontSize={15}
          className={styles.search__icon}
          onClick={handleSubmit}
        />
      </form>
    </>
  );
}
