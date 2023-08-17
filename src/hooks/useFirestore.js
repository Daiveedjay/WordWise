import { useReducer, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "react-hot-toast";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        ...state,
        isPending: true,
      };

    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  // collection ref
  const ref = collection(db, collectionName);

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // Add new document reference
  const favouriteWord = async (dataKey, dataName, uid) => {
    dispatch({ type: "IS_PENDING" });
    try {
      if (uid && dataKey) {
        // Check for existing bookmark
        const existingFavouriteQuery = query(
          ref,
          where("uid", "==", uid),
          where("dataKey", "==", dataKey)
        );
        const existingFavouriteSnapshot = await getDocs(existingFavouriteQuery);

        if (existingFavouriteSnapshot.empty) {
          // Add document if the bookmark doesn't exist
          const addedDocument = await addDoc(ref, {
            dataKey,
            dataName,
            uid,
            timestamp: serverTimestamp(),
          });

          toast.success(`${dataKey} added to your favourites`);
          dispatchIfNotCancelled({
            type: "ADDED_DOCUMENT",
            payload: addedDocument,
          });
        }
      } else {
        dispatchIfNotCancelled({
          type: "ERROR",
          payload: "Bookmark already exists",
        });
      }
    } catch (error) {
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  // Delete new document
  const deleteFavourite = async (dataKey) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // Find the document with the given dataKey
      const deleteFavouriteQuery = query(ref, where("dataKey", "==", dataKey));

      const deleteFavouriteSnapshot = await getDocs(deleteFavouriteQuery);

      if (!deleteFavouriteSnapshot.empty) {
        // Delete the document if found
        const docID = deleteFavouriteSnapshot.docs[0].id;
        await deleteDoc(doc(ref, docID));
        toast.success(`${dataKey} removed from your favourites`);
        dispatchIfNotCancelled({
          type: "DELETED_DOCUMENT",
        });
      } else {
        dispatchIfNotCancelled({
          type: "ERROR",
          payload: "Bookmark not found",
        });
      }
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "Could not delete" });
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { deleteFavourite, favouriteWord, response };
};
