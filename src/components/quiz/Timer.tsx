import React, { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { Card } from "../ui/card";

interface TimerProps {
  duration?: number; // Duration in seconds
  onTimeUp?: () => void;
  isActive?: boolean;
}

const Timer = ({
  duration = 30,
  onTimeUp = () => {},
  isActive = true,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onTimeUp();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isActive, duration, onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  return (
    <Card className="w-[100px] h-[100px] bg-white p-4 flex flex-col items-center justify-center gap-2">
      <div className="text-2xl font-bold text-center">{timeLeft}s</div>
      <Progress
        value={progress}
        className="w-full"
        indicatorClassName={`${progress <= 25 ? "bg-red-500" : "bg-green-500"}`}
      />
    </Card>
  );
};

export default Timer;
