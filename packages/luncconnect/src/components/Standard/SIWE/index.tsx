import React from 'react';

export const SIWEProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const useSIWE = () => {
  return {
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
  };
};
