// import "./Hero.css";

// export default function Hero({ onQuizOpen }) {
//   return (
//     <section className="hero">
//       <div className="hero-content">
//         <p className="hero-tag">Personalized Skincare System</p>

//         <h1>Skincare that actually understands your skin</h1>

//         <p>
//           Answer a few simple questions and get skincare recommendations
//           tailored to your skin type.
//         </p>

//         <button className="btn btn-cta" onClick={onQuizOpen}>
//           Find My Skin Type
//         </button>
//       </div>
//     </section>
//   );
// }

import "./Hero.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tag">Personalized Skincare System</p>

        <h1>Skincare that actually understands your skin</h1>

        <p>
          Answer a few simple questions and get skincare recommendations
          tailored to your skin type.
        </p>

        <button
          className="btn btn-cta"
          onClick={() => navigate("/quiz")}
        >
          Find My Skin Type
        </button>
      </div>
    </section>
  );
}
