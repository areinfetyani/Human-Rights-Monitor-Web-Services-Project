

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, Eye, X, Edit, Search, Link } from 'lucide-react';
import './Victim.css';

const API_URL = 'http://localhost:8000/victims';
const CASES_URL = 'http://localhost:8000/cases';
const TOKEN = 'admin';

const VictimList = () => {
  const [victims, setVictims] = useState([]);
  const [error, setError] = useState(null);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [editingVictim, setEditingVictim] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [caseSearchId, setCaseSearchId] = useState('');
  const [caseResults, setCaseResults] = useState([]);
  const [victimIdSearch, setVictimIdSearch] = useState('');
  const [victimByIdResult, setVictimByIdResult] = useState(null);
  const [assignCases, setAssignCases] = useState([]);
  const [assigningTo, setAssigningTo] = useState(null);
  const [form, setForm] = useState({
    anonymous: false,
    demographics: { gender: '', age: '', ethnicity: '', occupation: '' },
    contact_info: { email: '', phone: '', secure_messaging: '' },
    risk_assessment: { level: '', threats: '', protection_needed: false },
    case: '',
  });
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
    fetchVictims();
  }, []);

  const fetchVictims = () => {
    axios.get(API_URL, { headers })
      .then(res => setVictims(res.data))
      .catch(() => setError('⚠️ Access denied or server error'));
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
    } catch (err) {
      alert('❌ Assignment failed');
    }
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

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'anonymous') setForm(prev => ({ ...prev, anonymous: checked }));
    else if (name in form.demographics) setForm(prev => ({ ...prev, demographics: { ...prev.demographics, [name]: value } }));
    else if (name in form.contact_info) setForm(prev => ({ ...prev, contact_info: { ...prev.contact_info, [name]: value } }));
    else if (name in form.risk_assessment) setForm(prev => ({ ...prev, risk_assessment: { ...prev.risk_assessment, [name]: value } }));
    else if (name === 'case') setForm(prev => ({ ...prev, case: value }));
  };

  const handleCheckbox = (e) => setForm(prev => ({
    ...prev,
    risk_assessment: { ...prev.risk_assessment, protection_needed: e.target.checked },
  }));

  const handleRiskChange = (e) => {
    const { name, value, checked, type } = e.target;
    setRiskForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: 'victim',
      anonymous: form.anonymous,
      demographics: { ...form.demographics, age: Number(form.demographics.age) },
      contact_info: form.contact_info,
      support_services: [{ type: 'none', provider: 'default', status: 'unknown' }],
      cases_involved: [form.case || 'Unknown Case'],
      risk_assessment: {
        level: form.risk_assessment.level,
        threats: form.risk_assessment.threats?.split(',').map(t => t.trim()) || [],
        protection_needed: form.risk_assessment.protection_needed,
      },
    };
    try {
      await axios.post(API_URL, payload, { headers });
      alert('✅ Victim added!');
      fetchVictims();
      setShowForm(false);
    } catch (err) {
      alert('❌ Error adding victim');
    }
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
      fetchVictims();
      setEditingVictim(null);
    } catch {
      alert('❌ Failed to update risk');
    }
  };

  const handleClose = () => setSelectedVictim(null);

  return (
    <div className="victim-dashboard">
      <aside className="sidebar">
        <h3>RAMI TAWAFSHA</h3>
        <ul>
          <li className={currentTab === 'dashboard' ? 'active' : ''} onClick={() => { setCurrentTab('dashboard'); setShowForm(false); }}>Dashboard</li>
          <li className={currentTab === 'add' ? 'active' : ''} onClick={() => { setCurrentTab('add'); setShowForm(true); }}>Add New Victim</li>
          <li className={currentTab === 'update' ? 'active' : ''} onClick={() => { setCurrentTab('update'); setEditingVictim(null); }}>Update Risk</li>
          <li className={currentTab === 'search' ? 'active' : ''} onClick={() => setCurrentTab('search')}>Search by Case</li>
          <li className={currentTab === 'byid' ? 'active' : ''} onClick={() => setCurrentTab('byid')}>Search by ID</li>
          <li className={currentTab === 'assign' ? 'active' : ''} onClick={() => { setCurrentTab('assign'); fetchCasesWithInfo(); }}>Assign Victim</li>
        </ul>
      </aside>

      <main className="main-content">
        {currentTab === 'dashboard' && (
          <div className="grid">
            {victims.map((v) => (
              <div key={v.id} className="card">
                <div className="card-header">
                  <h3>Victim</h3>
                  <BadgeCheck color="white" size={20} />
                </div>
                <p className="desc"><strong>ID:</strong> {v.id}</p>
                <p className="desc"><strong>Anonymous:</strong> {v.anonymous ? 'Yes' : 'No'}</p>
                <button className="btn" onClick={() => setSelectedVictim(v)}><Eye size={16} /> View</button>
                <button className="btn" onClick={() => setAssigningTo(v)}><Link size={16} /> Assign</button>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'add' && showForm && (
          <form onSubmit={handleSubmit} className="form">
            <h3>Add New Victim</h3>
            <label><input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} /> Anonymous</label>
            <input name="gender" placeholder="Gender" onChange={handleChange} />
            <input name="age" placeholder="Age" type="number" onChange={handleChange} />
            <input name="ethnicity" placeholder="Ethnicity" onChange={handleChange} />
            <input name="occupation" placeholder="Occupation" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <input name="secure_messaging" placeholder="Secure Messaging" onChange={handleChange} />
            <select name="case" onChange={handleChange} value={form.case}>
              <option value="">Select Case</option>
              <option value="Loan">Loan</option>
              <option value="theft">Theft</option>
            </select>
            <input name="level" placeholder="Risk Level" onChange={handleChange} />
            <input name="threats" placeholder="Threats (comma separated)" onChange={handleChange} />
            <label><input type="checkbox" onChange={handleCheckbox} /> Protection Needed</label>
            <button type="submit" className="btn">Submit</button>
          </form>
        )}

        {currentTab === 'update' && (
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
        )}

        {currentTab === 'search' && (
          <div className="search-section">
            <h3>Search Victims by Case ID</h3>
            <input type="text" placeholder="Enter Case ID... (Loan or Theft)" value={caseSearchId} onChange={(e) => setCaseSearchId(e.target.value)} />
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
        )}

        {currentTab === 'byid' && (
          <div className="search-section">
            <h3>Search Victim by ID</h3>
            <input type="text" placeholder="Enter Victim ID..." value={victimIdSearch} onChange={(e) => setVictimIdSearch(e.target.value)} />
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
        )}

        {currentTab === 'assign' && assigningTo && (
          <div className="search-section">
            <h3>Assign Victim: {assigningTo.id}</h3>
            {assignCases.map((c) => (
              <div key={c.id} className="card">
                <h4>Case ID: {c.id}</h4>
                <p>Type: {c.type}</p>
                <button className="btn" onClick={() => handleAssignToCase(c.id)}>Assign</button>
              </div>
            ))}
          </div>
        )}

        {selectedVictim && (
          <div className="modal-overlay">
            <div className="modal">
              <button onClick={handleClose} className="modal-close"><X size={20} /></button>
              <h2 className="modal-title">Victim Details</h2>
              <p><strong>ID:</strong> {selectedVictim.id}</p>
              <p><strong>Anonymous:</strong> {selectedVictim.anonymous ? 'Yes' : 'No'}</p>
              <p><strong>Gender:</strong> {selectedVictim.demographics?.gender}</p>
              <p><strong>Age:</strong> {selectedVictim.demographics?.age}</p>
              <p><strong>Email:</strong> {selectedVictim.contact_info?.email}</p>
              <p><strong>Phone:</strong> {selectedVictim.contact_info?.phone}</p>
              <p><strong>Created At:</strong> {new Date(selectedVictim.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VictimList;