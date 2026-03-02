import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = () => {
        api.get("orders/")
            .then(res => {
                setOrders(res.data.results || res.data); // Support pagination if active
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Delivered": return "bg-success";
            case "Cancelled": return "bg-danger";
            case "Pending": return "bg-warning text-dark";
            default: return "bg-secondary";
        }
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Orders</h2>
                <Link to="/orders/create" className="btn btn-primary">+ Create Order</Link>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer ID</th>
                                <th>Date</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.customer}</td> {/* Usually it's an ID, you could join the name if backend returned it */}
                                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                    <td>{order.payment_method}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="fw-bold">₹{order.total_amount}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Orders;
