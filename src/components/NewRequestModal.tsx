"use client";

import React, { useState } from "react";
import { X, Send, Clock, Building, User } from "lucide-react";
import { PRRequest, RequestUrgency } from "@/types/pr-crm";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRequest: (request: Omit<PRRequest, "id" | "created_at">) => void;
}

export default function NewRequestModal({
  isOpen,
  onClose,
  onAddRequest,
}: NewRequestModalProps) {
  const [title, setTitle] = useState("");
  const [journalistName, setJournalistName] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("Expresso");
  const [customOutlet, setCustomOutlet] = useState("");
  const [isCustomOutlet, setIsCustomOutlet] = useState(false);
  const [subject, setSubject] = useState("");
  const [urgency, setUrgency] = useState<RequestUrgency>("alta");
  const [hoursToDeadline, setHoursToDeadline] = useState("4");
  const [spokesperson, setSpokesperson] = useState("Leonor Rodrigues");

  if (!isOpen) return null;

  const handleOutletChange = (val: string) => {
    setSelectedOutlet(val);
    if (val === "CUSTOM") {
      setIsCustomOutlet(true);
    } else {
      setIsCustomOutlet(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !journalistName || !subject) return;

    const finalOutlet = isCustomOutlet
      ? customOutlet.trim() || "Órgão Independente"
      : selectedOutlet;

    const deadlineDate = new Date(
      Date.now() + parseFloat(hoursToDeadline) * 3600 * 1000
    ).toISOString();

    onAddRequest({
      title,
      journalist_name: journalistName,
      outlet: finalOutlet,
      subject,
      deadline: deadlineDate,
      urgency,
      status: "pendente_analise",
      spokesperson_assigned: spokesperson,
      response_draft: "Em estruturação pelo gabinete.",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Novo Pedido de Imprensa</h3>
            <p className="text-[11px] text-[#6B6B6B]">Registo de contacto e prazo de fecho da redação.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
              Assunto / Pauta *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Pedido de entrevista sobre novos investimentos..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="crm-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                Jornalista *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B6B6B]" />
                <input
                  type="text"
                  required
                  placeholder="Nome do jornalista"
                  value={journalistName}
                  onChange={(e) => setJournalistName(e.target.value)}
                  className="crm-input pl-8"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                Órgão de Comunicação *
              </label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B6B6B]" />
                <select
                  value={selectedOutlet}
                  onChange={(e) => handleOutletChange(e.target.value)}
                  className="crm-select w-full pl-8 font-medium"
                >
                  <optgroup label="Jornais Nacionais &amp; Semanários">
                    <option value="Expresso">Expresso</option>
                    <option value="Público">Público</option>
                    <option value="Diário de Notícias">Diário de Notícias (DN)</option>
                    <option value="Jornal de Notícias">Jornal de Notícias (JN)</option>
                    <option value="Observador">Observador</option>
                    <option value="Visão">Revista Visão</option>
                    <option value="Sábado">Revista Sábado</option>
                  </optgroup>

                  <optgroup label="Economia &amp; Negócios">
                    <option value="ECO Economia Online">ECO Economia Online</option>
                    <option value="Jornal de Negócios">Jornal de Negócios</option>
                    <option value="Jornal Económico">Jornal Económico</option>
                    <option value="Dinheiro Vivo">Dinheiro Vivo</option>
                  </optgroup>

                  <optgroup label="Televisão &amp; Rádio">
                    <option value="SIC / SIC Notícias">SIC / SIC Notícias</option>
                    <option value="RTP 1 / RTP 3">RTP 1 / RTP 3</option>
                    <option value="TVI / CNN Portugal">TVI / CNN Portugal</option>
                    <option value="TSF">TSF Rádio Notícias</option>
                    <option value="Rádio Renascença">Rádio Renascença</option>
                  </optgroup>

                  <optgroup label="Agências &amp; Especializada">
                    <option value="Lusa">Agência Lusa</option>
                    <option value="Reuters Portugal">Reuters Portugal</option>
                    <option value="Bloomberg">Bloomberg</option>
                  </optgroup>

                  <optgroup label="Outro">
                    <option value="CUSTOM">+ Outro Órgão...</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {isCustomOutlet && (
            <div className="bg-[#FBF9F6] border border-[#E4DDD3] p-3 rounded-xl space-y-1">
              <label className="block text-xs font-medium text-[#1A1A1A]">
                Nome do Órgão de Comunicação *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Diário de Coimbra, Diário Insular..."
                value={customOutlet}
                onChange={(e) => setCustomOutlet(e.target.value)}
                className="crm-input"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                Nível de Urgência
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as RequestUrgency)}
                className="crm-select w-full"
              >
                <option value="urgente_crise">Urgente / Crise (menos de 2 horas)</option>
                <option value="alta">Alta Prioridade (Hoje)</option>
                <option value="media">Média Prioridade (24 horas)</option>
                <option value="baixa">Baixa / Planeamento</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                Prazo até Fecho de Edição (Horas)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B6B6B]" />
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hoursToDeadline}
                  onChange={(e) => setHoursToDeadline(e.target.value)}
                  className="crm-input pl-8 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
              Perguntas do Jornalista / Pauta *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Descreva as perguntas concretas colocadas pela redação..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="crm-input resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Guardar Pedido</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
