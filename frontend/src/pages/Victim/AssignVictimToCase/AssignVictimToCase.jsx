
// export default AssignVictimToCase;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignVictimToCase.css';

const AssignVictimToCase = () => {
  const [caseId, setCaseId] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [victims, setVictims] = useState([]);
  const [linkedVictims, setLinkedVictims] = useState([]);
  const [selectedVictimId, setSelectedVictimId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAllVictims = async () => {
    try {
      const res = await axios.get('http://localhost:8000/victims/get_victims');
      setVictims(res.data);
    } catch {
      setMessage('❌ Failed to load victims.');
    }
  };

  const fetchCaseById = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/cases/${caseId}`);
      setCaseData(res.data);
      setMessage('');
      setError('');
      fetchLinkedVictims();
    } catch {
      setCaseData(null);
      setLinkedVictims([]);
      setError('❌ Case not found.');
    }
  };

  const fetchLinkedVictims = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/victims/case/${caseId}`);
      setLinkedVictims(res.data);
    } catch {
      setLinkedVictims([]);
    }
  };

  const assignVictim = async () => {
    if (!selectedVictimId || !caseId) {
      setMessage('⚠️ Please select a victim and fetch a case.');
      return;
    }

    try {
      await axios.post(`http://localhost:8000/victims/${selectedVictimId}/assign/${caseId}`);
      setMessage(`✅ Victim assigned to case ${caseId} successfully.`);
      fetchLinkedVictims();
    } catch {
      setMessage('❌ Failed to assign victim.');
    }
  };

  useEffect(() => {
    fetchAllVictims();
  }, []);

  const selectedVictim = victims.find(v => v.id === selectedVictimId);

  return (
    <div className="assign-container">
      <h2>Assign Victim to Case</h2>

      <div className="form-group">
        <label>Enter Case ID:</label>
        <input
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          placeholder="Enter Case ID..."
        />
        <button className="btn" onClick={fetchCaseById}>Fetch Case</button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="message-text">{message}</p>}

      {caseData && (
        <div className="case-details">
          <h3>Case: {caseData.case_id}</h3>
          <p><strong>Title:</strong> {caseData.title}</p>
          <p><strong>Description:</strong> {caseData.description}</p>
          <p><strong>Priority:</strong> {caseData.priority}</p>
          <p><strong>Status:</strong> {caseData.status}</p>

          <h4>🧍 Victims Already Assigned:</h4>
          {linkedVictims.length > 0 ? (
            <ul>
              {linkedVictims.map(v => (
                <li key={v.id}>
                  {v.anonymous ? 'Anonymous' : v.name || `ID: ${v.id} - Age: ${v.demographics?.age || 'N/A'}`}
                </li>
              ))}
            </ul>
          ) : <p>No victims assigned yet.</p>}
        </div>
      )}

      <div className="form-group">
        <label>Select Victim to Assign:</label>
        <select
          value={selectedVictimId}
          onChange={(e) => setSelectedVictimId(e.target.value)}
        >
          <option value="">-- Choose Victim --</option>
          {victims.map(v => (
            <option key={v.id} value={v.id}>
              {v.anonymous ? 'Anonymous' : v.name || `Victim (${v.demographics?.gender || ''}, Age ${v.demographics?.age || 'N/A'})`}
            </option>
          ))}
        </select>
      </div>

      {selectedVictimId && selectedVictim && (
        <div className="victim-preview">
          <p>
            <strong>Selected Victim:</strong>{' '}
            {selectedVictim.anonymous
              ? 'Anonymous'
              : selectedVictim.name || 'Unnamed victim'}
          </p>
        </div>
      )}

      <button className="btn" onClick={assignVictim}>Assign Victim</button>
    </div>
  );
};

export default AssignVictimToCase;
