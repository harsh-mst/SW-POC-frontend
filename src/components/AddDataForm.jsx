import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

const FIELDS = [
    'ORDERNUMBER', 'QUANTITYORDERED', 'PRICEEACH', 'ORDERLINENUMBER', 'SALES',
    'ORDERDATE', 'STATUS', 'QTR_ID', 'MONTH_ID', 'YEAR_ID', 'PRODUCTLINE',
    'MSRP', 'PRODUCTCODE', 'CUSTOMERNAME', 'PHONE', 'ADDRESSLINE1',
    'ADDRESSLINE2', 'CITY', 'STATE', 'POSTALCODE', 'COUNTRY', 'TERRITORY',
    'CONTACTLASTNAME', 'CONTACTFIRSTNAME', 'DEALSIZE'
];

const AddDataForm = ({ onAdd, onUpdate, editingEntry, onCancel, notify }) => {
    const [formData, setFormData] = useState(
        FIELDS.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
    );

    useEffect(() => {
        if (editingEntry) {
            setFormData(editingEntry);
        } else {
            setFormData(FIELDS.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
        }
    }, [editingEntry]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEntry) {
                await onUpdate(editingEntry.ORDERNUMBER, formData);
            } else {
                await onAdd(formData);
                setFormData(FIELDS.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={24} /> {editingEntry ? 'Edit Entry' : 'Add New Entry'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {FIELDS.map(field => (
                    <div key={field} className="form-group">
                        <label className="label">{field.replace(/_/g, ' ')}</label>
                        <input
                            type={field.includes('DATE') ? 'datetime-local' : (field.match(/QUANTITY|PRICE|SALES|ID|MSRP|NUMBER/) ? 'number' : 'text')}
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleChange}
                            className="input"
                            placeholder={`Enter ${field}`}
                            required={field === 'ORDERNUMBER'}
                            disabled={editingEntry && field === 'ORDERNUMBER'}
                        />
                    </div>
                ))}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        <PlusCircle size={20} /> {editingEntry ? 'Update Record' : 'Add Record'}
                    </button>
                    {editingEntry && (
                        <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddDataForm;
