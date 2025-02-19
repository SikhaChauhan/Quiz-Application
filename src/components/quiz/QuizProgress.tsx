import React from "react";
import { Progress } from "../ui/progress";

interface QuizProgressProps {
  currentQuestion?: number;
  totalQuestions?: number;
  progress?: number;
}

const QuizProgress = ({
  currentQuestion = 1,
  totalQuestions = 10,
  progress = (1 / 10) * 100,
}: QuizProgressProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="w-full h-2" />
    </div>
  );
};

export default QuizProgress;
