// ✅ AddVictim.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/victims';
const TOKEN = 'admin';

const AddVictim = () => {
  const [form, setForm] = useState({
    anonymous: false,
    demographics: { gender: '', age: '', ethnicity: '', occupation: '' },
    contact_info: { email: '', phone: '', secure_messaging: '' },
    risk_assessment: { level: '', threats: '', protection_needed: false },
    case: '',
  });

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
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
      setForm({
        anonymous: false,
        demographics: { gender: '', age: '', ethnicity: '', occupation: '' },
        contact_info: { email: '', phone: '', secure_messaging: '' },
        risk_assessment: { level: '', threats: '', protection_needed: false },
        case: '',
      });
    } catch {
      alert('❌ Error adding victim');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Add New Victim</h3>
      <label><input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} /> Anonymous</label>
      <select name="gender" value={form.demographics.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input name="age" placeholder="Age" type="number" onChange={handleChange} />
      <input name="ethnicity" placeholder="Ethnicity" onChange={handleChange} />
      <input name="occupation" placeholder="Occupation" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="secure_messaging" placeholder="Secure Messaging" onChange={handleChange} />
      <input name="case" placeholder="Related Case ID" onChange={handleChange} />
      <input name="level" placeholder="Risk Level" onChange={handleChange} />
      <input name="threats" placeholder="Threats (comma separated)" onChange={handleChange} />
      <label><input type="checkbox" onChange={handleCheckbox} /> Protection Needed</label>
      <button type="submit" className="btn">Submit</button>
    </form>
  );
};

export default AddVictim;