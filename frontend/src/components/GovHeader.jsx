import { useNavigate, useLocation } from "react-router-dom";

export default function GovHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = role === "ADMIN"
    ? [
        { label: "Admin Dashboard", path: "/admin" },
      ]
    : [
        { label: "Dashboard", path: "/employee" },
        { label: "My ACR", path: "/my-acr" },
      ];

  return (
    <header className="gov-header">
      {/* Top Identity Bar */}
      <div className="gov-identity-bar">
        <div className="gov-identity-content">
          <div className="gov-identity-left">
            <div className="gov-emblem">
              <span className="emblem-icon">🏛️</span>
            </div>
            <div className="gov-identity-text">
              <span className="gov-org-name">Government of India</span>
              <span className="gov-portal-name">APAR Portal — National Informatics Centre</span>
            </div>
          </div>
          <div className="gov-identity-right">
            <div className="gov-user-badge">
              <div className="user-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-role">{role}</span>
              </div>
            </div>
            <button className="gov-logout-btn" onClick={handleLogout} id="logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="gov-navbar">
        <div className="gov-nav-content">
          {navItems.map((item) => (
            <button
              key={item.path + item.label}
              className={`gov-nav-link ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
