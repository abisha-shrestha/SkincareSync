import { useState } from "react";
import "./SkinQuiz.css";

const questions = [
  {
    question: "How does your skin feel after washing your face?",
    options: ["Tight", "Comfortable", "Oily", "Very dry"]
  },
  {
    question: "How often does your skin feel oily?",
    options: ["Never", "Sometimes", "Often", "Always"]
  },
  {
    question: "Do you experience flakiness or dry patches?",
    options: ["Never", "Rarely", "Often", "Very often"]
  },
  {
    question: "How visible are your pores?",
    options: ["Not visible", "Slightly visible", "Visible", "Very large"]
  },
  {
    question: "How often do you get breakouts?",
    options: ["Never", "Monthly", "Weekly", "Frequently"]
  },
  {
    question: "Does your skin feel tight by midday?",
    options: ["Never", "Sometimes", "Often", "Always"]
  },
  {
    question: "How does your skin react to new products?",
    options: ["No reaction", "Minor irritation", "Redness", "Breakouts"]
  },
  {
    question: "Is your T-zone oilier than your cheeks?",
    options: ["No", "Slightly", "Yes", "Very noticeable"]
  },
  {
    question: "Does your skin feel dull or dehydrated?",
    options: ["Never", "Sometimes", "Often", "Always"]
  },
  {
    question: "How sensitive is your skin?",
    options: ["Not sensitive", "Mildly", "Sensitive", "Very sensitive"]
  }
];

export default function SkinQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (option) => {
    setAnswers([...answers, option]);
    setCurrentIndex(currentIndex + 1);
  };

  const progress = Math.round(
    (answers.length / questions.length) * 100
  );

  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        
        {/* Progress */}
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>

        {currentIndex < questions.length ? (
          <>
            <p className="quiz-step">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <h2 className="quiz-question">
              {questions[currentIndex].question}
            </h2>

            <div className="quiz-options">
              {questions[currentIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="quiz-complete">
            <h2>Quiz Completed 🎉</h2>
            <p>Your skin profile will be generated next.</p>

            <button className="btn btn-cta">
              View Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
