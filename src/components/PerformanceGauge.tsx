"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface PerformanceGaugeProps {
  score: number;
}

export default function PerformanceGauge({ score }: PerformanceGaugeProps) {
  // Arc calculation for semi-circle
  // Radius 70, stroke-dasharray for semi-circle (pi * r) ≈ 220
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (score / 100));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Performance do Gabinete de RP</h3>
          <span className="w-2 h-2 rounded-full border border-slate-300"></span>
        </div>
      </div>

      {/* Semi-circle Gauge (matches screenshot) */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <div className="w-56 h-28 overflow-hidden relative flex items-end justify-center">
          <svg className="w-56 h-56 transform -rotate-180" viewBox="0 0 160 160">
            {/* Background semi-circle track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Active orange arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#ff5e36"
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>

        {/* Center score readout */}
        <div className="text-center -mt-6">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">+3</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">de 100 pontos</span>
        </div>
      </div>

      {/* Description & actionable advice */}
      <div className="pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
          <span>A sua equipa de comunicação está excelente!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
          Tempo médio de resposta a jornalistas Tier 1 desceu para 38 minutos. Risco reputacional reduzido em 92%.
        </p>

        <a
          href="#protocolo-crise"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-orange-600 transition-colors"
        >
          <span>Otimizar Protocolo de Crise</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
