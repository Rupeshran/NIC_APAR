import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";
import "../styles/Dashboard.css";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const employeeId = localStorage.getItem("employeeId") || "—";
  const role = localStorage.getItem("role") || "EMPLOYEE";

  const [acrStatus, setAcrStatus] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remindersLoading, setRemindersLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8083/acr-status/${employeeId}`
        );
        if (response.ok) {
          const data = await response.json();
          setAcrStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch ACR status:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReminders = async () => {
      // Read locally-saved reminders (from admin's ReminderPanel)
      const loadLocalReminders = () => {
        try {
          const all = JSON.parse(localStorage.getItem("apar_reminders") || "[]");
          return all.filter(
            (r) => String(r.employeeId) === String(employeeId)
          );
        } catch {
          return [];
        }
      };

      try {
        const response = await fetch(
          `http://localhost:8083/reminders/employee/${employeeId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Merge API reminders with local ones and deduplicate
          const localReminders = loadLocalReminders();
          const merged = [...data];
          localReminders.forEach((local) => {
            if (!data.some((api) => api.message === local.message)) {
              merged.push(local);
            }
          });
          
          // Sort by newest first
          merged.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
          
          setReminders(merged);
        } else {
          throw new Error("API not available");
        }
      } catch {
        // Backend endpoint not ready — use localStorage
        setReminders(loadLocalReminders());
      } finally {
        setRemindersLoading(false);
      }
    };

    fetchStatus();
    fetchReminders();

    // Real-time polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchStatus();
      fetchReminders();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [employeeId]);

  // APAR timeline status — backend serializes as "isAcrSubmitted"
  const isSubmitted = acrStatus?.isAcrSubmitted || acrStatus?.acrSubmitted;
  const isSentToRO = acrStatus?.sentToRO || acrStatus?.isSentToRO;
  const isReviewed = acrStatus?.isReviewed || acrStatus?.reviewed;

  const getTimelineStep = () => {
    if (isReviewed) return 4;
    if (isSentToRO) return 3;
    if (isSubmitted) return 2;
    return 1;
  };

  const currentStep = getTimelineStep();

  return (
    <div className="dashboard-layout">
      <GovHeader />

      <main className="dashboard-main">
        {/* Page Header */}
        <div className="page-header">
          <p className="page-breadcrumb">
            Home &gt; <span>Employee Dashboard</span>
          </p>
          <div className="page-title-row">
            <div>
              <h1 className="page-title">Welcome, {username}</h1>
              <p className="page-subtitle">
                Employee ID: {employeeId} &nbsp;|&nbsp; Role: {role}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="stats-grid">
          <div
            className="stat-card primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/my-acr")}
          >
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <span className="stat-label" style={{ marginTop: 0 }}>
                My ACR
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--neutral-500)",
                  marginTop: "4px",
                }}
              >
                View & fill your Annual Confidential Report
              </span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-label" style={{ marginTop: 0 }}>
                ACR Status
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--neutral-500)",
                  marginTop: "4px",
                }}
              >
                {loading
                  ? "Loading..."
                  : acrStatus
                  ? (acrStatus.isAcrSubmitted || acrStatus.acrSubmitted)
                    ? "Submitted"
                    : "Pending"
                  : "Not Available"}
              </span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-label" style={{ marginTop: 0 }}>
                Appraisal Period
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--neutral-500)",
                  marginTop: "4px",
                }}
              >
                April {new Date().getFullYear() - 1} — March{" "}
                {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div
            className="stat-card danger"
            style={{ cursor: reminders.length > 0 ? "pointer" : "default" }}
          >
            <div className="stat-icon">🔔</div>
            <div className="stat-info">
              <span className="stat-label" style={{ marginTop: 0 }}>
                Notifications
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: reminders.length > 0 ? "var(--danger-600)" : "var(--neutral-500)",
                  marginTop: "4px",
                  fontWeight: reminders.length > 0 ? 600 : 400,
                }}
              >
                {remindersLoading
                  ? "Loading..."
                  : reminders.length > 0
                  ? `${reminders.length} new reminder(s)`
                  : "No new notifications"}
              </span>
            </div>
          </div>
        </div>

        {/* APAR Status Timeline */}
        <div className="table-container" style={{ marginBottom: "24px" }}>
          <div className="table-toolbar">
            <h3 className="table-title">APAR Progress</h3>
            <span
              className={`badge ${isSubmitted ? "submitted" : "pending"}`}
            >
              <span className="badge-dot"></span>
              {isSentToRO ? "Forwarded" : isSubmitted ? "Submitted" : "Pending"}
            </span>
          </div>
          <div style={{ padding: "16px 24px" }}>
            <div className="timeline">
              <div
                className={`timeline-step ${
                  currentStep >= 1 ? (currentStep === 1 ? "current" : "completed") : ""
                }`}
              >
                <div className="timeline-dot">
                  {currentStep > 1 ? "✓" : "📝"}
                </div>
                <span className="timeline-label">Fill APAR</span>
              </div>

              <div className={`timeline-connector ${currentStep > 1 ? "completed" : ""}`}></div>

              <div
                className={`timeline-step ${
                  currentStep >= 2 ? (currentStep === 2 ? "current" : "completed") : ""
                }`}
              >
                <div className="timeline-dot">
                  {currentStep > 2 ? "✓" : "📤"}
                </div>
                <span className="timeline-label">Submit ACR</span>
              </div>

              <div className={`timeline-connector ${currentStep > 2 ? "completed" : ""}`}></div>

              <div
                className={`timeline-step ${
                  currentStep >= 3 ? (currentStep === 3 ? "current" : "completed") : ""
                }`}
              >
                <div className="timeline-dot">
                  {currentStep > 3 ? "✓" : "👤"}
                </div>
                <span className="timeline-label">Sent to RO</span>
              </div>

              <div className={`timeline-connector ${currentStep > 3 ? "completed" : ""}`}></div>

              <div
                className={`timeline-step ${
                  currentStep >= 4 ? (currentStep === 4 ? "current" : "completed") : ""
                }`}
              >
                <div className="timeline-dot">
                  {currentStep > 4 ? "✓" : "✅"}
                </div>
                <span className="timeline-label">Reviewed</span>
              </div>
            </div>

            {!isSubmitted && (
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/my-acr")}
                >
                  📝 Fill My ACR Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications / Reminders Section */}
        <div className="table-container" style={{ marginBottom: "24px" }}>
          <div className="table-toolbar">
            <h3 className="table-title">
              🔔 Notifications & Reminders
            </h3>
            {reminders.length > 0 && (
              <span className="sidebar-badge" style={{ background: "var(--danger-500)" }}>
                {reminders.length}
              </span>
            )}
          </div>

          <div style={{ padding: "16px 20px" }}>
            {remindersLoading ? (
              <div className="loading-container" style={{ padding: "30px" }}>
                <div className="loading-spinner"></div>
                <span className="loading-text">Loading notifications...</span>
              </div>
            ) : reminders.length > 0 ? (
              <div className="notification-list">
                {reminders.map((rem, idx) => (
                  <div
                    className="notification-card reminder"
                    key={rem.id || idx}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="notification-icon">🔔</div>
                    <div className="notification-body">
                      <div className="notification-title">
                        APAR Submission Reminder
                      </div>
                      <div className="notification-message">
                        {rem.message ||
                          "Please complete and submit your APAR at the earliest."}
                      </div>
                      <div className="notification-time">
                        {rem.sentAt
                          ? new Date(rem.sentAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="notification-empty">
                <div className="notification-empty-icon">✅</div>
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary Table */}
        <div className="table-container">
          <div className="table-toolbar">
            <h3 className="table-title">Your Profile Summary</h3>
          </div>
          <table className="data-table">
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: 600,
                    color: "var(--neutral-600)",
                    width: "200px",
                  }}
                >
                  Employee ID
                </td>
                <td>{employeeId}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--neutral-600)" }}>
                  Username
                </td>
                <td style={{ textTransform: "capitalize" }}>{username}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--neutral-600)" }}>
                  Role
                </td>
                <td>
                  <span className="badge submitted">
                    <span className="badge-dot"></span>
                    {role}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--neutral-600)" }}>
                  ACR Status
                </td>
                <td>
                  {loading ? (
                    <span style={{ color: "var(--neutral-400)" }}>
                      Loading...
                    </span>
                  ) : acrStatus ? (
                    <span
                      className={`badge ${
                        (acrStatus.isAcrSubmitted || acrStatus.acrSubmitted) ? "submitted" : "pending"
                      }`}
                    >
                      <span className="badge-dot"></span>
                      {(acrStatus.isAcrSubmitted || acrStatus.acrSubmitted) ? "Submitted" : "Pending"}
                    </span>
                  ) : (
                    <span className="badge pending">
                      <span className="badge-dot"></span>
                      Awaiting
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--neutral-600)" }}>
                  Appraisal Year
                </td>
                <td>
                  {new Date().getFullYear() - 1}–{new Date().getFullYear()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}