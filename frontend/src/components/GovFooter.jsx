export default function GovFooter() {
  return (
    <footer className="gov-footer">
      <div className="gov-footer-content">
        <div className="gov-footer-left">
          <span className="footer-org">
            Department of Personnel &amp; Training, Government of India
          </span>
          <span className="footer-disclaimer">
            This is a secure government portal. Unauthorized access is prohibited.
          </span>
        </div>
        <div className="gov-footer-right">
          <span className="footer-powered">Designed &amp; Developed by NIC</span>
          <span className="footer-date">{new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</span>
        </div>
      </div>
    </footer>
  );
}
