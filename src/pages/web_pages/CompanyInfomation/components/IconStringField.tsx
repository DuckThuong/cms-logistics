import { Input } from "antd";

type IconStringFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const IconStringField = ({
  value = "",
  onChange,
  placeholder = "URL ảnh icon hoặc emoji (vd: 🚚)",
}: IconStringFieldProps) => {
  const trimmed = value.trim();
  const isImageSrc =
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:");

  return (
    <div className="company-information-page__icon-field">
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {trimmed ? (
        <div className="company-information-page__icon-preview" aria-hidden>
          {isImageSrc ? (
            <img src={trimmed} alt="" />
          ) : (
            <span className="company-information-page__icon-preview-text">{trimmed}</span>
          )}
        </div>
      ) : null}
    </div>
  );
};
