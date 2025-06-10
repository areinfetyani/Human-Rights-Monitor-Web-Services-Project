import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddCase.css';

const DeleteCase = () => {
  const { case_id } = useParams();
  const navigate = useNavigate();

  const [caseId, setCaseId] = useState(case_id || '');
  const [caseData, setCaseData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCase = async () => {
    if (!caseId.trim()) {
      setError('❌ Please enter a Case ID.');
      setCaseData(null);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/cases/${caseId}`);
      setCaseData(res.data);
      setError('');
      setMessage('');
    } catch {
      setCaseData(null);
      setError('❌ Case not found.');
    }
  };

  const deleteCase = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/cases/${caseId}`);
      setMessage(res.data.message);
      setError('');
      setCaseData(null);
      setCaseId('');
      navigate('/delete-case');
    } catch {
      setMessage('');
      setError('❌ Failed to delete/archive case.');
    }
  };

  useEffect(() => {
    if (case_id) {
      fetchCase();
    }
  }, [case_id]);

  const handleSearch = () => {
    if (caseId.trim()) {
      navigate(`/delete-case/${caseId}`);
    } else {
      setError('❌ Please enter a Case ID.');
      setCaseData(null);
    }
  };

  return (
    <div className="form-container" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>

      {/* LEFT: Search Section */}
      <div className="case-form" style={{ maxWidth: '450px', flex: '1 1 400px' }}>
        <h2 className="form-title">Delete Case</h2>

        <div className="form-group full">
          <label>Case ID</label>
          <input
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="Enter Case ID"
          />
        </div>

        <button type="button" className="submit-btn" onClick={handleSearch}>Fetch Case</button>

        {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}

        <button
          className="submit-btn"
          style={{ backgroundColor: '#555', marginTop: '20px' }}
          onClick={() => navigate('/archive-case')}
        >
           View Archived Cases
        </button>
      </div>

      {/* RIGHT: Case Details Display */}
      {caseData && (
        <div className="case-form" style={{ maxWidth: '750px', flex: '1 1 600px' }}>
          <h3 className="form-title">Case Details</h3>

          <div className="form-grid">
            <div className="form-group full"><label>Title</label><input value={caseData.title} disabled /></div>
            <div className="form-group full"><label>Description</label><textarea rows="3" value={caseData.description} disabled /></div>
            <div className="form-group"><label>Status</label><input value={caseData.status} disabled /></div>
            <div className="form-group"><label>Priority</label><input value={caseData.priority} disabled /></div>
            <div className="form-group"><label>Country</label><input value={caseData.country} disabled /></div>
            <div className="form-group"><label>Region</label><input value={caseData.region} disabled /></div>
            <div className="form-group full"><label>Victims</label><input value={caseData.victims?.join(', ')} disabled /></div>
            <div className="form-group full"><label>Violation Types</label><input value={caseData.violation_types?.join(', ')} disabled /></div>
          </div>

          <button
            type="button"
            onClick={deleteCase}
            className="submit-btn"
            style={{ backgroundColor: '#b30000', marginTop: '20px' }}
          >
             Delete & Archive
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteCase;
