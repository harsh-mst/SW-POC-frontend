import { ChevronLeft, ChevronRight, LayoutDashboard, Edit2, ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = ({ data, onLimitChange, onEdit, page, limit, total, onPageChange }) => {
    const totalPages = Math.ceil(total / limit);
    const [pageInput, setPageInput] = useState(page);
    const [error, setError] = useState("");

    useEffect(() => {
        setPageInput(page);
    }, [page]);

    const validateAndNavigate = () => {
        const pageNumber = Number(pageInput);

        if (!pageInput || isNaN(pageNumber)) {
            setError("Enter a valid page number");
            return;
        }

        if (pageNumber <= 0) {
            setError("Page number cannot be negative or zero");
            return;
        }

        if (pageNumber > totalPages) {
            setError(`Page ${pageNumber} does not exist`);
            return;
        }

        setError("");
        onPageChange(pageNumber);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            validateAndNavigate();
        }
    };


    return (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutDashboard size={24} /> Data Dashboard
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="label" style={{ margin: 0 }}>Rows per page:</span>
                    <select
                        className="input"
                        style={{ width: 'auto', padding: '0.4rem' }}
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                    >
                        {[10, 50, 100].map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Quantity</th>
                            <th>Sales</th>
                            <th>Status</th>
                            <th>Product</th>
                            <th>Country</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.ORDERNUMBER}</td>
                                <td>{row.CUSTOMERNAME}</td>
                                <td>{row.QUANTITYORDERED}</td>
                                <td>${row.SALES?.toFixed(2)}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: row.STATUS === 'Shipped' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: row.STATUS === 'Shipped' ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {row.STATUS}
                                    </span>
                                </td>
                                <td>{row.PRODUCTLINE}</td>
                                <td>{row.COUNTRY}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => onEdit(row)}
                                        title="Edit Entry"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <span>
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
                </span>

                <div className="page-controls">

                    <button
                        className="page-btn"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <input
                        type="number"
                        value={pageInput}
                        onChange={(e) => {
                            setPageInput(e.target.value);
                            setError("");
                        }}
                        onBlur={validateAndNavigate}
                        onKeyDown={handleKeyDown}
                        min="1"
                        max={totalPages}
                        className="page-input"
                    />

                    <span style={{ marginLeft: "6px" }}>/ {totalPages}</span>

                    <button
                        className="page-btn"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight size={18} />
                    </button>

                    <button
                        className="page-btn"
                        onClick={() => onPageChange(totalPages)}
                        disabled={page === totalPages}
                        title="Go to last page"
                    >
                        Go to last page
                    </button>

                </div>

                {error && (
                    <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {error}
                    </p>
                )}
            </div>
        </div >
    );
};

export default Dashboard;
