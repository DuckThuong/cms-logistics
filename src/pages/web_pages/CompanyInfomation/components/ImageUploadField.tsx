import { InboxOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadRequestOption } from "rc-upload/lib/interface";

type ImageUploadFieldProps = {
  value?: string;
  onChange?: (nextValue: string) => void;
  label?: string;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });

export const ImageUploadField = ({ value, onChange, label }: ImageUploadFieldProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const customRequest = async (options: UploadRequestOption) => {
    try {
      const file = options.file as File;
      const dataUrl = await fileToDataUrl(file);
      onChange?.(dataUrl);
      options.onSuccess?.({ url: dataUrl }, new XMLHttpRequest());
    } catch (error) {
      options.onError?.(error as Error);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("Vui lòng chọn file ảnh (png/jpg/webp/...)");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Ảnh phải nhỏ hơn 2MB");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <div className="company-information-page__image-upload">
      {contextHolder}
      {label ? <div className="company-information-page__image-upload-label">{label}</div> : null}
      <Upload.Dragger
        name="file"
        multiple={false}
        showUploadList={false}
        customRequest={customRequest}
        beforeUpload={beforeUpload}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
        <p className="ant-upload-hint">Tối đa 2MB. Ảnh sẽ được lưu dạng DataURL (tạm thời).</p>
      </Upload.Dragger>

      {value ? (
        <div className="company-information-page__image-preview">
          <Image src={value} alt="uploaded" />
        </div>
      ) : null}
    </div>
  );
};

