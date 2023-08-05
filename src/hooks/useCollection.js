import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { useAuthContext } from "./useAuthContext";
import { db } from "@/firebase/config";
export const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      where("uid", "==", user?.uid),
      orderBy("timestamp", "desc") // Order by timestamp, newest to oldest
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("Could not fetch the data");
      }
    );

    // Unsubscribe on unmount
    return () => unsubscribe();
  }, [collectionName, user?.uid]);

  return { documents, error };
};
