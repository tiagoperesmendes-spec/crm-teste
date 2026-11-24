"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { UserRole, getRolePermissions } from "@/lib/supabase/roles";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openTasksCount?: number;
  openProjectsCount?: number;
  journalistsCount?: number;
  outletsCount?: number;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openTasksCount = 20,
  openProjectsCount = 6,
  journalistsCount = 20,
  outletsCount = 10,
  isCollapsed = false,
  setIsCollapsed,
  userRole = "director",
  userName = "Leonor Rodrigues",
  userEmail = "tiagoperesmendes@gmail.com",
  onSignOut,
}) => {
  const perms = getRolePermissions(userRole);

  const mainItems = [
    { id: "dashboard", label: "Painel", icon: LayoutDashboard },
    { id: "projects", label: "Projetos", icon: FolderKanban, badge: openProjectsCount },
    { id: "tasks", label: "Tarefas", icon: CheckSquare, badge: openTasksCount },
  ];

  const databaseItems = [
    { id: "journalists", label: "Jornalistas", icon: Users, badge: journalistsCount },
    { id: "outlets", label: "Meios", icon: Building2, badge: outletsCount },
  ];

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "TM";

  return (
    <aside
      className={`bg-[#FBF9F6]/95 backdrop-blur-md border-r border-[#E4DDD3] transition-all duration-200 select-none flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen md:max-h-screen ${
        isCollapsed ? "w-16 p-2" : "w-64 p-4"
      } z-40`}
    >
      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        {/* Topo: Marca MODO & Botão de Recolher */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 overflow-hidden">
            {!isCollapsed ? (
              <img
                src="/logo-modo.png"
                alt="MODO Agência de Comunicação"
                className="h-7 max-w-[155px] object-contain mix-blend-multiply"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs shadow-xs font-title shrink-0">
                M
              </div>
            )}
          </div>
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-[#6B6B6B] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#F6F2EC] transition-colors cursor-pointer"
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* 1. Navegação Principal: Painel, Projetos, Tarefas */}
        <nav className="space-y-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1A1A1A] font-medium shadow-xs border border-[#E4DDD3]/70"
                    : "text-[#1A1A1A] font-normal hover:bg-[#F6F2EC]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#6C1C37]" : "text-[#8A8A8A]"}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge !== undefined && (
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#E9E5E0] text-[#5C554E]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 2. BASES DE DADOS: Jornalistas, Meios */}
        <div className="space-y-1 pt-4 border-t border-[#E4DDD3]">
          {!isCollapsed && (
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A] px-2 mb-2">
              Bases de Dados
            </p>
          )}
          {databaseItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1A1A1A] font-medium shadow-xs border border-[#E4DDD3]/70"
                    : "text-[#1A1A1A] font-normal hover:bg-[#F6F2EC]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#6C1C37]" : "text-[#8A8A8A]"}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge !== undefined && (
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#E9E5E0] text-[#5C554E]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Zona de Utilizador no Canto Inferior: Nome, Posição e Logout com Ícone */}
      <div className="pt-4 border-t border-[#E4DDD3] shrink-0 mt-auto">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-2xl bg-white border border-[#E4DDD3] flex items-center justify-between shadow-2xs hover:border-[#6C1C37]/30 transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#9E4A28] text-white flex items-center justify-center text-xs font-semibold shrink-0 font-title shadow-2xs">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#1A1A1A] block truncate">{userName}</span>
                <span className="text-[11px] text-[#8C827A] block truncate">
                  {perms.fullTitle || perms.label}
                </span>
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-[#8A8A8A] hover:text-[#A3281E] p-1.5 rounded-lg hover:bg-[#F6F2EC] transition-colors cursor-pointer shrink-0"
                title="Terminar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-[#9E4A28] text-white flex items-center justify-center text-xs font-semibold font-title shadow-2xs"
              title={`${userName} (${perms.label})`}
            >
              {initials}
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-[#8A8A8A] hover:text-[#A3281E] p-1.5 rounded-lg hover:bg-[#F6F2EC] transition-colors cursor-pointer"
                title="Terminar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
