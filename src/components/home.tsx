import React from "react";
import QuizContainer from "./quiz/QuizContainer";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Quiz Challenge</h1>
          <p className="text-gray-600">
            Test your knowledge with our interactive quiz. You have 30 seconds
            per question. Good luck!
          </p>
        </div>

        <QuizContainer
          questions={[
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
          ]}
          timePerQuestion={30}
          onComplete={(score) => {
            console.log(`Quiz completed with score: ${score}`);
          }}
        />
      </div>
    </div>
  );
};

export default Home;
