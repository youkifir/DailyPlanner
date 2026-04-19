import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async () => {
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
        <div>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />
            <button onClick={handleSubmit}>Login</button>
        </div>
    );
}

export default Login;