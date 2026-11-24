"use client";

import React, { useState } from "react";
import { Project, Task, TaskPriority, TargetJournalist } from "@/types/pr-crm";
import { ChevronRight, ArrowLeft, Calendar, User, CheckCircle2, Clock, Plus, ExternalLink, Users, AlertCircle } from "lucide-react";
import TasksTable from "@/components/TasksTable";

interface ProjectDetailViewProps {
  project: Project;
  tasks: Task[];
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
  onOpenTaskDetail: (taskId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onUpdateTaskPriority: (taskId: string, priority: TaskPriority) => void;
  canEdit: boolean;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  tasks,
  onBack,
  onUpdateProject,
  onOpenTaskDetail,
  onToggleTaskStatus,
  onUpdateTaskPriority,
  canEdit,
}) => {
  // Separadores especificados: Resumo, Tarefas, Jornalistas-alvo
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "journalists">("overview");

  // Jornalistas-alvo
  const defaultTargetJournalists: TargetJournalist[] = project.target_journalists || [
    { name: "Marta Figueiredo", outlet: "Público", status: "contactado" },
    { name: "Rui Almeida", outlet: "Expresso", status: "respondeu" },
    { name: "Tiago Sousa", outlet: "ECO Economia Online", status: "publicou" },
    { name: "Inês Carvalho", outlet: "RTP", status: "por_contactar" },
  ];

  const [targetJournalists, setTargetJournalists] = useState<TargetJournalist[]>(defaultTargetJournalists);

  // Filtra as tarefas que pertencem a este projeto
  const projectTasks = tasks.filter(
    (t) => t.project_id === project.id || (t.project_name && t.project_name.toLowerCase() === project.name.toLowerCase())
  );

  const completedTasksCount = projectTasks.filter((t) => t.status === "completed" || t.status === "concluida").length;
  const progressPercent = projectTasks.length > 0 ? Math.round((completedTasksCount / projectTasks.length) * 100) : (project.progress_percentage || 0);

  // Meios-alvo automáticos a partir dos jornalistas-alvo (só leitura)
  const targetOutlets = Array.from(new Set(targetJournalists.map(j => j.outlet).filter(Boolean)));

  // Verificação de atraso: data de entrega ultrapassada e não concluído
  const todayStr = new Date().toISOString().split("T")[0];
  const isCompleted = project.status === "completed" || project.status === "concluido";
  const isOverdue = Boolean(project.deadline && project.deadline < todayStr && !isCompleted);

  const handleUpdateJournalistStatus = (index: number, newStatus: TargetJournalist["status"]) => {
    const updated = [...targetJournalists];
    updated[index].status = newStatus;
    setTargetJournalists(updated);
    onUpdateProject({ ...project, target_journalists: updated });
  };

  const getTargetStatusBadge = (status: TargetJournalist["status"]) => {
    switch (status) {
      case "publicou":
        return { text: "Publicou", class: "bg-[#DDEBDD] text-[#2F6B3A]" };
      case "respondeu":
        return { text: "Respondeu", class: "bg-[#D5E8E5] text-[#1F5B57]" };
      case "contactado":
        return { text: "Contactado", class: "bg-[#DCE7F0] text-[#2C5576]" };
      case "por_contactar":
      default:
        return { text: "Por contactar", class: "bg-[#E9E5E0] text-[#5C554E]" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "em_preparacao": return "Em preparação";
      case "em_curso":
      case "open": return "Em curso";
      case "aguarda_aprovacao": return "A aguardar aprovação";
      case "concluido":
      case "completed": return "Concluído";
      case "em_pausa": return "Em pausa";
      default: return status;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "lancamento": return "Lançamento";
      case "evento": return "Evento";
      case "comunicado": return "Comunicado";
      case "entrevista": return "Entrevista";
      case "campanha": return "Campanha";
      case "crise":
      case "gestao_de_crise": return "Gestão de crise";
      default: return type || "Campanha";
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Navegação / Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6B6B]">
        <button
          onClick={onBack}
          className="hover:text-[#1A1A1A] transition-colors flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Projetos
        </button>
        <ChevronRight className="w-3 h-3 text-[#6B6B6B]/60" />
        <span className="text-[#1A1A1A] font-semibold truncate max-w-xs">{project.name}</span>
      </nav>

      {/* Cartão de Cabeçalho do Projeto */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E4DDD3]/60">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-title">{project.name}</h1>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                isOverdue
                  ? "bg-[#F6D9D5] text-[#A3281E] border border-[#F1D9CE]"
                  : "bg-[#DCE7F0] text-[#2C5576]"
              }`}>
                {isOverdue ? "Em atraso" : getStatusLabel(project.status)}
              </span>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EDE6DE] text-[#6C1C37]">
                {getTypeLabel(project.type)}
              </span>
              {project.priority && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                  project.priority === "alta" ? "bg-[#F6D9D5] text-[#A3281E]" : "bg-[#EDE6DE] text-[#6B6B6B]"
                }`}>
                  Prioridade {project.priority}
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B6B6B]">
              Cliente: <span className="text-[#1A1A1A] font-medium px-2 py-0.5 rounded-md bg-[#F6F2EC]">{project.client_or_brand}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#E4DDD3] text-[#1A1A1A] bg-white hover:bg-[#F6F2EC] font-medium transition-all cursor-pointer"
            >
              Voltar aos Projetos
            </button>
          </div>
        </div>

        {/* Metadados Rápidos e Progresso */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <User className="w-3 h-3 text-[#6B6B6B]" /> Responsável
            </span>
            <p className="text-xs font-semibold text-[#1A1A1A]">{project.manager_name || "Gabinete de RP"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#6B6B6B]" /> Data de Entrega
            </span>
            <p className={`text-xs font-semibold font-mono ${isOverdue ? "text-[#A3281E]" : "text-[#1A1A1A]"}`}>
              {project.deadline || "Sem prazo definido"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#6B6B6B]" /> Meios-Alvo (Automático)
            </span>
            <p className="text-xs font-semibold text-[#1A1A1A]">
              {targetOutlets.length} meios ({targetOutlets.slice(0, 2).join(", ")}{targetOutlets.length > 2 ? "..." : ""})
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#6B6B6B]">Progresso ({completedTasksCount}/{projectTasks.length} concluídas)</span>
              <span className="font-semibold text-[#1A1A1A] font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#EDE6DE] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6C1C37] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Separadores do Projeto: Exatamente 3 (Resumo, Tarefas, Jornalistas-alvo) */}
      <div className="flex items-center gap-2 border-b border-[#E4DDD3] pb-2 text-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#6C1C37] text-white shadow-xs"
              : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC]"
          }`}
        >
          Resumo
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "tasks"
              ? "bg-[#6C1C37] text-white shadow-xs"
              : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC]"
          }`}
        >
          <span>Tarefas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E4DDD3] text-[#1A1A1A]">
            {projectTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("journalists")}
          className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "journalists"
              ? "bg-[#6C1C37] text-white shadow-xs"
              : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC]"
          }`}
        >
          <span>Jornalistas-alvo</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E4DDD3] text-[#1A1A1A]">
            {targetJournalists.length}
          </span>
        </button>
      </div>

      {/* SEPARADOR 1: RESUMO */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Objetivo do Projeto (2-3 linhas) */}
          <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Objetivo do Projeto</h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              {project.description || project.objective || "Garantir ampla cobertura noticiosa e impacto reputacional nos meios de comunicação social de referência, coordenando ações de assessoria e entrevistas com porta-vozes."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipa Alocada */}
            <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Equipa Alocada</h3>
              <div className="space-y-2">
                {(project.team_members || ["Leonor Rodrigues", "Sofia Ramos"]).map((member) => (
                  <div key={member} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/60">
                    <div className="w-6 h-6 rounded-full bg-[#6C1C37]/10 text-[#6C1C37] font-semibold flex items-center justify-center text-[10px]">
                      {member.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-[#1A1A1A]">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links e Documentos */}
            <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Links e Documentos</h3>
              <div className="space-y-2">
                {[
                  { label: "Briefing Estratégico", url: "#", type: "briefing" },
                  { label: "Comunicado de Imprensa (Draft)", url: "#", type: "comunicado" },
                  { label: "Pasta Partilhada no Google Drive", url: "#", type: "pasta" },
                ].map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white text-xs transition-colors"
                  >
                    <span className="font-medium text-[#1A1A1A]">{doc.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Notas */}
          {project.notes && (
            <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Notas</h3>
              <p className="text-xs text-[#6B6B6B] whitespace-pre-line">{project.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* SEPARADOR 2: TAREFAS */}
      {activeTab === "tasks" && (
        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]">
            <div>
              <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Tarefas deste Projeto</h3>
              <p className="text-[11px] text-[#6B6B6B]">Ações operacionais com prazo associadas a este plano.</p>
            </div>
            {canEdit && (
              <button
                onClick={() => {
                  const newTask: Task = {
                    id: "task-" + Date.now(),
                    title: "Nova Ação em " + project.name,
                    project_name: project.name,
                    project_id: project.id,
                    priority: "normal",
                    due_date: project.deadline || new Date().toISOString().split("T")[0],
                    status: "pending",
                  };
                  onOpenTaskDetail(newTask.id);
                }}
                className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                + Tarefa
              </button>
            )}
          </div>

          {projectTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#6B6B6B]">
              Nenhuma tarefa diretamente vinculada a este projeto. Clica em &quot;+ Tarefa&quot; para adicionar.
            </div>
          ) : (
            <TasksTable
              tasks={projectTasks}
              onToggleStatus={onToggleTaskStatus}
              onOpenDetail={onOpenTaskDetail}
              onUpdatePriorityInline={onUpdateTaskPriority}
              canEdit={canEdit}
            />
          )}
        </div>
      )}

      {/* SEPARADOR 3: JORNALISTAS-ALVO */}
      {activeTab === "journalists" && (
        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]">
            <div>
              <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Jornalistas-Alvo Deste Projeto</h3>
              <p className="text-[11px] text-[#6B6B6B]">Jornalistas selecionados da Base 2 para cobertura e contacto prioritário.</p>
            </div>
          </div>

          <div className="divide-y divide-[#E4DDD3]/60">
            {targetJournalists.map((target, idx) => {
              const badge = getTargetStatusBadge(target.status);
              return (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-[#1A1A1A] font-title">{target.name}</h4>
                    <p className="text-[11px] text-[#6B6B6B]">{target.outlet}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {canEdit ? (
                      <select
                        value={target.status}
                        onChange={(e) => handleUpdateJournalistStatus(idx, e.target.value as TargetJournalist["status"])}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-none cursor-pointer outline-none ${badge.class}`}
                      >
                        <option value="por_contactar">Por contactar</option>
                        <option value="contactado">Contactado</option>
                        <option value="respondeu">Respondeu</option>
                        <option value="publicou">Publicou</option>
                      </select>
                    ) : (
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${badge.class}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailView;
