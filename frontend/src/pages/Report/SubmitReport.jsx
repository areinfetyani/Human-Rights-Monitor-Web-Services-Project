import React, { useState } from "react";
import './ReportStyle.css';

function SubmitReport() {
  const [form, setForm] = useState({
    reporter_type: "victim",
    anonymous: false,
    contact_info: {
      email: "",
      phone: "",
      preferred_contact: "email",
    },
    incident_details: {
      date: "",
      location: {
        country: "",
        city: "",
        coordinates: {
          type: "Point",
          coordinates: ["", ""],
        },
      },
      description: "",
      violation_types: [],
    },
    evidence: [],
  });

  const [file, setFile] = useState(null);
  const [evidenceDesc, setEvidenceDesc] = useState("");

  const getCoordinatesFromNominatim = async (city, country) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(parseFloat(data[0].lat).toFixed(4)),
          lng: parseFloat(parseFloat(data[0].lon).toFixed(4)),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const autofillCoordinates = async () => {
    const { city, country } = form.incident_details.location;
    const coords = await getCoordinatesFromNominatim(city, country);
    if (coords) {
      const updatedCoords = [coords.lng.toString(), coords.lat.toString()];
      setForm({
        ...form,
        incident_details: {
          ...form.incident_details,
          location: {
            ...form.incident_details.location,
            coordinates: {
              type: "Point",
              coordinates: updatedCoords,
            },
          },
        },
      });
    } else {
      alert("⚠️ Could not find coordinates for the given location.");
    }
  };

  const handleChange = (e, section, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (field === "anonymous" && section === "root") {
      const newAnon = value;
      setForm({
        ...form,
        anonymous: newAnon,
        contact_info: newAnon
          ? { email: "", phone: "", preferred_contact: "email" }
          : form.contact_info,
      });
      return;
    }

    if (section === "root") {
      setForm({ ...form, [field]: value });
    } else {
      setForm({
        ...form,
        [section]: {
          ...form[section],
          [field]: value,
        },
      });
    }
  };

  const handleIncidentChange = (e, field) => {
    setForm({
      ...form,
      incident_details: {
        ...form.incident_details,
        [field]: e.target.value,
      },
    });
  };

  const handleLocationChange = (e, field) => {
    setForm({
      ...form,
      incident_details: {
        ...form.incident_details,
        location: {
          ...form.incident_details.location,
          [field]: e.target.value,
        },
      },
    });
  };

  const handleCoordinatesChange = (e, index) => {
    const coords = [...form.incident_details.location.coordinates.coordinates];
    coords[index] = e.target.value;
    setForm({
      ...form,
      incident_details: {
        ...form.incident_details,
        location: {
          ...form.incident_details.location,
          coordinates: {
            ...form.incident_details.location.coordinates,
            coordinates: coords,
          },
        },
      },
    });
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFile({
        type: uploadedFile.type.startsWith("image") ? "image" : "video",
        url: reader.result,
        description: evidenceDesc || uploadedFile.name,
      });
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const reportId = `REP-${Date.now()}`;

    formData.append("report_id", reportId);
    formData.append("reporter_type", form.reporter_type);
    formData.append("anonymous", form.anonymous.toString());

    formData.append("contact_email", form.contact_info.email);
    formData.append("contact_phone", form.contact_info.phone);
    formData.append("preferred_contact", form.contact_info.preferred_contact);
    formData.append("assigned_to", form.assigned_to);
    formData.append("incident_date", form.incident_details.date);
    formData.append("location_country", form.incident_details.location.country);
    formData.append("location_city", form.incident_details.location.city);
    formData.append(
      "location_lat",
      parseFloat(form.incident_details.location.coordinates.coordinates[1])
    );
    formData.append(
      "location_lng",
      parseFloat(form.incident_details.location.coordinates.coordinates[0])
    );
    formData.append("description", form.incident_details.description);

    form.incident_details.violation_types.forEach((type) => {
      formData.append("violation_types", type);
    });

    if (file) {
      const blob = await fetch(file.url).then((res) => res.blob());
      const fileObj = new File([blob], file.description, { type: blob.type });
      formData.append("files", fileObj);
    }

    const response = await fetch("http://localhost:8000/reports/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("✅ Report submitted successfully!");
      window.location.reload();
    } else {
      const err = await response.json();
      console.error("❌ Submission error:", err);
      alert("❌ Error submitting report.");
    }
  };

  return (
    <div className="container">
      <h2>Submit Incident Report</h2>

      <h3>Reporter Info</h3>
      <label>
        Reporter Type:
        <select
          value={form.reporter_type}
          onChange={(e) => handleChange(e, "root", "reporter_type")}
        >
          <option>victim</option>
          <option>witness</option>
          <option>journalist</option>
          <option>ngo</option>
        </select>
      </label>

      <label>
        Anonymous:
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(e) => handleChange(e, "root", "anonymous")}
        />
      </label>

      {!form.anonymous && (
        <>
          <label>
            Email:
            <input
              type="email"
              value={form.contact_info.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, email: e.target.value },
                })
              }
            />
          </label>

          <label>
            Phone:
            <input
              type="text"
              value={form.contact_info.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: { ...form.contact_info, phone: e.target.value },
                })
              }
            />
          </label>

          <label>
            Preferred Contact:
            <select
              value={form.contact_info.preferred_contact}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_info: {
                    ...form.contact_info,
                    preferred_contact: e.target.value,
                  },
                })
              }
            >
              <option>email</option>
              <option>phone</option>
            </select>
          </label>
        </>
      )}

      <label>
        Assigned To:
        <input
          type="text"
          value={form.assigned_to}
          onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
        />
      </label>

      <h3>Incident Details</h3>

      <label>
        Date:
        <input type="date" onChange={(e) => handleIncidentChange(e, "date")} />
      </label>

      <label>
        Country:
        <input
          type="text"
          value={form.incident_details.location.country}
          onChange={(e) => handleLocationChange(e, "country")}
        />
      </label>

      <label>
        City:
        <input
          type="text"
          value={form.incident_details.location.city}
          onChange={(e) => handleLocationChange(e, "city")}
        />
      </label>

      <div className="autofill-button">
        <button type="button" onClick={autofillCoordinates}>
          Autofill Coordinates
        </button>
      </div>

      <label>
        Longitude:
        <input
          type="text"
          value={form.incident_details.location.coordinates.coordinates[0]}
          readOnly
        />
      </label>

      <label>
        Latitude:
        <input
          type="text"
          value={form.incident_details.location.coordinates.coordinates[1]}
          readOnly
        />
      </label>

      <label>
        Description:
        <textarea onChange={(e) => handleIncidentChange(e, "description")} />
      </label>

      <label>
        Violation Types (comma-separated):
        <input
          type="text"
          value={form.incident_details.violation_types.join(",")}
          onChange={(e) =>
            setForm({
              ...form,
              incident_details: {
                ...form.incident_details,
                violation_types: e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter((v) => v !== ""),
              },
            })
          }
        />
      </label>

      <h3>Evidence</h3>

      <label>
        Description:
        <input
          type="text"
          value={evidenceDesc}
          onChange={(e) => setEvidenceDesc(e.target.value)}
        />
      </label>

      <label>
        File:
        <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />
      </label>

      <button onClick={handleSubmit}>Submit Report</button>
    </div>
  );
}

export default SubmitReport;
