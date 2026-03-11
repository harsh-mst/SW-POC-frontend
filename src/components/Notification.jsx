import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        if (type === 'success') return <CheckCircle size={20} />;
        if (type === 'error') return <XCircle size={20} />;
        return <Info size={20} />;
    };

    const getClassName = () => {
        if (type === 'success') return 'toast toast-success';
        if (type === 'error') return 'toast toast-error';
        return 'toast toast-info';
    };

    return (
        <div className={getClassName()}>
            {getIcon()}
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '0.5rem' }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Notification;
