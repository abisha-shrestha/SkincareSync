import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <ThemeProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#faf8f5',
                        color: '#3a2e28',
                        border: '1px solid rgba(107,93,82,0.15)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                    success: {
                        iconTheme: { primary: '#6b5d52', secondary: '#faf8f5' },
                    },
                    error: {
                        iconTheme: { primary: '#e63946', secondary: '#fff' },
                    },
                }}
            />
            <App />
        </ThemeProvider>
    </BrowserRouter>
);