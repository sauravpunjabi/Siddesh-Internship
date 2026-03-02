import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";

function Products() {
    const { user } = useOutletContext();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form state for adding/editing a product
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", category: "", price: "" });

    const fetchProducts = () => {
        let url = `products/?page=${page}`;
        if (search) url += `&search=${search}`;
        if (category) url += `&category=${category}`;

        api.get(url)
            .then(res => {
                // Handle both paginated and non-paginated responses
                if (res.data.results) {
                    setProducts(res.data.results);
                    // Approximate total pages (assuming 10 items per page if count is provided)
                    setTotalPages(Math.ceil((res.data.count || res.data.results.length) / 10));
                } else {
                    setProducts(res.data);
                    setTotalPages(1);
                }
            })
            .catch(err => console.error("Error fetching products:", err));
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search, category]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page
        fetchProducts();
    };

    const openCreateModal = () => {
        setFormData({ id: null, name: "", category: "", price: "" });
        setIsEditing(false);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setFormData(product);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            api.delete(`products/${id}/`)
                .then(() => fetchProducts())
                .catch(err => alert("Failed to delete product. " + (err.response?.data?.detail || "")));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            category: formData.category,
            price: formData.price
        };

        const request = isEditing
            ? api.put(`products/${formData.id}/`, payload)
            : api.post("products/", payload);

        request
            .then(() => {
                setShowModal(false);
                fetchProducts();
            })
            .catch(err => {
                console.error("Error saving product", err);
                alert("Failed to save product. " + (err.response?.data?.detail || ""));
            });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Products</h2>
                {user.role === "admin" && (
                    <button className="btn btn-primary" onClick={openCreateModal}>+ Add Product</button>
                )}
            </div>

            <div className="card shadow-sm p-3 mb-4">
                <form className="row g-3" onSubmit={handleSearch}>
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-5">
                        <select
                            className="form-select"
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home">Home</option>
                            <option value="Books">Books</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-secondary w-100">Search</button>
                    </div>
                </form>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-striped table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                {user.role === "admin" && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>#{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price}</td>
                                    {user.role === "admin" && (
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => openEditModal(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={user.role === "admin" ? 5 : 4} className="text-center py-4">No products found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <button
                        className="btn btn-outline-secondary me-2"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="align-self-center">Page {page} of {totalPages}</span>
                    <button
                        className="btn btn-outline-secondary ms-2"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEditing ? "Edit Product" : "Add Product"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
