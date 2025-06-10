// ✅ VictimDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Link } from 'lucide-react';
import ViewVictimDetails from '../ViewVictimDetails';

const API_URL = 'http://localhost:8000/victims';
const TOKEN = 'admin';

const VictimDashboard = () => {
  const [victims, setVictims] = useState([]);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [assigningTo, setAssigningTo] = useState(null);

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    axios.get(API_URL, { headers })
      .then(res => setVictims(res.data))
      .catch(() => alert('⚠️ Failed to fetch victims'));
  }, []);

  return (
    <div className="main-content">
      <h2 className="dashboard-header">Victim Dashboard</h2>
      <div className="grid">
        {victims.map((v) => (
          <div key={v.id} className="card">
            <div className="card-header">
              <h3>Victim</h3>
            </div>
            <p className="desc"><strong>ID:</strong> {v.id}</p>
            <p className="desc"><strong>Anonymous:</strong> {v.anonymous ? 'Yes' : 'No'}</p>
            <button className="btn" onClick={() => setSelectedVictim(v)}><Eye size={16} /> View</button>
            <button className="btn" onClick={() => setAssigningTo(v)}><Link size={16} /> Assign</button>
          </div>
        ))}
      </div>

      {selectedVictim && (
        <ViewVictimDetails victim={selectedVictim} onClose={() => setSelectedVictim(null)} />
      )}
    </div>
  );
};

export default VictimDashboard;