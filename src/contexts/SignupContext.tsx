import React, { createContext, useContext, useState, ReactNode } from "react";

type SignUpData = {
  role: "patient" | "doctor";
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  password: string;
};

type SignUpContextType = {
  signUpData: SignUpData;
  setSignUpData: (data: Partial<SignUpData>) => void;
  resetSignUpData: () => void;
};

const defaultData: SignUpData = {
  role: "patient",
  email: "",
  firstName: "",
  lastName: "",
  dateOfBirth: null,
  password: "",
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [signUpData, setSignUpState] = useState<SignUpData>(defaultData);

  const setSignUpData = (data: Partial<SignUpData>) => {
    setSignUpState((prev) => ({ ...prev, ...data }));
  };

  const resetSignUpData = () => {
    setSignUpState(defaultData);
  };

  return (
    <SignUpContext.Provider
      value={{ signUpData, setSignUpData, resetSignUpData }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = (): SignUpContextType => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};
