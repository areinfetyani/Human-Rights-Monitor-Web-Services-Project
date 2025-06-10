// ✅ AssignVictim.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/victims';
const CASES_URL = 'http://localhost:8000/cases';
const TOKEN = 'admin';

const AssignVictim = () => {
  const [victims, setVictims] = useState([]);
  const [assignCases, setAssignCases] = useState([]);
  const [assigningTo, setAssigningTo] = useState(null);

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    fetchVictims();
    fetchCasesWithInfo();
  }, []);

  const fetchVictims = () => {
    axios.get(API_URL, { headers })
      .then(res => setVictims(res.data))
      .catch(() => alert('❌ Failed to load victims'));
  };

  const fetchCasesWithInfo = async () => {
    try {
      const res = await axios.get(`${CASES_URL}/with-victim-info`);
      const onlyUnassignedCases = res.data.filter(c => !c.victim);
      setAssignCases(onlyUnassignedCases);
    } catch {
      alert('❌ Failed to load cases');
    }
  };

  const handleAssignToCase = async (caseId) => {
    if (!assigningTo) return alert('❌ Select a victim first.');
    try {
      await axios.patch(`${API_URL}/assign-case/${assigningTo.id}`, { case_id: caseId }, { headers });
      alert(`✅ Victim assigned to case ${caseId}`);
      fetchVictims();
      fetchCasesWithInfo();
    } catch {
      alert('❌ Assignment failed');
    }
  };

  return (
    <div className="main-content">
      <h2 className="dashboard-header">Assign Victim to Case</h2>

      <div className="grid">
        {victims.map((v) => (
          <div key={v.id} className="card">
            <p><strong>ID:</strong> {v.id}</p>
            <p><strong>Anonymous:</strong> {v.anonymous ? 'Yes' : 'No'}</p>
            <button className="btn" onClick={() => setAssigningTo(v)}>Select</button>
          </div>
        ))}
      </div>

      {assigningTo && (
        <div className="search-section" style={{ marginTop: '40px' }}>
          <h3>Assign Victim: {assigningTo.id}</h3>
          <div className="grid">
            {assignCases.map((c) => (
              <div key={c.id} className="card">
                <h4>Case ID: {c.id}</h4>
                <p>Type: {c.type}</p>
                <button className="btn" onClick={() => handleAssignToCase(c.id)}>Assign</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignVictim;
