function Sidebar({ role }) {
    return (
        <div className="bg-dark text-white p-3 vh-100">
            <h4>Dashboard</h4>
            <hr />

            <p>Analytics</p>
            <p>Orders</p>
            <p>Products</p>

            {/* only show if admin is logged in*/}
            {role === "admin" && (
                <p>Manage users</p>
            )}

        </div>
    );
}

export default Sidebar;