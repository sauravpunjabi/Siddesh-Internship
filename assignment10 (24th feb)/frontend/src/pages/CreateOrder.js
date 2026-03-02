import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../services/api";

function CreateOrder() {
    const navigate = useNavigate();

    // Form fields
    const [customerId, setCustomerId] = useState("");
    const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [status, setStatus] = useState("Pending");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [items, setItems] = useState([{ product: "", quantity: 1 }]);

    // For dropdowns
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all products (could be paginated ideally, but assuming enough for dropdown)
        api.get("products/")
            .then(res => {
                setProducts(res.data.results || res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products", err);
                setLoading(false);
            });
    }, []);

    const handleAddItem = () => {
        setItems([...items, { product: "", quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    // Calculate total amount dynamically on frontend based on selected items
    const calculateTotal = () => {
        return items.reduce((total, item) => {
            if (item.product && item.quantity) {
                const prod = products.find(p => p.id === parseInt(item.product));
                if (prod) {
                    return total + (parseFloat(prod.price) * parseInt(item.quantity));
                }
            }
            return total;
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!customerId) return alert("Please enter Customer ID");
        if (items.some(i => !i.product || !i.quantity)) return alert("Please complete all item fields");

        const payload = {
            customer: customerId,
            order_date: orderDate,
            status,
            payment_method: paymentMethod,
            items: items.map(i => ({ product: parseInt(i.product), quantity: parseInt(i.quantity) }))
        };

        api.post("orders/create/", payload)
            .then(() => {
                navigate("/orders");
            })
            .catch(err => {
                console.error("Error creating order:", err);
                alert("Failed to create order. " + JSON.stringify(err.response?.data || err.message));
            });
    };

    if (loading) return <p>Loading resources...</p>;

    const totalAmount = calculateTotal();

    return (
        <div className="card shadow-sm p-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 className="mb-4">Create New Order</h2>

            <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-muted fw-bold">Customer ID</label>
                        <input
                            type="number"
                            className="form-control mb-1"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            required
                            placeholder="Enter Customer ID (e.g. 1)"
                        />
                        <small className="text-muted">In a full application, this would be a search/dropdown.</small>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-muted fw-bold">Order Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-muted fw-bold">Payment Method</label>
                        <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                            <option value="COD">Cash On Delivery (COD)</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label text-muted fw-bold">Status</label>
                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <h5 className="border-bottom pb-2 mb-3">Order Items</h5>
                    {items.map((item, index) => (
                        <div key={index} className="row mb-3 align-items-end">
                            <div className="col-md-7">
                                <label className="form-label">Product</label>
                                <Select
                                    options={products.map(p => ({ value: p.id, label: `${p.name} - ₹${p.price}` }))}
                                    value={
                                        item.product
                                            ? { value: parseInt(item.product), label: products.find(p => p.id === parseInt(item.product))?.name + " - ₹" + products.find(p => p.id === parseInt(item.product))?.price }
                                            : null
                                    }
                                    onChange={(selectedOption) => handleItemChange(index, "product", selectedOption ? selectedOption.value : "")}
                                    placeholder="-- Search & Select Product --"
                                    isClearable
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '12px',
                                            borderColor: '#e2e8f0',
                                            padding: '1px',
                                            backgroundColor: 'rgba(255,255,255,0.8)'
                                        }),
                                        menuList: (base) => ({
                                            ...base,
                                            maxHeight: "200px" // Ensures scrolling works
                                        })
                                    }}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => handleRemoveItem(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleAddItem}>
                        + Add Another Item
                    </button>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded border border-info border-2">
                    <h4 className="mb-0 text-info text-dark">Estimated Total:</h4>
                    <h3 className="mb-0 text-success">₹ {totalAmount.toFixed(2)}</h3>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => navigate("/orders")}>Cancel</button>
                    <button type="submit" className="btn btn-success px-4 fw-bold">Create Order</button>
                </div>

            </form>
        </div>
    );
}

export default CreateOrder;
