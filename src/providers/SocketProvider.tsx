import { useEffect, type PropsWithChildren } from "react";
import { socketManager } from "../socket/socket-manager";

export const SocketProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    socketManager.connect();

    return () => {
      socketManager.disconnect();
    };
  }, []);

  return children;
};
