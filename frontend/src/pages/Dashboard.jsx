// Dashboard.jsx
import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    {
      title: "Case Management",
      items: [
        { name: 'Add Case', path: 'add-case' },
        { name: 'Get Case', path: 'get-case' },
        { name: 'Update Status', path: 'update-status' },
        { name: 'Delete Case', path: 'delete-case' },
        { name: 'Archived Cases', path: 'archive-case' }
      ]
    },
    {
      title: "Incident Reports",
      items: [
        { name: 'Submit Report', path: 'submit' },
        { name: 'View Reports', path: 'reports' },
        { name: 'Update Report Status', path: 'update' },
        { name: 'View Analytics', path: 'analytics' }
      ]
    },
    {
      title: "Victim",
      items: [
        { name: 'Show', path: 'victim-dashboard' },
        { name: 'Add New Victim', path: 'add-victim' },
        { name: 'Update Risk', path: 'update-risk' },
        { name: 'Search by Case', path: 'search-by-case' },
        { name: 'Search by ID', path: 'search-by-id' }
      ]
    },{
      title: "Analysis",
      items: [
        { name: 'Show Analytics', path: 'allanalytics' }]
    }
  ];

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        {sections.map((section, index) => (
          <div key={index}>
            <h4 className="sidebar-section-title">{section.title}</h4>
            {section.items.map((item, subIndex) => (
              <button
                key={subIndex}
                className={`sidebar-button ${
                  location.pathname.includes(item.path) ? 'active' : ''
                }`}
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
            <h1>Welcome to the Human Rights Monitor Platform</h1>
            <p>
              This system enables organizations and researchers to securely document, analyze,
              and manage human rights violation cases and reports.
            </p>
            <ul>
              <li>📂 <strong>Case Management</strong>: Track investigations, update statuses, and archive resolved cases.</li>
              <li>📑 <strong>Incident Reports</strong>: Submit and view field reports, attach media, and run analytics.</li>
              <li>👥 <strong>Victim/Witnesses</strong>: Add and manage sensitive personal records with risk assessments.</li>
            </ul>
            <p style={{ marginTop: '20px' }}>
              Select a module from the left menu to get started.
            </p>
          </section>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Dashboard;