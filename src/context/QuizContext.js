// WELP
import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { db } from "@/firebase/config";
import { getDoc, setDoc, collection, doc } from "firebase/firestore";

const QuizContext = createContext();

export const useQuizContext = () => {
  return useContext(QuizContext);
};

export const QuizProvider = ({ children }) => {
  const { user, authIsReady } = useAuthContext();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // Create the "quizdata" collection if it doesn't exist
    const createQuizDataCollection = async () => {
      try {
        const collectionRef = collection(db, "quizdata");
        const docRef = doc(collectionRef, user?.uid);
        await setDoc(docRef, quizData); // Use the combined quizData object
      } catch (error) {
        console.error("Error creating quizdata collection:", error);
      }
    };

    if (user?.uid) {
      createQuizDataCollection();
    }
  }, [user?.uid, quizData]);

  // Fetch initial quiz data from Firestore and set it as the initial state
  useEffect(() => {
    const fetchAndSetInitialQuizData = async () => {
      try {
        if (authIsReady && user?.uid) {
          const docRef = doc(db, `quizdata/${user.uid}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setQuizData(data);
          } else {
            // If the document doesn't exist, set initial data
            setQuizData({
              correctAnswersCount: 0,
              questionsAttemptedCount: 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching initial quiz data:", error);
      }
    };

    fetchAndSetInitialQuizData();
  }, [authIsReady, user?.uid]);

  // Function to update quiz data in Firestore by accumulating values
  const updateQuizData = async (
    correctAnswersCountToAdd,
    questionsAttemptedCountToAdd
  ) => {
    try {
      const docRef = doc(db, `quizdata/${user?.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentQuizData = docSnap.data();

        const updatedQuizData = {
          correctAnswersCount:
            currentQuizData.correctAnswersCount + correctAnswersCountToAdd,
          questionsAttemptedCount:
            currentQuizData.questionsAttemptedCount +
            questionsAttemptedCountToAdd,
        };

        await setDoc(docRef, updatedQuizData);

        // Update the local context state as well
        setQuizData(updatedQuizData);
      } else {
        console.error("Document does not exist.");
      }
    } catch (error) {
      console.error("Error updating quiz data:", error);
    }
  };

  const contextValue = {
    quizData,
    setQuizData,
    updateQuizData,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
};
