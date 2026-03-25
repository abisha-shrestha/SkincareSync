// import "./InfoPages.css";

// export default function Privacy() {
//     return (
//         <div className="info-page">
//             <div className="info-container">

//                 <p className="label">Privacy Policy</p>
//                 <h1>Your privacy matters</h1>

//                 <section>
//                     <h2>Information We Collect</h2>
//                     <p>
//                         We collect basic information such as your name, email, and skin type preferences 
//                         to provide personalized recommendations.
//                     </p>
//                 </section>

//                 <section>
//                     <h2>How We Use Your Data</h2>
//                     <p>
//                         Your data is used to improve your experience, personalize product suggestions, 
//                         and process orders securely.
//                     </p>
//                 </section>

//                 <section>
//                     <h2>Data Protection</h2>
//                     <p>
//                         We use secure technologies including encryption and token-based authentication 
//                         to protect your information.
//                     </p>
//                 </section>

//                 <section>
//                     <h2>Third-Party Services</h2>
//                     <p>
//                         Payments are processed through trusted third-party services such as eSewa. 
//                         We do not store sensitive payment details.
//                     </p>
//                 </section>

//                 <section>
//                     <h2>Your Rights</h2>
//                     <p>
//                         You can update or delete your account information at any time through your profile settings.
//                     </p>
//                 </section>

//             </div>
//         </div>
//     );
// }

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./InfoPages.css";

export default function Privacy() {
    return (
        <>
            <Navbar />
            <div className="info-page">
                <div className="info-container">
                    <p className="label">Privacy Policy</p>
                    <h1>Your privacy matters</h1>
                    <p className="info-lead">
                        We're committed to being transparent about how we collect and use your data.
                    </p>

                    <section>
                        <h2>Information We Collect</h2>
                        <p>We collect basic information such as your name, email, and skin type preferences to provide personalized recommendations.</p>
                    </section>

                    <section>
                        <h2>How We Use Your Data</h2>
                        <p>Your data is used to improve your experience, personalize product suggestions, and process orders securely.</p>
                    </section>

                    <section>
                        <h2>Data Protection</h2>
                        <p>We use secure technologies including encryption and token-based authentication to protect your information.</p>
                    </section>

                    <section>
                        <h2>Third-Party Services</h2>
                        <p>Payments are processed through trusted third-party services such as eSewa. We do not store sensitive payment details.</p>
                    </section>

                    <section>
                        <h2>Your Rights</h2>
                        <p>You can update or delete your account information at any time through your profile settings.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}