import React, { useEffect, useState } from "react";
import './ReportStyle.css';
function ViewReports() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    country: "",
    city: "",
    from_date: "",
    to_date: ""
  });

  useEffect(() => {
    fetch("http://localhost:8000/reports/")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to load reports:", err));
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    fetch(`http://localhost:8000/reports/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to filter reports:", err));
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2>View & Filter Incident Reports</h2>

      <div className="filter-row">
        <div>
          <label>Status:</label>
          <select name="status" onChange={handleChange}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label>Country:</label>
          <input name="country" onChange={handleChange} />
        </div>
        <div>
          <label>City:</label>
          <input name="city" onChange={handleChange} />
        </div>
        <div>
          <label>From Date:</label>
          <input type="date" name="from_date" onChange={handleChange} />
        </div>
        <div>
          <label>To Date:</label>
          <input type="date" name="to_date" onChange={handleChange} />
        </div>
        <div style={{ alignSelf: "flex-end" }}>
          <button onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter</th>
            <th>Location</th>
            <th>Description</th>
            <th>Status</th>
            <th>Violations</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((report) => (
              <tr key={report.report_id}>
                <td>{report.report_id}</td>
                <td>
                  {report.reporter_type}
                  {report.anonymous ? " (anonymous)" : ""}
                </td>
                <td>
                  {report.incident_details?.location?.city || "-"},{" "}
                  {report.incident_details?.location?.country || "-"}
                </td>
                <td>{report.description || "-"}</td>
                <td>{report.status || "-"}</td>
                <td>
                  {Array.isArray(report.violation_types)
                    ? report.violation_types.join(", ")
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewReports;
