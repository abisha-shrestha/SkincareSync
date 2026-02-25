// import "./CTA.css";

// export default function CTA() {
//   return (
//     <section className="cta">
//       <div className="cta-content">
//         <h2>Not sure what suits your skin?</h2>
//         <p>
//           Take a quick skin quiz and let SkincareSync recommend products based on
//           your unique skin type.
//         </p>
//         <button className="btn btn-cta">Find My Skin Type</button>
//       </div>
//     </section>
//   );
// }


import "./CTA.css";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta">
      <div className="cta-content">
        <h2>Not sure what suits your skin?</h2>
        <p>
          Take a quick skin quiz and let SkincareSync recommend products based on
          your unique skin type.
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
