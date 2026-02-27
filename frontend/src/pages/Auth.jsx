import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AuthForm from "../components/Auth/AuthForm";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
        <Navbar />

        <AuthForm 
            isLogin={isLogin} 
            toggleAuth={() => setIsLogin(!isLogin)} 
        />

        <Footer />
        </>
    );
}