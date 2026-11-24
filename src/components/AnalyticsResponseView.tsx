"use client";

import React from "react";
import { ArrowLeft, MessageSquare, Phone, Mail, Clock, BarChart3, TrendingUp, Users } from "lucide-react";

interface AnalyticsResponseViewProps {
  onBackToDashboard: () => void;
}

export const AnalyticsResponseView: React.FC<AnalyticsResponseViewProps> = ({
  onBackToDashboard,
}) => {
  const channelData = [
    {
      name: "WhatsApp Direto",
      icon: MessageSquare,
      rate: 68,
      sent: 34,
      replied: 23,
      avgTime: "1.5 horas",
      color: "#1F5B57",
      bgColor: "#D5E8E5",
    },
    {
      name: "Contacto Telefónico",
      icon: Phone,
      rate: 52,
      sent: 25,
      replied: 13,
      avgTime: "Imediato",
      color: "#3F5A2E",
      bgColor: "#DFE7D6",
    },
    {
      name: "Email / Pitch Editorial",
      icon: Mail,
      rate: 28,
      sent: 49,
      replied: 14,
      avgTime: "8.4 horas",
      color: "#2C5576",
      bgColor: "#DCE7F0",
    },
  ];

  const teamData = [
    {
      name: "Leonor Rodrigues",
      role: "Diretora de Contas & RP",
      contacts: 48,
      replies: 20,
      rate: 42,
      clippingsGenerated: 12,
    },
    {
      name: "Sofia Ramos",
      role: "Assessora Sénior de Imprensa",
      contacts: 36,
      replies: 14,
      rate: 39,
      clippingsGenerated: 9,
    },
    {
      name: "Gonçalo Neves",
      role: "Consultor de Comunicação Júnior",
      contacts: 24,
      replies: 7,
      rate: 29,
      clippingsGenerated: 3,
    },
  ];

  const outletData = [
    { outlet: "Expresso", pitched: 17, replied: 11, rate: 65 },
    { outlet: "ECO Economia Online", pitched: 15, replied: 9, rate: 60 },
    { outlet: "Público", pitched: 16, replied: 8, rate: 50 },
    { outlet: "RTP (Informação)", pitched: 10, replied: 4, rate: 40 },
    { outlet: "Jornal de Negócios", pitched: 13, replied: 4, rate: 31 },
  ];

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
            <h1 className="text-xl font-semibold text-[#1A1A1A] font-title">Taxas de Resposta &amp; Eficácia Editorial</h1>
            <p className="text-xs text-[#6B6B6B]">
              Diagnóstico detalhado dos últimos 30 dias de pautas propostas às redações e retorno obtido.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#6B6B6B]">
          Amostra: <span className="font-semibold text-[#1A1A1A]">108 contactos</span>
        </div>
      </div>

      {/* Cartões Executivos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#6C1C37]" /> Taxa Global de Resposta
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title">38%</span>
          </div>
          <span className="text-[11px] text-[#2F6B3A] font-medium">+4% face à média do setor</span>
        </div>

        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#6C1C37]" /> Contactos Iniciados
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title">108</span>
          </div>
          <span className="text-[11px] text-[#6B6B6B]">Pitches e comunicados</span>
        </div>

        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[#6C1C37]" /> Retornos Concretos
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title">41</span>
          </div>
          <span className="text-[11px] text-[#6B6B6B]">Interações com resposta</span>
        </div>

        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-card">
          <span className="text-xs font-medium text-[#6B6B6B] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#6C1C37]" /> Tempo Médio de Resposta
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title">4.2h</span>
          </div>
          <span className="text-[11px] text-[#6B6B6B]">Desde o primeiro envio</span>
        </div>
      </div>

      {/* Grelha de Duas Colunas: Desempenho por Canal & Eficácia por Meio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna 1 (6 cols): Desempenho por Canal */}
        <div className="lg:col-span-6 bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-card space-y-4">
          <div className="pb-3 border-b border-[#E4DDD3]/60">
            <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Conversão por Canal de Contacto</h3>
            <p className="text-[11px] text-[#6B6B6B]">Comparação entre abordagens diretas e transmissões gerais</p>
          </div>

          <div className="space-y-4">
            {channelData.map((channel) => {
              const IconComp = channel.icon;
              return (
                <div key={channel.name} className="p-3.5 rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: channel.bgColor, color: channel.color }}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#1A1A1A]">{channel.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1A1A1A] font-title">{channel.rate}%</span>
                      <span className="text-[10px] text-[#6B6B6B]">({channel.replied}/{channel.sent})</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#EDE6DE] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${channel.rate}%`, backgroundColor: channel.color }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[#6B6B6B]">
                    <span>Tempo médio de retorno: <strong className="text-[#1A1A1A]">{channel.avgTime}</strong></span>
                    <span>Eficácia: {channel.rate >= 50 ? "Alta" : "Média"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 2 (6 cols): Abertura por Órgão de Comunicação */}
        <div className="lg:col-span-6 bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-card space-y-4">
          <div className="pb-3 border-b border-[#E4DDD3]/60">
            <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Receptividade por Órgão de Comunicação</h3>
            <p className="text-[11px] text-[#6B6B6B]">Meios de comunicação com maior taxa de acolhimento de pautas</p>
          </div>

          <div className="divide-y divide-[#E4DDD3]/60">
            {outletData.map((out) => (
              <div key={out.outlet} className="py-2.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A1A]">{out.outlet}</h4>
                  <p className="text-[10px] text-[#6B6B6B]">
                    {out.replied} respostas em {out.pitched} abordagens
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-semibold font-title px-2.5 py-0.5 rounded-full ${
                      out.rate >= 50
                        ? "bg-[#DDEBDD] text-[#2F6B3A]"
                        : "bg-[#DCE7F0] text-[#2C5576]"
                    }`}
                  >
                    {out.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bloco Inferior: Produtividade e Desempenho por Consultor */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-card space-y-4">
        <div className="pb-3 border-b border-[#E4DDD3]/60">
          <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Produtividade Editorial por Membro da Equipa</h3>
          <p className="text-[11px] text-[#6B6B6B]">Métricas quantitativas individuais nos últimos 30 dias</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4DDD3] text-[#6B6B6B] font-medium text-[11px]">
                <th className="py-2.5 px-3">Consultor / Assessor</th>
                <th className="py-2.5 px-3">Cargo</th>
                <th className="py-2.5 px-3">Contactos Realizados</th>
                <th className="py-2.5 px-3">Respostas Obtidas</th>
                <th className="py-2.5 px-3">Taxa de Resposta</th>
                <th className="py-2.5 px-3">Peças Geradas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DDD3]/60">
              {teamData.map((member) => (
                <tr key={member.name} className="hover:bg-[#FBF9F6]">
                  <td className="py-3 px-3 font-semibold text-[#1A1A1A]">{member.name}</td>
                  <td className="py-3 px-3 text-[#6B6B6B]">{member.role}</td>
                  <td className="py-3 px-3 text-[#1A1A1A] font-mono">{member.contacts}</td>
                  <td className="py-3 px-3 text-[#1A1A1A] font-mono">{member.replies}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[#6C1C37]">{member.rate}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#DDEBDD] text-[#2F6B3A] font-medium">
                      {member.clippingsGenerated} peças
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsResponseView;
