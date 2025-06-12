// History.jsx - View case status history in professional cards
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/cases/status-history')
      .then((res) => setHistory(res.data))
      .catch(() => setError('❌ Failed to fetch status history'));
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">📜 Case Status History</h2>
      {error && <p className="error-text">{error}</p>}
      <div className="history-grid">
        {history.map((item) => (
          <div key={item._id} className="history-card">
            <h3>🆔 Case: {item.case_id}</h3>
            <p><strong>Old Status:</strong> <span className="old-status">{item.old_status}</span></p>
            <p><strong>New Status:</strong> <span className="new-status">{item.new_status}</span></p>
            <p><strong>Updated By:</strong> {item.updated_by}</p>
            <p><strong>Updated At:</strong> {new Date(item.updated_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
