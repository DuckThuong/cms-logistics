import { Form, Input } from "antd";

type SeoSectionProps = {
  seoUrl: string;
  onSeoUrlChange: (value: string) => void;
};

export const SeoSection = ({ seoUrl, onSeoUrlChange }: SeoSectionProps) => {
  return (
    <section className="company-information-page__section-card">
      <h3>Đường dẫn & SEO</h3>
      <Form layout="vertical">
        <Form.Item
          label="Đường dẫn (SEO URL)"
          required
          tooltip="Đây là URL hiển thị cho trang About ở frontend"
        >
          <Input
            value={seoUrl}
            onChange={(event) => onSeoUrlChange(event.target.value)}
            placeholder="about"
          />
        </Form.Item>
      </Form>
    </section>
  );
};
