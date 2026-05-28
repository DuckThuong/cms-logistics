import { Logo } from "@/components/Logo";
import { ROUTER_PATH } from "@/routers/Route";
import { LockOutlined, LoginOutlined, PhoneOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate(ROUTER_PATH.DASHBOARD);
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header__left">
          <a href={ROUTER_PATH.DASHBOARD} title="Trang chủ">
            <img
              src="https://hongkylogistics.vn/img/logo/logohk.png"
              alt="Công Ty Logistics"
              className="login-header__logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </a>
        </div>
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="login-card__accent" />
          <div className="login-card__logo">
            <Logo />
          </div>

          <h1 className="login-card__title">Đăng nhập</h1>
          <p className="login-card__subtitle">Chào mừng bạn trở lại!</p>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="account"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại hoặc email!",
                },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#bbb" }} />}
                placeholder="Điện thoại hoặc Email"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bbb" }} />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            {/* Remember me */}
            <Form.Item
              name="remember"
              valuePropName="checked"
              initialValue={false}
              style={{ marginBottom: 20 }}
            >
              <Checkbox>
                <span className="login-card__checkbox-label">
                  Lưu đăng nhập
                </span>
              </Checkbox>
            </Form.Item>

            {/* Submit button */}
            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                block
                className="login-card__submit-btn"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="login-card__divider" />
        </div>
      </main>

      <footer className="login-footer">
        Copyright © 2026 Công Ty Logistics
      </footer>
    </div>
  );
}
