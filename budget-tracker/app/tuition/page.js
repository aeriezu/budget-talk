"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Tuition() {
    const [tuition, setTuition] = useState("");
    const [income, setIncome] = useState("");
    const [Name, setName] = useState("");
    const [deadline, setDeadline] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedName = localStorage.getItem("Name");
        if (storedName) {
            setName(storedName); // Set Name state if found
        }
    }, [router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save tuition, income, Name, and deadline into localStorage
        localStorage.setItem("tuition", tuition);
        localStorage.setItem("income", income);
        localStorage.setItem("Name", Name); // Save Name if it's not already saved
        localStorage.setItem("deadline", deadline); // Store deadline as well

        console.log("Stored tuition:", tuition);
        console.log("Stored income:", income);
        console.log("Stored Name:", Name);
        console.log("Stored deadline:", deadline);  // Log the stored deadline

        router.push("/outlook"); // Redirect to the Outlook page
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 className="title">Welcome to BudgetTok, {Name}</h1>
                <p className="description">Enter your tuition, monthly income, and  tuition deadline to get started.</p>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="number"
                        placeholder="Enter tuition amount"
                        value={tuition}
                        onChange={(e) => setTuition(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="number"
                        placeholder="Enter monthly income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="date"
                        placeholder="Enter deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className="input-field"
                    />
                    <button
                        type="submit"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}
