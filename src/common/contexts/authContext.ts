import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  signIn as signInApi,
  signUp as signUpApi,
} from "../../api/configs/auth.config";
import { getUserPRofile } from "../../api/configs/user.config";
import {
  clearStoredAuth,
  getStoredRole,
  getStoredToken,
  isStoredAuthRemembered,
  setStoredAuth,
  setStoredRole,
} from "../utils/authStorage";
import type {
  SignInPayloadDto,
  SignInResponseDto,
  SignUpPayloadDto,
  SignUpResponseDto,
} from "../../api/dtos/auth.dto";
import type { UserProfileResponseDto } from "../../api/dtos/user.dto";

interface AuthContextType {
  token: string | null;
  user: UserProfileResponseDto | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthResolved: boolean;
  signIn: (
    payload: SignInPayloadDto,
    options?: { remember?: boolean },
  ) => Promise<SignInResponseDto>;
  signUp: (payload: SignUpPayloadDto) => Promise<SignUpResponseDto>;
  signOut: () => void;
  setUser: (user: UserProfileResponseDto | null) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState<UserProfileResponseDto | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  const applyAuthenticatedState = useCallback(
    (
      nextToken: string,
      nextUser: UserProfileResponseDto | null,
      remember = false,
    ) => {
      setToken(nextToken);
      setStoredAuth(nextToken, nextUser?.role, remember);

      setCurrentUser(nextUser);
    },
    [],
  );

  const setUser = useCallback((nextUser: UserProfileResponseDto | null) => {
    setCurrentUser(nextUser);
    setStoredRole(nextUser?.role ?? null);
  }, []);

  const signOut = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setCurrentUser(null);
  }, []);

  const fetchAndApplyUserProfile = useCallback(
    async (nextToken: string, remember = false) => {
      const profile = await getUserPRofile();
      applyAuthenticatedState(nextToken, profile, remember);
    },
    [applyAuthenticatedState],
  );

  const checkAuthStatus = useCallback(async () => {
    setIsAuthResolved(false);
    const currentToken = getStoredToken();

    if (!currentToken) {
      signOut();
      setIsAuthResolved(true);
      return;
    }

    setIsLoading(true);
    try {
      await fetchAndApplyUserProfile(currentToken, isStoredAuthRemembered());
    } catch {
      signOut();
    } finally {
      setIsLoading(false);
      setIsAuthResolved(true);
    }
  }, [fetchAndApplyUserProfile, signOut]);

  const signIn = useCallback(
    async (payload: SignInPayloadDto, options?: { remember?: boolean }) => {
      const remember = options?.remember ?? false;
      setIsLoading(true);
      try {
        const response = await signInApi(payload);
        applyAuthenticatedState(response.access_token, null, remember);
        await fetchAndApplyUserProfile(response.access_token, remember);
        return response;
      } catch (error) {
        signOut();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [applyAuthenticatedState, fetchAndApplyUserProfile, signOut],
  );

  const signUp = useCallback(async (payload: SignUpPayloadDto) => {
    setIsLoading(true);
    try {
      const response = await signUpApi(payload);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  const userRole = useMemo(
    () => currentUser?.role ?? getStoredRole(),
    [currentUser?.role],
  );

  const isAuthenticated = Boolean(token);

  const contextValue = useMemo(
    () => ({
      token,
      user: currentUser,
      userRole,
      isAuthenticated,
      isLoading,
      isAuthResolved,
      signIn,
      signUp,
      signOut,
      setUser,
      checkAuthStatus,
    }),
    [
      token,
      currentUser,
      userRole,
      isAuthenticated,
      isLoading,
      isAuthResolved,
      signIn,
      signUp,
      signOut,
      setUser,
      checkAuthStatus,
    ],
  );

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children,
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
