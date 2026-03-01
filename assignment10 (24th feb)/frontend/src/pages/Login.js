import { useState } from "react";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const login = async () => {
        const res = await axios.post("http://localhost:8000/api/login/", {
            username,
            password,
        });

        //store jwt token in local storage
        localStorage.setItem("token", res.data.token);

        window.location.href = "/dashboard";
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 col-md-4 mx-auto shadow">

                <h3 className="mb-3">Login page</h3>

                <input className="form-control mb-2" placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input type={showPassword ? "text" : "password"} className="form-control mb-2"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-sm btn-secondary mb-3"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"} Password
                </button>

                <button className="btn btn-primary" onClick={login}>Login</button>

            </div>
        </div>
    );
}

export default Login;