import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MartialCoreLogo } from '../ui/MartialCoreLogo';
import { validateEmail, sanitizeInput } from '../../utils/security';
import {
  X,
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  User,
  UserPlus
} from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              type?: 'standard' | 'icon';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            }
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'confirm' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const {
    loginWithCognito,
    loginWithGoogle,
    signUpWithCognito,
    confirmSignUpCode,
    resendConfirmationCode,
    requestPasswordReset,
    confirmPasswordReset,
    clearError
  } = useAuth();

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleClose = () => {
    clearError();
    setLocalError(null);
    setLocalSuccess(null);
    onClose();
  };

  // Inicialização do Google Identity Services (OAuth 2.0 / JWT)
  useEffect(() => {
    if (!isOpen || (mode !== 'signin' && mode !== 'signup')) return;

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '403405116649-odotca7r4cqpno60db71raddjfehafas.apps.googleusercontent.com';

    const setupGoogle = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: { credential: string }) => {
              if (response.credential) {
                try {
                  setIsSubmitting(true);
                  await loginWithGoogle(response.credential);
                  handleClose();
                  if (onSuccess) onSuccess();
                } catch (err: unknown) {
                  setLocalError(
                    err instanceof Error ? err.message : 'Falha ao autenticar com o Google.'
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }
            }
          });

          // Limpa qualquer botão renderizado anteriormente antes de injetar
          googleButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: 320
          });
        } catch (e) {
          console.warn('Google Identity Services ainda não disponível:', e);
        }
      }
    };

    // Tenta renderizar imediatamente ou aguarda carregar o script
    setupGoogle();
    const timer = setInterval(() => {
      if (window.google?.accounts?.id && googleButtonRef.current?.children.length === 0) {
        setupGoogle();
      }
    }, 400);

    return () => clearInterval(timer);
  }, [isOpen, mode]);

  // 1. Login com AWS Cognito
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    const cleanEmail = sanitizeInput(email);
    if (!validateEmail(cleanEmail)) {
      setLocalError('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setLocalError('A senha de acesso deve conter no mínimo 6 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await loginWithCognito(cleanEmail, password);
      if (res?.nextStep === 'CONFIRM_SIGN_UP') {
        setMode('confirm');
        setLocalSuccess('Conta ainda não verificada. Insira o código enviado para seu e-mail.');
      } else {
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao autenticar com o AWS Cognito.';
      setLocalError(msg);
      if (msg.includes('não foi confirmada')) {
        setMode('confirm');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Cadastro de Novo Usuário no AWS Cognito
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);

    if (cleanName.length < 3) {
      setLocalError('Informe o nome completo do atleta ou instrutor.');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setLocalError('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (password.length < 8) {
      setLocalError('A senha deve ter no mínimo 8 caracteres (com letras maiúsculas, minúsculas e números).');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUpWithCognito(cleanName, cleanEmail, password);
      setLocalSuccess(`Código de 6 dígitos enviado para ${cleanEmail}!`);
      setMode('confirm');
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Falha ao realizar cadastro no Cognito.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Confirmação do Código de 6 dígitos
  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    const cleanEmail = sanitizeInput(email);
    const cleanCode = sanitizeInput(code).trim();

    if (!cleanCode || cleanCode.length < 4) {
      setLocalError('Insira o código de confirmação recebido.');
      return;
    }

    try {
      setIsSubmitting(true);
      await confirmSignUpCode(cleanEmail, cleanCode);
      setLocalSuccess('Conta ativada com sucesso no AWS Cognito! Faça seu login.');
      setMode('signin');
      setCode('');
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Código de verificação incorreto ou expirado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Reenviar Código
  const handleResendCode = async () => {
    setLocalError(null);
    try {
      await resendConfirmationCode(sanitizeInput(email));
      setLocalSuccess('Novo código enviado para seu e-mail!');
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao reenviar código.');
    }
  };

  // 5. Esqueci a Senha
  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    const cleanEmail = sanitizeInput(email);
    if (!validateEmail(cleanEmail)) {
      setLocalError('Informe o endereço de e-mail cadastrado.');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(cleanEmail);
      setLocalSuccess(`Código de segurança enviado para ${cleanEmail}.`);
      setForgotStep(2);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao solicitar recuperação de senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    const cleanEmail = sanitizeInput(email);
    const cleanCode = sanitizeInput(code).trim();

    if (cleanCode.length < 4) {
      setLocalError('Insira o código recebido no e-mail.');
      return;
    }
    if (newPassword.length < 8) {
      setLocalError('A nova senha deve conter no mínimo 8 caracteres.');
      return;
    }

    try {
      setIsSubmitting(true);
      await confirmPasswordReset(cleanEmail, cleanCode, newPassword);
      setLocalSuccess('Senha alterada com sucesso! Faça login com a nova senha.');
      setMode('signin');
      setPassword('');
      setNewPassword('');
      setCode('');
      setForgotStep(1);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Falha ao redefinir senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Topo do Modal */}
        <div className="flex items-center gap-3">
          <MartialCoreLogo size="md" isMonochrome={true} />
        </div>

        {/* Mensagens de Feedback */}
        {localError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError}</span>
          </div>
        )}
        {localSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{localSuccess}</span>
          </div>
        )}

        {/* Alternador Principal: Entrar vs Criar Conta */}
        {mode !== 'confirm' && mode !== 'forgot' && (
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setLocalError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setLocalError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>
        )}

        {/* 1. MODO: ENTRAR (AWS COGNITO) */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="valderi.neto@alunos.ufersa.edu.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setForgotStep(1);
                    setLocalError(null);
                  }}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Autenticando no Cognito...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Cockpit</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center pt-2">
              Autenticação segura via <strong>AWS Cognito User Pool</strong>
            </p>

            {/* Divisor Visual para Google OAuth */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full absolute" />
              <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 relative uppercase tracking-wider">
                ou entrar com
              </span>
            </div>

            {/* Botão Oficial do Google Identity Services (Renderizado pelo SDK da Google) */}
            <div className="flex flex-col items-center justify-center gap-1.5 w-full pt-1 pb-1">
              <div ref={googleButtonRef} className="flex justify-center w-full min-h-[44px]" />
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center">
                OAuth 2.0 • Emissão e assinatura oficial de JWT pela Google
              </span>
            </div>
          </form>
        )}

        {/* 2. MODO: CRIAR CONTA (AWS COGNITO) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Nome do Atleta ou Avaliador"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                E-mail (Receberá código de confirmação)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                Senha Segura (Mínimo 8 dígitos)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Maiúsculas, minúsculas e números"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">
                Exigência da AWS: mínimo 8 caracteres com letras e números.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cadastrando no Cognito...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Criar Minha Conta</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. MODO: CONFIRMAR CÓDIGO DE 6 DÍGITOS */}
        {mode === 'confirm' && (
          <form onSubmit={handleConfirmCode} className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Verificação de E-mail
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Insira o código de segurança de 6 dígitos que o AWS Cognito enviou para:
              </p>
              <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold block">
                {email || 'seu e-mail'}
              </span>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                Código de Confirmação (6 dígitos)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white font-mono tracking-widest text-center text-base focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando Código...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar e Ativar Conta</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Reenviar novo código
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setLocalError(null);
                }}
                className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                Voltar ao login
              </button>
            </div>
          </form>
        )}

        {/* 4. MODO: RECUPERAR SENHA (FORGOT PASSWORD) */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Redefinir Senha de Acesso
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                {forgotStep === 1
                  ? 'Informe seu e-mail para receber o código de segurança da AWS.'
                  : `Informe o código enviado para ${email} e crie sua nova senha.`}
              </p>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Seu E-mail Cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando Código...</span>
                    </>
                  ) : (
                    <span>Enviar Código de Redefinição</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPasswordConfirm} className="space-y-4">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Código de 6 dígitos
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white font-mono tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Nova Senha (Mínimo 8 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nova senha segura"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Salvando Nova Senha...</span>
                    </>
                  ) : (
                    <span>Salvar Nova Senha</span>
                  )}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setForgotStep(1);
                setLocalError(null);
              }}
              className="w-full text-center text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer pt-1"
            >
              Voltar ao Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
