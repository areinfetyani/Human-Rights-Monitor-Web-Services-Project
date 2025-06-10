import React, { useState } from "react";
import './ReportStyle.css';
function UpdateReport() {
  const [reportId, setReportId] = useState("");
  const [newStatus, setNewStatus] = useState("new");
  const [feedback, setFeedback] = useState("");

  const handleUpdate = async () => {
  if (!reportId) {
    alert("Please enter a Report ID.");
    return;
  }

  const formData = new FormData();
  formData.append("new_status", newStatus);

  try {
    const res = await fetch(`http://localhost:8000/reports/${reportId}`, {
      method: "PATCH",
      body: formData, // ✅ FormData instead of JSON
    });

    if (res.ok) {
      setFeedback("✅ Status updated successfully.");
    } else {
      const err = await res.text();
      setFeedback(`❌ Failed to update status: ${err}`);
    }
  } catch (error) {
    setFeedback("❌ Error updating report.");
  }
};

  return (
    <div className="container">
      <h2>Update Report Status</h2>

      <label>
        Report ID:
        <input
          type="text"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
        />
      </label>

      <label>
        New Status:
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="new">New</option>
          <option value="under_investigation">Under Investigation</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>

      <button onClick={handleUpdate}>Update Status</button>

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}

export default UpdateReport;
