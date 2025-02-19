import React, { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import QuizProgress from "./QuizProgress";
import Timer from "./Timer";
import ResultsSummary from "./ResultsSummary";
import AttemptHistory from "./AttemptHistory";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  initDB,
  saveQuizAttempt,
  updateQuizAttempt,
  getLatestIncompleteAttempt,
  getAllAttempts,
  type QuizAttempt,
} from "@/lib/indexedDB";

interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctOptionId: string;
}

interface QuizContainerProps {
  questions?: Question[];
  timePerQuestion?: number;
  onComplete?: (score: number) => void;
}

const generateUserId = () => {
  let userId = localStorage.getItem("quizUserId");
  if (!userId) {
    userId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("quizUserId", userId);
  }
  return userId;
};

const QuizContainer = ({
  questions = [
    {
      id: "1",
      text: "What is the capital of France?",
      options: [
        { id: "1", text: "London" },
        { id: "2", text: "Paris" },
        { id: "3", text: "Berlin" },
        { id: "4", text: "Madrid" },
      ],
      correctOptionId: "2",
    },
    {
      id: "2",
      text: "Which planet is known as the Red Planet?",
      options: [
        { id: "1", text: "Venus" },
        { id: "2", text: "Mars" },
        { id: "3", text: "Jupiter" },
        { id: "4", text: "Saturn" },
      ],
      correctOptionId: "2",
    },
    {
      id: "3",
      text: "What is the largest mammal?",
      options: [
        { id: "1", text: "African Elephant" },
        { id: "2", text: "Blue Whale" },
        { id: "3", text: "Giraffe" },
        { id: "4", text: "Hippopotamus" },
      ],
      correctOptionId: "2",
    },
  ],
  timePerQuestion = 30,
  onComplete = () => {},
}: QuizContainerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }>
  >([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [currentAttemptId, setCurrentAttemptId] = useState<number | null>(null);
  const [userId] = useState(generateUserId());

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const initializeQuiz = async () => {
      await initDB();
      const allAttempts = await getAllAttempts(userId);
      setAttempts(allAttempts);

      const savedAttempt = await getLatestIncompleteAttempt(userId);
      if (savedAttempt) {
        setCurrentQuestionIndex(savedAttempt.currentQuestionIndex);
        setScore(savedAttempt.score);
        setAnswers(savedAttempt.answers);
        setCurrentAttemptId(savedAttempt.id || null);
        setShowHistory(false);
      }
    };
    initializeQuiz();
  }, []);

  const saveProgress = async (isComplete: boolean = false) => {
    const attempt: QuizAttempt = {
      ...(currentAttemptId ? { id: currentAttemptId } : {}),
      userId,
      timestamp: Date.now(),
      currentQuestionIndex,
      score,
      answers,
      isComplete,
    };

    if (isComplete || !currentAttemptId) {
      const id = await saveQuizAttempt(attempt);
      setCurrentAttemptId(id);
    } else {
      await updateQuizAttempt(attempt);
    }

    const allAttempts = await getAllAttempts();
    setAttempts(allAttempts);
  };

  const handleOptionSelect = async (optionId: string) => {
    setSelectedOption(optionId);
    setIsAnswered(true);
    setTimerActive(false);

    const isCorrect = optionId === currentQuestion.correctOptionId;
    if (isCorrect) setScore((prev) => prev + 1);

    const selectedOptionText = currentQuestion.options.find(
      (opt) => opt.id === optionId,
    )?.text;
    const correctOptionText = currentQuestion.options.find(
      (opt) => opt.id === currentQuestion.correctOptionId,
    )?.text;

    const newAnswers = [
      ...answers,
      {
        question: currentQuestion.text,
        userAnswer: selectedOptionText || "",
        correctAnswer: correctOptionText || "",
        isCorrect,
      },
    ];
    setAnswers(newAnswers);

    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimerActive(true);
        await saveProgress(false);
      } else {
        setQuizComplete(true);
        onComplete(score);
        await saveProgress(true);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      handleOptionSelect("");
    }
  };

  const handleStartNewAttempt = async () => {
    setCurrentAttemptId(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
    setTimerActive(true);
    setShowHistory(false);
  };

  const handleSelectAttempt = async (id: number) => {
    const selectedAttempt = attempts.find((a) => a.id === id);
    if (selectedAttempt) {
      setCurrentAttemptId(id);
      setCurrentQuestionIndex(selectedAttempt.currentQuestionIndex);
      setScore(selectedAttempt.score);
      setAnswers(selectedAttempt.answers);
      setQuizComplete(selectedAttempt.isComplete);
      setShowHistory(false);
      setTimerActive(!selectedAttempt.isComplete);
    }
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  return (
    <Card className="w-full max-w-[800px] min-h-[600px] mx-auto p-6 bg-gray-50">
      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AttemptHistory
              attempts={attempts.map((a) => ({
                ...a,
                totalQuestions: questions.length,
              }))}
              onSelectAttempt={handleSelectAttempt}
              onStartNewAttempt={handleStartNewAttempt}
            />
          </motion.div>
        ) : !quizComplete ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-start">
              <QuizProgress
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                progress={progress}
              />
              <Timer
                duration={timePerQuestion}
                onTimeUp={handleTimeUp}
                isActive={timerActive}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <QuestionCard
                  question={currentQuestion.text}
                  options={currentQuestion.options}
                  selectedOption={selectedOption}
                  onSelectOption={handleOptionSelect}
                  isAnswered={isAnswered}
                  correctOption={currentQuestion.correctOptionId}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsSummary
              score={score}
              totalQuestions={questions.length}
              answers={answers}
              onRestart={handleStartNewAttempt}
              onReview={handleViewHistory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default QuizContainer;
