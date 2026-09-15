import { useState } from 'react';
import type { ModalityId, UserRole } from './types/martial';
import { RoleSimulatorBar } from './components/layout/RoleSimulatorBar';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';

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

export default function App() {
  const [isLandingActive, setIsLandingActive] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [selectedModality, setSelectedModality] = useState<ModalityId | 'all'>('all');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Ajusta a view inicial ao trocar de perfil
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    switch (role) {
      case 'admin':
        setActiveView('dashboard');
        break;
      case 'instructor':
        setActiveView('attendance');
        break;
      case 'student':
        setActiveView('progress');
        break;
      case 'visitor':
        setActiveView('trial');
        break;
    }
  };

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Barra Flutuante de Simulação de Perfis (Ideal para apresentação e testes) */}
      <RoleSimulatorBar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isLandingActive={isLandingActive}
        onToggleLanding={setIsLandingActive}
      />

      {/* 2. Visualização da Landing Page ou Sistema */}
      {isLandingActive ? (
        <LandingPage onEnterApp={() => setIsLandingActive(false)} />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header da Aplicação */}
          <Navbar
            currentRole={currentRole}
            selectedModality={selectedModality}
            onSelectModality={setSelectedModality}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onGoToLanding={() => setIsLandingActive(true)}
          />

          {/* Layout Principal: Sidebar + Conteúdo da Tela */}
          <div className="flex-1 flex">
            <Sidebar
              currentRole={currentRole}
              activeView={activeView}
              onSelectView={setActiveView}
              isOpenMobile={isMobileMenuOpen}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />

            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
              {renderSystemView()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}