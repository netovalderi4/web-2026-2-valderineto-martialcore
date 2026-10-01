import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole } from '../types/martial';
import { configureAmplify } from '../config/cognito';
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  signOut,
  getCurrentUser,
  fetchUserAttributes
} from 'aws-amplify/auth';

// Inicializa a configuração do Amplify
configureAmplify();

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isCognito: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  currentRole: UserRole;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  loginWithCognito: (email: string, password: string) => Promise<{ nextStep?: string }>;
  signUpWithCognito: (name: string, email: string, password: string) => Promise<{ nextStep?: string }>;
  confirmSignUpCode: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
  loginAsQuickRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = 'martialcore_auth_session';

interface StoredSession {
  user: AuthUser;
  currentRole: UserRole;
}

// Mapeamento amigável de erros do AWS Cognito em português
function translateCognitoError(err: unknown): string {
  const errorName = (err as { name?: string })?.name || '';
  const errorMessage = (err as { message?: string })?.message || '';

  if (errorName === 'UserNotFoundException' || errorMessage.includes('User does not exist')) {
    return 'Nenhuma conta encontrada com este e-mail.';
  }
  if (errorName === 'NotAuthorizedException' || errorMessage.includes('Incorrect username or password')) {
    return 'E-mail ou senha incorretos.';
  }
  if (errorName === 'UserNotConfirmedException' || errorMessage.includes('User is not confirmed')) {
    return 'Sua conta ainda não foi confirmada. Insira o código enviado para seu e-mail.';
  }
  if (errorName === 'UsernameExistsException' || errorMessage.includes('User already exists')) {
    return 'Já existe uma conta cadastrada com este e-mail.';
  }
  if (errorName === 'InvalidPasswordException' || errorMessage.includes('Password did not conform')) {
    return 'A senha deve conter no mínimo 8 caracteres (com letras maiúsculas, minúsculas e números).';
  }
  if (errorName === 'CodeMismatchException' || errorMessage.includes('Invalid verification code')) {
    return 'Código de verificação incorreto ou expirado.';
  }
  if (errorName === 'LimitExceededException') {
    return 'Muitas tentativas consecutivas. Aguarde alguns instantes e tente novamente.';
  }
  return errorMessage || 'Ocorreu um erro ao comunicar com o serviço de autenticação.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Restaura sessão salva ou verifica Cognito ativo ao montar
  useEffect(() => {
    async function checkAuth() {
      try {
        setIsLoading(true);

        // 1. Tenta recuperar sessão do AWS Cognito ativo
        try {
          const cognitoUser = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          const email = attributes.email || cognitoUser.username;
          const name = attributes.name || (email.split('@')[0] || 'Usuário Cognito');

          // Valderi ou administradores recebem perfil admin por padrão
          const isValderiAdmin = email.toLowerCase().includes('valderi') || email.toLowerCase().includes('admin');
          const defaultRole: UserRole = isValderiAdmin ? 'admin' : 'student';

          // Verifica se havia um papel salvo no storage
          const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
          const savedRole = stored ? (JSON.parse(stored) as StoredSession).currentRole : defaultRole;

          const authUser: AuthUser = {
            id: cognitoUser.userId,
            email,
            name,
            isCognito: true
          };

          setUser(authUser);
          setCurrentRole(savedRole);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        } catch {
          // Não há usuário Cognito ativo na sessão do Amplify
        }

        // 2. Verifica se há sessão local ativa (ex: Acesso Rápido de demonstração)
        const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredSession;
          setUser(parsed.user);
          setCurrentRole(parsed.currentRole);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Erro ao restaurar sessão:', e);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  // Login com AWS Cognito
  const loginWithCognito = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await signIn({
        username: email.trim(),
        password
      });

      if (response.isSignedIn) {
        const cognitoUser = await getCurrentUser();
        let name = email.split('@')[0];
        try {
          const attributes = await fetchUserAttributes();
          if (attributes.name) name = attributes.name;
        } catch {
          // Atributos adicionais opcionais
        }

        const isValderiAdmin = email.toLowerCase().includes('valderi') || email.toLowerCase().includes('admin');
        const role: UserRole = isValderiAdmin ? 'admin' : 'student';

        const authUser: AuthUser = {
          id: cognitoUser.userId,
          email: email.trim(),
          name,
          isCognito: true
        };

        setUser(authUser);
        setCurrentRole(role);
        setIsAuthenticated(true);
        localStorage.setItem(
          LOCAL_STORAGE_SESSION_KEY,
          JSON.stringify({ user: authUser, currentRole: role })
        );

        return { nextStep: 'DONE' };
      }

      return { nextStep: response.nextStep.signInStep };
    } catch (err: unknown) {
      const friendlyError = translateCognitoError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro de novo usuário no AWS Cognito
  const signUpWithCognito = async (name: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: name.trim()
          }
        }
      });

      return { nextStep: response.nextStep.signUpStep };
    } catch (err: unknown) {
      const friendlyError = translateCognitoError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmação do código de 6 dígitos enviado por e-mail
  const confirmSignUpCode = async (email: string, code: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await confirmSignUp({
        username: email.trim(),
        confirmationCode: code.trim()
      });
    } catch (err: unknown) {
      const friendlyError = translateCognitoError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código de confirmação
  const resendConfirmationCode = async (email: string) => {
    setError(null);
    try {
      await resendSignUpCode({
        username: email.trim()
      });
    } catch (err: unknown) {
      const friendlyError = translateCognitoError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    }
  };

  // Solicitar redefinição de senha
  const requestPasswordReset = async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await resetPassword({
        username: email.trim()
      });
    } catch (err: unknown) {
      const friendlyError = translateCognitoError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar redefinição com código e nova senha
  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await confirmResetPassword({
        username: email.trim(),
        confirmationCode: code.trim(),
        newPassword
      });
    } catch (err: unknown) {
      const friendlyError = translateCognitoError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  // Acesso Rápido para Apresentação Acadêmica / Avaliação
  const loginAsQuickRole = (role: UserRole) => {
    setError(null);
    const demoProfiles: Record<UserRole, { name: string; email: string }> = {
      admin: { name: 'Valderi Gestor', email: 'valderi.gestor@martialcore.ct' },
      instructor: { name: 'Mestre Rodrigo Silva', email: 'rodrigo.silva@martialcore.ct' },
      student: { name: 'Lucas Mendonça', email: 'lucas.atleta@martialcore.ct' },
      visitor: { name: 'Visitante Experimental', email: 'visitante@martialcore.ct' }
    };

    const authUser: AuthUser = {
      id: `quick-${role}`,
      name: demoProfiles[role].name,
      email: demoProfiles[role].email,
      isCognito: false
    };

    setUser(authUser);
    setCurrentRole(role);
    setIsAuthenticated(true);
    localStorage.setItem(
      LOCAL_STORAGE_SESSION_KEY,
      JSON.stringify({ user: authUser, currentRole: role })
    );
  };

  // Simulador de Perfil em Tempo Real (Role Switcher)
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (user) {
      localStorage.setItem(
        LOCAL_STORAGE_SESSION_KEY,
        JSON.stringify({ user, currentRole: role })
      );
    }
  };

  // Logout seguro
  const logout = async () => {
    try {
      if (user?.isCognito) {
        await signOut();
      }
    } catch {
      // Ignora erro no logout do Cognito
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      clearError();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        currentRole,
        isLoading,
        error,
        clearError,
        loginWithCognito,
        signUpWithCognito,
        confirmSignUpCode,
        resendConfirmationCode,
        requestPasswordReset,
        confirmPasswordReset,
        loginAsQuickRole,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
