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

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import styles from "@/styles/Quiz.module.css";
import { FaRegQuestionCircle } from "react-icons/fa";

function QuizPage({ data }) {
  console.log(data);
  const questions = data.slice(0, 10);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const [quizCompleted, setQuizCompleted] = useState(false);

  const questionObj = questions[currentQuestion];
  // console.log("Here", questionObj, currentQuestion);
  const questionText = questionObj?.question.text;
  const correctAnswer = questionObj?.correctAnswer;
  const incorrectAnswers = questionObj?.incorrectAnswers;
  useEffect(() => {
    const shuffledAnswers = shuffleAnswers([
      correctAnswer,
      ...incorrectAnswers,
    ]);
    setAllAnswers(shuffledAnswers);
  }, [correctAnswer, currentQuestion, incorrectAnswers]);

  const shuffleAnswers = (answers) => {
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer) => {
    setIsAnswerCorrect(false);
    setSelectedAnswer(answer);
    console.log("My answer", answer);
  };

  useEffect(() => {
    console.log("My answer in state", selectedAnswer);
  }, [selectedAnswer]);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
    setSelectedAnswer(null);
  };

  // const handleSubmit = () => {
  //   setShowSubmitButton(false);
  //   setIsAnswerSubmitted(true);
  //   if (selectedAnswer === correctAnswer) {
  //     setIsAnswerCorrect(true);
  //     alert("Correct answer!");
  //   } else {
  //     setIsAnswerCorrect(false);
  //     alert("Incorrect answer. Try again.");
  //   }
  // };

  const handleSubmit = () => {
    setIsAnswerSubmitted(true);

    // Determine if the selected answer is correct
    const isCorrect = selectedAnswer === correctAnswer;

    // Create a new array of answer buttons with updated classes
    const updatedAnswers = allAnswers.map((answer) => ({
      text: answer,
      isCorrect: answer === correctAnswer,
      isSelected: answer === selectedAnswer,
    }));

    setAllAnswers(updatedAnswers);

    if (isCorrect) {
      setIsAnswerCorrect(true);
      alert("Correct answer!");
    } else {
      setIsAnswerCorrect(false);
      alert("Incorrect answer. Try again.");
    }

    setShowSubmitButton(false);
  };

  console.log("Length", currentQuestion, questions.length);

  return (
    <Layout title={"Quiz"}>
      <div className={styles.quiz__page}>
        {!quizCompleted && currentQuestion <= questions.length - 1 ? (
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
                  <button
                    className={`${styles.answer__button} ${
                      selectedAnswer === answer ? "selected" : ""
                    } ${
                      isAnswerSubmitted
                        ? selectedAnswer === answer && isAnswerCorrect
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(answer)}
                  >
                    {answer}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.action__buttons}>
              <button
                className={styles.submit__button}
                onClick={handleSubmit}
                disabled={!selectedAnswer}
              >
                Submit
              </button>

              {/* {selectedAnswer && !showSubmitButton && ( */}
              {currentQuestion <= questions.length && (
                <button
                  className={styles.next__button}
                  onClick={handleNextQuestion}
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.quiz__result}>
            <h2>Congratulations! You have completed the quiz.</h2>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default QuizPage;

export async function getServerSideProps() {
  const res = await fetch(`https://the-trivia-api.com/v2/questions`);
  const data = await res.json();

  return {
    props: { data },
  };
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
