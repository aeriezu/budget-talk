"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Welcome() {
    const [Name, setName] = useState("");
    const router = useRouter();

    useEffect(() => {
        // If Name is already set, redirect to Tuition page
        if (typeof window !== "undefined" && localStorage.getItem("Name")) {
            router.push("/"); // Redirect if Name exists
        }
    }, [router]);

    const handleSS = (e) => {
        e.preventDefault();

        if (Name.trim() !== "") {
            localStorage.setItem("Name", Name); // Save Name to localStorage
            router.push("/tuition"); // Redirect to the Tuition page
        } else {
            alert("Please enter a name!"); // Prevent empty submission
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-box">
                <h1>Welcome Broke College Student!</h1>
                <p>Enter your name:</p>
                <form onSubmit={handleSS} className="form-container">
                    <input
                        type="text"
                        placeholder="Name"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="input-field"
                    />
                    <button type="submit" className="submit-button">
                        Start Saving
                    </button>
                </form>
            </div>
        </div>
    );
}
