"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface MonthData {
  month: string;
  reach: string;
  sentiment: string;
  value: number;
}

const yearlyData: Record<string, MonthData[]> = {
  "2026": [
    { month: "Jan", reach: "0", sentiment: "0%", value: 2 },
    { month: "Fev", reach: "0", sentiment: "0%", value: 2 },
    { month: "Mar", reach: "0", sentiment: "0%", value: 2 },
    { month: "Abr", reach: "0", sentiment: "0%", value: 2 },
    { month: "Mai", reach: "0", sentiment: "0%", value: 2 },
    { month: "Jun", reach: "0", sentiment: "0%", value: 2 },
    { month: "Jul", reach: "0", sentiment: "0%", value: 2 },
    { month: "Ago", reach: "0", sentiment: "0%", value: 2 },
    { month: "Set", reach: "0", sentiment: "0%", value: 2 },
    { month: "Out", reach: "0", sentiment: "0%", value: 2 },
    { month: "Nov", reach: "0", sentiment: "0%", value: 2 },
    { month: "Dez", reach: "0", sentiment: "0%", value: 2 },
  ],
  "2025": [
    { month: "Jan", reach: "0", sentiment: "0%", value: 2 },
    { month: "Fev", reach: "0", sentiment: "0%", value: 2 },
    { month: "Mar", reach: "0", sentiment: "0%", value: 2 },
    { month: "Abr", reach: "0", sentiment: "0%", value: 2 },
    { month: "Mai", reach: "0", sentiment: "0%", value: 2 },
    { month: "Jun", reach: "0", sentiment: "0%", value: 2 },
    { month: "Jul", reach: "0", sentiment: "0%", value: 2 },
    { month: "Ago", reach: "0", sentiment: "0%", value: 2 },
    { month: "Set", reach: "0", sentiment: "0%", value: 2 },
    { month: "Out", reach: "0", sentiment: "0%", value: 2 },
    { month: "Nov", reach: "0", sentiment: "0%", value: 2 },
    { month: "Dez", reach: "0", sentiment: "0%", value: 2 },
  ],
};

export default function AnalyticsChart() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [activeIndex, setActiveIndex] = useState<number>(10); // Novembro

  const data = yearlyData[selectedYear] || yearlyData["2026"];
  const currentMonthData = data[activeIndex] || data[10];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Evolução Mensal de Cobertura & Alcance Mediático
          </h2>
          <p className="text-xs text-slate-400">
            Os valores crescerão à medida que novos clippings e respostas forem arquivados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Ano:</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 appearance-none cursor-pointer"
            >
              <option value="2026">Ano Atual (2026)</option>
              <option value="2025">2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-slate-500" />
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-10 pb-2">
        {/* Dynamic Tooltip */}
        <div className="mb-3 flex justify-center">
          <div className="bg-slate-900 text-white rounded-xl px-4 py-2 text-xs shadow-xl flex items-center gap-3 animate-in fade-in">
            <span className="font-bold text-orange-400">
              {currentMonthData.month} {selectedYear}
            </span>
            <span className="text-slate-500">•</span>
            <span>
              Alcance: <strong className="text-white font-mono">{currentMonthData.reach}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span>
              Sentimento Favorável:{" "}
              <strong className="text-emerald-400 font-mono">{currentMonthData.sentiment}</strong>
            </span>
          </div>
        </div>

        {/* Y Axis Reference Guides */}
        <div className="absolute inset-x-0 top-16 bottom-8 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300 font-mono">
          <div className="flex items-center gap-2 w-full">
            <span className="w-10 text-slate-400">800K</span>
            <div className="flex-1 border-b border-dashed border-slate-100"></div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="w-10 text-slate-400">600K</span>
            <div className="flex-1 border-b border-dashed border-slate-100"></div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="w-10 text-slate-400">400K</span>
            <div className="flex-1 border-b border-dashed border-slate-100"></div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="w-10 text-slate-400">200K</span>
            <div className="flex-1 border-b border-dashed border-slate-100"></div>
          </div>
        </div>

        {/* Bars Container */}
        <div className="ml-12 h-44 flex items-end justify-between gap-1.5 sm:gap-3 relative z-10">
          {data.map((item, index) => {
            const isSelected = index === activeIndex;

            return (
              <div
                key={item.month}
                onClick={() => setActiveIndex(index)}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                <div
                  style={{ height: `${item.value}%` }}
                  className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 ${
                    isSelected
                      ? "bg-orange-500 shadow-md shadow-orange-500/30 scale-105"
                      : "striped-bar border-t border-slate-200 group-hover:border-orange-400 group-hover:bg-slate-100"
                  }`}
                ></div>

                <span
                  className={`text-[10px] mt-2 font-medium transition-colors ${
                    isSelected ? "text-orange-600 font-bold" : "text-slate-400 group-hover:text-slate-700"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
