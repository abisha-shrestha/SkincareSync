// import "./InfoPages.css";

// export default function Contact() {
//     return (
//         <div className="info-page">
//             <div className="info-container">

//                 <p className="label">Contact</p>
//                 <h1>We’re here to help</h1>

//                 <p className="info-lead">
//                     Have questions, feedback, or need support? Reach out to us anytime.
//                 </p>

//                 <div className="contact-grid">

//                     <div>
//                         <h2>Email</h2>
//                         <p>support@skincaresync.com</p>
//                     </div>

//                     <div>
//                         <h2>Location</h2>
//                         <p>Pokhara, Nepal</p>
//                     </div>

//                     <div>
//                         <h2>Support Hours</h2>
//                         <p>Sunday – Friday<br />9:00 AM – 6:00 PM</p>
//                     </div>

//                 </div>

//                 <section>
//                     <h2>Send a Message</h2>

//                     <form className="contact-form">
//                         <input type="text" placeholder="Your Name" required />
//                         <input type="email" placeholder="Your Email" required />
//                         <textarea placeholder="Your Message" rows="5" required />
//                         <button className="btn btn-cta">Send Message</button>
//                     </form>
//                 </section>

//             </div>
//         </div>
//     );
// }



import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./InfoPages.css";

export default function Contact() {
    return (
        <>
            <Navbar />
            <div className="info-page">
                <div className="info-container">
                    <p className="label">Contact</p>
                    <h1>We're here to help</h1>
                    <p className="info-lead">
                        Have questions, feedback, or need support? Reach out to us anytime.
                    </p>

                    <div className="contact-grid">
                        <div>
                            <h2>Email</h2>
                            <p>support@skincaresync.com</p>
                        </div>
                        <div>
                            <h2>Location</h2>
                            <p>Pokhara, Nepal</p>
                        </div>
                        <div>
                            <h2>Support Hours</h2>
                            <p>Sunday – Friday<br />9:00 AM – 6:00 PM</p>
                        </div>
                    </div>

                    <section>
                        <h2>Send a Message</h2>
                        <form className="contact-form" onSubmit={e => e.preventDefault()}>
                            <input type="text" placeholder="Your Name" required />
                            <input type="email" placeholder="Your Email" required />
                            <textarea placeholder="Your Message" rows="5" required />
                            <button className="btn btn-cta">Send Message</button>
                        </form>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}