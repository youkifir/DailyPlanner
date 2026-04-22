import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    return (
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <span className="text-white font-semibold">DailyPlanner</span>
                <nav className="flex gap-6">
                    {isLoggedIn && (
                        <button
                            onClick={() => {
                                logout();
                                setIsLoggedIn(false);
                                navigate("/login");
                            }}
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header >
    )
}

export default Header;