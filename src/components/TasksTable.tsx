"use client";

import React from "react";
import { Check } from "lucide-react";
import { Task, TaskPriority } from "@/types/pr-crm";

interface TasksTableProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
  onOpenDetail: (taskId: string) => void;
  onUpdatePriorityInline?: (taskId: string, priority: TaskPriority) => void;
  canEdit?: boolean;
}

export const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  onToggleStatus,
  onOpenDetail,
  onUpdatePriorityInline,
  canEdit = true,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "urgente":
        return "bg-[#F6D9D5] text-[#A3281E] border-[#F1D9CE]";
      case "alta":
        return "bg-[#F1D9CE] text-[#8A3E22] border-[#F1D9CE]";
      case "normal":
      case "media":
        return "bg-[#F3E3C3] text-[#7A4E0F] border-[#F3E3C3]";
      case "baixa":
      default:
        return "bg-[#E9E5E0] text-[#5C554E] border-[#E9E5E0]";
    }
  };

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return "Sem prazo";
    if (dateStr === todayStr) return "Hoje";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      const mIdx = parseInt(parts[1], 10) - 1;
      return `${parts[2]} ${months[mIdx] || ""}`;
    }
    return dateStr;
  };

  if (tasks.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-[#6B6B6B]">
        <p className="font-medium text-[#1A1A1A] mb-1">Tudo em dia. Não existem tarefas nesta vista.</p>
        <p>Clica em &quot;+ Nova Tarefa&quot; para adicionares uma nova ação ao plano.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#E4DDD3]/60">
      {tasks.map((task) => {
        const isDone = task.status === "completed" || task.status === "concluida";
        const isOverdue = !isDone && Boolean(task.due_date && task.due_date < todayStr);

        return (
          <div
            key={task.id}
            onClick={() => onOpenDetail(task.id)}
            className="py-3 flex items-center justify-between gap-3 group hover:bg-[#F6F2EC]/60 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
          >
            {/* Lado Esquerdo: Checkbox & Título & Projeto */}
            <div className="flex items-center gap-3 min-w-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onToggleStatus(task.id)}
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  isDone
                    ? "bg-[#2F6B3A] border border-[#2F6B3A] text-white"
                    : "border border-[#D1C7BA] hover:border-[#6C1C37]"
                }`}
                title={isDone ? "Reabrir tarefa" : "Marcar como concluída"}
              >
                {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  onClick={() => onOpenDetail(task.id)}
                  className={`text-xs truncate transition-colors cursor-pointer hover:text-[#6C1C37] ${
                    isDone ? "line-through text-[#6B6B6B]" : "text-[#1A1A1A] font-normal"
                  }`}
                  title="Clica para abrir os detalhes"
                >
                  {task.title}
                </span>
                {task.project_name && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F6F2EC] text-[#6B6B6B] shrink-0 hidden sm:inline-block">
                    {task.project_name}
                  </span>
                )}
                {isOverdue && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-[#F6D9D5] text-[#A3281E] shrink-0">
                    Em atraso
                  </span>
                )}
              </div>
            </div>

            {/* Lado Direito: Prioridade Inline & Prazo */}
            <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              {canEdit && onUpdatePriorityInline ? (
                <select
                  value={task.priority}
                  onChange={(e) => onUpdatePriorityInline(task.id, e.target.value as TaskPriority)}
                  className={`text-[10px] py-0.5 px-2 font-medium rounded-full border cursor-pointer ${getPriorityBadge(
                    task.priority
                  )}`}
                >
                  <option value="urgente">Urgente</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              ) : (
                <span
                  className={`text-[10px] py-0.5 px-2 font-medium rounded-full border capitalize ${getPriorityBadge(
                    task.priority
                  )}`}
                >
                  {task.priority === "normal" || task.priority === "media" ? "Média" : task.priority}
                </span>
              )}

              <span className={`text-xs min-w-[50px] text-right font-normal ${isOverdue ? "text-[#A3281E] font-medium" : "text-[#6B6B6B]"}`}>
                {formatDueDate(task.due_date)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TasksTable;
