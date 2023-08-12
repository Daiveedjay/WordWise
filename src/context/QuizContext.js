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
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [questionsAttemptedCount, setQuestionsAttemptedCount] = useState(0);

  useEffect(() => {
    // Create the "quizdata" collection if it doesn't exist
    const createQuizDataCollection = async () => {
      try {
        const collectionRef = collection(db, "quizdata");
        const docRef = doc(collectionRef, user?.uid);
        await setDoc(docRef, {
          correctAnswersCount: 0,
          questionsAttemptedCount: 0,
        });
      } catch (error) {
        console.error("Error creating quizdata collection:", error);
      }
    };

    if (user?.uid) {
      createQuizDataCollection();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      const fetchQuizData = async () => {
        try {
          const docRef = doc(db, `quizdata/${user?.uid}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setCorrectAnswersCount(data.correctAnswersCount);
            setQuestionsAttemptedCount(data.questionsAttemptedCount);
          } else {
            // If the document doesn't exist, create it here
          }
        } catch (error) {
          console.error("Error fetching quiz data:", error);
        }
      };

      fetchQuizData();
    }
  }, [user?.uid, authIsReady]);

  useEffect(() => {
    // Update quiz data in Firestore when statistics change
    const updateQuizData = async () => {
      try {
        const docRef = doc(db, `quizdata/${user?.uid}`);
        await setDoc(docRef, {
          correctAnswersCount,
          questionsAttemptedCount,
        });
      } catch (error) {
        console.error("Error updating quiz data:", error);
      }
    };

    if (user?.uid) {
      updateQuizData();
    }
  }, [correctAnswersCount, questionsAttemptedCount, user?.uid]);

  const contextValue = {
    correctAnswersCount,
    setCorrectAnswersCount,
    questionsAttemptedCount,
    setQuestionsAttemptedCount,
  };

  useEffect(() => {
    console.log(
      "------Context Value Indicator-----------",
      correctAnswersCount,
      questionsAttemptedCount
    );
  }, [correctAnswersCount, questionsAttemptedCount]);

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
};
