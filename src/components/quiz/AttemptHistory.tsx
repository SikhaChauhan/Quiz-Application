import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";

interface AttemptHistoryProps {
  attempts: Array<{
    id?: number;
    timestamp: number;
    score: number;
    totalQuestions: number;
    isComplete: boolean;
  }>;
  onSelectAttempt: (id: number) => void;
  onStartNewAttempt: () => void;
}

const AttemptHistory = ({
  attempts = [],
  onSelectAttempt,
  onStartNewAttempt,
}: AttemptHistoryProps) => {
  const sortedAttempts = [...attempts].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <Card className="w-full max-w-[800px] p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Quiz Attempts</h2>
          <Button onClick={onStartNewAttempt} className="gap-2">
            <Trophy className="w-4 h-4" />
            Start New Attempt
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {sortedAttempts.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => attempt.id && onSelectAttempt(attempt.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {attempt.isComplete ? (
                          <CheckCircle2 className="text-green-500 w-5 h-5" />
                        ) : (
                          <Clock className="text-blue-500 w-5 h-5" />
                        )}
                        <p className="font-medium">
                          {attempt.isComplete ? "Completed" : "In Progress"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(attempt.timestamp, "PPpp")}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {(
                            (attempt.score / attempt.totalQuestions) *
                            100
                          ).toFixed(0)}
                          %
                        </p>
                        <p className="text-sm text-gray-500">
                          {attempt.score}/{attempt.totalQuestions} correct
                        </p>
                      </div>
                      <div className="text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default AttemptHistory;
