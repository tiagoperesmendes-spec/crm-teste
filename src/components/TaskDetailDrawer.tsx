"use client";

import React, { useState } from "react";
import { X, Maximize2, Minimize2, CheckSquare, MessageSquare, History, Plus, Trash2 } from "lucide-react";
import { Task, TaskPriority, TaskStatus, SubtaskItem, TaskComment } from "@/types/pr-crm";

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  canEdit?: boolean;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  canEdit = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  if (!isOpen || !task) return null;

  const handleToggleSubtask = (stId: string) => {
    const updatedSubtasks = (task.subtasks || []).map((st) =>
      st.id === stId ? { ...st, completed: !st.completed } : st
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSt: SubtaskItem = {
      id: "st-" + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    onUpdateTask({ ...task, subtasks: [...(task.subtasks || []), newSt] });
    setNewSubtaskTitle("");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newCm: TaskComment = {
      id: "cm-" + Date.now(),
      author: "Leonor Rodrigues",
      text: newCommentText.trim(),
      created_at: new Date().toISOString(),
    };
    onUpdateTask({ ...task, comments: [...(task.comments || []), newCm] });
    setNewCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs transition-opacity">
      <div
        className={`bg-white h-full shadow-2xl flex flex-col transition-all duration-200 border-l border-[#E4DDD3] ${
          isFullscreen ? "w-full" : "w-full max-w-2xl"
        }`}
      >
        {/* Topo da Gaveta */}
        <div className="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span>Tarefas</span>
            <span>&gt;</span>
            <span className="font-medium text-[#1A1A1A]">{task.project_name || "Geral"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] rounded-lg hover:bg-white border border-transparent hover:border-[#E4DDD3] transition-all"
              title={isFullscreen ? "Restaurar tamanho" : "Expandir ecrã inteiro"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] rounded-lg hover:bg-white border border-transparent hover:border-[#E4DDD3] transition-all"
              title="Fechar gaveta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Título da Tarefa */}
          <div>
            <input
              type="text"
              value={task.title}
              disabled={!canEdit}
              onChange={(e) => onUpdateTask({ ...task, title: e.target.value })}
              className="text-xl font-semibold text-[#1A1A1A] font-title w-full bg-transparent border-b border-transparent hover:border-[#E4DDD3] focus:border-[#6C1C37] focus:outline-none transition-colors"
            />
          </div>

          {/* Grelha de Propriedades */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#FBF9F6] border border-[#E4DDD3] rounded-2xl text-xs">
            {/* Estado */}
            <div>
              <label className="block text-[11px] font-medium text-[#6B6B6B] mb-1">Estado</label>
              <select
                value={task.status}
                disabled={!canEdit}
                onChange={(e) => onUpdateTask({ ...task, status: e.target.value as TaskStatus })}
                className="crm-select text-xs py-1"
              >
                <option value="pending">Por fazer</option>
                <option value="in_progress">Em curso</option>
                <option value="review">Em revisão</option>
                <option value="completed">Concluída</option>
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-[11px] font-medium text-[#6B6B6B] mb-1">Prioridade</label>
              <select
                value={task.priority}
                disabled={!canEdit}
                onChange={(e) => onUpdateTask({ ...task, priority: e.target.value as TaskPriority })}
                className="crm-select text-xs py-1"
              >
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="normal">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>

            {/* Data de Entrega */}
            <div>
              <label className="block text-[11px] font-medium text-[#6B6B6B] mb-1">Data de Entrega</label>
              <input
                type="date"
                value={task.due_date}
                disabled={!canEdit}
                onChange={(e) => onUpdateTask({ ...task, due_date: e.target.value })}
                className="crm-input text-xs py-1 font-mono"
              />
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-[11px] font-medium text-[#6B6B6B] mb-1">Responsável</label>
              <input
                type="text"
                value={task.assignee_name || "Leonor Rodrigues"}
                disabled={!canEdit}
                onChange={(e) => onUpdateTask({ ...task, assignee_name: e.target.value })}
                className="crm-input text-xs py-1"
              />
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-2 font-title">Descrição &amp; Instruções</h4>
            <textarea
              rows={4}
              value={task.description || ""}
              disabled={!canEdit}
              placeholder="Adicionar notas sobre o briefing, contactos com jornalistas, links de comunicados..."
              onChange={(e) => onUpdateTask({ ...task, description: e.target.value })}
              className="crm-input text-xs resize-none"
            />
          </div>

          {/* Subtarefas / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-[#1A1A1A] font-title flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#6C1C37]" />
                <span>Sub-tarefas &amp; Verificações</span>
              </h4>
            </div>

            <div className="space-y-1.5">
              {(task.subtasks || []).map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F6F2EC] text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleToggleSubtask(st.id)}
                    className="rounded border-[#E4DDD3] text-[#6C1C37] focus:ring-[#6C1C37] cursor-pointer"
                  />
                  <span className={st.completed ? "line-through text-[#6B6B6B]" : "text-[#1A1A1A]"}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            {canEdit && (
              <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Nova sub-tarefa..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="crm-input text-xs py-1"
                />
                <button type="submit" className="btn-secondary py-1 text-xs px-2.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </form>
            )}
          </div>

          {/* Comentários */}
          <div>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-2 font-title flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#6C1C37]" />
              <span>Comentários da Equipa</span>
            </h4>

            <div className="space-y-2 mb-3">
              {(task.comments || []).map((cm) => (
                <div key={cm.id} className="p-3 bg-[#FBF9F6] border border-[#E4DDD3] rounded-xl text-xs">
                  <div className="flex items-center justify-between text-[10px] text-[#6B6B6B] mb-1">
                    <span className="font-medium text-[#1A1A1A]">{cm.author}</span>
                    <span className="font-mono">{new Date(cm.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-[#1A1A1A]">{cm.text}</p>
                </div>
              ))}
            </div>

            {canEdit && (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escrever comentário..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="crm-input text-xs py-1"
                />
                <button type="submit" className="btn-primary py-1 text-xs px-3">
                  Publicar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailDrawer;
