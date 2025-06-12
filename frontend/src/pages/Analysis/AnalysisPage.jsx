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

  const defaultLayout = {
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    font: { family: 'Segoe UI', size: 14, color: '#333' },
    hovermode: 'closest',
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    }
  };

  return (
    <div className="analysis-container">
      <h1 className="dashboard-title">📊 Human Rights Analytics Dashboard</h1>

      <div className="chart-section">
        <h2>🔍 Violations by Type</h2>
        <Plot
          data={[{
            type: 'bar',
            x: dashboard.cases_by_violation.map(item => item.violation_type),
            y: dashboard.cases_by_violation.map(item => item.count),
            marker: { color: '#24b9b9' },
            hoverinfo: 'x+y',
            animation: { frame: { duration: 500 } }
          }]}
          layout={{
            ...defaultLayout,
            title: 'Types of Reported Violations'
          }}
        />
      </div>

      <div className="chart-section">
        <h2>🌍 Cases by Country</h2>
        <Plot
          data={[{
            type: 'pie',
            labels: dashboard.cases_by_country.map(item => item.country),
            values: dashboard.cases_by_country.map(item => item.count),
            textinfo: 'label+percent',
            hole: 0.3,
            marker: {
              colors: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff']
            }
          }]}
          layout={{
            ...defaultLayout,
            title: 'Distribution of Cases by Country'
          }}
        />
      </div>

      <div className="chart-section">
        <h2>📅 Case Timeline</h2>
        <Plot
          data={[{
            type: 'scatter',
            mode: 'lines+markers',
            x: dashboard.cases_by_date.map(item => item.date),
            y: dashboard.cases_by_date.map(item => item.count),
            line: { color: '#a29bfe' },
            marker: { size: 6 }
          }]}
          layout={{
            ...defaultLayout,
            title: 'Cases Reported Over Time'
          }}
        />
      </div>

      <div className="chart-section">
        <h2>🚻 Victims by Gender</h2>
        <Plot
          data={[{
            type: 'bar',
            x: dashboard.victims_by_gender.map(item => item.gender),
            y: dashboard.victims_by_gender.map(item => item.count),
            marker: { color: '#f78fb3' },
            hoverinfo: 'x+y'
          }]}
          layout={{
            ...defaultLayout,
            title: 'Gender Distribution of Victims'
          }}
        />
      </div>

      <div className="chart-section">
        <h2>🧬 Victims by Ethnicity</h2>
        <Plot
          data={[{
            type: 'bar',
            x: dashboard.victims_by_ethnicity.map(item => item.ethnicity),
            y: dashboard.victims_by_ethnicity.map(item => item.count),
            marker: { color: '#70a1ff' },
            hoverinfo: 'x+y'
          }]}
          layout={{
            ...defaultLayout,
            title: 'Ethnic Background of Victims'
          }}
        />
      </div>
    </div>
  );
};

export default AnalysisPage;
