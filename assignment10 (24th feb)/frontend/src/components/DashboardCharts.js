import { useEffect, useState } from "react";
import api from "../services/api";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function DashboardCharts() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("dashboard/advanced/")
            .then((res) => {
                // FORMAT DATA for recharts
                const formattedData = {
                    ...res.data,
                    revenue_by_month: res.data.revenue_by_month.map(item => {
                        const date = new Date(item.month);
                        return {
                            ...item,
                            monthName: date.toLocaleString('default', { month: 'short', year: 'numeric' })
                        };
                    })
                };
                setData(formattedData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching advanced analytics:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading charts...</p>;
    }

    if (!data) {
        return <p>Failed to load charts.</p>;
    }

    return (
        <div className="row mt-4">
            {/* Revenue by Month - Line Chart */}
            <div className="col-md-6 mb-4">
                <div className="card shadow-sm p-3">
                    <h6 className="mb-3">Revenue by Month</h6>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.revenue_by_month}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="monthName" />
                                <YAxis />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products - Bar Chart */}
            <div className="col-md-6 mb-4">
                <div className="card shadow-sm p-3">
                    <h6 className="mb-3">Top Products</h6>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.top_products}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="product__name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="total_sold" fill="#82ca9d" name="Quantity Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Revenue by Payment Method - Pie Chart */}
            <div className="col-md-6 mb-4">
                <div className="card shadow-sm p-3">
                    <h6 className="mb-3">Revenue by Payment Method</h6>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.revenue_by_payment}
                                    dataKey="revenue"
                                    nameKey="payment_method"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {data.revenue_by_payment.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders - Table */}
            <div className="col-md-6 mb-4">
                <div className="card shadow-sm p-3" style={{ height: "100%" }}>
                    <h6 className="mb-3">Recent Orders</h6>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recent_orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                        <td>₹{order.total_amount}</td>
                                        <td>
                                            <span className={`badge bg-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {data.recent_orders.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">No recent orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DashboardCharts;
