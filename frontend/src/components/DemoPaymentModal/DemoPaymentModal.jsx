// import { useState, useEffect } from "react";
// import "./DemoPaymentModal.css";

// export default function DemoPaymentModal({ onSelect, onClose }) {
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const t = requestAnimationFrame(() => setVisible(true));
//         return () => cancelAnimationFrame(t);
//     }, []);

//     const handleChoice = (outcome) => {
//         setVisible(false);
//         setTimeout(() => onSelect(outcome), 220);
//     };

//     const handleClose = () => {
//         setVisible(false);
//         setTimeout(onClose, 220);
//     };

//     return (
//         <div
//             className={`dpm-backdrop ${visible ? "dpm-backdrop--in" : ""}`}
//             onClick={handleClose}
//         >
//             <div
//                 className={`dpm-modal ${visible ? "dpm-modal--in" : ""}`}
//                 onClick={e => e.stopPropagation()}
//             >
//                 <div className="dpm-header">
//                     <span className="dpm-dev-badge">DEV MODE</span>
//                     <button className="dpm-close" onClick={handleClose} aria-label="Close">
//                         ✕
//                     </button>
//                 </div>

//                 <div className="dpm-body">
//                     <div className="dpm-icon-wrap">
//                         <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
//                             <rect width="36" height="36" rx="10" fill="var(--dpm-accent-bg)" />
//                             <path
//                                 d="M10 18h2l2-5 3 10 3-12 3 8 2-1h1"
//                                 stroke="var(--dpm-accent)"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 fill="none"
//                             />
//                         </svg>
//                     </div>

//                     <h2 className="dpm-title">Simulate Payment</h2>
//                     <p className="dpm-subtitle">
//                         Choose an outcome to test the eSewa payment flow without a real transaction.
//                     </p>

//                     <div className="dpm-choices">
//                         <button
//                             className="dpm-choice dpm-choice--success"
//                             onClick={() => handleChoice("success")}
//                         >
//                             <span className="dpm-choice-icon">✓</span>
//                             <div>
//                                 <span className="dpm-choice-label">Payment Success</span>
//                                 <span className="dpm-choice-desc">Order saved · Cart cleared · Email sent</span>
//                             </div>
//                         </button>

//                         <button
//                             className="dpm-choice dpm-choice--failure"
//                             onClick={() => handleChoice("failure")}
//                         >
//                             <span className="dpm-choice-icon">✕</span>
//                             <div>
//                                 <span className="dpm-choice-label">Payment Failed</span>
//                                 <span className="dpm-choice-desc">No order saved · Redirected to failure page</span>
//                             </div>
//                         </button>
//                     </div>
//                 </div>

//                 <p className="dpm-footer-note">
//                     This modal only appears when <code>REACT_APP_DEMO_MODE=true</code>
//                 </p>
//             </div>
//         </div>
//     );
// }



import { useState, useEffect } from "react";
import "./DemoPaymentModal.css";

export default function DemoPaymentModal({ onSelect, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const handleChoice = (outcome) => {
        setVisible(false);
        setTimeout(() => onSelect(outcome), 220);
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 220);
    };

    return (
        <div
            className={`dpm-backdrop ${visible ? "dpm-backdrop--in" : ""}`}
            onClick={handleClose}
        >
            <div
                className={`dpm-modal ${visible ? "dpm-modal--in" : ""}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="dpm-header">
                    <button className="dpm-close" onClick={handleClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="dpm-body">
                    <div className="dpm-icon-wrap">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                            <rect width="42" height="42" rx="12" fill="var(--dpm-accent-bg)" />
                            <rect x="9" y="13" width="24" height="16" rx="3" stroke="var(--dpm-accent)" strokeWidth="2" fill="none" />
                            <path d="M9 18h24" stroke="var(--dpm-accent)" strokeWidth="2" />
                            <rect x="13" y="23" width="5" height="2.5" rx="1" fill="var(--dpm-accent)" />
                            <rect x="20" y="23" width="3" height="2.5" rx="1" fill="var(--dpm-accent)" opacity="0.5" />
                        </svg>
                    </div>

                    <h2 className="dpm-title">Simulate Payment</h2>
                    <p className="dpm-subtitle">
                        Choose an outcome to test the eSewa payment flow without a real transaction.
                    </p>

                    <div className="dpm-choices">
                        <button
                            className="dpm-choice dpm-choice--success"
                            onClick={() => handleChoice("success")}
                        >
                            <span className="dpm-choice-icon">✓</span>
                            <div>
                                <span className="dpm-choice-label">Payment Success</span>
                                <span className="dpm-choice-desc">Order saved · Cart cleared · Email sent</span>
                            </div>
                        </button>

                        <button
                            className="dpm-choice dpm-choice--failure"
                            onClick={() => handleChoice("failure")}
                        >
                            <span className="dpm-choice-icon">✕</span>
                            <div>
                                <span className="dpm-choice-label">Payment Failed</span>
                                <span className="dpm-choice-desc">No order saved · Redirected to failure page</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}