import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/Search.module.css";
import { useData } from "@/context/DataContext";
import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, error, fetchData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.preventDefault();
    // await fetchData(searchTerm);
    // setSearchTerm("");
    // Check if the search term is not empty
    if (searchTerm.trim() !== "") {
      await fetchData(searchTerm);
      setSearchTerm("");
    } else {
      // Show a message or take some other action to handle empty search term
      toast.error("Search term is empty. Please enter a valid term.");
    }
  };
  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.search__component}>
        <input
          type="text"
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
      {isPending && <div>Loading</div>}
      {data && <div>Data has arrived</div>}
    </>
  );
}
