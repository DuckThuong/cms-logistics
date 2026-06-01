import { StringListSection } from "./StringListSection";

type ListEditorProps = {
  title: string;
  values: string[];
  placeholder: string;
  onChange: (nextValues: string[]) => void;
  addModalTitle?: string;
  addTooltip?: string;
};

export const ListEditor = (props: ListEditorProps) => (
  <section className="company-information-page__section-card">
    <StringListSection {...props} />
  </section>
);
