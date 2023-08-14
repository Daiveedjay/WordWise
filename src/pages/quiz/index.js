import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import styles from "@/styles/Quiz.module.css";
import { toast } from "react-toastify";
import QuizData from "@/quiz.json";
import { useQuizContext } from "@/context/QuizContext";
import { useRouter } from "next/router";
function getRandomIndex(maxIndex) {
  return Math.floor(Math.random() * maxIndex);
}

const QUESTIONS_COUNT = 3;
function QuizPage() {
  const [data] = useState(QuizData); // Use the imported JSON data

  const [questions, setQuestions] = useState([]);
  // const questions = data?.slice(0, 2);
  // console.log(questions);
  useEffect(() => {
    const maxIndex = data.length - QUESTIONS_COUNT;
    let index1 = getRandomIndex(maxIndex);
    let index2 = index1 + QUESTIONS_COUNT - 1;

    // Swap indexes if index2 is smaller than index1
    if (index2 < index1) [index1, index2] = [index2, index1];

    const newQuestions = data?.slice(index1, index2 + 1);

    // Set the questions in state
    setQuestions(newQuestions);

    // Update your context or state here
  }, [data]);

  console.log(questions);

  const router = useRouter();

  const { setCorrectAnswersCount, setQuestionsAttemptedCount } =
    useQuizContext();

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

  const [currentQuizAnswers, setCurrentQuizAnswers] = useState(0);

  const handleSubmit = () => {
    console.log(allAnswers);
    allAnswers.forEach((answer) => {
      if (answer === correctAnswer) {
        const buttonElement = document?.querySelector(
          `[data-text="${answer.replace(/"/g, '\\"')}"]`
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
      setCurrentQuizAnswers((prevCount) => prevCount + 1);
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
    setCurrentQuizAnswers(0);

    // Re-generate random questions
    let index1 = getRandomIndex(data.length);
    let index2 = index1 + QUESTIONS_COUNT - 1;

    if (index2 < index1) [index1, index2] = [index2, index1];

    const newQuestions = data?.slice(index1, index2 + 1);
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
        {/* {error && (
          <div className={`${styles.error} `}>
            <h1>An error occured while fetching your data</h1>
            <button className={styles.restart__quiz} onClick={fetchNewData}>
              Try again
            </button>
          </div>
        )} */}
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
                        disabled={!isSubmitClicked}
                      >
                        {currentQuestion === questions.length - 1
                          ? "Finish"
                          : "Next Question"}
                      </button>
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
                  You answered <span>{currentQuizAnswers} </span>out of{" "}
                  <span>{questions?.length} </span>
                  questions correctly.
                </p>
                <p className="small__text">
                  Percentage pass:{" "}
                  <span>
                    {Math.floor((currentQuizAnswers / questions?.length) * 100)}
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
