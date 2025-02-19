import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Answer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ResultsSummaryProps {
  score?: number;
  totalQuestions?: number;
  answers?: Answer[];
  onRestart?: () => void;
  onReview?: () => void;
}

const ResultsSummary = ({
  score = 7,
  totalQuestions = 10,
  answers = [
    {
      question: "What is the capital of France?",
      userAnswer: "Paris",
      correctAnswer: "Paris",
      isCorrect: true,
    },
    {
      question: "Which planet is known as the Red Planet?",
      userAnswer: "Venus",
      correctAnswer: "Mars",
      isCorrect: false,
    },
    {
      question: "What is the largest mammal?",
      userAnswer: "Blue Whale",
      correctAnswer: "Blue Whale",
      isCorrect: true,
    },
  ],
  onRestart = () => {},
  onReview = () => {},
}: ResultsSummaryProps) => {
  const percentage = (score / totalQuestions) * 100;

  return (
    <Card className="w-full max-w-[760px] p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <motion.div
            className="relative w-40 h-40 mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Progress
              value={percentage}
              className="w-full h-full rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="bg-white rounded-full p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-4xl font-bold">
                  {percentage.toFixed(2)}%
                </span>
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            You scored {score} out of {totalQuestions} questions
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-xl font-semibold">Detailed Breakdown</h3>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {answers.map((answer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 1.2 }}
                    className="p-4 rounded-lg border bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">Question {index + 1}:</p>
                        <p className="text-gray-600">{answer.question}</p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            Your answer:{" "}
                            <span className="font-medium">
                              {answer.userAnswer}
                            </span>
                          </p>
                          {!answer.isCorrect && (
                            <p className="text-sm">
                              Correct answer:{" "}
                              <span className="font-medium text-green-600">
                                {answer.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 1.4 }}
                      >
                        {answer.isCorrect ? (
                          <CheckCircle2 className="text-green-500 h-6 w-6 flex-shrink-0" />
                        ) : (
                          <XCircle className="text-red-500 h-6 w-6 flex-shrink-0" />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Button variant="outline" onClick={onReview}>
            Review Answers
          </Button>
          <Button onClick={onRestart}>Try Again</Button>
          <Button variant="secondary" onClick={onReview}>
            View All Attempts
          </Button>
        </motion.div>
      </div>
    </Card>
  );
};

export default ResultsSummary;
