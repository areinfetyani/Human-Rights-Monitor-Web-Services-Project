// // ✅ VictimSearch.jsx
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


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search, BadgeCheck } from 'lucide-react';

// const API_URL = 'http://localhost:8000/victims';
// const CASES_URL = 'http://localhost:8000/cases';
// const TOKEN = 'admin';

// const VictimSearch = () => {
//   const [allCases, setAllCases] = useState([]);
//   const [caseSearchId, setCaseSearchId] = useState('');
//   const [victimIdSearch, setVictimIdSearch] = useState('');
//   const [caseVictims, setCaseVictims] = useState([]);
//   const [victimDetails, setVictimDetails] = useState(null);
//   const [notFoundCase, setNotFoundCase] = useState(false);
//   const [notFoundVictim, setNotFoundVictim] = useState(false);

//   const headers = {
//     Authorization: `Bearer ${TOKEN}`,
//     'Content-Type': 'application/json',
//   };

//   useEffect(() => {
//     axios
//       .get(CASES_URL, { headers })
//       .then((res) => setAllCases(res.data))
//       .catch(() => alert('⚠️ Failed to load cases list'));
//   }, []);

//   const handleSearchByCase = async () => {
//     setNotFoundCase(false);
//     setCaseVictims([]);
//     if (!caseSearchId) return;
//     try {
//       const res = await axios.get(`${API_URL}/case/${caseSearchId}`, { headers });
//       if (res.data.length === 0) setNotFoundCase(true);
//       else setCaseVictims(res.data);
//     } catch (err) {
//       setNotFoundCase(true);
//     }
//   };

//   const handleSearchById = async () => {
//     setNotFoundVictim(false);
//     setVictimDetails(null);
//     try {
//       const res = await axios.get(`${API_URL}/${victimIdSearch}`, { headers });
//       setVictimDetails(res.data);
//     } catch {
//       setNotFoundVictim(true);
//     }
//   };

//   return (
//     <div className="main-content">
//       <h2 className="dashboard-header">Search Victims</h2>

//       {/* 🔍 Search by Case ID Dropdown */}
//       <div className="search-section">
//         <h3>Search Victims by Case ID</h3>
//         <div className="form-group">
//           <label>Select Case</label>
//           <select
//             value={caseSearchId}
//             onChange={(e) => setCaseSearchId(e.target.value)}
//           >
//             <option value="">-- Choose a case --</option>
//             {allCases.map((c) => (
//               <option key={c.case_id} value={c.case_id}>
//                 {c.case_id} - {c.title}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button className="btn" onClick={handleSearchByCase}>
//           <Search size={14} /> Search
//         </button>

//         {notFoundCase && <p style={{ color: 'red' }}>❌ No victims found for this case.</p>}

//         <div className="grid">
//           {caseVictims.map((v) => (
//             <div key={v.id} className="card">
//               <div className="card-header">
//                 <h3>Victim</h3>
//                 <BadgeCheck color="white" size={20} />
//               </div>
//               <p><strong>ID:</strong> {v.id}</p>
//               <p><strong>Anonymous:</strong> {v.anonymous ? 'Yes' : 'No'}</p>
//               <p><strong>Age:</strong> {v.demographics?.age ?? 'N/A'}</p>
//               <p><strong>Email:</strong> {v.contact_info?.email ?? 'N/A'}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🔍 Search by Victim ID */}
//       <div className="search-section" style={{ marginTop: '40px' }}>
//         <h3>Search Victim by ID</h3>
//         <input
//           type="text"
//           placeholder="Enter Victim ID..."
//           value={victimIdSearch}
//           onChange={(e) => setVictimIdSearch(e.target.value)}
//         />
//         <button className="btn" onClick={handleSearchById}>
//           <Search size={14} /> Search
//         </button>

//         {notFoundVictim && <p style={{ color: 'red' }}>❌ Victim not found.</p>}

//         {victimDetails && (
//           <div key={victimDetails.id} className="card">
//             <div className="card-header">
//               <h3>Victim</h3>
//               <BadgeCheck color="white" size={20} />
//             </div>
//             <p><strong>ID:</strong> {victimDetails.id}</p>
//             <p><strong>Anonymous:</strong> {victimDetails.anonymous ? 'Yes' : 'No'}</p>
//             <p><strong>Age:</strong> {victimDetails.demographics?.age ?? 'N/A'}</p>
//             <p><strong>Email:</strong> {victimDetails.contact_info?.email ?? 'N/A'}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VictimSearch;
