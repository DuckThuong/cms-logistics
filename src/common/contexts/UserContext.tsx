import { createContext, useContext, useState, type ReactNode } from "react";

export type UserInfo = {
  userName: string;
  notifCount: number;
  phone?: string;
  email?: string;
  address?: string;
  birthday?: string;
  avatarUrl?: string;
};

interface UserContextType {
  user: UserInfo;
  setUser: (user: UserInfo) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: UserInfo;
}) => {
  const [user, setUser] = useState<UserInfo>(
    initialUser || {
      userName: "Khách",
      notifCount: 0,
    },
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
