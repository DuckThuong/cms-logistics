import { useUser } from "@/common/contexts/UserContext";
import { ROUTER_PATH } from "@/routers/Route";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import "./Header.scss";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="hk-header">
      <div className="hk-header__inner">
        <a className="hk-header__logo" href={`/${ROUTER_PATH.DASHBOARD}`}>
          <div className="hk-header__logo-text">
            <span className="hk-header__logo-name">CMS Logistics</span>
            <span className="hk-header__logo-sub">Admin Dashboard</span>
          </div>
        </a>

        <div className="hk-header__actions">
          <Badge count={user.notifCount} offset={[0, 2]}>
            <button type="button" className="hk-header__action-btn">
              <BellOutlined />
            </button>
          </Badge>

          <button
            type="button"
            className="hk-header__action-btn hk-header__profile-btn"
          >
            <UserOutlined />
            <span>{user.userName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
