import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GetCase.css";

const GetCase = () => {
  const { case_id } = useParams();
  const navigate = useNavigate();

  const [searchMode, setSearchMode] = useState(case_id ? "id" : "filter");
  const [caseId, setCaseId] = useState(case_id || "");
  const [filters, setFilters] = useState({});
  const [caseData, setCaseData] = useState(null);
  const [filteredCases, setFilteredCases] = useState([]);
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  const statusOptions = ["new", "in_progress", "closed"];
  const priorityOptions = ["low", "moderate", "high"];

  const fetchCaseById = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/cases/${id}`);
      setCaseData(res.data);
      setFilteredCases([]);
      setError("");
    } catch {
      setCaseData(null);
      setError("❌ No case found with this ID.");
    }
  };

  const fetchCasesByFilter = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/cases/filter`,
        filters
      );
      setCaseData(null);
      setError("");
      setFilteredCases(res.data);
      if (res.data.length === 0) {
        setError("❌ No cases match the filters.");
      }
    } catch {
      setFilteredCases([]);
      setError("❌ Filter failed. Try again.");
    }
  };

  useEffect(() => {
    if (case_id) fetchCaseById(case_id);
  }, [case_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError("");
    setError("");
    setCaseData(null);
    setFilteredCases([]);

    if (searchMode === "id") {
      if (!caseId.trim()) {
        setInputError("⚠️ Please enter the case ID.");
        return;
      }
      navigate(`/get-case/${caseId}`);
    } else {
      fetchCasesByFilter();
    }
  };

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCaseData(null);
    setFilteredCases([]);
  };

  const parseList = (val) =>
    val
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleSearchModeChange = (e) => {
    setSearchMode(e.target.value);
    setCaseData(null);
    setCaseId("");
    setFilters({});
    setError("");
    setInputError("");
    setFilteredCases([]);
  };

  const renderCaseCard = (c) => (
    <div
      key={c.case_id}
      className="case-card"
      style={{
        width: "200px",
        background: "rgb(55, 200, 171)",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h3>Case</h3>
      <p>
        <strong>ID:</strong> {c.case_id}
      </p>
      <p>
        <strong>Status:</strong> {c.status}
      </p>
      <p>
        <strong>Anonymous:</strong> {c.anonymous ? "Yes" : "No"}
      </p>
      <button
        className="submit-btn"
        style={{ background: "white", color: "#512da8" }}
        onClick={() => setSelectedCase(c)}
      >
        👁️ View
      </button>
    </div>
  );

  return (
    <div className="form-container">
      <form className="case-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Search Case</h2>

        <div className="form-group full">
          <label>Search Mode</label>
          <select value={searchMode} onChange={handleSearchModeChange}>
            <option value="id">By Case ID</option>
            <option value="filter">By Filter</option>
          </select>
        </div>

        {searchMode === "id" ? (
          <div className="form-group full">
            <label>Case ID</label>
            <input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Enter case ID"
            />
          </div>
        ) : (
          <div className="form-grid">
            <div className="form-group">
              <label>Status</label>
              <select onChange={(e) => handleChange("status", e.target.value)}>
                <option value="">--</option>
                {statusOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="">--</option>
                {priorityOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Region</label>
              <input onChange={(e) => handleChange("region", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Violation Types</label>
              <input
                onChange={(e) =>
                  handleChange("violation_types", parseList(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label>Victims</label>
              <input
                onChange={(e) =>
                  handleChange("victims", parseList(e.target.value))
                }
              />
            </div>
            <div className="form-group">
              <label>Created By</label>
              <input
                onChange={(e) => handleChange("created_by", e.target.value)}
              />
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          Search
        </button>
        {inputError && <p className="error-text">{inputError}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>

      {/* ✅ NEW: AUTO SHOW caseData in modal (centered popup) */}
      {caseData && !selectedCase && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setCaseData(null)}>
              ×
            </button>
            <h3>Case Details</h3>
            {Object.entries(caseData).map(([key, val]) => (
              <p key={key}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(val)
                  ? key === "evidence"
                    ? val.map((ev, idx) => (
                        <div key={idx} style={{ marginLeft: "10px" }}>
                          <strong>{ev.type}:</strong> {ev.description} —{" "}
                          <a href={ev.url} target="_blank" rel="noreferrer">
                            📎 View
                          </a>
                        </div>
                      ))
                    : val.join(", ")
                  : typeof val === "object"
                  ? JSON.stringify(val)
                  : val}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Existing: filtered case cards + view modal */}
      {filteredCases.length > 0 && (
        <div
          className="case-form"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "start",
            width: "100%",
          }}
        >
          <h3 className="form-title" style={{ width: "100%" }}>
            Matching Cases
          </h3>
          {filteredCases.map(renderCaseCard)}
        </div>
      )}

      {selectedCase && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setSelectedCase(null)}
            >
              ×
            </button>
            <h3>Case Details</h3>
            {Object.entries(selectedCase).map(([key, val]) => (
              <p key={key}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(val)
                  ? key === "evidence"
                    ? val.map((ev, idx) => (
                        <div key={idx} style={{ marginLeft: "10px" }}>
                          <strong>{ev.type}:</strong> {ev.description} —{" "}
                          <a href={ev.url} target="_blank" rel="noreferrer">
                            📎 View
                          </a>
                        </div>
                      ))
                    : val.join(", ")
                  : typeof val === "object"
                  ? JSON.stringify(val)
                  : val}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetCase;
