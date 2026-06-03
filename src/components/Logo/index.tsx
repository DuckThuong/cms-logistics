import { BRAND } from "@/common/constants/constants";
import "./style.scss";

export const Logo = () => (
  <div className="logo">
    <img src={BRAND.logoSrc} alt={BRAND.name} className="logo__img" />
    <div className="logo__text">
      <span className="logo__name">{BRAND.namePrimary}</span>
      <span className="logo__sub">{BRAND.nameSecondary}</span>
    </div>
  </div>
);
