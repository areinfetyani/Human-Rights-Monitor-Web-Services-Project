import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  const [stats, setStats] = useState({
    total_cases: 0,
    reports_submitted: 0,
    active_victims: 0,
    archived_cases: 0
  });

  // 🔐 Redirect if no role
  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  // 📊 Load dashboard stats
  useEffect(() => {
    axios.get("http://localhost:8000/dashboard/dashboard-stats")
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("❌ Dashboard stats error:", err);
        alert("Failed to load dashboard statistics.");
      });
  }, []);

  // 📁 Sections based on role
  const sections = [];

  if (role === "admin") {
    sections.push(
      {
        title: "📂 Case Management",
        items: [
          { name: 'Add Case', path: 'add-case' },
          { name: 'Get Case', path: 'get-case' },
          { name: 'Update Status', path: 'update-status' },
          { name: 'Delete Case', path: 'delete-case' },
          { name: 'Archived Cases', path: 'archive-case' },
          { name: 'Case Status History', path: 'status-history' }
        ]
      },
      {
        title: "📑 Incident Reports",
        items: [
          { name: 'Submit Report', path: 'submit' },
          { name: 'View Reports', path: 'reports' },
          { name: 'Update Report Status', path: 'update' },
          { name: 'View Analytics', path: 'analytics' }
        ]
      },
      {
        title: "👥 Victim/Witnesses",
        items: [
          { name: 'Show', path: 'victim-dashboard' },
          { name: 'Add New Victim', path: 'add-victim' },
          { name: 'Update Risk', path: 'update-risk' },
          { name: 'Search by Case', path: 'search-by-case' },
          { name: 'Assign to Case', path: 'assign-victim-to-case' }
        ]
      },
      {
        title: "📊 Analysis",
        items: [
          { name: 'Show Analytics', path: 'allanalytics' }
        ]
      }
    );
  }

  if (role === "employee") {
    sections.push(
      {
        title: "📂 Case Management",
        items: [
          { name: 'Add Case', path: 'add-case' },
          { name: 'Get Case', path: 'get-case' },
          { name: 'Update Status', path: 'update-status' },
          { name: 'Delete Case', path: 'delete-case' },
          { name: 'Archived Cases', path: 'archive-case' },
          { name: 'Case Status History', path: 'status-history' }
        ]
      },
      {
        title: "👥 Victim/Witnesses",
        items: [
          { name: 'Show', path: 'victim-dashboard' },
          { name: 'Add New Victim', path: 'add-victim' },
          { name: 'Update Risk', path: 'update-risk' },
          { name: 'Search by Case', path: 'search-by-case' },
          { name: 'Assign to Case', path: 'assign-victim-to-case' }
        ]
      }
    );
  }

  if (role === "anonymous_reporter") {
    sections.push({
      title: "📑 Incident Reports",
      items: [
          { name: 'Submit Report', path: 'submit' },
          { name: 'View Reports', path: 'reports' },
          { name: 'Update Report Status', path: 'update' },
          { name: 'View Analytics', path: 'analytics' }
      ]
    });
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">📊 Dashboard</h2>
        {sections.map((section, index) => (
          <div key={index}>
            <h4 className="sidebar-section-title">{section.title}</h4>
            {section.items.map((item, subIndex) => (
              <button
                key={subIndex}
                className={`sidebar-button ${location.pathname.includes(item.path) ? 'active' : ''}`}
                onClick={() => navigate(`/${item.path}`)}
              >
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {location.pathname === '/' ? (
          <section className="intro-section">
            <h1 style={{ fontSize: "28px", color: "#1e40af" }}>
              Welcome to the Human Rights Monitor Platform
            </h1>
            <p style={{ fontSize: "16px", color: "#334155", marginBottom: "20px" }}>
              This platform empowers organizations and researchers to document, analyze, and monitor human rights violations with precision. Below is an overview of the system’s main components:
            </p>

            <div className="dashboard-highlights">
              <div className="highlight-box">
                <span>📂</span>
                <div>
                  <strong>Case Management</strong>
                  <p>Create and manage case records, monitor investigation progress, update case statuses, and archive completed cases.</p>
                </div>
              </div>
              <div className="highlight-box">
                <span>📑</span>
                <div>
                  <strong>Incident Reports</strong>
                  <p>Log field-level reports including date, description, media evidence, and sources. Supports data aggregation and analysis.</p>
                </div>
              </div>
              <div className="highlight-box">
                <span>👥</span>
                <div>
                  <strong>Victim/Witness Records</strong>
                  <p>Securely store personal information of victims and witnesses with customizable risk assessments and tracking.</p>
                </div>
              </div>
            </div>

            <div className="dashboard-cards">
              <div className="card">📁 <h3>{stats.total_cases}</h3><p>Total Cases</p></div>
              <div className="card">📑 <h3>{stats.reports_submitted}</h3><p>Reports Submitted</p></div>
              <div className="card">👥 <h3>{stats.active_victims}</h3><p>Active Victims</p></div>
              <div className="card">🗃️ <h3>{stats.archived_cases}</h3><p>Archived Cases</p></div>
            </div>
          </section>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
