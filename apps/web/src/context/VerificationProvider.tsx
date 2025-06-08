import { createContext, useState, useContext, type ReactNode } from 'react';

type VerificationContextType = {
  isOpen: boolean;
  verificationEmail: string | null;
  openModal: (email: string) => void;
  closeModal: () => void;
};

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const openModal = (email: string) => {
    setVerificationEmail(email);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setVerificationEmail(null);
  };

  return (
    <VerificationContext.Provider value={{ isOpen, verificationEmail, openModal, closeModal }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};