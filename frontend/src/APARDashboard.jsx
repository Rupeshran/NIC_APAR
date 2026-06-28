import { useState, useEffect, useCallback } from "react";
import "./APARDashboard.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8083/employees");

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      console.log("Employees:", data);

      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Search filter
  const filtered = employees.filter((emp) => {
    const name = (emp.employeeName || "").toLowerCase();

    return (
      name.includes(search.toLowerCase()) ||
      String(emp.employeeId).includes(search)
    );
  });

  // Pending employee IDs
  const pendingIds = filtered
    .filter((emp) => !emp.acrSubmitted)
    .map((emp) => emp.employeeId);

  const allChecked =
    pendingIds.length > 0 &&
    pendingIds.every((id) => selected.includes(id));

  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelected([...new Set([...selected, ...pendingIds])]);
    } else {
      setSelected(selected.filter((id) => !pendingIds.includes(id)));
    }
  };

  const toggleOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Send selected employees
  const handleSend = async () => {
    if (selected.length === 0) {
      alert("Please select at least one employee.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8083/acr-status/sendToRO",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeIds: selected,
          }),
        }
      );

      const message = await response.text();

      alert(message);

      setSelected([]);

      // Refresh table
      await fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Unable to send employees.");
    }
  };

  return (
    <div>
      <div className="top-bar">
        <span>APAR Portal – Government of India</span>
        <span>Sign Out</span>
      </div>

      <div className="navbar">
        <span className="nav-link">Home</span>
      </div>

      <div className="content">
        <div className="page-title">
          Employee APAR Forwarding Dashboard
        </div>

        <hr />

        <div className="search-row">
          <label>Search Employee:</label>

          <input
            type="text"
            placeholder="Search by Name or Employee ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <hr />

        <div className="select-all-row">
          <label>
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
            />
            &nbsp; Select All
          </label>
        </div>

        <hr />

        <table className="emp-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Organization</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(emp.employeeId)}
                      disabled={emp.acrSubmitted}
                      onChange={() => toggleOne(emp.employeeId)}
                    />
                  </td>

                  <td>{emp.employeeId}</td>

                  <td>{emp.employeeName}</td>

                  <td>{emp.organizationId}</td>

                  <td
                    className={
                      emp.acrSubmitted
                        ? "status-sent"
                        : "status-pending"
                    }
                  >
                    {emp.acrSubmitted ? "Submitted" : "Pending"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Employees Found</td>
              </tr>
            )}
          </tbody>
        </table>

        <hr />

        <div className="bottom-row">
          <span>
            Selected Employees:
            <strong> {selected.length}</strong>
          </span>

          <button
            className="send-btn"
            onClick={handleSend}
          >
            Send to RO
          </button>
        </div>
      </div>

      <div className="footer">
        <span>
          Dept. of Personnel & Training, Govt. of India
        </span>

        <span>
          Powered by NIC | {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}