// ✅ UpdateRisk.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit } from 'lucide-react';

const API_URL = 'http://localhost:8000/victims';
const TOKEN = 'admin';

const UpdateRisk = () => {
  const [victims, setVictims] = useState([]);
  const [riskForm, setRiskForm] = useState({
    level: '',
    threats: '',
    protection_needed: false,
  });

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    axios.get(API_URL, { headers })
      .then(res => setVictims(res.data))
      .catch(() => alert('⚠️ Failed to fetch victims'));
  }, []);

  const handleRiskChange = (e) => {
    const { name, value, checked, type } = e.target;
    setRiskForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePatch = async (id) => {
    const patchData = {
      level: riskForm.level,
      threats: riskForm.threats?.split(',').map(t => t.trim()) || [],
      protection_needed: riskForm.protection_needed,
    };
    try {
      await axios.patch(`${API_URL}/${id}`, patchData, { headers });
      alert('✅ Risk updated');
    } catch {
      alert('❌ Failed to update risk');
    }
  };

  return (
    <div className="main-content">
      <h2 className="dashboard-header">Update Victim Risk</h2>
      <div className="grid">
        {victims.map((v) => (
          <div key={v.id} className="card">
            <h3>{v.id}</h3>
            <input placeholder="Level (low/medium/high)" name="level" onChange={handleRiskChange} />
            <input placeholder="Threats (comma separated)" name="threats" onChange={handleRiskChange} />
            <label><input type="checkbox" name="protection_needed" onChange={handleRiskChange} /> Protection Needed</label>
            <button className="btn" onClick={() => handlePatch(v.id)}><Edit size={16} /> Update Risk</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateRisk;