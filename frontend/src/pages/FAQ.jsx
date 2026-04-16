import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./InfoPages.css";

export default function FAQ() {
    return (
        <>
            <Navbar />
            <div className="info-page">
                <div className="info-container">

                    <p className="label">FAQ</p>
                    <h1>Frequently Asked Questions</h1>
                    <p className="info-lead">
                        Everything you need to know about ordering, shipping, and using SkincareSync.
                    </p>

                    <section>
                        <h2>How long does delivery take?</h2>
                        <p>
                            Delivery usually takes 2-5 days inside Kathmandu Valley and 3-7 days outside the valley depending on your location.
                        </p>
                    </section>

                    <section>
                        <h2>Do you offer Cash on Delivery (COD)?</h2>
                        <p>
                            Yes, we offer Cash on Delivery for most locations within Nepal. Prepaid orders may get faster processing.
                        </p>
                    </section>

                    <section>
                        <h2>Can I return or exchange a product?</h2>
                        <p>
                            Yes, you can request a return or exchange within 48 hours of receiving your order if the product is damaged, incorrect, or unused.
                        </p>
                    </section>

                    <section>
                        <h2>How do I track my order?</h2>
                        <p>
                            Once your order is confirmed, you can track it from the “Orders” page in your account dashboard.
                        </p>
                    </section>

                    <section>
                        <h2>Are your skincare products authentic?</h2>
                        <p>
                            Yes, all products listed on SkincareSync are 100% authentic and sourced from verified suppliers and brands.
                        </p>
                    </section>

                    <section>
                        <h2>How do I know which product is right for my skin?</h2>
                        <p>
                            You can use our Skin Quiz to get personalized product recommendations based on your skin type and concerns.
                        </p>
                    </section>

                    <section>
                        <h2>What payment methods do you accept?</h2>
                        <p>
                            We accept Cash on Delivery, eSewa, and other secure digital payment options available in Nepal.
                        </p>
                    </section>

                </div>
            </div>
            <Footer />
        </>
    );
}