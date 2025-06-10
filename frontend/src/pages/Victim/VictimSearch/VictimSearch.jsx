// ✅ VictimSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Search, BadgeCheck } from 'lucide-react';

const API_URL = 'http://localhost:8000/victims';
const TOKEN = 'admin';

const VictimSearch = () => {
  const [caseSearchId, setCaseSearchId] = useState('');
  const [victimIdSearch, setVictimIdSearch] = useState('');
  const [caseResults, setCaseResults] = useState([]);
  const [victimByIdResult, setVictimByIdResult] = useState(null);

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  const handleSearchByCase = async () => {
    try {
      const res = await axios.get(`${API_URL}/case/${caseSearchId}`, { headers });
      setCaseResults(res.data);
    } catch (err) {
      alert('❌ Error fetching victims by case');
      setCaseResults([]);
    }
  };

  const handleSearchById = async () => {
    try {
      const res = await axios.get(`${API_URL}/${victimIdSearch}`, { headers });
      setVictimByIdResult(res.data);
    } catch {
      alert('❌ Victim not found');
      setVictimByIdResult(null);
    }
  };

  return (
    <div className="main-content">
      <h2 className="dashboard-header">Search Victims</h2>

      {/* Search by Case ID */}
      <div className="search-section">
        <h3>Search Victims by Case ID</h3>
        <input
          type="text"
          placeholder="Enter Case ID... (Loan or Theft)"
          value={caseSearchId}
          onChange={(e) => setCaseSearchId(e.target.value)}
        />
        <button className="btn" onClick={handleSearchByCase}>Search</button>
        <div className="grid">
          {caseResults.map((v) => (
            <div key={v.id} className="card">
              <div className="card-header">
                <h3>Victim</h3>
                <BadgeCheck color="white" size={20} />
              </div>
              <p className="desc"><strong>ID:</strong> {v.id}</p>
              <p className="desc"><strong>Anonymous:</strong> {v.anonymous ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search by Victim ID */}
      <div className="search-section" style={{ marginTop: '40px' }}>
        <h3>Search Victim by ID</h3>
        <input
          type="text"
          placeholder="Enter Victim ID..."
          value={victimIdSearch}
          onChange={(e) => setVictimIdSearch(e.target.value)}
        />
        <button className="btn" onClick={handleSearchById}><Search size={14} /> Search</button>

        {victimByIdResult && (
          <div key={victimByIdResult.id} className="card">
            <div className="card-header">
              <h3>Victim</h3>
              <BadgeCheck color="white" size={20} />
            </div>
            <p className="desc"><strong>ID:</strong> {victimByIdResult.id}</p>
            <p className="desc"><strong>Anonymous:</strong> {victimByIdResult.anonymous ? 'Yes' : 'No'}</p>
            <p className="desc"><strong>Age:</strong> {victimByIdResult.demographics?.age}</p>
            <p className="desc"><strong>Email:</strong> {victimByIdResult.contact_info?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VictimSearch;