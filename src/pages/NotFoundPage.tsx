import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";

const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn tìm kiếm không tồn tại."
        extra={
          <Link to={ROUTER_PATH.DASHBOARD}>
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFoundPage;
