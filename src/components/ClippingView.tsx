"use client";

import React, { useState } from "react";
import { Clipping, SentimentType, CoverageType, MediaTier } from "@/types/pr-crm";
import { ArrowLeft, ExternalLink, Search, TrendingUp, Users, DollarSign, Newspaper } from "lucide-react";

interface ClippingViewProps {
  clippings: Clipping[];
  onBackToDashboard: () => void;
}

export const ClippingView: React.FC<ClippingViewProps> = ({
  clippings,
  onBackToDashboard,
}) => {
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [coverageFilter, setCoverageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getSentimentBadge = (sentiment: SentimentType) => {
    switch (sentiment) {
      case "muito_positivo":
        return { text: "Muito Positivo", class: "bg-[#DDEBDD] text-[#2F6B3A]" };
      case "positivo":
        return { text: "Positivo", class: "bg-[#DDEBDD] text-[#2F6B3A]" };
      case "neutro":
        return { text: "Neutro", class: "bg-[#E9E5E0] text-[#5C554E]" };
      case "negativo":
        return { text: "Negativo", class: "bg-[#F6D9D5] text-[#A3281E]" };
      case "critico":
        return { text: "Crítico", class: "bg-[#F6D9D5] text-[#A3281E]" };
      default:
        return { text: sentiment, class: "bg-[#E9E5E0] text-[#5C554E]" };
    }
  };

  const getTierBadge = (tier: MediaTier) => {
    switch (tier) {
      case "tier_1":
        return "bg-[#6C1C37]/10 text-[#6C1C37] font-semibold";
      case "tier_2":
        return "bg-[#DCE7F0] text-[#2C5576]";
      case "tier_3":
        return "bg-[#E9E5E0] text-[#5C554E]";
      default:
        return "bg-[#EDE6DE] text-[#6B6B6B]";
    }
  };

  const filteredClippings = clippings.filter((clip) => {
    if (sentimentFilter === "positive" && clip.sentiment !== "positivo" && clip.sentiment !== "muito_positivo") return false;
    if (sentimentFilter === "neutral" && clip.sentiment !== "neutro") return false;
    if (sentimentFilter === "negative" && clip.sentiment !== "negativo" && clip.sentiment !== "critico") return false;
    if (coverageFilter !== "all" && clip.coverage_type !== coverageFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (clip.title || "").toLowerCase().includes(q);
      const matchOutlet = clip.outlet.toLowerCase().includes(q);
      const matchJourn = (clip.journalist_name || "").toLowerCase().includes(q);
      if (!matchTitle && !matchOutlet && !matchJourn) return false;
    }
    return true;
  });

  const totalAve = clippings.reduce((sum, c) => sum + (c.ave_value_eur || 0), 0);
  const totalReach = clippings.reduce((sum, c) => sum + (c.reach_impressions || 0), 0);
  const positiveCount = clippings.filter((c) => c.sentiment === "positivo" || c.sentiment === "muito_positivo").length;
  const neutralCount = clippings.filter((c) => c.sentiment === "neutro").length;
  const negativeCount = clippings.filter((c) => c.sentiment === "negativo" || c.sentiment === "critico").length;

  return (
    <div className="space-y-6 fade-in">
      {/* Barra de Navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl border border-[#E4DDD3] bg-white hover:bg-[#F6F2EC] text-[#1A1A1A] transition-all"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#1A1A1A] font-title">Peças Publicadas &amp; Clipping de Imprensa</h1>
            <p className="text-xs text-[#6B6B6B]">
              Cobertura mediática conquistada, impacto quantitativo e auditoria de sentimento editorial.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#6B6B6B]">
          Período: <span className="font-medium text-[#1A1A1A]">Novembro 2026</span>
        </div>
      </div>

      {/* Cartões de Indicadores Executivos de Clipping */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5 text-[#6C1C37]" /> Peças no Mês
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title">{clippings.length}</span>
          </div>
          <span className="text-[11px] text-[#2F6B3A] font-medium">+6 face ao mês anterior</span>
        </div>

        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#6C1C37]" /> Valor AVE Total
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-mono font-title">
              € {totalAve.toLocaleString("pt-PT")}
            </span>
          </div>
          <span className="text-[11px] text-[#6B6B6B]">Equivalência publicitária</span>
        </div>

        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#6C1C37]" /> Alcance Auditado
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-mono font-title">
              {(totalReach / 1000000).toFixed(2)}M
            </span>
          </div>
          <span className="text-[11px] text-[#6B6B6B]">Leitores &amp; espetadores estimados</span>
        </div>

        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#6C1C37]" /> Sentimento Médio
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#2F6B3A] font-title">88%</span>
          </div>
          <span className="text-[11px] text-[#6B6B6B]">Favorabilidade de pauta</span>
        </div>
      </div>

      {/* Cartão de Lista com Filtros */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E4DDD3]/60">
          {/* Filtros de Sentimento */}
          <div className="flex gap-1.5 bg-[#EDE6DE]/50 p-1 rounded-xl">
            <button
              onClick={() => setSentimentFilter("all")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sentimentFilter === "all" ? "bg-white text-[#1A1A1A] shadow-xs" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              Todas ({clippings.length})
            </button>
            <button
              onClick={() => setSentimentFilter("positive")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sentimentFilter === "positive" ? "bg-white text-[#2F6B3A] shadow-xs" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              Positivas ({positiveCount})
            </button>
            <button
              onClick={() => setSentimentFilter("neutral")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sentimentFilter === "neutral" ? "bg-white text-[#5C554E] shadow-xs" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              Neutras ({neutralCount})
            </button>
            <button
              onClick={() => setSentimentFilter("negative")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                sentimentFilter === "negative" ? "bg-white text-[#A3281E] shadow-xs" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              Negativas ({negativeCount})
            </button>
          </div>

          {/* Formato & Pesquisa */}
          <div className="flex items-center gap-2">
            <select
              value={coverageFilter}
              onChange={(e) => setCoverageFilter(e.target.value)}
              className="text-xs border border-[#E4DDD3] rounded-xl px-2.5 py-1.5 bg-white text-[#1A1A1A] outline-none"
            >
              <option value="all">Todos os formatos</option>
              <option value="online">Online</option>
              <option value="imprensa_escrita">Imprensa Escrita</option>
              <option value="televisao">Televisão</option>
              <option value="radio">Rádio</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar título ou meio..."
                className="pl-8 pr-3 py-1.5 text-xs border border-[#E4DDD3] rounded-xl bg-white text-[#1A1A1A] focus:outline-none focus:border-[#6C1C37] w-48 sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Lista de Peças */}
        {filteredClippings.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6B6B6B]">
            Nenhuma peça encontrada para os critérios selecionados.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClippings.map((clip) => {
              const badge = getSentimentBadge(clip.sentiment);
              return (
                <div
                  key={clip.id}
                  className="p-4 rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white hover:border-[#6C1C37]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${getTierBadge(clip.media_tier)}`}>
                        {clip.media_tier.replace("_", " ")}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] font-title truncate">
                        {clip.title}
                      </h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge.class}`}>
                        {badge.text}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6B6B] line-clamp-2">{clip.summary}</p>

                    <div className="flex items-center gap-3 text-[11px] text-[#6B6B6B]">
                      <span className="font-medium text-[#1A1A1A]">{clip.outlet}</span>
                      <span>•</span>
                      <span>{clip.journalist_name || "Redação"}</span>
                      <span>•</span>
                      <span className="font-mono">{clip.published_at}</span>
                      <span>•</span>
                      <span className="capitalize">{clip.coverage_type.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E4DDD3]/60">
                    <div className="text-left md:text-right">
                      <span className="text-xs sm:text-sm font-semibold text-[#1A1A1A] font-mono">
                        € {clip.ave_value_eur.toLocaleString("pt-PT")}
                      </span>
                      <p className="text-[10px] text-[#6B6B6B]">{clip.reach_impressions.toLocaleString("pt-PT")} alcance</p>
                    </div>

                    {clip.url && (
                      <a
                        href={clip.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-[11px] text-[#6C1C37] hover:underline font-medium flex items-center gap-1"
                      >
                        Abrir artigo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClippingView;
