import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question?: string;
  options?: Option[];
  selectedOption?: string | null;
  onSelectOption?: (optionId: string) => void;
  isAnswered?: boolean;
  correctOption?: string;
}

const QuestionCard = ({
  question = "What is the capital of France?",
  options = [
    { id: "1", text: "London" },
    { id: "2", text: "Paris" },
    { id: "3", text: "Berlin" },
    { id: "4", text: "Madrid" },
  ],
  selectedOption = null,
  onSelectOption = () => {},
  isAnswered = false,
  correctOption = "2",
}: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-[760px] p-6 bg-white shadow-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">{question}</h2>

          <div className="grid gap-4">
            {options.map((option, index) => {
              const isSelected = selectedOption === option.id;
              const isCorrect = isAnswered && option.id === correctOption;
              const isWrong =
                isAnswered && isSelected && option.id !== correctOption;

              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    key={option.id}
                    variant="outline"
                    className={cn(
                      "w-full p-4 h-auto justify-start text-left font-normal hover:bg-gray-100",
                      isSelected && !isAnswered && "border-blue-500 bg-blue-50",
                      isCorrect && "border-green-500 bg-green-50",
                      isWrong && "border-red-500 bg-red-50",
                    )}
                    onClick={() => !isAnswered && onSelectOption(option.id)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                          isSelected && !isAnswered && "border-blue-500",
                          isCorrect && "border-green-500",
                          isWrong && "border-red-500",
                        )}
                      >
                        {isSelected && (
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              !isAnswered && "bg-blue-500",
                              isCorrect && "bg-green-500",
                              isWrong && "bg-red-500",
                            )}
                          />
                        )}
                      </div>
                      <span className="text-base">{option.text}</span>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
