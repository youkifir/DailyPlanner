import { register } from "../api/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const model = {
            name,
            email,
            password
        }

        const response = await register(model);
        if (response) {
            navigate("/login")
            return response;
        }
    }

    return (
        <div>
            <input
                value={name}
                onChange={(n) => setName(n.target.value)}
                placeholder="Name"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                value={password}
                onChange={(p) => setPassword(p.target.value)}
                placeholder="Password"
                type="password"
            />
            <button
                onClick={handleSubmit}>Sign up</button>
        </div>
    )
}

export default Register;