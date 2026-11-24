"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  UserCheck,
  Building,
  FileText,
  Send,
  MoreVertical,
  Filter
} from "lucide-react";
import { PRRequest } from "@/types/pr-crm";

interface PendingRequestsTableProps {
  requests: PRRequest[];
  onCompleteRequest: (id: string) => void;
  onOpenNewModal: () => void;
}

export default function PendingRequestsTable({
  requests,
  onCompleteRequest,
  onOpenNewModal,
}: PendingRequestsTableProps) {
  const [filter, setFilter] = useState<string>("todos");
  const [selectedRequest, setSelectedRequest] = useState<PRRequest | null>(null);

  const filteredRequests = requests.filter((req) => {
    if (filter === "urgente") return req.urgency === "urgente_crise" || req.urgency === "alta";
    if (filter === "aguarda_porta_voz") return req.status === "aguarda_porta_voz";
    if (filter === "rascunho") return req.status === "rascunho_aprovacao";
    return true;
  });

  const getUrgencyBadge = (urgency: PRRequest["urgency"]) => {
    switch (urgency) {
      case "urgente_crise":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600 animate-pulse" />
            Urgente / Crise (&lt; 2h)
          </span>
        );
      case "alta":
        return (
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-orange-200">
            <Clock className="w-3 h-3 text-orange-600" />
            Alta Prioridade
          </span>
        );
      case "media":
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
            Média Prioridade
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-500 text-[10px] font-normal px-2 py-0.5 rounded-full">
            Normal
          </span>
        );
    }
  };

  const getStatusBadge = (status: PRRequest["status"]) => {
    switch (status) {
      case "aguarda_porta_voz":
        return (
          <span className="bg-amber-50 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded border border-amber-200/60">
            Aguarda Porta-Voz (CEO)
          </span>
        );
      case "rascunho_aprovacao":
        return (
          <span className="bg-blue-50 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded border border-blue-200/60">
            Rascunho de Q&A Pronto
          </span>
        );
      case "pendente_analise":
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
            Em Triagem
          </span>
        );
      case "concluido":
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded">
            Enviado à Imprensa
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Pedidos de Imprensa Pendentes & Prazos Críticos
            </h3>
            <span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {filteredRequests.length} ativos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pedidos de jornalistas que exigem resposta antes do fecho de edição.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs">
          <button
            onClick={() => setFilter("todos")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === "todos" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("urgente")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === "urgente" ? "bg-white text-red-600 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Urgentes / Crise
          </button>
          <button
            onClick={() => setFilter("aguarda_porta_voz")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === "aguarda_porta_voz" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Aguarda Porta-Voz
          </button>
          <button
            onClick={() => setFilter("rascunho")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              filter === "rascunho" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Rascunho Pronto
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-slate-100">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhum pedido pendente com este filtro. Todos os prazos de media estão cumpridos!
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Column: Journalist & Subject */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getUrgencyBadge(req.urgency)}
                  {getStatusBadge(req.status)}
                  <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    {req.outlet}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-slate-600">
                    {req.journalist_name}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {req.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-1 max-w-3xl">
                  {req.subject}
                </p>

                {req.response_draft && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-600 bg-indigo-50/60 px-2 py-0.5 rounded max-w-fit">
                    <FileText className="w-3 h-3" />
                    <span>{req.response_draft}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Deadline & Action Buttons */}
              <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Fecho de Edição</span>
                  </div>
                  <span className="text-[11px] text-orange-600 font-semibold font-mono">
                    {new Date(req.deadline).toLocaleTimeString("pt-PT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    (Hoje)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCompleteRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    title="Aprovar e enviar resposta ao jornalista"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Concluir & Arquivar</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>SLA Médio de Resposta: 42 minutos</span>
        <button
          onClick={onOpenNewModal}
          className="font-semibold text-orange-600 hover:text-orange-700 text-xs"
        >
          + Registar Novo Pedido de Jornalista
        </button>
      </div>
    </div>
  );
}
