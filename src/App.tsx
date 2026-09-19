import { useState } from 'react';
import type { ModalityId, UserRole } from './types/martial';
import { ThemeProvider } from './context/ThemeContext';
import { MartialThemeProvider, useMartialTheme } from './context/MartialThemeContext';
import { AmbientAura } from './components/layout/AmbientAura';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ModalityHeroBanner } from './components/layout/ModalityHeroBanner';
import { BottomNavMobile } from './components/layout/BottomNavMobile';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

// Admin Views
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsManagement } from './pages/admin/StudentsManagement';
import { SchedulesManagement } from './pages/admin/SchedulesManagement';
import { FinanceManagement } from './pages/admin/FinanceManagement';
import { ModalitiesSettings } from './pages/admin/ModalitiesSettings';

// Instructor Views
import { AttendanceSheet } from './pages/instructor/AttendanceSheet';
import { TechnicalEvaluation } from './pages/instructor/TechnicalEvaluation';
import { GraduationEligible } from './pages/instructor/GraduationEligible';

// Student Views
import { StudentPortal } from './pages/student/StudentPortal';

// Visitor Views
import { TrialClassBooking } from './pages/visitor/TrialClassBooking';

interface SystemContainerProps {
  currentRole: UserRole;
  onLogout: () => void;
}

function SystemContainer({
  currentRole,
  onLogout
}: SystemContainerProps) {
  const getInitialView = (role: UserRole) => {
    if (typeof window !== 'undefined') {
      const urlView = new URLSearchParams(window.location.search).get('view');
      if (urlView) return urlView;
    }
    switch (role) {
      case 'admin':
        return 'dashboard';
      case 'instructor':
        return 'attendance';
      case 'student':
        return 'progress';
      case 'visitor':
        return 'trial';
    }
  };

  const [activeView, setActiveView] = useState<string>(() => getInitialView(currentRole));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { selectedModality, setSelectedModality } = useMartialTheme();

  // Renderizador da View do Sistema de acordo com o Perfil RBAC ativo
  const renderSystemView = () => {
    if (currentRole === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return (
            <AdminDashboard
              selectedModality={selectedModality}
              onNavigateTab={setActiveView}
            />
          );
        case 'students':
          return <StudentsManagement selectedModality={selectedModality} />;
        case 'schedules':
          return <SchedulesManagement selectedModality={selectedModality} />;
        case 'finance':
          return <FinanceManagement selectedModality={selectedModality} />;
        case 'modalities':
          return <ModalitiesSettings />;
        default:
          return (
            <AdminDashboard
              selectedModality={selectedModality}
              onNavigateTab={setActiveView}
            />
          );
      }
    }

    if (currentRole === 'instructor') {
      switch (activeView) {
        case 'attendance':
          return <AttendanceSheet selectedModality={selectedModality} />;
        case 'evaluations':
          return <TechnicalEvaluation selectedModality={selectedModality} />;
        case 'eligible':
          return <GraduationEligible selectedModality={selectedModality} />;
        default:
          return <AttendanceSheet selectedModality={selectedModality} />;
      }
    }

    if (currentRole === 'student') {
      switch (activeView) {
        case 'progress':
          return <StudentPortal selectedModality={selectedModality} />;
        case 'schedules':
          return <SchedulesManagement selectedModality={selectedModality} />;
        case 'invoices':
          return <FinanceManagement selectedModality={selectedModality} />;
        default:
          return <StudentPortal selectedModality={selectedModality} />;
      }
    }

    if (currentRole === 'visitor') {
      switch (activeView) {
        case 'trial':
          return <TrialClassBooking selectedModality={selectedModality} />;
        case 'explore':
          return <ModalitiesSettings />;
        default:
          return <TrialClassBooking selectedModality={selectedModality} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300 relative">
      {/* Luz Atmosférica Dinâmica por Arte Marcial */}
      <AmbientAura />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header da Aplicação com Navegação por Modalidades, Toggle de Tema e Sair */}
        <Navbar
          currentRole={currentRole}
          selectedModality={selectedModality}
          onSelectModality={setSelectedModality}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogout={onLogout}
        />

        {/* Layout Principal: Sidebar + Conteúdo da Tela */}
        <div className="flex-1 flex">
          <Sidebar
            currentRole={currentRole}
            activeView={activeView}
            onSelectView={setActiveView}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onLogout={onLogout}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden pb-24 md:pb-12">
            {/* Banner de Ambientação da Modalidade Ativa */}
            <ModalityHeroBanner
              selectedModality={selectedModality}
              onClearFilter={() => setSelectedModality('all')}
            />

            {/* View do Módulo Ativo */}
            {renderSystemView()}
          </main>
        </div>

        {/* Navegação Inferior Otimizada para Mobile (Bottom Navigation) */}
        <BottomNavMobile
          currentRole={currentRole}
          activeView={activeView}
          onSelectView={setActiveView}
        />
      </div>
    </div>
  );
}

export default function App() {
  const getUrlParams = () => {
    if (typeof window === 'undefined') return { modality: 'all' as const, isAuth: false, isModalOpen: false, role: 'admin' as const };
    const params = new URLSearchParams(window.location.search);
    const role = (params.get('role') as UserRole) || 'admin';
    const hasRole = Boolean(params.get('role'));
    const isAuth = hasRole || params.get('auth') === 'true';
    const isModalOpen = params.get('modal') === 'auth' || params.get('auth') === 'open';
    const modality = (params.get('modality') as ModalityId | 'all') || 'all';
    return { modality, isAuth, isModalOpen, role };
  };

  const initialParams = getUrlParams();
  const [selectedModality, setSelectedModality] = useState<ModalityId | 'all'>(initialParams.modality);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialParams.isAuth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(initialParams.isModalOpen);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialParams.role);

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <MartialThemeProvider
        selectedModality={selectedModality}
        setSelectedModality={setSelectedModality}
      >
        {!isAuthenticated ? (
          <>
            <LandingPage onOpenAuthModal={() => setIsAuthModalOpen(true)} />
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onLogin={handleLogin}
            />
          </>
        ) : (
          <SystemContainer
            currentRole={currentRole}
            onLogout={handleLogout}
          />
        )}
      </MartialThemeProvider>
    </ThemeProvider>
  );
}