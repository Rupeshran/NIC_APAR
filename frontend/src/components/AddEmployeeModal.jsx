import { useState } from "react";

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employeeId: "",
    empIniName: "",
    empFirstName: "",
    empMidName: "",
    empLastName: "",
    organizationId: "",
    officeId: "",
    departmentId: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    username: "",
    password: "",
    role: "Employee",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.empFirstName.trim() ||
      !formData.employeeId.trim() ||
      !formData.username.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8083/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: Number(formData.employeeId),
          empIniName: formData.empIniName.trim(),
          empFirstName: formData.empFirstName.trim(),
          empMidName: formData.empMidName.trim(),
          empLastName: formData.empLastName.trim(),
          organizationId: formData.organizationId ? Number(formData.organizationId) : null,
          officeId: formData.officeId ? Number(formData.officeId) : null,
          departmentId: formData.departmentId ? Number(formData.departmentId) : null,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          mobileNumber: formData.mobileNumber.trim(),
          username: formData.username.trim(),
          password: formData.password,
          role: formData.role ? formData.role.toUpperCase() : "EMPLOYEE",
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to add employee.");
      }

      // Reset form
      setFormData({
        employeeId: "",
        empIniName: "",
        empFirstName: "",
        empMidName: "",
        empLastName: "",
        organizationId: "",
        officeId: "",
        departmentId: "",
        gender: "",
        dateOfBirth: "",
        mobileNumber: "",
        username: "",
        password: "",
        role: "Employee",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Add employee error:", err);
      setError(err.message || "Unable to add employee. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" role="dialog" aria-labelledby="add-employee-title">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="add-employee-title">
            Add New Employee
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-banner error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Employee ID */}
            <div className="form-row">
              <label className="form-field-label">
                Employee ID <span className="required">*</span>
              </label>
              <input
                className="form-field-input"
                type="number"
                placeholder="Enter employee ID (e.g. 1001)"
                value={formData.employeeId}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                disabled={saving}
                id="add-emp-id"
              />
            </div>

            {/* Name Fields */}
            <div className="form-row-grid" style={{ gridTemplateColumns: "1fr 2fr 1fr" }}>
              <div className="form-row">
                <label className="form-field-label">Prefix (Ini)</label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="Mr./Ms."
                  value={formData.empIniName}
                  onChange={(e) => handleChange("empIniName", e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-row">
                <label className="form-field-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.empFirstName}
                  onChange={(e) => handleChange("empFirstName", e.target.value)}
                  disabled={saving}
                />
              </div>
              
              <div className="form-row">
                <label className="form-field-label">Middle Name</label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="Middle"
                  value={formData.empMidName}
                  onChange={(e) => handleChange("empMidName", e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>
            
            <div className="form-row-grid">
              <div className="form-row">
                <label className="form-field-label">Last Name</label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.empLastName}
                  onChange={(e) => handleChange("empLastName", e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-row">
                <label className="form-field-label">Gender</label>
                <select
                  className="form-field-select"
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={saving}
                >
                  <option value="">-- Select --</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            {/* IDs Grid */}
            <div className="form-row-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div className="form-row">
                <label className="form-field-label">Org ID</label>
                <input
                  className="form-field-input"
                  type="number"
                  placeholder="e.g. 1"
                  value={formData.organizationId}
                  onChange={(e) => handleChange("organizationId", e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-row">
                <label className="form-field-label">Office ID</label>
                <input
                  className="form-field-input"
                  type="number"
                  placeholder="e.g. 101"
                  value={formData.officeId}
                  onChange={(e) => handleChange("officeId", e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-row">
                <label className="form-field-label">Dept ID</label>
                <input
                  className="form-field-input"
                  type="number"
                  placeholder="e.g. 201"
                  value={formData.departmentId}
                  onChange={(e) => handleChange("departmentId", e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Mobile & DOB */}
            <div className="form-row-grid">
              <div className="form-row">
                <label className="form-field-label">Date of Birth</label>
                <input
                  className="form-field-input"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-row">
                <label className="form-field-label">Mobile Number</label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange("mobileNumber", e.target.value)}
                  disabled={saving}
                  id="add-emp-mobile"
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{
              borderTop: "2px solid var(--neutral-200)",
              margin: "20px 0 16px",
              paddingTop: "16px",
            }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary-700)", marginBottom: "14px" }}>
                🔐 Login Credentials
              </p>
            </div>

            {/* Username + Password */}
            <div className="form-row-grid">
              <div className="form-row">
                <label className="form-field-label">
                  Username <span className="required">*</span>
                </label>
                <input
                  className="form-field-input"
                  type="text"
                  placeholder="Login username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={saving}
                  id="add-emp-username"
                />
              </div>

              <div className="form-row">
                <label className="form-field-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  className="form-field-input"
                  type="password"
                  placeholder="Set password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={saving}
                  id="add-emp-password"
                />
              </div>
            </div>

            {/* Role */}
            <div className="form-row">
              <label className="form-field-label">Role (Designation)</label>
              <select
                className="form-field-select"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                disabled={saving}
                id="add-emp-role"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee (General)</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="Clerk">Clerk</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              id="save-employee-btn"
            >
              {saving ? "Saving..." : "➕ Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
