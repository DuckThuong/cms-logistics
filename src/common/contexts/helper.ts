import { useState, useEffect, useRef } from "react";

export const childrenPath = (path: string, param?: string) =>
  param ? path.replace(/:\w+\?/, param) : path.replace(/\/:\w+\?/, "");

export const validString = (value: string) => {
  if (!value) {
    return false;
  } else if (value.trim() === "") {
    return false;
  } else {
    return true;
  }
};

export const seatColor = (n: number) => {
  if (n <= 3) return "trip-card__seats--urgent";
  if (n <= 8) return "trip-card__seats--low";
  return "trip-card__seats--ok";
};

export const useCountdown = (initialSeconds: number) => {
  const [secs, setSecs] = useState(initialSeconds);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(ref.current!);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};
