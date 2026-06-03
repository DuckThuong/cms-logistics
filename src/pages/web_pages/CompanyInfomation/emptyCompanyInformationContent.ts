import type { CompanyInformationContent } from "@/common/types/companyInformation";

/** Trạng thái form rỗng trước khi API trả dữ liệu hoặc khi chưa có page trên server. */
export const EMPTY_COMPANY_INFORMATION_CONTENT: CompanyInformationContent = {
  seoUrl: "",
  pageTag: "",
  pageTitle: "",
  pageSubtitle: "",
  headerExtras: [],
  intro: {
    title: "",
    anchor: "",
    content: "",
    imageUrl: "",
  },
  otherOptions: [],
  sections: [],
  showQuickLinks: true,
  hiddenQuickLinkIds: [],
};
