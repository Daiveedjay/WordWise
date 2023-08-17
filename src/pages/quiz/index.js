import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import styles from "@/styles/Quiz.module.css";

import QuizData from "@/quiz.json";
import { useQuizContext } from "@/context/QuizContext";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const QUESTIONS_COUNT = 10;
function QuizPage() {
  const [data] = useState(QuizData); // Use the imported JSON data

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const maxIndex = data.length - 1; // The maximum index in the array
    const selectedIndices = generateRandomIndices(maxIndex, QUESTIONS_COUNT);

    const newQuestions = selectedIndices.map((index) => data[index]);

    // Set the questions in state
    setQuestions(newQuestions);

    // Update your context or state here
  }, [data]);

  // Function to generate random unique indices
  const generateRandomIndices = (maxIndex, count) => {
    const indices = new Set();

    while (indices.size < count) {
      const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
      indices.add(randomIndex);
    }

    return Array.from(indices);
  };

  const router = useRouter();

  // const { updateQuizData } = useQuizContext();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const [currentCorrectAnswers, setCurrentCorrectAnswers] = useState(0);

  const [currentAttemptedQuestions, setCurrentAttemptedQuestions] = useState(0);
  const questionObj = questions && questions[currentQuestion];
  const questionText = questionObj?.question.text;
  const correctAnswer = questionObj?.correctAnswer;

  const [quizCompleted, setQuizCompleted] = useState(false);

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
    if (currentQuestion === questions.length - 1) {
      setQuizCompleted(true);
    }

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

  const handleSubmit = () => {
    allAnswers?.forEach((answer) => {
      if (answer === correctAnswer) {
        const buttonElement = document?.querySelector(
          `[data-text="${answer.replace(/"/g, '\\"')}"]`
        );
        if (buttonElement) {
          buttonElement.classList.remove("wrong");
          buttonElement.classList.add("correct");
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
      setCurrentCorrectAnswers((prevCount) => prevCount + 1);
    } else {
      setIsAnswerCorrect(false);
      toast.error("Incorrect answer");
    }

    setCurrentAttemptedQuestions((prevCount) => prevCount + 1);
  };

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
    setCurrentCorrectAnswers(0);
    setCurrentAttemptedQuestions(0);

    // Re-generate random question indices
    const maxIndex = data.length - 1;
    const selectedIndices = generateRandomIndices(maxIndex, QUESTIONS_COUNT);

    const newQuestions = selectedIndices.map((index) => data[index]);
    setQuestions(newQuestions);

    // Re-shuffle answers using the JSON data
    if (questions[currentQuestion]?.correctAnswer) {
      const shuffledAnswers = shuffleAnswers([
        questions[currentQuestion]?.correctAnswer,
        ...questions[currentQuestion]?.incorrectAnswers,
      ]);
      setAllAnswers(shuffledAnswers);
    }
  };

  const { updateQuizData } = useQuizContext();

  const handleFinish = async () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    if (currentQuestion === questions.length - 1) {
      await updateQuizData(currentCorrectAnswers, currentAttemptedQuestions);
    }
  };

  const handleStats = () => {
    router.push("/admin");
  };

  return (
    <Layout
      title={"WordWise - Vocabulary Quiz"}
      description={"Test your vocabulary with fun quizzes on WordWise."}
      keywords={"vocabulary quiz, learning, app"}
    >
      <div className={styles.quiz__page}>
        {
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
                    onClick={() => handleRestart()}
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

                    {isAnswerSubmitted &&
                      currentQuestion <= questions.length && (
                        <>
                          {currentQuestion === questions.length - 1 ? (
                            <button
                              className={styles.next__button}
                              onClick={handleFinish}
                              disabled={!isSubmitClicked}
                            >
                              Finish
                            </button>
                          ) : (
                            <button
                              className={styles.next__button}
                              onClick={handleNextQuestion}
                              disabled={!isSubmitClicked}
                            >
                              Next Question
                            </button>
                          )}
                        </>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.quiz__result}>
                <h2 className="utility__header loading__header ">
                  Congratulations! You have completed the quiz.
                </h2>
                <p style={{ textAlign: "center" }} className="small__text">
                  You answered <span>{currentCorrectAnswers} </span>out of{" "}
                  <span>{questions?.length} </span>
                  questions correctly.
                </p>
                <p className="small__text">
                  Percentage pass:{" "}
                  <span>
                    {Math.floor(
                      (currentCorrectAnswers / questions?.length) * 100
                    )}
                    %
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
        }
      </div>
    </Layout>
  );
}

export default QuizPage;
