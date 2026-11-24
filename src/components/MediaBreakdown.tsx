"use client";

import React from "react";

export default function MediaBreakdown() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  // Heatmap rows
  const slots = [
    { label: "12 AM - 8 AM", weights: [1, 2, 1, 1, 1, 0, 0] },
    { label: "8 AM - 4 PM", weights: [3, 4, 4, 4, 3, 1, 1] }, // Peak journalist deadline time
    { label: "4 PM - 12 AM", weights: [2, 3, 2, 4, 2, 1, 0] },
  ];

  const getHeatmapColor = (weight: number) => {
    switch (weight) {
      case 4:
        return "bg-orange-600";
      case 3:
        return "bg-orange-400";
      case 2:
        return "bg-orange-200";
      case 1:
        return "bg-orange-100";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Heatmap Widget (mimicking screenshot bottom-left) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Horário Crítico de Pedidos de Imprensa</h3>
            <span className="w-2 h-2 rounded-full border border-slate-300"></span>
          </div>

          {/* Scale Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Baixa</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-100"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-orange-100"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-orange-300"></span>
              <span className="w-2.5 h-2.5 rounded-xs bg-orange-600"></span>
            </div>
            <span>Pico Crítico (Fecho)</span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="space-y-3 pt-2">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 text-center text-[10px] text-slate-400 font-medium">
            <span className="text-left pl-1">Horário</span>
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Time Rows */}
          {slots.map((slot) => (
            <div key={slot.label} className="grid grid-cols-8 gap-2 items-center">
              <span className="text-[10px] text-slate-400 font-mono">{slot.label}</span>
              {slot.weights.map((w, idx) => (
                <div
                  key={idx}
                  className={`h-5 rounded-md ${getHeatmapColor(w)} transition-all hover:scale-105 cursor-pointer`}
                  title={`Intensidade de contacto: Nível ${w}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart Widget (mimicking screenshot bottom-right) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Repartição de Cobertura</h3>
            <span className="w-2 h-2 rounded-full border border-slate-300"></span>
          </div>
        </div>

        <div className="flex items-center justify-between my-2">
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">1.84M</div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +14.2% impressões
            </span>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="text-slate-600">Digital / Online:</span>
                <span className="font-bold text-slate-900 ml-auto">60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-300"></span>
                <span className="text-slate-600">Televisão (Prime-time):</span>
                <span className="font-bold text-slate-900 ml-auto">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-100"></span>
                <span className="text-slate-600">Imprensa Escrita:</span>
                <span className="font-bold text-slate-900 ml-auto">15%</span>
              </div>
            </div>
          </div>

          {/* Pie Chart SVG */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              {/* 15% Imprensa Escrita */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#fed7aa"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset="0"
                fill="transparent"
              />
              {/* 25% TV */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#fb923c"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset="62.8"
                fill="transparent"
              />
              {/* 60% Online */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f97316"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset="125.6"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded shadow">
              60%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
