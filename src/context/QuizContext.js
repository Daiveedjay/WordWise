// import { createContext, useContext, useState, useEffect } from "react";

// const QuizContext = createContext();

// export const useQuizContext = () => {
//   return useContext(QuizContext);
// };

// export const QuizProvider = ({ children }) => {
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [questionsAttempted, setQuestionsAttempted] = useState(0);

//   useEffect(() => {
//     // Load stored statistics from local storage
//     const storedCorrectAnswers =
//       parseInt(localStorage.getItem("correctAnswers")) || 0;
//     const storedQuestionsAttempted =
//       parseInt(localStorage.getItem("questionsAttempted")) || 0;
//     setCorrectAnswers(storedCorrectAnswers);
//     setQuestionsAttempted(storedQuestionsAttempted);
//   }, []);

//   useEffect(() => {
//     // Update local storage when statistics change
//     localStorage.setItem("correctAnswers", correctAnswers);
//     localStorage.setItem("questionsAttempted", questionsAttempted);
//   }, [correctAnswers, questionsAttempted]);

//   const contextValue = {
//     correctAnswers,
//     setCorrectAnswers,
//     questionsAttempted,
//     setQuestionsAttempted,
//   };

//   return (
//     <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
//   );
// };

// import { createContext, useContext, useState, useEffect } from "react";
// import { db } from "@/firebase/config";
// import { useAuthContext } from "@/hooks/useAuthContext";

// const QuizContext = createContext();

// export const useQuizContext = () => {
//   return useContext(QuizContext);
// };

// export const QuizProvider = ({ children }) => {
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [questionsAttempted, setQuestionsAttempted] = useState(0);

//   const { user } = useAuthContext();

//   useEffect(() => {
//     // Load quiz data from Firestore
//     const fetchQuizData = async () => {
//       try {
//         const docRef = await db.collection("quizdata").doc(user?.uid).get();
//         if (docRef.exists()) {
//           const data = docRef.data();
//           setCorrectAnswers(data.correctAnswers);
//           setQuestionsAttempted(data.questionsAttempted);
//         }
//       } catch (error) {
//         console.error("Error fetching quiz data:", error);
//       }
//     };

//     fetchQuizData();
//   }, [user?.uid]);

//   useEffect(() => {
//     // Update quiz data in Firestore when statistics change
//     const updateQuizData = async () => {
//       try {
//         await db.collection("quizdata").doc(user?.uid).set({
//           correctAnswers,
//           questionsAttempted,
//         });
//       } catch (error) {
//         console.error("Error updating quiz data:", error);
//       }
//     };

//     updateQuizData();
//   }, [correctAnswers, questionsAttempted, user?.uid]);

//   const contextValue = {
//     correctAnswers,
//     setCorrectAnswers,
//     questionsAttempted,
//     setQuestionsAttempted,
//   };

//   return (
//     <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
//   );
// };

// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuthContext } from "@/hooks/useAuthContext";
// import { db } from "@/firebase/config";
// import { getDoc, setDoc } from "firebase/firestore";

// const QuizContext = createContext();

// export const useQuizContext = () => {
//   return useContext(QuizContext);
// };

// export const QuizProvider = ({ children }) => {
//   const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
//   const [questionsAttemptedCount, setQuestionsAttemptedCount] = useState(0);

//   const { user } = useAuthContext();

//   useEffect(() => {
//     // Load quiz data from Firestore
//     const fetchQuizData = async () => {
//       try {
//         const docRef = db.doc(`quizdata/${user?.uid}`);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setCorrectAnswersCount(data.correctAnswersCount);
//           setQuestionsAttemptedCount(data.questionsAttemptedCount);
//         }
//       } catch (error) {
//         console.error("Error fetching quiz data:", error);
//       }
//     };

//     if (user?.uid) {
//       fetchQuizData();
//     }
//   }, [user?.uid]);

//   useEffect(() => {
//     // Update quiz data in Firestore when statistics change
//     const updateQuizData = async () => {
//       try {
//         const docRef = db.doc(`quizdata/${user?.uid}`);
//         await setDoc(docRef, {
//           correctAnswersCount,
//           questionsAttemptedCount,
//         });
//       } catch (error) {
//         console.error("Error updating quiz data:", error);
//       }
//     };

//     if (user?.uid) {
//       updateQuizData();
//     }
//   }, [correctAnswersCount, questionsAttemptedCount, user?.uid]);

//   const contextValue = {
//     correctAnswersCount,
//     setCorrectAnswersCount,
//     questionsAttemptedCount,
//     setQuestionsAttemptedCount,
//   };

//   return (
//     <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
//   );
// };

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
    if (authIsReady && user?.uid) {
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
