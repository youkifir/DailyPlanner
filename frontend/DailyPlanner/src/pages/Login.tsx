import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    //ERRORS
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({});

    const handleSubmit = async () => {
        const newErrors: { email?: string, password?: string } = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Input correct email";
        }


        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Minimum 8 symbols, one capital letter, digital and special character";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const model = {
            email,
            password
        }

        const response = await login(model);

        if (response) {
            localStorage.setItem("token", response.token)
            navigate("/")
            return response.data;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">

            <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 flex flex-col gap-4">

                <h1 className="text-white text-xl font-semibold">Login</h1>

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium rounded-lg py-2.5 transition-all cursor-pointer"
                >
                    Login
                </button>
                <p className="text-center text-gray-500 text-sm">
                    Ещё нет акканта?{" "}
                    <a href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Регистрация
                    </a>
                </p>
            </div>

        </div>
    );
}

export default Login;