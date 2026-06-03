/** FE kiểm tra `headers` chứa giá trị này để render dòng in đậm. */
export const SERVICE_DESCRIPTION_BOLD_HEADER = "1";

export const isServiceDescriptionBold = (headers?: string[] | null): boolean =>
  headers?.includes(SERVICE_DESCRIPTION_BOLD_HEADER) ?? false;

export const serviceDescriptionHeadersForBold = (bold: boolean): string[] | null =>
  bold ? [SERVICE_DESCRIPTION_BOLD_HEADER] : null;
