import React, { useState } from 'react';
import axios from 'axios';
import './UpdateCase.css';

const UpdateStatus = () => {
  const [caseId, setCaseId] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const statusOptions = ['new', 'under_investigation', 'resolved'];

  const fetchCase = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/cases/${caseId}`);
      setCaseData(res.data);
      setStatus(res.data.status);
      setError('');
      setMessage('');
    } catch {
      setCaseData(null);
      setError('❌ Case not found.');
    }
  };

  const updateStatus = async () => {
    try {
      await axios.patch(`http://localhost:8000/cases/${caseId}`, null, {
        params: {
          new_status: status,
          user: user,
        },
      });
      setMessage(`✅ Status updated successfully for case: ${caseId}`);
      setCaseData(null);
      setCaseId('');
      setStatus('');
      setUser('');
    } catch {
      setMessage('');
      setError('❌ Failed to update status.');
    }
  };

  return (
    <div className="form-container">
      {/* Search Section */}
      <div className="case-form" style={{ maxWidth: '420px' }}>
        <h2 className="form-title">Search Case</h2>

        <div className="form-group full">
          <label htmlFor="caseId">Case ID</label>
          <input
            id="caseId"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="Enter Case ID"
          />
        </div>

        <button type="button" className="submit-btn" onClick={fetchCase}>
          Fetch Case
        </button>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
      </div>

      {/* Case Details Section */}
      {caseData && (
        <div className="case-form" style={{ maxWidth: '750px' }}>
          <h3 className="form-title">Case Details</h3>
          <div className="form-grid">
        <div className="form-group full">
  <label htmlFor="title">Title:</label>
  <div id="title" className="value-label">{caseData.title}</div>
</div>

<div className="form-group full">
  <label htmlFor="description">Description:</label>
  <div id="description" className="value-label">{caseData.description}</div>
</div>

<div className="form-group">
  <label htmlFor="priority">Priority:</label>
  <div id="priority" className="value-label">{caseData.priority}</div>
</div>

<div className="form-group">
  <label htmlFor="country">Country:</label>
  <div id="country" className="value-label">{caseData.location?.country}</div>
</div>

            {/* Editable Fields */}
            <div className="form-group full">
              <label htmlFor="status">New Status:</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full">
              <label htmlFor="user">Updated By (User):</label>
              <input
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter your name or ID"
              />
            </div>
          </div>

          <button type="button" className="submit-btn" onClick={updateStatus}>
            Update Status
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateStatus;
