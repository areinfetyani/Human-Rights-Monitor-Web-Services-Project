import React, { useEffect, useState } from "react";
import './ReportStyle.css';
function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/reports/analytics")
      .then((res) => res.json())
      .then((json) => {
        setAnalytics(json.analytics || []);
        setTotal(json.total_violation_types || 0);
      })
      .catch((err) => console.error("Failed to load analytics:", err));
  }, []);

  return (
    <div className="container">
      <h2>Report Analytics by Violation Type</h2>

      {analytics.length === 0 ? (
        <p>Loading or no data available.</p>
      ) : (
        <>
          <p><strong>Total Violation Types:</strong> {total}</p>
          <table>
            <thead>
              <tr>
                <th>Violation Type</th>
                <th>Report Count</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((item) => (
                <tr key={item.violation_type}>
                  <td>{item.violation_type}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Analytics;
