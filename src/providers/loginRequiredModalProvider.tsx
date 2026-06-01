import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Button, Modal } from "antd";

export type LoginRequiredModalOptions = {
  signInState?: Record<string, unknown>;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type LoginRequiredModalContextType = {
  openLoginRequiredModal: (options: LoginRequiredModalOptions) => void;
};

const LoginRequiredModalContext = createContext<
  LoginRequiredModalContextType | undefined
>(undefined);

export const useLoginRequiredModal = () => {
  const context = useContext(LoginRequiredModalContext);
  if (!context) {
    throw new Error(
      "useLoginRequiredModal must be used within LoginRequiredModalProvider",
    );
  }
  return context;
};

export const LoginRequiredModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<LoginRequiredModalOptions>({});

  const openLoginRequiredModal = useCallback(
    (nextOptions: LoginRequiredModalOptions) => {
      setOptions(nextOptions);
      setOpen(true);
    },
    [],
  );

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    options.onConfirm?.();
    close();
  }, [close, options]);

  const handleCancel = useCallback(() => {
    options.onCancel?.();
    close();
  }, [close, options]);

  const modalNode = useMemo(() => {
    return (
      <Modal
        open={open}
        title="Đăng nhập cần thiết"
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            Đăng nhập
          </Button>,
        ]}
        onCancel={handleCancel}
        maskClosable
      >
        Bạn cần đăng nhập để tiếp tục.
      </Modal>
    );
  }, [handleCancel, handleConfirm, open]);

  return (
    <LoginRequiredModalContext.Provider value={{ openLoginRequiredModal }}>
      {children}
      {modalNode}
    </LoginRequiredModalContext.Provider>
  );
};

