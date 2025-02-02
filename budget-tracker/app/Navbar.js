"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome, FaWallet, FaChartBar, FaBook, FaFire } from "react-icons/fa";

export default function Navbar() {
    const pathname = usePathname();
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const today = new Date();
        const todayStr = today.toDateString(); // Format: "Tue Feb 1 2025"

        const lastVisit = localStorage.getItem("lastVisit");
        const savedStreak = parseInt(localStorage.getItem("streak")) || 0;

        if (lastVisit) {
            const lastDate = new Date(lastVisit);
            const difference = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)); // Days between visits

            if (difference === 1) {
                setStreak(savedStreak + 1); // Increment streak for consecutive visits
                localStorage.setItem("streak", savedStreak + 1);
            } else if (difference > 1) {
                setStreak(1); // Reset streak if they missed a day
                localStorage.setItem("streak", 1);
            } else {
                setStreak(savedStreak); // Keep current streak if they visit multiple times a day
            }
        } else {
            setStreak(1); // First visit starts streak
            localStorage.setItem("streak", 1);
        }

        localStorage.setItem("lastVisit", todayStr);
    }, []);

    const handleNavClick = (route) => {
        window.location.href = route;
    };

    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Streak Display - Aligned Left */}
                <div className="streak-display">
                    <FaFire className="icon fire-icon" />
                    <span className="streak-text">{streak} day{streak !== 1 ? "s" : ""} streak</span>
                </div>

                {/* Centered Navigation Icons */}
                <div className="nav-icons">
                    <div
                        className={`navbar-item ${pathname === "/outlook" ? "active" : ""}`}
                        onClick={() => handleNavClick("/outlook")}
                    >
                        <FaHome className="icon" />
                        <span className="text">Outlook</span>
                    </div>

                    <div
                        className={`navbar-item ${pathname === "/budgeting" ? "active" : ""}`}
                        onClick={() => handleNavClick("/budgeting")}
                    >
                        <FaWallet className="icon" />
                        <span className="text">Budgeting</span>
                    </div>

                    <div
                        className={`navbar-item ${pathname === "/analytics" ? "active" : ""}`}
                        onClick={() => handleNavClick("/analytics")}
                    >
                        <FaChartBar className="icon" />
                        <span className="text">Analytics</span>
                    </div>

                    <div
                        className={`navbar-item ${pathname === "/btok" ? "active" : ""}`}
                        onClick={() => handleNavClick("/btok")}
                    >
                        <FaBook className="icon" />
                        <span className="text">Budget Tok</span>
                    </div>
                </div>
            </div>
        </div>
    );
}