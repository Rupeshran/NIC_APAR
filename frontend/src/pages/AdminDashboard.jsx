import { useState, useEffect, useCallback } from "react";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";
import AddEmployeeModal from "../components/AddEmployeeModal";
import ReminderPanel from "../components/ReminderPanel";
import APARReviewPanel from "../components/APARReviewPanel";
import "../styles/Dashboard.css";

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "employees", label: "Employee Management", icon: "👥" },
  { id: "reminders", label: "Send Reminders", icon: "🔔" },
  { id: "review", label: "APAR Review", icon: "📋" },
  { id: "forwarding", label: "Forwarding", icon: "📤" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Employee management states
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Forwarding states
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);

  // Real-time review count from /acr/submitted
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch the actual review submissions count
  const fetchReviewCount = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8083/acr/submitted");
      if (response.ok) {
        const data = await response.json();
        setReviewCount(data.length);
      } else {
        setReviewCount(0);
      }
    } catch (err) {
      console.error("Fetch review count error:", err);
      setReviewCount(0);
    }
  }, []);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8083/employees");

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchReviewCount();
  }, [fetchEmployees, fetchReviewCount]);

  // Search filter
  const filtered = employees.filter((emp) => {
    const name = (emp.employeeName || "").toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      String(emp.employeeId).includes(search)
    );
  });

  // Stats
  const totalCount = employees.length;
  const submittedCount = employees.filter((e) => e.acrSubmitted).length;
  const pendingCount = totalCount - submittedCount;

  // Forwarding — pending IDs
  const pendingIds = filtered
    .filter((emp) => !emp.acrSubmitted)
    .map((emp) => emp.employeeId);

  const allChecked =
    pendingIds.length > 0 && pendingIds.every((id) => selected.includes(id));

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected([...new Set([...selected, ...pendingIds])]);
    } else {
      setSelected(selected.filter((id) => !pendingIds.includes(id)));
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Send to RO
  const handleSend = async () => {
    if (selected.length === 0) return;

    try {
      setSending(true);
      const response = await fetch("http://localhost:8083/acr-status/sendToRO", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeIds: selected }),
      });

      const message = await response.text();
      alert(message);
      setSelected([]);
      await fetchEmployees();
    } catch (err) {
      console.error("Send error:", err);
      alert("Unable to send employees. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Delete employee
  const handleDelete = async (empId) => {
    try {
      const response = await fetch(`http://localhost:8083/employees/${empId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteConfirm(null);
        await fetchEmployees();
      } else {
        alert("Failed to delete employee.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete employee.");
    }
  };

  // ─── Render Tab Content ───
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "employees":
        return renderEmployeeManagement();
      case "reminders":
        return <ReminderPanel employees={employees} onRefresh={fetchEmployees} />;
      case "review":
        return <APARReviewPanel onReviewCountChange={fetchReviewCount} />;
      case "forwarding":
        return renderForwarding();
      default:
        return renderOverview();
    }
  };

  // ─── Overview ───
  const renderOverview = () => (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Dashboard Overview</h2>
          <p className="section-subtitle">
            Quick overview of APAR status across your organization
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchEmployees} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary" style={{ cursor: "pointer" }} onClick={() => setActiveTab("employees")}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total Employees</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{submittedCount}</span>
            <span className="stat-label">APAR Submitted</span>
          </div>
        </div>
        <div className="stat-card warning" style={{ cursor: "pointer" }} onClick={() => setActiveTab("reminders")}>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card danger" style={{ cursor: "pointer" }} onClick={() => setActiveTab("review")}>
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">{reviewCount}</span>
            <span className="stat-label">To Review</span>
          </div>
        </div>
      </div>

      {/* Quick Employee Summary */}
      {error && (
        <div className="alert-banner error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <h3 className="table-title">Recent Employees</h3>
          <button className="btn btn-outline" onClick={() => setActiveTab("employees")} style={{ fontSize: "13px", padding: "6px 14px" }}>
            View All →
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading employee data...</span>
          </div>
        ) : employees.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Organization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp) => (
                <tr key={emp.employeeId}>
                  <td style={{ fontWeight: 600, color: "var(--primary-700)" }}>
                    {emp.employeeId}
                  </td>
                  <td>{emp.employeeName}</td>
                  <td>{emp.organizationId}</td>
                  <td>
                    <span className={`badge ${emp.acrSubmitted ? "submitted" : "pending"}`}>
                      <span className="badge-dot"></span>
                      {emp.acrSubmitted ? "Submitted" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No employee records found.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Employee Management ───
  const renderEmployeeManagement = () => (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Employee Management</h2>
          <p className="section-subtitle">
            Add, view, and manage employee records
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} id="add-employee-btn">
          ➕ Add Employee
        </button>
      </div>

      {error && (
        <div className="alert-banner error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <h3 className="table-title">
            All Employees ({filtered.length})
          </h3>
          <div className="table-search">
            <input
              type="text"
              placeholder="🔍 Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="emp-search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading employees...</span>
          </div>
        ) : filtered.length > 0 ? (
          <table className="data-table" id="employee-mgmt-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Organization</th>
                <th>APAR Status</th>
                <th style={{ width: "80px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.employeeId}>
                  <td style={{ fontWeight: 600, color: "var(--primary-700)" }}>
                    {emp.employeeId}
                  </td>
                  <td>{emp.employeeName}</td>
                  <td>{emp.organizationId}</td>
                  <td>
                    <span className={`badge ${emp.acrSubmitted ? "submitted" : "pending"}`}>
                      <span className="badge-dot"></span>
                      {emp.acrSubmitted ? "Submitted" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {deleteConfirm === emp.employeeId ? (
                        <>
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: "12px", padding: "4px 10px" }}
                            onClick={() => handleDelete(emp.employeeId)}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ fontSize: "12px", padding: "4px 10px" }}
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-icon delete"
                          title="Delete Employee"
                          onClick={() => setDeleteConfirm(emp.employeeId)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">
              {search ? "No employees match your search." : "No employee records found."}
            </p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );

  // ─── Forwarding ───
  const renderForwarding = () => (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">APAR Forwarding</h2>
          <p className="section-subtitle">
            Forward employee APARs to the Reporting Officer
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchEmployees} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="alert-banner error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h3 className="table-title">Employee Records</h3>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "var(--neutral-600)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                disabled={pendingIds.length === 0}
                style={{ accentColor: "var(--primary-500)" }}
              />
              Select All Pending
            </label>
          </div>
          <div className="table-search">
            <input
              type="text"
              placeholder="🔍 Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="fwd-search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading employee data...</span>
          </div>
        ) : filtered.length > 0 ? (
          <table className="data-table" id="forwarding-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Select</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Organization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(emp.employeeId)}
                      disabled={emp.acrSubmitted}
                      onChange={() => toggleOne(emp.employeeId)}
                    />
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--primary-700)" }}>
                    {emp.employeeId}
                  </td>
                  <td>{emp.employeeName}</td>
                  <td>{emp.organizationId}</td>
                  <td>
                    <span className={`badge ${emp.acrSubmitted ? "submitted" : "pending"}`}>
                      <span className="badge-dot"></span>
                      {emp.acrSubmitted ? "Submitted" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">
              {search ? "No employees match your search." : "No employee records found."}
            </p>
          </div>
        )}

        {/* Actions */}
        {!loading && filtered.length > 0 && (
          <div className="table-actions">
            <span className="selected-count">
              <strong>{selected.length}</strong> employee(s) selected
            </span>
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={selected.length === 0 || sending}
              id="send-to-ro-btn"
            >
              {sending ? "Sending..." : "📤 Send to Reporting Officer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <GovHeader />

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Admin Panel</div>
            <div className="sidebar-subtitle">APAR Management System</div>
          </div>

          <nav className="sidebar-nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                {tab.label}
                {tab.id === "reminders" && pendingCount > 0 && (
                  <span className="sidebar-badge">{pendingCount}</span>
                )}
                {tab.id === "review" && reviewCount > 0 && (
                  <span className="sidebar-badge">{reviewCount}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-content" key={activeTab}>
          {renderContent()}
        </main>
      </div>

      <GovFooter />
    </div>
  );
}