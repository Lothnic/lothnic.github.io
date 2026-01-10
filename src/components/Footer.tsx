import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">© 2025 MAYANK J0SHI. ALL RIGHTS RESERVED.</p>
          <div className="footer-links">
            <Link href="#home" className="footer-link">
              H0ME
            </Link>
            <Link href="#projects" className="footer-link">
              PR0JECTS
            </Link>
            <Link href="#contact" className="footer-link">
              C0NTACT
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
