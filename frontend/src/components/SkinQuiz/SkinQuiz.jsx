import { useState } from "react";
import "./SkinQuiz.css";

const questions = [
    {
        question: "How does your skin feel after washing your face?",
        options: [
            { text: "Tight and uncomfortable", scores: { dry: 2 } },
            { text: "Comfortable and balanced", scores: { normal: 2 } },
            { text: "Oily within an hour", scores: { oily: 2 } },
            { text: "Very dry and flaky", scores: { dry: 3 } }
        ]
    },
    {
        question: "How often does your skin feel oily?",
        options: [
            { text: "Never", scores: { dry: 2, normal: 1 } },
            { text: "Sometimes, only in T-zone", scores: { combination: 2 } },
            { text: "Often throughout the day", scores: { oily: 2 } },
            { text: "Always shiny all over", scores: { oily: 3 } }
        ]
    },
    {
        question: "Do you experience flakiness or dry patches?",
        options: [
            { text: "Never", scores: { normal: 1, oily: 1 } },
            { text: "Rarely", scores: { normal: 1 } },
            { text: "Often", scores: { dry: 2 } },
            { text: "Very often", scores: { dry: 3, sensitive: 1 } }
        ]
    },
    {
        question: "How visible are your pores?",
        options: [
            { text: "Not visible at all", scores: { dry: 1, normal: 1 } },
            { text: "Slightly visible", scores: { normal: 2, combination: 1 } },
            { text: "Visible on nose and forehead", scores: { combination: 2 } },
            { text: "Very large and visible", scores: { oily: 3 } }
        ]
    },
    {
        question: "How often do you get breakouts?",
        options: [
            { text: "Never", scores: { normal: 2, dry: 1 } },
            { text: "Monthly", scores: { combination: 1, sensitive: 1 } },
            { text: "Weekly", scores: { oily: 2, combination: 1 } },
            { text: "Frequently and unpredictably", scores: { oily: 3, sensitive: 1 } }
        ]
    },
    {
        question: "Does your skin feel tight by midday?",
        options: [
            { text: "Never", scores: { oily: 1, normal: 1 } },
            { text: "Sometimes", scores: { combination: 1 } },
            { text: "Often", scores: { dry: 2 } },
            { text: "Always", scores: { dry: 3 } }
        ]
    },
    {
        question: "How does your skin react to new products?",
        options: [
            { text: "No reaction at all", scores: { normal: 2, oily: 1 } },
            { text: "Minor irritation that fades", scores: { sensitive: 1, combination: 1 } },
            { text: "Redness or burning", scores: { sensitive: 2 } },
            { text: "Breakouts or rashes", scores: { sensitive: 3 } }
        ]
    },
    {
        question: "Is your T-zone oilier than your cheeks?",
        options: [
            { text: "No, it is all the same", scores: { normal: 1, dry: 1 } },
            { text: "Slightly", scores: { combination: 1 } },
            { text: "Yes, noticeably", scores: { combination: 3 } },
            { text: "Very noticeable difference", scores: { combination: 2, oily: 1 } }
        ]
    },
    {
        question: "Does your skin feel dull or dehydrated?",
        options: [
            { text: "Never", scores: { normal: 2 } },
            { text: "Sometimes after sun exposure", scores: { normal: 1, dry: 1 } },
            { text: "Often, looks tired", scores: { dry: 2, sensitive: 1 } },
            { text: "Always looks dull", scores: { dry: 3 } }
        ]
    },
    {
        question: "How sensitive is your skin?",
        options: [
            { text: "Not sensitive at all", scores: { normal: 2, oily: 1 } },
            { text: "Mildly sensitive", scores: { combination: 1, sensitive: 1 } },
            { text: "Sensitive to weather and products", scores: { sensitive: 2 } },
            { text: "Very sensitive, reacts to everything", scores: { sensitive: 3 } }
        ]
    }
];

const skinTypeInfo = {
    dry: {
        label: "Dry Skin",
        description: "Your skin tends to feel tight, appear dull, and may develop flaky patches. It lacks sufficient moisture and needs rich, hydrating products that restore the skin barrier and lock in hydration throughout the day.",
        traits: ["Feels tight after washing", "Flaky or rough texture", "Dull appearance", "Rarely oily"]
    },
    oily: {
        label: "Oily Skin",
        description: "Your skin produces excess sebum, leaving it shiny and prone to clogged pores and breakouts. Lightweight, oil-free products that balance sebum production without stripping your skin work best for you.",
        traits: ["Shiny throughout the day", "Enlarged pores", "Prone to breakouts", "Thick texture"]
    },
    combination: {
        label: "Combination Skin",
        description: "You have an oily T-zone — forehead, nose, and chin — while your cheeks are normal to dry. Your routine needs to balance both zones without over-moisturizing oily areas or drying out drier ones.",
        traits: ["Oily T-zone", "Normal to dry cheeks", "Occasional breakouts", "Visible pores on nose"]
    },
    normal: {
        label: "Normal Skin",
        description: "Your skin is well-balanced — it is neither too oily nor too dry. Your pores are minimal, breakouts are rare, and your skin generally looks healthy. Focus on maintaining this balance with gentle, consistent care.",
        traits: ["Balanced moisture", "Minimal pores", "Rarely breaks out", "Even texture"]
    },
    sensitive: {
        label: "Sensitive Skin",
        description: "Your skin reacts easily to products, environmental changes, and stress — showing redness, irritation, or discomfort. Gentle, fragrance-free formulas with soothing ingredients are essential for your skin.",
        traits: ["Reacts to new products", "Prone to redness", "Easily irritated", "Feels tight or burns"]
    }
};

function calculateSkinType(answers) {
    const scores = { dry: 0, oily: 0, combination: 0, normal: 0, sensitive: 0 };
    answers.forEach(answer => {
        Object.entries(answer.scores).forEach(([type, score]) => {
            scores[type] += score;
        });
    });
    return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

export default function SkinQuiz() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [selected, setSelected] = useState(null);

    const progress = Math.round((currentIndex / questions.length) * 100);

    const handleAnswer = (option) => {
        setSelected(option.text);
        setTimeout(() => {
            const newAnswers = [...answers, option];
            if (currentIndex + 1 >= questions.length) {
                const skinType = calculateSkinType(newAnswers);
                setResult(skinType);
            }
            setAnswers(newAnswers);
            setCurrentIndex(currentIndex + 1);
            setSelected(null);
        }, 280);
    };

    const handleBack = () => {
        if (currentIndex === 0) return;
        setAnswers(answers.slice(0, -1));
        setCurrentIndex(currentIndex - 1);
        setSelected(null);
    };

    const handleRetake = () => {
        setCurrentIndex(0);
        setAnswers([]);
        setResult(null);
        setSelected(null);
    };

    return (
        <div className="quiz-overlay">
            <div className="quiz-bg-blob quiz-blob-1" />
            <div className="quiz-bg-blob quiz-blob-2" />

            {!result ? (
                <div className="quiz-container">
                    <div className="quiz-header">
                        <h1 className="quiz-title">Skin Analysis</h1>
                        <p className="quiz-subtitle">Answer honestly for the most accurate results</p>
                    </div>

                    <div className="quiz-progress">
                        <span className="progress-text">{currentIndex + 1} / {questions.length}</span>
                        <div className="progress-bar">
                            <div style={{ width: `${progress}%` }} />
                        </div>
                        <span className="progress-text">{progress}%</span>
                    </div>

                    <h2 className="quiz-question">
                        {questions[currentIndex].question}
                    </h2>

                    <div className="quiz-options">
                        {questions[currentIndex].options.map((opt, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(opt)}
                                className={`quiz-option-btn ${selected === opt.text ? 'selected' : ''}`}
                            >
                                <span className="quiz-option-letter">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span>{opt.text}</span>
                            </button>
                        ))}
                    </div>

                    {currentIndex > 0 && (
                        <button className="quiz-back-btn" onClick={handleBack}>
                            Back
                        </button>
                    )}
                </div>
            ) : (
                <div className="quiz-container quiz-result-container">
                    <p className="quiz-result-label">Your skin type is</p>
                    <h1 className="quiz-result-type">
                        {skinTypeInfo[result].label}
                    </h1>
                    <p className="quiz-result-desc">
                        {skinTypeInfo[result].description}
                    </p>

                    <div className="quiz-traits">
                        {skinTypeInfo[result].traits.map((trait, i) => (
                            <div key={i} className="quiz-trait">
                                <span className="quiz-trait-dot" />
                                {trait}
                            </div>
                        ))}
                    </div>

                    <div className="quiz-result-actions">
                        <button className="quiz-retake-btn" onClick={handleRetake}>
                            Retake Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}