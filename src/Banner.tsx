import { useEffect } from "react";
import { FormSearch } from "../FormSearch/formSearch";
import "./Banner.scss";
interface BannerProps {
  image?: string;
  title?: string;
  description?: string;
  onSearch?: (value: string) => void;
}
export const Banner = (props: BannerProps) => {
  return (
    <div
      className="banner"
      style={{
        background: `url(${props?.image}) no-repeat center center/cover`,
      }}
    >
      <div className="banner__content">
        <h1 className="banner__content-title">{props?.title}</h1>
        <p className="banner__content-description">{props?.description}</p>
        <FormSearch
          label=""
          name="search"
          placeholder="Tìm kiếm theo tên, địa chỉ..."
          onSearch={(value) => {
            props.onSearch(value);
          }}
          formItemProps={{
            className: "banner__content-search",
          }}
        />
      </div>
    </div>
  );
};
