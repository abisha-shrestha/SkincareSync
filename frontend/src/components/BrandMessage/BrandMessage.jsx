import "./BrandMessage.css";

const steps = [
    {
        number: "01",
        title: "Take the quiz",
        desc: "Answer 10 simple questions about your skin's behaviour, texture, and concerns."
    },
    {
        number: "02",
        title: "Get your profile",
        desc: "We identify your skin type: dry, oily, combination, normal, or sensitive."
    },
    {
        number: "03",
        title: "Shop with confidence",
        desc: "Browse products curated specifically for your skin. No guesswork, no waste."
    }
];

export default function BrandMessage() {
    return (
        <section className="brand-message">
            <div className="brand-message-inner">
                <div className="brand-message-header">
                    <span className="brand-eyebrow">How It Works</span>
                    <h2 className="brand-title">Simple, personalized,<br />and data-driven</h2>
                    <p className="brand-desc">
                        SkincareSync analyzes your skin type using a short quiz and recommends
                        products that actually suit you. No guesswork, no trial and error.
                    </p>
                </div>

                <div className="brand-steps">
                    {steps.map((step) => (
                        <div key={step.number} className="brand-step">
                            <span className="brand-step-number">{step.number}</span>
                            <h3 className="brand-step-title">{step.title}</h3>
                            <p className="brand-step-desc">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}