// Format hh:mm:dd
export const formatMinutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);

  const hh = String(hours).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

export const formatMoney = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const normalized =
    typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));

  if (!Number.isFinite(normalized) || normalized === 0) {
    return "";
  }

  return normalized.toLocaleString("en-US");
};

export const formatCurrencyVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
};

export const formatDateDDMMYYYY = (input?: string | number | Date) => {
  if (!input) return "";

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatLastMessageAt = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isSameDay) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  if (isYesterday) {
    return "Hôm qua";
  }

  if (date.getFullYear() !== now.getFullYear()) {
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
};

export const formatPhone = (raw: string) => {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length > 9) digits = digits.slice(0, 9);
  let result = "";
  if (digits.length > 0) result = digits.slice(0, 3);
  if (digits.length > 3) result += " " + digits.slice(3, 6);
  if (digits.length > 6) result += " " + digits.slice(6, 9);
  return digits ? "0" + result : "";
};
