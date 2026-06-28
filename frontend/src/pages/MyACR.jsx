import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";
import "../styles/Dashboard.css";

export default function MyACR() {
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId") || "";
  const username = localStorage.getItem("username") || "";

  const [formData, setFormData] = useState({
    achievements: "",
    challenges: "",
    training: "",
    goals: "",
    designation: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.achievements.trim() || !formData.designation) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      // Simulate ACR submission — replace with actual API endpoint
      const response = await fetch("http://localhost:8083/acr/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: Number(employeeId),
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit ACR. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Unable to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <GovHeader />

      <main className="dashboard-main">
        {/* Page Header */}
        <div className="page-header">
          <p className="page-breadcrumb">
            Home &gt; Employee Dashboard &gt; <span>My ACR</span>
          </p>
          <div className="page-title-row">
            <div>
              <h1 className="page-title">Annual Confidential Report</h1>
              <p className="page-subtitle">
                Appraisal Period: April {new Date().getFullYear() - 1} — March{" "}
                {new Date().getFullYear()} &nbsp;|&nbsp; Employee: {username} ({employeeId})
              </p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate("/employee")}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {submitted ? (
          /* Success State */
          <div className="table-container" style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ color: "var(--success-700)", marginBottom: "8px" }}>
              ACR Submitted Successfully
            </h2>
            <p style={{ color: "var(--neutral-500)", marginBottom: "24px" }}>
              Your Annual Confidential Report has been submitted for review.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/employee")}>
              Return to Dashboard
            </button>
          </div>
        ) : (
          /* ACR Form */
          <form onSubmit={handleSubmit}>
            <div className="table-container" style={{ marginBottom: "20px" }}>
              <div className="table-toolbar">
                <h3 className="table-title">Self-Appraisal Form</h3>
                <span className="badge pending">
                  <span className="badge-dot"></span>
                  Draft
                </span>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Achievements */}
                <div style={{ marginBottom: "22px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--neutral-700)",
                    marginBottom: "8px",
                  }}>
                    Key Achievements / Work Done <span style={{ color: "var(--danger-500)" }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.achievements}
                    onChange={(e) => handleChange("achievements", e.target.value)}
                    placeholder="Describe your key achievements during the appraisal period..."
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid var(--neutral-300)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: "var(--neutral-800)",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    id="acr-achievements"
                  />
                </div>

                {/* Challenges */}
                <div style={{ marginBottom: "22px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--neutral-700)",
                    marginBottom: "8px",
                  }}>
                    Challenges Faced
                  </label>
                  <textarea
                    rows={3}
                    value={formData.challenges}
                    onChange={(e) => handleChange("challenges", e.target.value)}
                    placeholder="Describe any challenges you encountered..."
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid var(--neutral-300)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: "var(--neutral-800)",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    id="acr-challenges"
                  />
                </div>

                {/* Training */}
                <div style={{ marginBottom: "22px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--neutral-700)",
                    marginBottom: "8px",
                  }}>
                    Training Attended / Required
                  </label>
                  <textarea
                    rows={3}
                    value={formData.training}
                    onChange={(e) => handleChange("training", e.target.value)}
                    placeholder="List training programs attended or needed..."
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid var(--neutral-300)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: "var(--neutral-800)",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    id="acr-training"
                  />
                </div>

                {/* Goals */}
                <div style={{ marginBottom: "22px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--neutral-700)",
                    marginBottom: "8px",
                  }}>
                    Goals for Next Period
                  </label>
                  <textarea
                    rows={3}
                    value={formData.goals}
                    onChange={(e) => handleChange("goals", e.target.value)}
                    placeholder="Set your goals for the next appraisal period..."
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid var(--neutral-300)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: "var(--neutral-800)",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    id="acr-goals"
                  />
                </div>

                {/* Designation */}
                <div style={{ marginBottom: "8px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--neutral-700)",
                    marginBottom: "8px",
                  }}>
                    Designation <span style={{ color: "var(--danger-500)" }}>*</span>
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    disabled={submitting}
                    style={{
                      padding: "10px 16px",
                      border: "1.5px solid var(--neutral-300)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: "var(--neutral-800)",
                      background: "var(--white)",
                      minWidth: "200px",
                      width: "100%",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                    id="acr-designation"
                  >
                    <option value="">-- Select Designation --</option>
                    <option value="Clerk">Clerk</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Full Stack Engineer">Full Stack Engineer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Database Administrator">Database Administrator</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Support Staff">Support Staff</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="table-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate("/employee")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  id="submit-acr-btn"
                >
                  {submitting ? "Submitting..." : "📤 Submit ACR"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <GovFooter />
    </div>
  );
}