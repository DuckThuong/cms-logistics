import { BRAND } from "@/common/constants/constants";
import { useUser } from "@/common/contexts/UserContext";
import { ROUTER_PATH } from "@/routers/Route";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import "./Header.scss";

const Header = () => {
  const { user } = useUser();

  const initials = user.userName
    ? user.userName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="hk-header">
      {/* Subtle top accent line */}
      <div className="hk-header__accent-line" />

      <div className="hk-header__inner">
        {/* ── Logo ── */}
        <a className="hk-header__logo" href={`/${ROUTER_PATH.DASHBOARD}`}>
          <img
            src={BRAND.logoSrc}
            alt={BRAND.name}
            className="hk-header__logo-img"
          />
          <div className="hk-header__logo-text">
            <span className="hk-header__logo-name">{BRAND.namePrimary}</span>
            <span className="hk-header__logo-sub">{BRAND.cmsSubtitle}</span>
          </div>
        </a>

        {/* ── Search ── */}
        <div className="hk-header__search">
          <SearchOutlined className="hk-header__search-icon" />
          <input
            className="hk-header__search-input"
            placeholder="Tìm kiếm đơn hàng, tài xế..."
            aria-label="Tìm kiếm"
          />
          <kbd className="hk-header__search-kbd">⌘K</kbd>
        </div>

        {/* ── Right actions ── */}
        <div className="hk-header__actions">
          {/* Notification */}
          <Tooltip title="Thông báo" placement="bottom">
            <button type="button" className="hk-header__icon-btn" aria-label="Thông báo">
              <Badge
                count={user.notifCount}
                size="small"
                offset={[0, 0]}
                styles={{ indicator: { boxShadow: "none" } }}
              >
                <BellOutlined className="hk-header__icon-btn-inner" />
              </Badge>
            </button>
          </Tooltip>

          {/* Divider */}
          <div className="hk-header__divider" aria-hidden="true" />

          {/* Profile */}
          <button type="button" className="hk-header__profile" aria-label="Tài khoản của bạn">
            <div className="hk-header__avatar">
              <span>{initials}</span>
            </div>
            <div className="hk-header__profile-info">
              <span className="hk-header__profile-name">{user.userName}</span>
              <span className="hk-header__profile-role">Super Admin</span>
            </div>
            <svg
              className="hk-header__profile-chevron"
              viewBox="0 0 16 16"
              fill="#fff"
              aria-hidden="true"
            >
              <path fill="#fff" stroke="#fff" d="M4 6l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;