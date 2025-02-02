"use client";
import './globals.css';
import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
