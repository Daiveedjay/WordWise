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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function QuizPage({ data }) {
  console.log(data);
  const questions = data.slice(0, 2);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const [quizCompleted, setQuizCompleted] = useState(false);

  const questionObj = questions[currentQuestion];
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

  // const handleAnswerSelect = (answer) => {
  //   setIsAnswerCorrect(false);
  //   setSelectedAnswer(answer);
  //   console.log("My answer", answer);
  // };

  const handleAnswerSelect = (answer) => {
    setIsAnswerCorrect(false);
    setSelectedAnswer(answer);
    setShowSubmitButton(true); // Enable the "Submit" button when an answer is selected
    setAreButtonsDisabled(false); // Enable answer buttons after a new answer is selected
    setIsAnswerSubmitted(false); // Reset answer submission status
    setIsSubmitClicked(false);
  };

  useEffect(() => {
    console.log("My answer in state", selectedAnswer);
  }, [selectedAnswer]);

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

  const [wrongAns, setWrongAns] = useState([]);
  const [rightAns, setRightAns] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const handleSubmit = () => {
    console.log('----All answers-----', allAnswers);
    console.log('correct answers-----', correctAnswer);
    allAnswers.forEach((answer) => {
      if (answer === correctAnswer) {
        const buttonElement = document.querySelector(`[data-text="${answer}"]`);
        buttonElement.classList.remove('wrong');
        buttonElement.classList.add('correct');
        console.log('----- The found button------', buttonElement)
      }
    });
    // const wrongAns = allAnswers.filter((ans) => ans !== correctAnswer);
    // const rightAns = allAnswers.filter((ans) => ans === correctAnswer);
    // setRightAns(rightAns);
    // console.log("check", wrongAns);
    // setWrongAns(wrongAns);
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
      toast.error("Incorrect answer. Try again.");
    }
  };
  useEffect(() => console.log("check 2", wrongAns), [wrongAns]);

  console.log("Length", currentQuestion, questions.length);
  // const handleRestart = () => {
  //   setCurrentQuestion(0);
  //   setQuizCompleted(false);
  // };
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
    setWrongAns([]);
    setRightAns([]);
    setCorrectAnswersCount(0);
  };

  const generateNewQuiz = () => {
    const newQuestions = shuffleQuestions(data.slice(0, 10)); // Generate new shuffled questions
    setCurrentQuestion(0); // Start from the first question
    newQuestions(newQuestions); // Update the questions state with new questions
    setSelectedAnswer(null);
    setShowSubmitButton(false);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(false);
    setAreButtonsDisabled(false);
    setIsSubmitClicked(false);
    setWrongAns([]);
    setRightAns([]);
    setCorrectAnswersCount(0);
    setQuizCompleted(false);
  };

  useEffect(() => {
    console.log("current que", currentQuestion);
  }, [currentQuestion]);

  return (
    <Layout title={"Quiz"}>
      <div className={styles.quiz__page}>
        <ToastContainer />
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
                      !selectedAnswer || areButtonsDisabled || isSubmitClicked
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
            <h2>Congratulations! You have completed the quiz.</h2>
            <p>
              You answered {correctAnswersCount} out of {questions.length}{" "}
              questions correctly.
            </p>
            <p>
              Percentage pass: {(correctAnswersCount / questions.length) * 100}%
            </p>
            <button onClick={handleRestart} className={styles.restart__quiz}>
              Restart Quiz
            </button>
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
