import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCase.css';

const ArchivedCase = () => {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedCases = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cases/archive');
        setCases(response.data);
        setError('');
      } catch (err) {
        setError('❌ No archived cases found or failed to fetch data.');
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedCases();
  }, []);

  return (
    <div className="form-container">
      <div className="header-block" style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h2 className="form-title" style={{ fontSize: '34px', fontWeight: '800', color: '#042c54', letterSpacing: '1px' }}> Archived Cases</h2>
      </div>

      {loading ? (
        <div className="loading">Loading archived cases...</div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : cases.length === 0 ? (
        <div className="info-text">No archived cases available.</div>
      ) : (
        <div className="table-container" style={{ overflowX: 'auto', maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
          <table className="case-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left' }}>Case ID</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Date Reported</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item, index) => (
                <tr
                  key={item._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f4f8fc',
                    transition: 'background-color 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2f1f8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f4f8fc')}
                >
                  <td style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>{item.case_id}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>{item.title}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>{item.description}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>{item.status}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>{item.priority}</td>
                  <td style={{ padding: '14px', borderBottom: '1px solid #ddd' }}>{new Date(item.date_reported).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArchivedCase;
