import { useState, useEffect, useCallback } from "react";

export default function APARReviewPanel({ onReviewCountChange }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [reviewData, setReviewData] = useState({});
  const [saving, setSaving] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8083/acr/submitted");

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        // If endpoint doesn't exist yet, show empty state
        setSubmissions([]);
      }
    } catch (err) {
      console.error("Fetch submissions error:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
    // Notify parent to refresh count
    if (onReviewCountChange) onReviewCountChange();
  }, [onReviewCountChange]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const toggleExpand = (empId) => {
    setExpandedId((prev) => (prev === empId ? null : empId));
  };

  const handleReviewChange = (empId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (empId) => {
    const review = reviewData[empId];
    if (!review?.rating) {
      setAlert({ type: "error", text: "Please select a rating before submitting review." });
      return;
    }

    setSaving(empId);
    setAlert(null);

    try {
      const response = await fetch("http://localhost:8083/acr/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: empId,
          reviewerRating: review.rating,
          reviewerComments: review.comments || "",
        }),
      });

      if (response.ok) {
        setAlert({ type: "success", text: `Review submitted for Employee #${empId}.` });
        setExpandedId(null);
        await fetchSubmissions();
      } else {
        throw new Error("Failed to submit review.");
      }
    } catch (err) {
      console.error("Review error:", err);
      setAlert({ type: "error", text: "Unable to submit review. Please try again." });
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteApar = async (empId) => {
    if (!window.confirm("Are you sure you want to delete this APAR submission? This action cannot be undone.")) return;

    setAlert(null);
    try {
      const response = await fetch(`http://localhost:8083/acr/submitted/${empId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setAlert({ type: "success", text: `APAR deleted for Employee #${empId}.` });
        setExpandedId(null);
        await fetchSubmissions();
      } else {
        throw new Error("Failed to delete APAR.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setAlert({ type: "error", text: "Unable to delete APAR. Please try again." });
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">APAR Review</h2>
          <p className="section-subtitle">
            Review submitted Annual Performance Appraisal Reports
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchSubmissions} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {alert && (
        <div className={`alert-banner ${alert.type}`}>
          <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
          {alert.text}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading submissions...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">
              No APAR submissions to review yet.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {submissions.map((sub) => {
            const isExpanded = expandedId === sub.employeeId;
            const review = reviewData[sub.employeeId] || {};

            return (
              <div className="review-card" key={sub.employeeId}>
                {/* Header — clickable to expand */}
                <div
                  className="review-card-header"
                  onClick={() => toggleExpand(sub.employeeId)}
                >
                  <div className="review-card-info">
                    <div className="review-avatar">
                      {(sub.employeeName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="review-meta">
                      <span className="review-name">
                        {sub.employeeName || `Employee #${sub.employeeId}`}
                      </span>
                      <span className="review-emp-id">
                        ID: {sub.employeeId}
                        {sub.organizationId ? ` · ${sub.organizationId}` : ""}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="badge submitted">
                      <span className="badge-dot"></span>
                      {sub.selfRating || "Submitted"}
                    </span>
                    <span className={`review-toggle ${isExpanded ? "open" : ""}`}>▼</span>
                  </div>
                </div>

                {/* Body — expanded details */}
                {isExpanded && (
                  <div className="review-card-body">
                    <div className="review-section">
                      <div className="review-section-label">Key Achievements</div>
                      <div className="review-section-content">
                        {sub.achievements || "—"}
                      </div>
                    </div>

                    <div className="review-section">
                      <div className="review-section-label">Challenges Faced</div>
                      <div className="review-section-content">
                        {sub.challenges || "—"}
                      </div>
                    </div>

                    <div className="review-section">
                      <div className="review-section-label">Training Attended / Required</div>
                      <div className="review-section-content">
                        {sub.training || "—"}
                      </div>
                    </div>

                    <div className="review-section">
                      <div className="review-section-label">Goals for Next Period</div>
                      <div className="review-section-content">
                        {sub.goals || "—"}
                      </div>
                    </div>

                    <div className="review-section">
                      <div className="review-section-label">Self Rating</div>
                      <div className="review-section-content">
                        {sub.selfRating || "—"}
                      </div>
                    </div>

                    {/* Reviewer section */}
                    <div
                      style={{
                        marginTop: "24px",
                        paddingTop: "20px",
                        borderTop: "2px solid var(--neutral-200)",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "var(--primary-800)",
                          marginBottom: "16px",
                        }}
                      >
                        Reviewer Assessment
                      </h4>

                      <div className="form-row">
                        <label className="form-field-label">
                          Reviewer Rating <span className="required">*</span>
                        </label>
                        <select
                          className="form-field-select"
                          value={review.rating || ""}
                          onChange={(e) =>
                            handleReviewChange(sub.employeeId, "rating", e.target.value)
                          }
                          disabled={saving === sub.employeeId}
                          style={{ maxWidth: "280px" }}
                        >
                          <option value="">-- Select Rating --</option>
                          <option value="Outstanding">Outstanding (9-10)</option>
                          <option value="Very Good">Very Good (7-8)</option>
                          <option value="Good">Good (5-6)</option>
                          <option value="Average">Average (3-4)</option>
                          <option value="Below Average">Below Average (1-2)</option>
                        </select>
                      </div>

                      <div className="form-row">
                        <label className="form-field-label">Reviewer Comments</label>
                        <textarea
                          className="form-field-textarea"
                          placeholder="Add your assessment comments..."
                          value={review.comments || ""}
                          onChange={(e) =>
                            handleReviewChange(sub.employeeId, "comments", e.target.value)
                          }
                          disabled={saving === sub.employeeId}
                          rows={3}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleDeleteApar(sub.employeeId)}
                          disabled={saving === sub.employeeId}
                          style={{ borderColor: "var(--danger-500)", color: "var(--danger-600)" }}
                        >
                          🗑️ Delete APAR
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmitReview(sub.employeeId)}
                          disabled={saving === sub.employeeId}
                        >
                          {saving === sub.employeeId ? "Submitting..." : "📋 Submit Review"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
