import { register } from "../api/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    //ERRORS
    const [errors, setErrors] = useState<{ name?: string, email?: string, password?: string }>({});

    const handleSubmit = async () => {
        const newErrors: { name?: string, email?: string, password?: string } = {};

        const nameRegex = /^[A-Za-z0-9_]{4,}$/;
        if (!name) {
            newErrors.name = "Name is required"
        } else if (!nameRegex.test(name)) {
            newErrors.name = "Name"
        }

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
            name,
            email,
            password
        }

        const response = await register(model);
        if (response) {
            navigate("/login")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">

            <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 flex flex-col gap-4">

                <h1 className="text-white text-xl font-semibold" >Sign up</h1>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}

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
                    className="w-full bg-blue-600 hover:bg-green-800 active:scale-95 text-white text-sm font-medium rounded-lg py-2.5 transition-all cursor-pointer"
                >
                    Sign up
                </button>
                <p className="text-center text-gray-500 text-sm">
                    Уже есть аккаунт?{" "}
                    <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Войти
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Register;