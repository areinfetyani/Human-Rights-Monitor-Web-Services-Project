// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddCase from "./pages/CaseManagement/AddCase";
import GetCase from "./pages/CaseManagement/GetCase";
import UpdateStatus from "./pages/CaseManagement/UpdateStatus";
import DeleteCase from "./pages/CaseManagement/DeleteCase";
import ArchiveCase from "./pages/CaseManagement/ArchiveCase";
import History from "./pages/CaseManagement/History";
import VictimList from "./pages/Victim/Victim";
import SubmitReport from "./pages/Report/SubmitReport";
import UpdateReport from "./pages/Report/UpdateReport";
import ViewReports from "./pages/Report/ViewReports";
import Analytics from "./pages/Report/Analytics";
import AnalysisPage from "./pages/Analysis/AnalysisPage";
import VictimDashboard from "./pages/Victim/VictimDashboard/VictimDashboard";
import AddVictim from "./pages/Victim/AddVictim/AddVictim";
import UpdateRisk from "./pages/Victim/UpdateRisk/UpdateRisk";
import VictimSearch from "./pages/Victim/VictimSearch/VictimSearch";
import AssignVictimToCase from "./pages/Victim/AssignVictimToCase/AssignVictimToCase";
import Login from "./pages/Login";
import AuthGuard from "./pages/AuthGuard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes under Dashboard */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        >
          <Route path="add-case" element={<AddCase />} />
          <Route path="get-case" element={<GetCase />} />
          <Route path="get-case/:case_id" element={<GetCase />} />
          <Route path="update-status" element={<UpdateStatus />} />
          <Route path="delete-case" element={<DeleteCase />} />
          <Route path="delete-case/:case_id" element={<DeleteCase />} />
          <Route path="archive-case" element={<ArchiveCase />} />
          <Route path="submit" element={<SubmitReport />} />
          <Route path="reports" element={<ViewReports />} />
          <Route path="update" element={<UpdateReport />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="status-history" element={<History />} />
          <Route path="allanalytics" element={<AnalysisPage />} />
          <Route path="victim-dashboard" element={<VictimDashboard />} />
          <Route path="add-victim" element={<AddVictim />} />
          <Route path="update-risk" element={<UpdateRisk />} />
          <Route path="search-by-case" element={<VictimSearch />} />
          <Route
            path="assign-victim-to-case"
            element={<AssignVictimToCase />}
          />
        </Route>

        {/* Protected Victim List (outside of Dashboard layout) */}
        <Route
          path="/victims"
          element={
            <AuthGuard>
              <VictimList />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
