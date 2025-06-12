// Updated AddCase.jsx with required field validation (with red asterisk)
// No core logic changed; only improved validation and field highlighting

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCase.css";

const AddCase = () => {
  const [form, setForm] = useState({
    case_id: "",
    title: "",
    description: "",
    violation_types: "",
    created_by: "",
    status: "new",
    priority: "moderate",
    perpetratorName: "",
    perpetratorType: "",
    perpetrators: [],
    victims: [],
    selectedVictimId: "",
    evidenceDescription: "",
    evidenceFile: null,
    evidenceType: "",
    country: "",
    region: "",
    latitude: "",
    longitude: "",
    date_occurred: "",
    date_reported: "",
  });

  const [countries, setCountries] = useState([]);
  const [victims, setVictims] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://restcountries.com/v2/all?fields=name,region,latlng")
      .then((res) => {
        const filtered = res.data
          .filter((c) => c.name && c.latlng?.length === 2)
          .map((c) => ({
            name: c.name,
            region: c.region,
            lat: c.latlng[0],
            lng: c.latlng[1],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(filtered);
      });

    axios
      .get("http://localhost:8000/victims/get_victims")
      .then((res) => setVictims(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCountryChange = (e) => {
    const selected = countries.find((c) => c.name === e.target.value);
    if (selected) {
      setForm({
        ...form,
        country: selected.name,
        region: selected.region,
        latitude: selected.lat,
        longitude: selected.lng,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    let type = "unknown";
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png"].includes(ext)) type = "photo";
      else if (ext === "pdf") type = "pdf";
      else if (["doc", "docx"].includes(ext)) type = "word";
      else if (["mp4", "mov", "avi"].includes(ext)) type = "video";
    }
    setForm({ ...form, evidenceFile: file, evidenceType: type });
  };

  const addPerpetrator = () => {
    if (!form.perpetratorName || !form.perpetratorType) {
      setErrors((prev) => ({
        ...prev,
        perpetratorName: "Required",
        perpetratorType: "Required",
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      perpetrators: [
        ...prev.perpetrators,
        { name: prev.perpetratorName, type: prev.perpetratorType },
      ],
      perpetratorName: "",
      perpetratorType: "",
    }));
  };

  const addVictim = () => {
    const id = form.selectedVictimId;
    if (id && !form.victims.includes(id)) {
      setForm((prev) => ({
        ...prev,
        victims: [...prev.victims, id],
        selectedVictimId: "",
      }));
    }
  };

  const validate = () => {
    const required = [
      "case_id",
      "title",
      "description",
      "violation_types",
      "created_by",
      "country",
      "date_occurred",
      "date_reported",
      "evidenceDescription",
    ];
    const errs = {};
    required.forEach((field) => {
      if (!form[field]) errs[field] = "Required";
    });
    if (!form.latitude || !form.longitude) errs.country = "Select a valid country";
    if (form.perpetrators.length === 0) {
      errs.perpetrators = "At least one perpetrator is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const base64 = await toBase64(form.evidenceFile);
    const payload = {
      case_id: form.case_id,
      title: form.title,
      description: form.description,
      violation_types: form.violation_types.split(",").map((v) => v.trim()),
      status: form.status,
      priority: form.priority,
      location: {
        country: form.country,
        region: form.region,
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(form.latitude), parseFloat(form.longitude)],
        },
      },
      victims: form.victims,
      perpetrators: form.perpetrators,
      evidence: [
        {
          type: form.evidenceType,
          url: base64,
          description: form.evidenceDescription,
          date_captured: new Date().toISOString(),
        },
      ],
      created_by: form.created_by,
      date_occurred: new Date(form.date_occurred).toISOString(),
      date_reported: new Date(form.date_reported).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await axios.get(`http://localhost:8000/cases/${form.case_id}`);
      setErrors((prev) => ({
        ...prev,
        case_id: "Case ID already exists",
      }));
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          await axios.post("http://localhost:8000/cases/", payload);
          alert("✅ Case submitted!");
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert("❌ Submission failed.");
        }
      } else {
        alert("❌ Server error while checking ID.");
      }
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve) => {
      if (!file) return resolve("");
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  // Full return section with validation and red asterisks (AddCase.jsx)
return (
  <div className="form-container">
    <form className="case-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Add New Case</h2>
      <div className="form-grid">
        {["case_id", "title", "created_by"].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>
              {field.replace("_", " ").toUpperCase()}<span style={{ color: "red" }}> *</span>
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
            />
            {errors[field] && <div className="error-text">{errors[field]}</div>}
          </div>
        ))}

        <div className="form-group">
          <label>
            Violation Types (comma-separated)<span style={{ color: "red" }}> *</span>
          </label>
          <input
            name="violation_types"
            value={form.violation_types}
            onChange={handleChange}
          />
          {errors.violation_types && <div className="error-text">{errors.violation_types}</div>}
        </div>

        <div className="form-group full">
          <label>
            Description<span style={{ color: "red" }}> *</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="new">New</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Country<span style={{ color: "red" }}> *</span>
          </label>
          <select onChange={handleCountryChange} value={form.country}>
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.country && <div className="error-text">{errors.country}</div>}
        </div>

        <div className="form-group">
          <label>Region</label>
          <input value={form.region} disabled />
        </div>

        <div className="form-group">
          <label>Latitude</label>
          <input value={form.latitude} disabled />
        </div>

        <div className="form-group">
          <label>Longitude</label>
          <input value={form.longitude} disabled />
        </div>

        <div className="form-group">
          <label>
            Date Occurred<span style={{ color: "red" }}> *</span>
          </label>
          <input type="date" name="date_occurred" onChange={handleChange} value={form.date_occurred} />
          {errors.date_occurred && <div className="error-text">{errors.date_occurred}</div>}
        </div>

        <div className="form-group">
          <label>
            Date Reported<span style={{ color: "red" }}> *</span>
          </label>
          <input type="date" name="date_reported" onChange={handleChange} value={form.date_reported} />
          {errors.date_reported && <div className="error-text">{errors.date_reported}</div>}
        </div>

        <div className="form-group full">
          <label>
            Evidence Description<span style={{ color: "red" }}> *</span>
          </label>
          <textarea
            name="evidenceDescription"
            value={form.evidenceDescription}
            onChange={handleChange}
            rows="2"
          />
          {errors.evidenceDescription && <div className="error-text">{errors.evidenceDescription}</div>}
        </div>

        <div className="form-group">
          <label>Upload Evidence</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Detected Evidence Type</label>
          <input value={form.evidenceType} disabled />
        </div>

        <div className="form-group">
          <label>
            Perpetrator Name<span style={{ color: "red" }}> *</span>
          </label>
          <input name="perpetratorName" value={form.perpetratorName} onChange={handleChange} />
          {errors.perpetratorName && <div className="error-text">{errors.perpetratorName}</div>}
        </div>

        <div className="form-group">
          <label>
            Perpetrator Type<span style={{ color: "red" }}> *</span>
          </label>
          <input name="perpetratorType" value={form.perpetratorType} onChange={handleChange} />
          {errors.perpetratorType && <div className="error-text">{errors.perpetratorType}</div>}
        </div>

        <div className="form-group">
          <button type="button" className="submit-btn" onClick={addPerpetrator}>➕ Add Perpetrator</button>
        </div>

        {errors.perpetrators && <div className="form-group full"><div className="error-text">{errors.perpetrators}</div></div>}

        {form.perpetrators.length > 0 && (
          <div className="form-group full">
            <div className="table-container">
              <table className="case-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.perpetrators.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.name}</td>
                      <td>{p.type}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              perpetrators: prev.perpetrators.filter((_, index) => index !== idx),
                            }))
                          }
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="form-group full">
          <label>Select Victim (Optional)</label>
          <select
            value={form.selectedVictimId}
            onChange={(e) => setForm({ ...form, selectedVictimId: e.target.value })}
          >
            <option value="">-- Choose a victim --</option>
            {victims
              .filter((v) => !form.victims.includes(v.id))
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.anonymous
                    ? "Anonymous"
                    : `${v.demographics?.gender || "N/A"} - Age ${v.demographics?.age || "N/A"}`}
                </option>
              ))}
          </select>
          <button type="button" className="submit-btn" onClick={addVictim}>➕ Add Victim</button>
        </div>

        {form.victims.length > 0 && (
          <div className="form-group full">
            <div className="table-container">
              <table className="case-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.victims.map((vid) => {
                    const victim = victims.find((v) => v.id === vid);
                    return (
                      <tr key={vid}>
                        <td>{victim?.anonymous ? "Anonymous" : "Victim"}</td>
                        <td>{victim?.demographics?.gender || "N/A"}</td>
                        <td>{victim?.demographics?.age || "N/A"}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                victims: prev.victims.filter((v) => v !== vid),
                              }))
                            }
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <button type="submit" className="submit-btn">Submit Case</button>
    </form>
  </div>
);
};
export default AddCase;
