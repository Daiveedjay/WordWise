import { useAuthContext } from "@/hooks/useAuthContext";
import { useRouter } from "next/router";
import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [searches, setSearches] = useState(new Set());
  let controller;

  const { user } = useAuthContext();

  const router = useRouter();

  const fetchData = async (searchTerm) => {
    if (controller) {
      controller.abort();
    }

    controller = new AbortController();
    const signal = controller.signal;
    setIsPending(true);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`,
        { signal }
      );

      if (!response.ok) {
        if (response.status === 408)
          throw new Error(
            "Request Timeout: The server took too long to respond."
          );

        if (response.status === 503)
          throw new Error(
            "Service Unavailable: The server is currently unable to handle the request."
          );

        throw new Error(
          `The word you searched for ${searchTerm} was not found in our database. Check the spelling or try a different word`
        );
      }

      const json = await response.json();
      console.log("My json", json);

      // Update the Set by adding the new search term
      setSearches((prevSearches) => new Set(prevSearches).add(searchTerm));

      if (json === null) {
        setIsPending(false);
        setError(
          `The word you searched for ${searchTerm} was not found in our database. Check the spelling or try a different word`
        );
      } else {
        setIsPending(false);
        setData(json);
        setError(null);
        router.push("/");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setIsPending(false);
        setError(error.message);
      }
    }
  };

  // Reset data and searches when the user changes
  useEffect(() => {
    setData(null);
    setSearches(new Set());
  }, [user]);

  return (
    <DataContext.Provider
      value={{ data, isPending, error, searches, fetchData }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
