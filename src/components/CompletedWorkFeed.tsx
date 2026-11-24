"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  ExternalLink,
  Tv,
  Newspaper,
  Globe,
  Radio,
  TrendingUp,
  Award,
  Sparkles,
  Search
} from "lucide-react";
import { Clipping } from "@/types/pr-crm";

interface CompletedWorkFeedProps {
  clippings: Clipping[];
}

export default function CompletedWorkFeed({ clippings }: CompletedWorkFeedProps) {
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredClippings = clippings.filter((clip) => {
    const matchesType = selectedType === "todos" || clip.coverage_type === selectedType;
    const matchesSearch =
      clip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clip.outlet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getMediaIcon = (type: Clipping["coverage_type"]) => {
    switch (type) {
      case "televisao":
        return <Tv className="w-3.5 h-3.5 text-rose-500" />;
      case "imprensa_escrita":
        return <Newspaper className="w-3.5 h-3.5 text-blue-500" />;
      case "radio":
        return <Radio className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const getSentimentPill = (sentiment: Clipping["sentiment"]) => {
    switch (sentiment) {
      case "muito_positivo":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Muito Positivo
          </span>
        );
      case "positivo":
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Positivo
          </span>
        );
      case "neutro":
        return (
          <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
            Neutro
          </span>
        );
      default:
        return (
          <span className="bg-red-50 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Atenção
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              O Que Já Foi Feito: Histórico de Cobertura & Impacto
            </h3>
            <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
              42 Resultados Aprovados
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Artigos publicados, entrevistas realizadas e valor de AVE (Retorno de Relações Públicas).
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por meio ou título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200/70 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs">
            <button
              onClick={() => setSelectedType("todos")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedType === "todos" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedType("online")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedType === "online" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500"
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setSelectedType("imprensa_escrita")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedType === "imprensa_escrita" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500"
              }`}
            >
              Imprensa Escrita
            </button>
            <button
              onClick={() => setSelectedType("televisao")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedType === "televisao" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-500"
              }`}
            >
              TV
            </button>
          </div>
        </div>
      </div>

      {/* Clippings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {filteredClippings.map((clip) => (
          <div
            key={clip.id}
            className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col justify-between group space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  {getMediaIcon(clip.coverage_type)}
                  <span>{clip.outlet}</span>
                  {clip.media_tier === "tier_1" && (
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                      Tier 1
                    </span>
                  )}
                </div>
                {getSentimentPill(clip.sentiment)}
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                {clip.title}
              </h4>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {clip.summary}
              </p>
            </div>

            {/* Metrics Footer for each clipping */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Alcance Estimado</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {clip.reach_impressions.toLocaleString("pt-PT")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Equivalência AVE</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    € {clip.ave_value_eur.toLocaleString("pt-PT")}
                  </span>
                </div>
              </div>

              {clip.url && (
                <a
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                  title="Abrir artigo original"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-500" />
          <span className="font-medium">Total de Valor AVE Acumulado este Trimestre: <strong>€ 142.800</strong></span>
        </div>
        <span className="text-[11px] text-slate-400">Dados sincronizados com o Supabase</span>
      </div>
    </div>
  );
}
