import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import type { AuthUser, LoginResponse, Patient } from '../types/models';

type AuthContextValue = {
  token: string | null;
  usuario: AuthUser | null;
  patient: Patient | null;
  isAuthenticated: boolean;
  signIn: (response: LoginResponse) => void;
  signOut: () => void;
  setPatient: (patient: Patient) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      usuario,
      patient,
      isAuthenticated: Boolean(token && usuario),
      signIn: (response) => {
        setToken(response.token);
        setUsuario(response.usuario);
      },
      signOut: () => {
        setToken(null);
        setUsuario(null);
        setPatient(null);
      },
      setPatient,
    }),
    [patient, token, usuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
