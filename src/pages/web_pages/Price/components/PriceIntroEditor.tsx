import { ListEditor } from "../../CompanyInfomation/components/ListEditor";

type PriceIntroEditorProps = {
  values: string[];
  onChange: (next: string[]) => void;
};

export const PriceIntroEditor = ({ values, onChange }: PriceIntroEditorProps) => (
  <ListEditor
    title="Đoạn mở đầu (description[])"
    values={values}
    placeholder="Nhập đoạn giới thiệu..."
    onChange={onChange}
    addModalTitle="Thêm đoạn"
    addTooltip="Thêm đoạn mô tả"
  />
);
