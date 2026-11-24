"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import TasksTable from "@/components/TasksTable";
import ContactsList from "@/components/ContactsList";
import TaskDetailDrawer from "@/components/TaskDetailDrawer";
import ProjectDetailView from "@/components/ProjectDetailView";
import ContactsView from "@/components/ContactsView";
import ClippingView from "@/components/ClippingView";
import AnalyticsResponseView from "@/components/AnalyticsResponseView";
import JournalistsView from "@/components/JournalistsView";
import OutletsView from "@/components/OutletsView";
import {
  initialMetrics,
  sampleTasks,
  sampleProjects,
  sampleDailyContacts,
  sampleJournalists,
  sampleMediaOutlets,
  sampleClippings,
} from "@/lib/mock-data";
import { Task, Project, DailyContact, Journalist, TaskPriority, ContactStatus } from "@/types/pr-crm";
import { UserRole } from "@/lib/supabase/roles";
import { FolderKanban, Plus, ExternalLink, Calendar, Users, ArrowLeft, Filter, CheckCircle2, Sparkles, Bell, Search } from "lucide-react";

export default function PRCRMDashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeTaskFilter, setActiveTaskFilter] = useState<string>("all");
  const [activeContactFilter, setActiveContactFilter] = useState<string>("all");
  const [dashTaskFilter, setDashTaskFilter] = useState<"today" | "overdue" | "all">("today");
  const [dashContactFilter, setDashContactFilter] = useState<"all" | "pending">("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>("director");

  // Estados dos Dados Centrais
  const [metrics, setMetrics] = useState(initialMetrics);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [contacts, setContacts] = useState<DailyContact[]>(sampleDailyContacts);
  const [clippings, setClippings] = useState(sampleClippings);
  const [journalists, setJournalists] = useState<Journalist[]>(sampleJournalists);
  const [outlets, setOutlets] = useState<MediaOutlet[]>(sampleMediaOutlets);

  // Gaveta de Detalhes da Tarefa
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Suporte a Histórico do Navegador (Corrige o botão de recuar do browser que ficava cinzento)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
        if (event.state.projectId) {
          setSelectedProjectId(event.state.projectId);
        } else {
          setSelectedProjectId(null);
        }
      } else {
        setActiveTab("dashboard");
        setSelectedProjectId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (tab: string, filter?: string, projId?: string) => {
    setActiveTab(tab);
    if (filter) {
      if (tab === "tasks") setActiveTaskFilter(filter);
      if (tab === "contacts") setActiveContactFilter(filter);
    }
    if (projId) {
      setSelectedProjectId(projId);
    } else if (tab !== "project_detail") {
      setSelectedProjectId(null);
    }

    // Regista no histórico do browser para ativar as setas de navegação
    try {
      window.history.pushState({ tab, filter, projectId: projId || null }, "", `#${tab}`);
    } catch {
      // Ignora erro em ambientes sem suporte
    }
  };

  // Ações de Tarefas
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "completed" ? "pending" : "completed";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleUpdateTaskPriority = (taskId: string, priority: TaskPriority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority } : t))
    );
  };

  const handleOpenTaskDetail = (taskId: string) => {
    const t = tasks.find((item) => item.id === taskId) || null;
    setSelectedTask(t);
    setIsDrawerOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
  };

  // Ações de Contactos
  const handleUpdateContactStatus = (contactId: string, status: ContactStatus) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status } : c))
    );
  };

  const handleAddNewContact = (newContact: Partial<DailyContact>) => {
    const item: DailyContact = {
      id: "cnt-" + Date.now(),
      contact_name: newContact.contact_name || "Jornalista",
      outlet_name: newContact.outlet_name || "Geral",
      contact_type: newContact.contact_type || "email",
      status: newContact.status || "enviado",
      subject_or_notes: newContact.subject_or_notes || "Contacto de seguimento",
      contact_date: newContact.contact_date || new Date().toISOString().split("T")[0],
      contact_time: newContact.contact_time || "10:00",
    };
    setContacts([item, ...contacts]);
  };

  // Ação de Projetos
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  // Título e Subtítulo dinâmico da página
  const getPageInfo = () => {
    switch (activeTab) {
      case "tasks":
        return { title: "O Que Tenho Para Fazer", subtitle: "Prioridades, entregas críticas e prazos de resposta." };
      case "projects":
        return { title: "Projetos em Aberto", subtitle: "Acompanhamento de campanhas, lançamentos e relações institucionais." };
      case "project_detail":
        const currentProj = projects.find((p) => p.id === selectedProjectId);
        return { title: currentProj ? currentProj.name : "Dossiê do Projeto", subtitle: "Gestão integrada de tarefas, contactos e cobertura mediática." };
      case "contacts":
        return { title: "Diário de Contactos", subtitle: "Histórico de contactos, acompanhamento de pautas e registo de retorno." };
      case "clipping":
        return { title: "Clipping de Imprensa", subtitle: "Cobertura mediática, valor publicitário equivalente (AVE) e sentimento." };
      case "analytics":
        return { title: "Taxas de Resposta & Eficácia", subtitle: "Métricas quantitativas de resposta por canal e consultor." };
      case "journalists":
        return { title: "Base de Dados de Jornalistas", subtitle: "Registo de contactos, áreas de intervenção e OCS associados." };
      case "outlets":
        return { title: "Órgãos de Comunicação Social (OCS)", subtitle: "Registo de redações, moradas, grupos de media e registo ERC." };
      default:
        return { title: "Dashboard", subtitle: undefined };
    }
  };

  const pageInfo = getPageInfo();
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Filtro dinâmico para a lista de tarefas
  const getFilteredTasks = () => {
    if (activeTaskFilter === "today") {
      return tasks.filter((t) => t.due_date === "2026-11-17" || t.status !== "completed");
    }
    if (activeTaskFilter === "overdue") {
      return tasks.filter((t) => t.status !== "completed" && t.priority === "urgente");
    }
    if (activeTaskFilter === "week") {
      return tasks.filter((t) => t.status !== "completed");
    }
    return tasks;
  };

  return (
    <div className="flex min-h-screen bg-[#EDE6DE]">
      {/* Barra Lateral Retrátil */}
      <Sidebar
        activeTab={activeTab === "project_detail" ? "projects" : activeTab}
        setActiveTab={(tab) => navigateTo(tab)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        openTasksCount={tasks.filter((t) => t.status !== "completed").length}
        openProjectsCount={projects.filter((p) => p.status !== "completed").length}
        userRole={userRole}
        userName="Leonor Rodrigues"
        userEmail="tiagoperesmendes@gmail.com"
        onNewTaskClick={() => {
          const newTask: Task = {
            id: "task-" + Date.now(),
            title: "Nova Tarefa Institucional",
            project_name: "Geral",
            priority: "normal",
            due_date: new Date().toISOString().split("T")[0],
            status: "pending",
          };
          setTasks([newTask, ...tasks]);
          setSelectedTask(newTask);
          setIsDrawerOpen(true);
        }}
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          userRole={userRole}
          userName="Leonor Rodrigues"
          userEmail="tiagoperesmendes@gmail.com"
        />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Seletor Rápido de Papel (Para teste de permissões RBAC na barra de topo) */}
          <div className="flex items-center justify-between text-xs bg-white/60 p-2.5 rounded-xl border border-[#E4DDD3]">
            <span className="text-[#6B6B6B] font-medium">Testar Permissões (RBAC):</span>
            <div className="flex gap-1.5">
              {(["director", "press_officer", "junior", "viewer"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    userRole === r
                      ? "bg-[#6C1C37] text-white shadow-xs"
                      : "bg-white text-[#1A1A1A] hover:bg-[#F6F2EC] border border-[#E4DDD3]"
                  }`}
                >
                  {r === "director" ? "Diretor" : r === "press_officer" ? "Assessor" : r === "junior" ? "Técnico" : "Observador"}
                </button>
              ))}
            </div>
          </div>

                    {/* VISTA 1: DASHBOARD EXECUTIVO */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 fade-in">
              {/* TOPO: SAUDAÇÃO & LINHA DE RESUMO */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight">
                    Bom dia, Tiago
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
                    5 tarefas para hoje · <span className="text-[#A3281E] font-medium">2 em atraso</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-60 sm:w-72">
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      className="w-full bg-white/95 border border-[#E4DDD3] rounded-xl pl-9 pr-12 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-2xs"
                    />
                    <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
                    <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-mono text-[#8A8A8A] bg-[#F6F2EC] border border-[#E4DDD3] rounded">⌘K</kbd>
                  </div>

                  <button
                    onClick={() => {
                      const newTask: Task = {
                        id: "task-" + Date.now(),
                        title: "Nova Tarefa Institucional",
                        project_name: "Geral",
                        priority: "normal",
                        due_date: new Date().toISOString().split("T")[0],
                        status: "pending",
                      };
                      setTasks([newTask, ...tasks]);
                      setSelectedTask(newTask);
                      setIsDrawerOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>+ Nova Tarefa</span>
                  </button>
                  <button
                    onClick={() => navigateTo("contacts")}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] bg-white border border-[#E4DDD3] hover:border-[#6C1C37]/50 shadow-2xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>+ Registar Contacto</span>
                  </button>
                </div>
              </div>

              {/* LINHA DE 4 CARTÕES (NÚMERO GRANDE + LEGENDA PEQUENA) */}
              <MetricCards
                metrics={metrics}
                onNavigate={(tab, filter) => navigateTo(tab, filter)}
              />

              {/* ABAIXO: DUAS COLUNAS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* COLUNA ESQUERDA (7 COLS): PARA FAZER HOJE & EM ATRASO OU EM RISCO */}
                <div className="lg:col-span-7 space-y-6">
                  {/* 1. PARA FAZER HOJE */}
                  <section className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                      <div>
                        <h3 className="text-base font-semibold text-[#1A1A1A] font-title">Para fazer hoje</h3>
                        <p className="text-[11px] text-[#6B6B6B] mt-0.5">Ordenado cronologicamente por prazo de entrega</p>
                      </div>
                      <button
                        onClick={() => navigateTo("tasks", "today")}
                        className="text-xs font-medium text-[#6C1C37] hover:underline cursor-pointer"
                      >
                        Ver todas no gestor &rarr;
                      </button>
                    </div>

                    {/* Lista com Checkbox, Tarefa, Cliente, Prazo, Responsável */}
                    <div className="divide-y divide-[#E4DDD3]/60">
                      {[
                        { id: "sample-t-1", title: "Rever comunicado de imprensa ibérico", client: "Grupo M", due: "11:00", overdue: true, initials: "LR", avatarBg: "bg-[#6C1C37]", name: "Leonor Rodrigues", done: false },
                        { id: "sample-t-2", title: "Follow-up telefónico com Marta Figueiredo (Público)", client: "GreenVolt", due: "12:00", overdue: true, initials: "TM", avatarBg: "bg-[#1A1A1A]", name: "Tiago Mendes", done: false },
                        { id: "sample-t-3", title: "Validar draft de anúncio executivo Q4", client: "Banco Atlântico", due: "14:30", overdue: false, initials: "RV", avatarBg: "bg-[#B85D3B]", name: "Rita Valente", done: false },
                        { id: "sample-t-4", title: "Alinhar briefing e Q&A com porta-voz oficial", client: "TechFin Ibéria", due: "16:00", overdue: false, initials: "CS", avatarBg: "bg-[#2F6B3A]", name: "Carlos Silva", done: false },
                        { id: "sample-t-5", title: "Enviar dossier mediático para a RTP", client: "Lusitânia Saúde", due: "17:30", overdue: false, initials: "HR", avatarBg: "bg-[#805B00]", name: "Helena Ramos", done: false },
                      ].map((task) => (
                        <div
                          key={task.id}
                          className="py-3 flex items-center justify-between gap-3 group hover:bg-[#F6F2EC]/60 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
                          onClick={() => handleOpenTaskDetail(task.id)}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTaskStatus(task.id);
                              }}
                              className={w-4 h-4 rounded-full  flex items-center justify-center shrink-0 transition-colors cursor-pointer}
                              title={task.done ? "Reabrir tarefa" : "Marcar como concluída"}
                            >
                              {task.done && (
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>

                            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span
                                className={	ext-xs  truncate group-hover:text-[#6C1C37] transition-colors}
                                title={task.title}
                              >
                                {task.title}
                              </span>
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F6F2EC] text-[#6B6B6B] border border-[#E4DDD3]/60 truncate shrink-0 max-w-[140px]">
                                {task.client}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className={	ext-xs font-mono font-medium  min-w-[42px] text-right}>
                              {task.due}
                            </span>
                            <div
                              className={w-6 h-6 rounded-full  text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title shadow-2xs}
                              title={task.name}
                            >
                              {task.initials}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between text-xs">
                      <span className="text-[#8A8A8A] text-[11px]">
                        5 tarefas agendadas para hoje · <span className="text-[#A3281E] font-medium">2 em atraso</span>
                      </span>
                      <button
                        onClick={() => {
                          const newTask: Task = {
                            id: "task-" + Date.now(),
                            title: "Nova Tarefa Institucional",
                            project_name: "Geral",
                            priority: "normal",
                            due_date: new Date().toISOString().split("T")[0],
                            status: "pending",
                          };
                          setTasks([newTask, ...tasks]);
                          setSelectedTask(newTask);
                          setIsDrawerOpen(true);
                        }}
                        className="font-medium text-[#6C1C37] hover:underline cursor-pointer"
                      >
                        + Nova Tarefa
                      </button>
                    </div>
                  </section>

                  {/* 2. EM ATRASO OU EM RISCO */}
                  <section className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                      <div>
                        <h3 className="text-base font-semibold text-[#1A1A1A] font-title">Em atraso ou em risco</h3>
                        <p className="text-[11px] text-[#6B6B6B] mt-0.5">Projetos com prazo crítico (&lt; 3 dias) ou sem movimento recente</p>
                      </div>
                      <button
                        onClick={() => navigateTo("projects")}
                        className="text-xs font-medium text-[#6C1C37] hover:underline cursor-pointer"
                      >
                        Ver todos os projetos &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          id: "proj-risk-1",
                          name: "Lançamento Plataforma ESG",
                          client: "GreenVolt",
                          deadlineInfo: "Prazo: amanhã (23 nov)",
                          statusLabel: "Prazo crítico (<24h)",
                          statusClass: "bg-[#FDF6F5] text-[#A3281E] border-[#F6D9D5]",
                          progress: 85,
                        },
                        {
                          id: "proj-risk-2",
                          name: "Relatório Anual Integrado",
                          client: "Banco Atlântico",
                          deadlineInfo: "Última ação há 6 dias",
                          statusLabel: "Sem movimento há 6 dias",
                          statusClass: "bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]",
                          progress: 40,
                        },
                        {
                          id: "proj-risk-3",
                          name: "Ronda Série B FinTech",
                          client: "TechFin Ibéria",
                          deadlineInfo: "Prazo: 25 nov (3 dias)",
                          statusLabel: "Aprovações pendentes",
                          statusClass: "bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]",
                          progress: 65,
                        },
                        {
                          id: "proj-risk-4",
                          name: "Campanha Prevenção Cardiovascular",
                          client: "Lusitânia Saúde",
                          deadlineInfo: "Prazo: 26 nov (4 dias)",
                          statusLabel: "Feedback em falta",
                          statusClass: "bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]",
                          progress: 50,
                        },
                      ].map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => navigateTo("projects")}
                          className="p-3.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 hover:border-[#6C1C37]/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                                {proj.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-[#6B6B6B] truncate">{proj.client}</span>
                                <span className="text-[#D1C7BA] text-[10px]">•</span>
                                <span className="text-[10px] text-[#8A8A8A] truncate">{proj.deadlineInfo}</span>
                              </div>
                            </div>
                            <span className={inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 }>
                              {proj.statusLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-full bg-[#E4DDD3]/50 rounded-full h-1.5 overflow-hidden flex-1">
                              <div className="bg-[#6C1C37] h-1.5 rounded-full" style={{ width: ${proj.progress}% }} />
                            </div>
                            <span className="text-[10px] font-mono text-[#8A8A8A] shrink-0 font-medium">{proj.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* COLUNA DIREITA (5 COLS): PRÓXIMOS 7 DIAS, SEM CONTACTO HÁ +15 DIAS, ATIVIDADE RECENTE */}
                <div className="lg:col-span-5 space-y-6">
                  {/* 1. PRÓXIMOS 7 DIAS (AGENDA) */}
                  <section className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                      <h3 className="text-base font-semibold text-[#1A1A1A] font-title">Próximos 7 dias</h3>
                      <span className="text-xs text-[#8A8A8A]">Agenda da agência</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { day: "23", month: "NOV", title: "Entrevista CEO — Expresso", detail: "10:30 · Sede, Lisboa · Briefing preparado" },
                        { day: "25", month: "NOV", title: "Conferência de Imprensa: Hospital Lusíadas", detail: "11:00 · Hotel Tivoli, Lisboa" },
                        { day: "27", month: "NOV", title: "Embargo: Estudo de Sustentabilidade", detail: "09:00 · 18 jornalistas com acesso" },
                        { day: "28", month: "NOV", title: "Almoço Editorial com Direção do ECO", detail: "13:00 · Clube de Jornalistas" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => navigateTo("tasks")}
                          className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FBF9F6] transition-colors cursor-pointer group"
                        >
                          <div className="w-11 h-12 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] flex flex-col items-center justify-center shrink-0 group-hover:border-[#6C1C37]/40 transition-colors">
                            <span className="text-[9px] uppercase font-bold text-[#8A8A8A] leading-none">{item.month}</span>
                            <span className="text-sm font-bold text-[#1A1A1A] leading-tight">{item.day}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-[#6B6B6B] mt-0.5 truncate">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 2. SEM CONTACTO HÁ +15 DIAS */}
                  <section className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                      <h3 className="text-base font-semibold text-[#1A1A1A] font-title">Sem contacto há +15 dias</h3>
                      <span className="text-xs text-[#8A8A8A]">Atenção relacional</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: "BioPharma Portugal", lastContact: "04 nov (há 18 dias)", alertColor: "text-[#805B00]" },
                        { name: "Logística Urbana SA", lastContact: "28 out (há 25 dias)", alertColor: "text-[#A3281E]" },
                        { name: "Câmara de Comércio Luso-Francesa", lastContact: "01 nov (há 21 dias)", alertColor: "text-[#805B00]" },
                        { name: "Inovação & Retalho Ibérico", lastContact: "05 nov (há 17 dias)", alertColor: "text-[#805B00]" },
                      ].map((client, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#1A1A1A] truncate">{client.name}</h4>
                            <p className={	ext-[11px]  mt-0.5}>Último contacto: {client.lastContact}</p>
                          </div>
                          <button
                            onClick={() => navigateTo("contacts")}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] transition-colors shrink-0 cursor-pointer shadow-2xs"
                          >
                            Contactar
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. ATIVIDADE RECENTE */}
                  <section className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                      <h3 className="text-base font-semibold text-[#1A1A1A] font-title">Atividade recente</h3>
                      <span className="text-xs text-[#8A8A8A]">Últimas 5 ações</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { initials: "RV", bg: "bg-[#B85D3B]", author: "Rita Valente", action: "registou contacto com Marta Figueiredo (Público)", time: "há 12 min" },
                        { initials: "TM", bg: "bg-[#1A1A1A]", author: "Tiago Mendes", action: "concluiu a tarefa \"Aprovação de nota de imprensa Q4\"", time: "há 34 min" },
                        { initials: "LR", bg: "bg-[#6C1C37]", author: "Leonor Rodrigues", action: "enviou pitch a Rui Almeida (Expresso)", time: "há 1h" },
                        { initials: "CS", bg: "bg-[#2F6B3A]", author: "Carlos Silva", action: "agendou reunião com Direção do ECO", time: "há 2h" },
                        { initials: "MF", bg: "bg-[#805B00]", author: "Marta Figueiredo", action: "respondeu ao pitch \"Inovação Verde\"", time: "há 3h" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <div className={w-7 h-7 rounded-full  text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title}>
                            {item.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[#1A1A1A] leading-snug">
                              <span className="font-semibold">{item.author}</span> {item.action}
                            </p>
                            <span className="text-[10px] text-[#8A8A8A] block mt-0.5">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: TAREFAS */}

          {activeTab === "tasks" && (
            <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 shadow-card space-y-4 fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4DDD3]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo("dashboard")}
                    className="p-1.5 rounded-lg border border-[#E4DDD3] bg-white hover:bg-[#F6F2EC] text-[#1A1A1A]"
                    title="Voltar ao Dashboard"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Todas as Entregas de Imprensa</h3>
                    <p className="text-[11px] text-[#6B6B6B]">Total: {tasks.length} tarefas registadas</p>
                  </div>
                </div>

                {/* Filtros Rápidos de Tarefas */}
                <div className="flex gap-1.5 bg-[#EDE6DE]/50 p-1 rounded-xl">
                  {[
                    { id: "all", label: "Todas" },
                    { id: "today", label: "Para Hoje" },
                    { id: "overdue", label: "Em Atraso" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveTaskFilter(f.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                        activeTaskFilter === f.id
                          ? "bg-white text-[#1A1A1A] shadow-xs"
                          : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <TasksTable
                tasks={getFilteredTasks()}
                onToggleStatus={handleToggleTaskStatus}
                onOpenDetail={handleOpenTaskDetail}
                onUpdatePriorityInline={handleUpdateTaskPriority}
                canEdit={userRole === "director" || userRole === "press_officer"}
              />
            </div>
          )}

          {/* VISTA 3: PROJETOS (GALERIA & TABELA) */}
          {activeTab === "projects" && (
            <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 shadow-card space-y-4 fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo("dashboard")}
                    className="p-1.5 rounded-lg border border-[#E4DDD3] bg-white hover:bg-[#F6F2EC] text-[#1A1A1A]"
                    title="Voltar ao Dashboard"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Dossiês de Campanha &amp; Projetos</h3>
                    <p className="text-[11px] text-[#6B6B6B]">{projects.length} projetos em acompanhamento</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => navigateTo("project_detail", undefined, proj.id)}
                    className="p-4 rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white hover:border-[#6C1C37]/40 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-[#1A1A1A] font-title group-hover:text-[#6C1C37] transition-colors">
                            {proj.name}
                          </h4>
                          <p className="text-xs text-[#6B6B6B]">{proj.client_or_brand}</p>
                        </div>
                        <span className="text-[10px] bg-[#DCE7F0] text-[#2C5576] font-medium px-2 py-0.5 rounded-full">
                          Em Aberto
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6B6B] line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between text-[11px] text-[#6B6B6B]">
                      <span>Responsável: {proj.manager_name}</span>
                      <span className="font-mono">Prazo: {proj.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA 3.1: DETALHE DO PROJETO (PÁGINA DEDICADA) */}
          {activeTab === "project_detail" && (
            <ProjectDetailView
              project={currentProject}
              tasks={tasks}
              clippings={clippings}
              onBack={() => navigateTo("projects")}
              onUpdateProject={handleUpdateProject}
              onOpenTaskDetail={handleOpenTaskDetail}
              onToggleTaskStatus={handleToggleTaskStatus}
              onUpdateTaskPriority={handleUpdateTaskPriority}
              canEdit={userRole === "director" || userRole === "press_officer"}
            />
          )}

          {/* VISTA 4: CONSULTA DE CONTACTOS REALIZADOS */}
          {activeTab === "contacts" && (
            <ContactsView
              contacts={contacts}
              initialFilter={activeContactFilter}
              onBackToDashboard={() => navigateTo("dashboard")}
              onUpdateContactStatus={handleUpdateContactStatus}
              onAddNewContact={handleAddNewContact}
              canEdit={userRole === "director" || userRole === "press_officer"}
            />
          )}

          {/* VISTA 5: CLIPPING DE IMPRENSA & VALOR AVE */}
          {activeTab === "clipping" && (
            <ClippingView
              clippings={clippings}
              onBackToDashboard={() => navigateTo("dashboard")}
            />
          )}

          {/* VISTA 5.1: ANÁLISE DE TAXAS DE RESPOSTA */}
          {activeTab === "analytics" && (
            <AnalyticsResponseView
              onBackToDashboard={() => navigateTo("dashboard")}
            />
          )}

          {/* VISTA 6: BASE DE DADOS DE JORNALISTAS */}
          {activeTab === "journalists" && (
            <JournalistsView
              journalists={journalists}
              outlets={outlets}
              onBackToDashboard={() => navigateTo("dashboard")}
              onLogContactWithJournalist={(j) => {
                handleAddNewContact({
                  contact_name: j.name,
                  outlet_name: j.outlet_name,
                  contact_type: "email",
                  status: "enviado",
                  subject_or_notes: `Contacto com ${j.name} (${j.outlet_name})`,
                  contact_date: "2026-11-17",
                });
                navigateTo("contacts", "today");
              }}
              onOpenOutletDetail={(outletRef) => {
                navigateTo("outlets");
              }}
              canEdit={userRole === "director" || userRole === "press_officer"}
            />
          )}

          {/* VISTA 7: ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS) */}
          {activeTab === "outlets" && (
            <OutletsView
              outlets={outlets}
              journalists={journalists}
              onBackToDashboard={() => navigateTo("dashboard")}
              onOpenJournalistDetail={(j) => {
                navigateTo("journalists");
              }}
              canEdit={userRole === "director" || userRole === "press_officer"}
            />
          )}
        </main>
      </div>

      {/* Gaveta Lateral de Detalhes da Tarefa */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateTask={handleUpdateTask}
        canEdit={userRole === "director" || userRole === "press_officer"}
      />
    </div>
  );
}
