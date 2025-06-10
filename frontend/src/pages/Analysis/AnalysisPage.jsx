import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './AnalysisPage.css';

const AnalysisPage = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/analytics/ana')
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(err => console.error('Failed to fetch dashboard data:', err));
  }, []);

  if (!dashboard) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analysis-container">
      <h1 className="dashboard-title">Human Rights Analytics Dashboard</h1>

      <div className="chart-section">
        <h2>Violations by Type</h2>
        <Plot
          data={[{
            type: 'bar',
            x: dashboard.cases_by_violation.map(item => item.violation_type),
            y: dashboard.cases_by_violation.map(item => item.count),
          }]}
          layout={{ title: 'Violations by Type' }}
        />
      </div>

      <div className="chart-section">
        <h2>Cases by Country</h2>
        <Plot
          data={[{
            type: 'pie',
            labels: dashboard.cases_by_country.map(item => item.country),
            values: dashboard.cases_by_country.map(item => item.count),
          }]}
          layout={{ title: 'Cases by Country' }}
        />
      </div>

      <div className="chart-section">
        <h2>Case Timeline (Date Reported)</h2>
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines+markers',
            x: dashboard.cases_by_date.map(item => item.date),
            y: dashboard.cases_by_date.map(item => item.count),
          }]}
          layout={{ title: 'Cases Over Time' }}
        />
      </div>

      <div className="chart-section">
        <h2>Victims by Gender</h2>
        <Plot
          data={[{
            type: 'bar',
            x: dashboard.victims_by_gender.map(item => item.gender),
            y: dashboard.victims_by_gender.map(item => item.count),
          }]}
          layout={{ title: 'Victims by Gender' }}
        />
      </div>

      <div className="chart-section">
        <h2>Victims by Ethnicity</h2>
        <Plot
          data={[{
            type: 'bar',
            x: dashboard.victims_by_ethnicity.map(item => item.ethnicity),
            y: dashboard.victims_by_ethnicity.map(item => item.count),
          }]}
          layout={{ title: 'Victims by Ethnicity' }}
        />
      </div>
    </div>
  );
};

export default AnalysisPage;