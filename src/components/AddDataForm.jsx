import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

const FIELDS = [
  "ORDERNUMBER",
  "QUANTITYORDERED",
  "PRICEEACH",
  "ORDERLINENUMBER",
  "SALES",
  "ORDERDATE",
  "STATUS",
  "QTR_ID",
  "MONTH_ID",
  "YEAR_ID",
  "PRODUCTLINE",
  "MSRP",
  "PRODUCTCODE",
  "CUSTOMERNAME",
  "PHONE",
  "ADDRESSLINE1",
  "ADDRESSLINE2",
  "CITY",
  "STATE",
  "POSTALCODE",
  "COUNTRY",
  "TERRITORY",
  "CONTACTLASTNAME",
  "CONTACTFIRSTNAME",
  "DEALSIZE",
];

const VALIDATIONS = {
  ORDERNUMBER: { type: "number", required: true },

  QUANTITYORDERED: { type: "number", min: 1 },
  PRICEEACH: { type: "number", min: 0.01 },
  ORDERLINENUMBER: { type: "number", min: 1 },
  SALES: { type: "number", min: 0.01 },

  ORDERDATE: { type: "datetime-local" },

  QTR_ID: { type: "number", min: 1, max: 4 },
  MONTH_ID: { type: "number", min: 1, max: 12 },
  YEAR_ID: { type: "number" },

  MSRP: { type: "number", min: 0.01 },

  PHONE: {
    pattern: /^[0-9]{10}$/,
    message: "Phone number must be exactly 10 digits",
  },

  POSTALCODE: {
    pattern: /^[0-9]{5,6}$/,
    message: "Postal code must contain only numbers",
  },

  DEALSIZE: {
    options: ["Small", "Medium", "Large"],
  },
};

const AddDataForm = ({ onAdd, onUpdate, editingEntry, onCancel }) => {
  const emptyForm = FIELDS.reduce((acc, field) => ({ ...acc, [field]: "" }), {});

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry);
    } else {
      setFormData(emptyForm);
    }
  }, [editingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(VALIDATIONS).forEach((field) => {
      const rule = VALIDATIONS[field];
      const value = formData[field];

      if (rule.required && !value) {
        newErrors[field] = "This field is required";
      }

      if (rule.min !== undefined && Number(value) < rule.min) {
        newErrors[field] = `Minimum value is ${rule.min}`;
      }

      if (rule.max !== undefined && Number(value) > rule.max) {
        newErrors[field] = `Maximum value is ${rule.max}`;
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message;
      }

      if (rule.options && value && !rule.options.includes(value)) {
        newErrors[field] = `Allowed values: ${rule.options.join(", ")}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingEntry) {
        await onUpdate(editingEntry.ORDERNUMBER, formData);
      } else {
        await onAdd(formData);
        setFormData(emptyForm);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getInputType = (field) => {
    if (VALIDATIONS[field]?.type) return VALIDATIONS[field].type;
    if (field.includes("DATE")) return "datetime-local";
    if (field.match(/QUANTITY|PRICE|SALES|ID|MSRP|NUMBER/)) return "number";
    return "text";
  };

  return (
    <div className="glass-card" style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <PlusCircle size={24} /> {editingEntry ? "Edit Entry" : "Add New Entry"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {FIELDS.map((field) => (
          <div key={field} className="form-group">
            <label className="label">{field.replace(/_/g, " ")}</label>

            {VALIDATIONS[field]?.options ? (
              <select
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select {field}</option>
                {VALIDATIONS[field].options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={getInputType(field)}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="input"
                placeholder={`Enter ${field}`}
                required={field === "ORDERNUMBER"}
                disabled={editingEntry && field === "ORDERNUMBER"}
              />
            )}

            {errors[field] && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors[field]}</p>
            )}
          </div>
        ))}

        <div
          style={{
            gridColumn: "1 / -1",
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
          }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <PlusCircle size={20} />{" "}
            {editingEntry ? "Update Record" : "Add Record"}
          </button>

          {editingEntry && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDataForm;