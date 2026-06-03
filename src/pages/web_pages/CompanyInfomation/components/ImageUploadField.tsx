import { InboxOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { uploadFile } from "@/api/config/fileApi";

type ImageUploadFieldProps = {
  value?: string;
  onChange?: (nextValue: string) => void;
  label?: string;
};

export const ImageUploadField = ({ value, onChange, label }: ImageUploadFieldProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const customRequest = async (options: UploadRequestOption) => {
    try {
      const file = options.file as File;
      const url = await uploadFile(file);
      onChange?.(url);
      options.onSuccess?.({ url }, new XMLHttpRequest());
      messageApi.success("Upload thành công!");
    } catch (error) {
      options.onError?.(error as Error);
      messageApi.error("Upload thất bại. Vui lòng thử lại.");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("Vui lòng chọn file ảnh (png/jpg/webp/...)");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error("Ảnh phải nhỏ hơn 5MB");
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
        <p className="ant-upload-hint">Tối đa 5MB. Ảnh sẽ được upload lên server.</p>
      </Upload.Dragger>

      {value ? (
        <div className="company-information-page__image-preview">
          <Image src={value} alt="uploaded" />
        </div>
      ) : null}
    </div>
  );
};
