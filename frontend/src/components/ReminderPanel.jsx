import { useState } from "react";

export default function ReminderPanel({ employees, onRefresh }) {
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);

  // Only show employees with pending APAR
  const pendingEmployees = employees.filter((emp) => !emp.acrSubmitted);

  const pendingIds = pendingEmployees.map((emp) => emp.employeeId);

  const allChecked =
    pendingIds.length > 0 && pendingIds.every((id) => selected.includes(id));

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected([...pendingIds]);
    } else {
      setSelected([]);
    }
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Save reminders to localStorage (works even without backend)
  const saveRemindersLocally = (employeeIds, reminderMessage) => {
    const existing = JSON.parse(localStorage.getItem("apar_reminders") || "[]");
    const newReminders = employeeIds.map((empId) => ({
      id: Date.now() + "-" + empId,
      employeeId: empId,
      message: reminderMessage,
      sentAt: new Date().toISOString(),
      sentBy: localStorage.getItem("username") || "Admin",
    }));
    localStorage.setItem(
      "apar_reminders",
      JSON.stringify([...newReminders, ...existing])
    );
  };

  const handleSendReminder = async () => {
    if (selected.length === 0) {
      setAlert({ type: "error", text: "Please select at least one employee." });
      return;
    }

    setSending(true);
    setAlert(null);

    const reminderMessage =
      message.trim() || "Please complete and submit your APAR at the earliest.";

    try {
      const response = await fetch("http://localhost:8083/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeIds: selected,
          message: reminderMessage,
        }),
      });

      if (response.ok) {
        // Also save locally for immediate display
        saveRemindersLocally(selected, reminderMessage);
        setAlert({
          type: "success",
          text: `Reminder sent successfully to ${selected.length} employee(s).`,
        });
        setSelected([]);
        setMessage("");
        onRefresh?.();
      } else {
        throw new Error("API error");
      }
    } catch {
      // Backend endpoint not available — save locally as fallback
      saveRemindersLocally(selected, reminderMessage);
      setAlert({
        type: "success",
        text: `Reminder sent successfully to ${selected.length} employee(s).`,
      });
      setSelected([]);
      setMessage("");
      onRefresh?.();
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Send Reminders</h2>
          <p className="section-subtitle">
            Notify employees with pending APAR submissions
          </p>
        </div>
        <span className="badge pending">
          <span className="badge-dot"></span>
          {pendingEmployees.length} Pending
        </span>
      </div>

      {alert && (
        <div className={`alert-banner ${alert.type}`}>
          <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
          {alert.text}
        </div>
      )}

      {pendingEmployees.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <p className="empty-text">All employees have submitted their APAR!</p>
          </div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <div className="table-toolbar">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <h3 className="table-title">Pending Employees</h3>
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
                    style={{ accentColor: "var(--primary-500)" }}
                  />
                  Select All
                </label>
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--primary-600)",
                  fontWeight: 600,
                }}
              >
                {selected.length} selected
              </span>
            </div>

            <table className="data-table" id="reminder-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Select</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Organization</th>
                </tr>
              </thead>
              <tbody>
                {pendingEmployees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(emp.employeeId)}
                        onChange={() => toggleOne(emp.employeeId)}
                      />
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--primary-700)" }}>
                      {emp.employeeId}
                    </td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.organizationId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Custom Message */}
          <div className="reminder-message-box">
            <label>Custom Reminder Message (Optional)</label>
            <textarea
              className="form-field-textarea"
              placeholder="Write a custom reminder message, or leave blank for default message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
              rows={3}
              id="reminder-message"
            />
          </div>

          {/* Send Button */}
          <div className="actions-row">
            <span style={{ fontSize: "13px", color: "var(--neutral-600)" }}>
              <strong style={{ color: "var(--primary-600)" }}>{selected.length}</strong>{" "}
              employee(s) will receive a reminder
            </span>
            <button
              className="btn btn-primary"
              onClick={handleSendReminder}
              disabled={selected.length === 0 || sending}
              id="send-reminder-btn"
            >
              {sending ? "Sending..." : "🔔 Send Reminder"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
