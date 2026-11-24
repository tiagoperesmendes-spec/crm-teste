"use client";

import React from "react";
import { PRDashboardMetrics } from "@/types/pr-crm";

interface MetricCardsProps {
  metrics: PRDashboardMetrics;
  onNavigate: (tab: string, filter?: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, onNavigate }) => {
  const openProjectsCount = metrics?.open_projects || 7;
  const overdueCount = 2;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cartão 1: Projetos em curso */}
      <div
        onClick={() => onNavigate("projects")}
        className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group"
      >
        <span className="text-xs text-[#6B6B6B] font-medium block">Projetos em curso</span>
        <div className="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors">
          {openProjectsCount}
        </div>
        <span className="text-xs text-[#6B6B6B] block">
          2 a terminar esta semana
        </span>
      </div>

      {/* Cartão 2: Entregas esta semana */}
      <div
        onClick={() => onNavigate("tasks", "overdue")}
        className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group"
      >
        <span className="text-xs text-[#6B6B6B] font-medium block">Entregas esta semana</span>
        <div className="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors">
          12
        </div>
        <span className="text-xs text-[#A3281E] font-medium block">
          {overdueCount} em atraso
        </span>
      </div>

      {/* Cartão 3: A aguardar cliente */}
      <div
        onClick={() => onNavigate("tasks")}
        className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group"
      >
        <span className="text-xs text-[#6B6B6B] font-medium block">A aguardar cliente</span>
        <div className="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors">
          4
        </div>
        <span className="text-xs text-[#6B6B6B] block">
          Aprovações e feedback pendentes
        </span>
      </div>

      {/* Cartão 4: Contactos hoje */}
      <div
        onClick={() => onNavigate("contacts")}
        className="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group"
      >
        <span className="text-xs text-[#6B6B6B] font-medium block">Contactos hoje</span>
        <div className="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors">
          3 / 7
        </div>
        <span className="text-xs text-[#6B6B6B] block">
          4 planeados para a tarde
        </span>
      </div>
    </div>
  );
};

export default MetricCards;
