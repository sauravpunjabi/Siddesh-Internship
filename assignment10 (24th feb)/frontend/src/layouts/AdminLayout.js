import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import api from "../services/api";

function AdminLayout() {
    const [user, setUser] = useState({ username: "", role: "manager" });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        api.get("user/")
            .then(res => setUser(res.data))
            .catch(() => navigate("/"));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
                <h4 className="mb-4 text-center mt-2 fw-bold" style={{ background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Nexus Analytics
                </h4>
                <div className="nav flex-column nav-pills mt-4">
                    <Link
                        to="/dashboard"
                        className={`nav-link text-white mb-2 ${location.pathname === "/dashboard" ? "active bg-primary" : ""}`}
                    >
                        Analytics
                    </Link>
                    <Link
                        to="/orders"
                        className={`nav-link text-white mb-2 ${location.pathname.startsWith("/orders") ? "active bg-primary" : ""}`}
                    >
                        Orders
                    </Link>
                    <Link
                        to="/products"
                        className={`nav-link text-white mb-2 ${location.pathname === "/products" ? "active bg-primary" : ""}`}
                    >
                        Products
                    </Link>

                    {user.role === "admin" && (
                        <div className="nav-link text-secondary mb-2" style={{ cursor: "not-allowed" }}>
                            Manage Users (Coming Soon)
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 border-top border-secondary">
                    <p className="mb-2">Signed in as:<br /><strong>{user.username}</strong> ({user.role})</p>
                    <button className="btn btn-danger btn-sm w-100 mt-2" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow-1 bg-light p-4 overflow-auto">
                {/* We pass user context to child pages using Outlet context */}
                <Outlet context={{ user }} />
            </div>
        </div>
    );
}

export default AdminLayout;
