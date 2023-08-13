import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { orderBy } from "firebase/firestore";
import { useAuthContext } from "./useAuthContext";
import { db } from "@/firebase/config";

export const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    // Check if user is defined before creating the query
    if (user) {
      const q = query(
        collection(db, collectionName),
        where("uid", "==", user.uid), // Assuming user.uid exists
        orderBy("timestamp", "desc")
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
          setIsPending(false);
        },
        (error) => {
          setError("Could not fetch the data");
          setIsPending(false);
        }
      );

      return () => unsubscribe();
    } else {
      setIsPending(false); // Set isPending to false if user is not defined
    }
  }, [collectionName, user]);

  return { documents, error, isPending };
};

// export const useCollection = (collectionName) => {
//   const [documents, setDocuments] = useState(null);
//   const [error, setError] = useState(null);
//   const [isPending, setIsPending] = useState(true); // Add the isPending state

//   const { user } = useAuthContext();

//   useEffect(() => {
//     const q = query(
//       collection(db, collectionName),
//       where("uid", "==", user?.uid),
//       orderBy("timestamp", "desc")
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const results = snapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         }));

//         setDocuments(results);
//         setError(null);
//         setIsPending(false); // Set isPending to false after data is fetched
//       },
//       (error) => {
//         setError("Could not fetch the data");
//         setIsPending(false); // Set isPending to false if there's an error
//       }
//     );

//     return () => unsubscribe();
//   }, [collectionName, user?.uid]);

//   return { documents, error, isPending }; // Include isPending in the returned object
// };
