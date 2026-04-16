import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./InfoPages.css";

export default function Shipping() {
    return (
        <>
            <Navbar />

            <div className="info-page">
                <div className="info-container">

                    <p className="label">Shipping & Delivery</p>
                    <h1>Delivery Information</h1>
                    <p className="info-lead">
                        We aim to deliver your skincare products safely and on time across Nepal.
                    </p>

                    <section>
                        <h2>Delivery Areas</h2>
                        <p>
                            We currently deliver across Pokhara and major cities in Nepal.
                            Remote areas may take additional time depending on courier availability.
                        </p>
                    </section>

                    <section>
                        <h2>Delivery Time</h2>
                        <p>
                            Inside Pokhara: 2-5 working days<br />
                            Outside Pokhara: 3-7 working days<br />
                            Remote regions: 5-10 working days
                        </p>
                    </section>

                    <section>
                        <h2>Shipping Charges</h2>
                        <p>
                            Shipping charges depend on your location and order size.  
                            Free delivery may be available on selected offers or minimum order value promotions.
                        </p>
                    </section>

                    <section>
                        <h2>Cash on Delivery (COD)</h2>
                        <p>
                            We offer Cash on Delivery (COD) in most locations within Nepal.  
                            Prepaid orders are processed faster and prioritized in dispatch.
                        </p>
                    </section>

                    <section>
                        <h2>Order Processing Time</h2>
                        <p>
                            Orders are usually processed within 24 hours after confirmation.  
                            Orders placed on holidays or weekends may be processed on the next working day.
                        </p>
                    </section>

                    <section>
                        <h2>Order Tracking</h2>
                        <p>
                            Once your order is shipped, you can track its status from your Orders page in your account dashboard.
                        </p>
                    </section>

                    <section>
                        <h2>Delivery Issues</h2>
                        <p>
                            If your order is delayed, damaged, or missing, please contact our support team within 48 hours of expected delivery.
                        </p>
                    </section>

                </div>
            </div>

            <Footer />
        </>
    );
}