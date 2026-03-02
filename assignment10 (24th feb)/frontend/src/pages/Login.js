import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, User } from "lucide-react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:8000/api/login/", {
                username,
                password,
            });

            //store jwt token in local storage
            localStorage.setItem("token", res.data.access);

            window.location.href = "/dashboard";
        } catch (err) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "var(--bg-color)" }}>
            <div className="card p-5 shadow-lg" style={{ width: "100%", maxWidth: "420px", border: "none" }}>

                <div className="text-center mb-4">
                    <h2 className="mb-2" style={{ background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Nexus Analytics
                    </h2>
                    <p className="text-muted fw-bold">Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.9rem" }}>
                        {error}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label text-muted fw-bold mb-1" style={{ fontSize: "0.85rem" }}>USERNAME</label>
                    <div className="input-group shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                        <span className="input-group-text bg-white border-end-0 text-muted px-3">
                            <User size={18} />
                        </span>
                        <input
                            className="form-control border-start-0 ps-1"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && login()}
                            style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                        />
                    </div>
                </div>

                <div className="mb-4 position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label text-muted fw-bold mb-0" style={{ fontSize: "0.85rem" }}>PASSWORD</label>
                    </div>
                    <div className="input-group shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                        <span className="input-group-text bg-white border-end-0 text-muted px-3">
                            <Lock size={18} />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control border-start-0 border-end-0 ps-1"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && login()}
                            style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                        />
                        <span
                            className="input-group-text bg-white border-start-0 text-muted px-3 hover-lift"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-100 py-2 mt-2 shadow-sm fs-6"
                    onClick={login}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Login to Dashboard"}
                </button>

            </div>
        </div>
    );
}

export default Login;