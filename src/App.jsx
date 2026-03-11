import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import AddDataForm from './components/AddDataForm';
import FileManager from './components/FileManager';
import Notification from './components/Notification';
import { Database } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Assuming FastAPI default

function App() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Pass page and limit to the API
      const response = await axios.get(`${API_BASE_URL}/clean_data`, {
        params: { page, limit }
      });

      // Update state with API response
      // Handle cases where response.data.data might be null or undefined
      const rawData = response.data?.data || [];
      setData(rawData.map(item => {
        const { _sa_instance_state, ...rest } = item;
        return rest;
      }));
      setTotal(response.data?.total || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      addNotification('Failed to fetch data from API', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleAddData = async (newData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-entry`, newData);
      addNotification('Entry added successfully!', 'success');
      fetchData();
      return response.data;
    } catch (error) {
      console.error('Error adding data:', error);

      if (error.response && error.response.status === 400) {
        const detail = error.response.data.detail;
        if (detail && detail.errors) {
          // Join all validation errors and show them
          const errorMessage = detail.errors.join(' | ');
          addNotification(`Validation failed: ${errorMessage}`, 'error');
        } else {
          addNotification('Validation failed. Please check your data.', 'error');
        }
      } else {
        addNotification('Failed to add data to the database.', 'error');
      }
      throw error;
    }
  };

  const handleUpdateData = async (orderNumber, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/edit-entry/${orderNumber}`, updatedData);
      addNotification('Entry updated successfully!', 'success');
      setEditingEntry(null);
      fetchData();
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);

      if (error.response && error.response.status === 400) {
        const detail = error.response.data.detail;
        if (detail && detail.errors) {
          const errorMessage = detail.errors.join(' | ');
          addNotification(`Update failed: ${errorMessage}`, 'error');
        } else {
          addNotification('Update failed. Please check your data.', 'error');
        }
      } else if (error.response && error.response.status === 404) {
        addNotification('Order not found.', 'error');
      } else {
        addNotification('Failed to update data in the database.', 'error');
      }
      throw error;
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = async (file) => {
    addNotification(`Uploading ${file.name}...`, 'info');
    const formData = new FormData();
    formData.append('file', file);
    setUploadProgress(1); // Start progress

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const contentType = response.headers['content-type'];

      // Check if it's the Excel file (faulty data)
      if (contentType && (
        contentType.includes('spreadsheetml') ||
        contentType.includes('excel') ||
        contentType.includes('application/octet-stream')
      )) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'faulty_data.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        addNotification('Faulty data detected and downloaded as Excel.', 'error');
      } else {
        addNotification('File uploaded and processed successfully!', 'success');
      }

      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
      addNotification('Failed to upload or process file.', 'error');
    } finally {
      setUploadProgress(0); // Reset progress
    }
  };

  const handleDownload = (type) => {
    addNotification(`Preparing ${type} data download...`, 'success');
    // Mock download logic
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/download/${type}`;
    link.download = `${type}_data.csv`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    setTimeout(() => {
      addNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} data downloaded!`, 'success');
    }, 1000);
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Database size={32} color="var(--primary)" />
        </div>
        <div>
          <h1>CleanData Manager</h1>
          <p className="label" style={{ margin: 0 }}>Enterprise Data Validation & Storage</p>
        </div>
      </header>

      <main>
        <FileManager
          onUpload={handleUpload}
          onDownload={handleDownload}
          notify={addNotification}
        />

        {uploadProgress > 0 && (
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Uploading File...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        <AddDataForm
          onAdd={handleAddData}
          onUpdate={handleUpdateData}
          editingEntry={editingEntry}
          onCancel={() => setEditingEntry(null)}
          notify={addNotification}
        />

        {loading ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="label">Loading data...</div>
          </div>
        ) : (
          <Dashboard
            data={data}
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onEdit={handleEditEntry}
          />
        )}
      </main>

      <div className="toast-container">
        {notifications.map(n => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
