import "./style.scss";
import { ROUTER_PATH } from "@/routers/Route";

const Footer = () => (
  <footer className="app-footer">
    <div>© 2026 Công Ty Logistics</div>
    <div className="app-footer__links">
      <a href={`/${ROUTER_PATH.DASHBOARD}`}>Chính sách</a>
      <a href={`/${ROUTER_PATH.DASHBOARD}`}>Hỗ trợ</a>
    </div>
  </footer>
);

export default Footer;
