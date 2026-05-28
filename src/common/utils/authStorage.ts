const TOKEN_STORAGE_KEY = "token";
const ROLE_STORAGE_KEY = "userRole";
const REMEMBER_LOGIN_STORAGE_KEY = "rememberLogin";
const REMEMBERED_EMAIL_STORAGE_KEY = "rememberedEmail";

const getStorageItem = (key: string) =>
  localStorage.getItem(key) ?? sessionStorage.getItem(key);

const clearStorageItem = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

const getActiveAuthStorage = () => {
  if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
    return localStorage;
  }

  if (sessionStorage.getItem(TOKEN_STORAGE_KEY)) {
    return sessionStorage;
  }

  return localStorage.getItem(REMEMBER_LOGIN_STORAGE_KEY) === "true"
    ? localStorage
    : sessionStorage;
};

export const getStoredToken = () => getStorageItem(TOKEN_STORAGE_KEY);

export const getStoredRole = () => getStorageItem(ROLE_STORAGE_KEY);

export const isStoredAuthRemembered = () =>
  Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));

export const setStoredAuth = (
  token: string,
  role?: string | null,
  remember = false,
) => {
  clearStorageItem(TOKEN_STORAGE_KEY);
  clearStorageItem(ROLE_STORAGE_KEY);

  const targetStorage = remember ? localStorage : sessionStorage;
  targetStorage.setItem(TOKEN_STORAGE_KEY, token);

  if (role) {
    targetStorage.setItem(ROLE_STORAGE_KEY, role);
  }
};

export const setStoredRole = (role: string | null) => {
  clearStorageItem(ROLE_STORAGE_KEY);

  if (!role) {
    return;
  }

  getActiveAuthStorage().setItem(ROLE_STORAGE_KEY, role);
};

export const clearStoredAuth = () => {
  clearStorageItem(TOKEN_STORAGE_KEY);
  clearStorageItem(ROLE_STORAGE_KEY);
};

export const getRememberedSignIn = () => ({
  remember: localStorage.getItem(REMEMBER_LOGIN_STORAGE_KEY) === "true",
  email: localStorage.getItem(REMEMBERED_EMAIL_STORAGE_KEY),
});

export const setRememberedSignIn = (email: string) => {
  localStorage.setItem(REMEMBER_LOGIN_STORAGE_KEY, "true");
  localStorage.setItem(REMEMBERED_EMAIL_STORAGE_KEY, email);
};

export const clearRememberedSignIn = () => {
  localStorage.removeItem(REMEMBER_LOGIN_STORAGE_KEY);
  localStorage.removeItem(REMEMBERED_EMAIL_STORAGE_KEY);
};
