// // import Layout from "@/components/Layout";
// // import styles from "@/styles/Quiz.module.css";

// // import { FaRegQuestionCircle } from "react-icons/fa";
// // function QuizPage({ data }) {
// //   console.log(data);
// //   return (
// //     <Layout title={"Quiz"}>
// //       <div className={styles.quiz__page}>
// //         {/* <div className={styles.quiz__modal}>
// //           <FaRegQuestionCircle fontSize={"50px"} fill="#a445ed" />
// //           <h1 className="utility__header">
// //             Are you ready to test your knowledge ?
// //           </h1>
// //           <button className={styles.quiz__button}>Take test</button>
// //         </div> */}
// //       </div>
// //     </Layout>
// //   );
// // }

// // export default QuizPage;

// // import React from "react";
// // import Layout from "@/components/Layout";
// // import styles from "@/styles/Quiz.module.css";

// // import { FaRegQuestionCircle } from "react-icons/fa";

// // function QuizPage({ data }) {
// //   // Assuming data is an array of 10 question objects received from the server
// //   const questions = data.slice(0, 10); // Get the first 10 questions (you can adjust the number as needed)

// //   // Function to shuffle the answer options
// //   function shuffleAnswers(answers) {
// //     return answers.sort(() => Math.random() - 0.5);
// //   }

// //   return (
// //     <Layout title={"Quiz"}>
// //       <div className={styles.quiz__page}>
// //         {questions.map((questionObj, index) => {
// //           const questionText = questionObj.question.text;
// //           const correctAnswer = questionObj.correctAnswer;
// //           const incorrectAnswers = questionObj.incorrectAnswers;
// //           const allAnswers = shuffleAnswers([
// //             correctAnswer,
// //             ...incorrectAnswers,
// //           ]);

// //           return (
// //             <div key={index} className={styles.quiz__question}>
// //               <h2>{questionText}</h2>
// //               <ul>
// //                 {allAnswers.map((answer, answerIndex) => (
// //                   <li key={answerIndex}>
// //                     <button onClick={() => checkAnswer(answer, correctAnswer)}>
// //                       {answer}
// //                     </button>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </Layout>
// //   );
// // }

// // export default QuizPage;

// import React, { useState } from "react";
// import Layout from "@/components/Layout";
// import styles from "@/styles/Quiz.module.css";

// import { FaRegQuestionCircle } from "react-icons/fa";

// function QuizPage({ data }) {
//   console.log(data);
//   // Assuming data is an array of question objects received from the server
//   const questions = data.slice(0, 10); // Get the first 10 questions (you can adjust the number as needed)

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const questionObj = questions[currentQuestion];
//   console.log(questionObj);
//   const questionText = questionObj.question.text;
//   const correctAnswer = questionObj.correctAnswer;
//   const incorrectAnswers = questionObj.incorrectAnswers;
//   const allAnswers = shuffleAnswers([correctAnswer, ...incorrectAnswers]);

//   // Function to shuffle the answer options
//   function shuffleAnswers(answers) {
//     return answers.sort(() => Math.random() - 0.5);
//   }

//   // Function to handle selecting an answer and move to the next question
//   function handleAnswerSelect(selectedAnswer) {
//     if (selectedAnswer === correctAnswer) {
//       alert("Correct answer!");
//     } else {
//       alert("Incorrect answer. Try again.");
//     }

//     // Move to the next question
//     setCurrentQuestion((prevQuestion) => prevQuestion + 1);
//   }

//   return (
//     <Layout title={"Quiz"}>
//       <div className={styles.quiz__page}>
//         {currentQuestion < questions.length ? (
//           <div className={styles.quiz__question}>
//             <h2 className={styles.question__number}>
//               Question {currentQuestion + 1}
//             </h2>
//             <h2 className={`${styles.question__text} utility__header`}>
//               {questionText}
//             </h2>
//             <ul className={styles.answers__container}>
//               {allAnswers.map((answer, answerIndex) => (
//                 <li className={styles.answer__option} key={answerIndex}>
//                   <button
//                     className={styles.answer__button}
//                     onClick={() => handleAnswerSelect(answer)}
//                   >
//                     {answer}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             <div className={styles.action__buttons}>
//               <button>Submit</button>
//               <button>Next Question</button>
//             </div>
//           </div>
//         ) : (
//           // Render something else when all questions are answered
//           <div className={styles.quiz__result}>
//             <h2>Congratulations! You have completed the quiz.</h2>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }

// export default QuizPage;

// export async function getServerSideProps() {
//   const res = await fetch(`https://the-trivia-api.com/v2/questions`);
//   const data = await res.json();

//   return {
//     props: { data },
//   };
// }

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import styles from "@/styles/Quiz.module.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuizContext } from "@/context/QuizContext";
import { useRouter } from "next/router";

function QuizPage({ initialData, error }) {
  console.log(initialData);
  const [data, setData] = useState(initialData);
  const questions = data?.slice(0, 2);
  const router = useRouter();

  const {
    correctAnswersCount,
    setCorrectAnswersCount,
    setQuestionsAttemptedCount,
  } = useQuizContext();

  const fetchNewData = async () => {
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(
        `https://the-trivia-api.com/v2/questions?timestamp=${timestamp}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const newData = await res.json();
      setData(newData);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      // You can handle the error here, e.g., show an error message to the user
    }
  };

  // const questions = data.slice(0, 2);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const [quizCompleted, setQuizCompleted] = useState(false);

  const questionObj = questions && questions[currentQuestion];
  const questionText = questionObj?.question.text;
  const correctAnswer = questionObj?.correctAnswer;

  const incorrectAnswers = useMemo(() => {
    return questionObj?.incorrectAnswers ?? [];
  }, [questionObj?.incorrectAnswers]);

  useEffect(() => {
    if (correctAnswer) {
      const shuffledAnswers = shuffleAnswers([
        correctAnswer,
        ...incorrectAnswers,
      ]);
      setAllAnswers(shuffledAnswers);
    }
  }, [correctAnswer, incorrectAnswers]);

  const shuffleAnswers = (answers) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer) => {
    setIsAnswerCorrect(false);
    setSelectedAnswer(answer);
    setShowSubmitButton(true); // Enable the "Submit" button when an answer is selected
    setAreButtonsDisabled(false); // Enable answer buttons after a new answer is selected
    setIsAnswerSubmitted(false); // Reset answer submission status
    setIsSubmitClicked(false);
  };

  const handleNextQuestion = () => {
    setAllAnswers([]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setIsAnswerSubmitted(false);
      setAreButtonsDisabled(false);

      setIsSubmitClicked(false);
    } else {
      setQuizCompleted(true);
    }
    setSelectedAnswer(null);
  };
  // const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const handleSubmit = () => {
    console.log(allAnswers);
    allAnswers.forEach((answer) => {
      if (answer === correctAnswer) {
        const buttonElement = document?.querySelector(
          `[data-text="${answer.replace(/"/g, '\\"')}"]`
          // `[data-text="${answer}"]`
        );
        if (buttonElement) {
          buttonElement.classList.remove("wrong");
          buttonElement.classList.add("correct");
          console.log("----- The found button ------", buttonElement);
        }
      }
    });
    setShowSubmitButton(false);
    setIsAnswerSubmitted(true);
    setAreButtonsDisabled(true);
    setIsSubmitClicked(true);
    if (selectedAnswer === correctAnswer) {
      setIsAnswerCorrect(true);
      toast.success("Correct answer!");
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    } else {
      setIsAnswerCorrect(false);
      toast.error("Incorrect answer");
    }
    // Update the questionsAttempted count
    setQuestionsAttemptedCount((prevCount) => prevCount + 1);
  };

  console.log("Length", currentQuestion, questions?.length);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowSubmitButton(false);
    setAllAnswers([]);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(false);
    setAreButtonsDisabled(false);
    setIsSubmitClicked(false);
    setQuizCompleted(false);

    // Fetch new data and update questions
    fetchNewData();
  };

  const handleStats = () => {
    router.push("/admin");
  };

  return (
    <Layout title={"Quiz"}>
      <div className={styles.quiz__page}>
        <ToastContainer />
        {error && (
          <div className={`${styles.error} `}>
            <h1>An error occured while fetching your data</h1>
            <button className={styles.restart__quiz} onClick={fetchNewData}>
              Try again
            </button>
          </div>
        )}
        {!error && (
          <>
            {!quizCompleted && currentQuestion <= questions?.length - 1 ? (
              <div className={styles.quiz__question}>
                <h2 className={styles.question__number}>
                  Question {currentQuestion + 1}
                </h2>
                <h2 className={`${styles.question__text} utility__header`}>
                  {questionText}
                </h2>
                <ul className={styles.answers__container}>
                  {allAnswers.map((answer, answerIndex) => (
                    <li className={styles.answer__option} key={answerIndex}>
                      <div
                        className={`${styles.answer__letter} ${
                          selectedAnswer === answer ? "selected" : ""
                        }`}
                      >
                        {String.fromCharCode(97 + answerIndex)}
                        {/* Convert index to letter */}
                      </div>
                      <button
                        className={`${styles.answer__button} ${
                          selectedAnswer === answer ? "selected" : ""
                        } ${
                          isAnswerSubmitted &&
                          selectedAnswer === answer &&
                          isAnswerCorrect
                            ? "correct"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(answer)}
                        disabled={areButtonsDisabled}
                        data-text={answer}
                      >
                        {answer}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={styles.action__buttons}>
                  <button
                    onClick={() => {
                      if (currentQuestion > 0) {
                        handleRestart();
                      }
                    }}
                    className={styles.restart__quiz}
                  >
                    Restart Quiz
                  </button>
                  <div className={styles.controls}>
                    {showSubmitButton && (
                      <button
                        className={styles.submit__button}
                        onClick={() => handleSubmit()}
                        disabled={
                          !selectedAnswer ||
                          areButtonsDisabled ||
                          isSubmitClicked
                        }
                      >
                        Submit
                      </button>
                    )}

                    {currentQuestion <= questions.length && (
                      <button
                        className={styles.next__button}
                        onClick={handleNextQuestion}
                        // disabled={
                        //   isAnswerSubmitted === false || areButtonsDisabled === true
                        // }
                        disabled={!isSubmitClicked}
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.quiz__result}>
                <h2 className="utility__header">
                  Congratulations! You have completed the quiz.
                </h2>
                <p className="small__text">
                  You answered <span>{correctAnswersCount} </span>out of{" "}
                  <span>{questions?.length} </span>
                  questions correctly.
                </p>
                <p className="small__text">
                  Percentage pass:{" "}
                  <span>
                    {(correctAnswersCount / questions?.length) * 100}%
                  </span>
                </p>
                <button
                  onClick={handleRestart}
                  className={styles.restart__quiz}
                >
                  Take another quiz
                </button>
                <button onClick={handleStats} className={styles.restart__quiz}>
                  See Stats
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default QuizPage;

export async function getServerSideProps() {
  try {
    const res = await fetch(`https://the-trivia-api.com/v2/questions`);
    const data = await res.json();

    return {
      props: { initialData: data },
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      props: { initialData: null, error: true },
    };
  }
}

{
  /* <button
                    className={`${styles.answer__button} ${
                      selectedAnswer === answer ? "selected" : ""
                    } ${
                      isAnswerSubmitted
                        ? selectedAnswer === answer && isAnswerCorrect
                          ? "correct"
                          : ""
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(answer)}
                    disabled={areButtonsDisabled}
                    data-text={answer}
                  >
                    {answer}
                  </button> */
}

// isAnswerSubmitted && isAnswerCorrect
//   ? "correct"
//   : isAnswerSubmitted
//   ? "wrong"
//   : ""
// selectedAnswer === answer
//   ? isAnswerCorrect
//     ? "correct"
//     : "wrong"
//   : answer === correctAnswer
//   ? "correct"
//   : "wrong"

{
  /* {isAnswerSubmitted &&
                wrongAns.map((ans) => (
                  <button className="wrong" key={ans}>
                    {ans}
                  </button>
                ))}
              {isAnswerSubmitted &&
                rightAns.map((ans) => (
                  <button className="correct" key={ans}>
                    {ans}
                  </button>
                ))} */
}
