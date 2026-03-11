import React, { useRef } from 'react';
import { Upload, Download, FileText, AlertTriangle } from 'lucide-react';

const FileManager = ({ onUpload, onDownload, notify }) => {
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
            />
            <button className="btn btn-secondary" onClick={handleUploadClick}>
                <Upload size={20} /> Upload CSV/Excel
            </button>

            <button className="btn btn-secondary" onClick={() => onDownload('clean')}>
                <FileText size={20} color="var(--success)" /> Download Clean Data
            </button>
        </div>
    );
};

export default FileManager;
