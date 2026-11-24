"use client";

import React, { useState, useMemo } from "react";
import { Journalist, MediaOutlet, ContactPreference, JournalistStatus } from "@/types/pr-crm";
import { AVAILABLE_SPECIALTIES } from "@/lib/mock-data";
import {
  Search,
  Filter,
  ArrowLeft,
  Plus,
  Download,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Columns3,
  Clock,
  UserCheck,
  UserX,
  FileText,
  Trash2
} from "lucide-react";

interface JournalistsViewProps {
  journalists: Journalist[];
  outlets?: MediaOutlet[];
  onBackToDashboard: () => void;
  onLogContactWithJournalist?: (journalist: Journalist) => void;
  onOpenOutletDetail?: (outletNameOrId: string) => void;
  canEdit?: boolean;
}

type SortField = 'name' | 'outlet_name' | 'role_title' | 'last_contact_date' | 'status';
type SortOrder = 'asc' | 'desc';

export const JournalistsView: React.FC<JournalistsViewProps> = ({
  journalists: initialJournalists,
  outlets = [],
  onBackToDashboard,
  onLogContactWithJournalist,
  onOpenOutletDetail,
  canEdit = true,
}) => {
  const [journalistsList, setJournalistsList] = useState<Journalist[]>(initialJournalists);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Visibilidade de colunas
  const [visibleColumns, setVisibleColumns] = useState({
    role: true,
    outlets: true,
    contacts: true,
    areas: true,
    lastContact: true,
    rgpd: true,
    status: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Ficha de Detalhe (Drawer)
  const [selectedJournalist, setSelectedJournalist] = useState<Journalist | null>(null);

  // Modal Novo / Editar Jornalista
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJournalist, setEditingJournalist] = useState<Journalist | null>(null);

  // Modal Importar CSV
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");

  // Alternar ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteJournalist = (id: string, name: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar o jornalista "${name}"? Esta ação não pode ser desfeita.`)) return;
    setJournalistsList(prev => prev.filter(j => j.id !== id));
    if (selectedJournalist?.id === id) {
      setSelectedJournalist(null);
    }
  };

  // Filtragem e Ordenação
  const filteredJournalists = useMemo(() => {
    return journalistsList.filter((j) => {
      // Filtro de Estado
      if (selectedStatus !== "all" && j.status !== selectedStatus) {
        return false;
      }
      // Filtro de Área
      if (selectedArea !== "all") {
        const areas = j.intervention_areas || [];
        if (!areas.some(a => a.toLowerCase().includes(selectedArea.toLowerCase()))) {
          return false;
        }
      }
      // Pesquisa por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = j.name.toLowerCase().includes(q);
        const matchOutlet = (j.outlet_name || "").toLowerCase().includes(q) ||
          (j.outlet_names || []).some(o => o.toLowerCase().includes(q));
        const matchRole = (j.role_title || "").toLowerCase().includes(q);
        const matchAreas = (j.intervention_areas || []).some(a => a.toLowerCase().includes(q));
        const matchEmail = (j.emails || []).some(e => e.toLowerCase().includes(q));
        if (!matchName && !matchOutlet && !matchRole && !matchAreas && !matchEmail) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let valA = "";
      let valB = "";
      if (sortField === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortField === 'outlet_name') {
        valA = a.outlet_name || "";
        valB = b.outlet_name || "";
      } else if (sortField === 'role_title') {
        valA = a.role_title || "";
        valB = b.role_title || "";
      } else if (sortField === 'last_contact_date') {
        valA = a.last_contact_date || "";
        valB = b.last_contact_date || "";
      } else if (sortField === 'status') {
        valA = a.status;
        valB = b.status;
      }
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [journalistsList, searchQuery, selectedArea, selectedStatus, sortField, sortOrder]);

  // Exportar para CSV
  const handleExportCsv = () => {
    const headers = ["Nome", "Cargo", "Meios", "Emails", "Telemóveis", "Preferência", "Áreas", "Estado", "Último Contacto", "Origem", "Consentimento RGPD", "Data RGPD", "Notas"];
    const rows = filteredJournalists.map(j => [
      `"${j.name}"`,
      `"${j.role_title || ""}"`,
      `"${(j.outlet_names || [j.outlet_name]).join(", ")}"`,
      `"${(j.emails || []).join("; ")}"`,
      `"${(j.phones || []).join("; ")}"`,
      `"${j.contact_preference}"`,
      `"${(j.intervention_areas || []).join("; ")}"`,
      `"${j.status}"`,
      `"${j.last_contact_date || ""}"`,
      `"${j.contact_origin || ""}"`,
      `"${j.rgpd_consent ? "Sim" : "Não"}"`,
      `"${j.rgpd_consent_date || ""}"`,
      `"${(j.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jornalistas_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Importar de CSV
  const handleImportCsv = () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return;

    const imported: Journalist[] = [];
    // Linha 0 é cabeçalho
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map(p => p.trim().replace(/^"|"$/g, ""));
      if (parts[0]) {
        const item: Journalist = {
          id: "jour-csv-" + Date.now() + "-" + i,
          name: parts[0],
          role_title: parts[1] || "Jornalista",
          outlet_name: parts[2] ? parts[2].split(";")[0].trim() : "Geral",
          outlet_names: parts[2] ? parts[2].split(";").map(s => s.trim()) : ["Geral"],
          emails: parts[3] ? parts[3].split(";").map(s => s.trim()) : [],
          phones: parts[4] ? parts[4].split(";").map(s => s.trim()) : [],
          contact_preference: (parts[5] as ContactPreference) || "email",
          intervention_areas: parts[6] ? parts[6].split(";").map(s => s.trim()) : ["Geral"],
          status: (parts[7] as JournalistStatus) || "ativo",
          last_contact_date: parts[8] || "",
          contact_origin: parts[9] || "Importação CSV",
          rgpd_consent: parts[10] ? parts[10].toLowerCase().includes("sim") : true,
          rgpd_consent_date: parts[11] || new Date().toISOString().split("T")[0],
          notes: parts[12] || "",
          updated_at: new Date().toISOString(),
        };
        imported.push(item);
      }
    }

    if (imported.length > 0) {
      setJournalistsList(prev => [...imported, ...prev]);
      setIsCsvModalOpen(false);
      setCsvText("");
    }
  };

  // Encontrar Outlet associado para obter o logo
  const getOutletData = (nameOrId?: string) => {
    if (!nameOrId) return null;
    return outlets.find(o => o.id === nameOrId || o.name.toLowerCase() === nameOrId.toLowerCase()) || null;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* 1. TOPO & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl border border-[#E4DDD3] bg-white hover:bg-[#F6F2EC] text-[#1A1A1A] transition-all cursor-pointer shadow-2xs"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-title">
              Base de Dados de Jornalistas
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Fichas profissionais, órgãos associados, histórico de contacto e conformidade RGPD.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão Exportar dados */}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white text-[#1A1A1A] border border-[#E4DDD3] hover:bg-[#F6F2EC] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Exportar dados para CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Exportar dados</span>
          </button>

          {/* Botão Adicionar Jornalista */}
          {canEdit && (
            <button
              onClick={() => {
                setEditingJournalist(null);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar Jornalista</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. BARRA DE PESQUISA */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, cargo, OCS, área ou notas..."
            className="w-full bg-[#FBF9F6] border border-[#E4DDD3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-2xs"
          />
        </div>
      </div>

      {/* Totalizador de Resultados */}
      <div className="flex items-center justify-between text-xs text-[#6B6B6B] px-1">
        <span>{filteredJournalists.length} de {journalistsList.length} jornalistas listados</span>
        <span className="text-[11px]">Clica num jornalista para abrir a ficha detalhada</span>
      </div>

      {/* 3. TABELA DE JORNALISTAS */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4DDD3] text-[#6B6B6B] font-medium text-[11px] bg-[#FBF9F6]">
                <th className="py-3 px-3">Nome do Jornalista</th>
                <th className="py-3 px-3">Cargo</th>
                <th className="py-3 px-3">Órgão (OCS)</th>
                <th className="py-3 px-3">Contactos Diretos</th>
                <th className="py-3 px-3">Área de Intervenção</th>
                <th className="py-3 px-3">Último Contacto</th>
                <th className="py-3 px-3">RGPD</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E4DDD3]/60">
              {filteredJournalists.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#6B6B6B]">
                    <p className="font-medium text-[#1A1A1A] mb-1">Nenhum jornalista encontrado com os filtros aplicados.</p>
                    <p>Altera a pesquisa ou os filtros para visualizares mais registos.</p>
                  </td>
                </tr>
              ) : (
                filteredJournalists.map((j) => {
                  const primaryOutlet = getOutletData(j.outlet_name);
                  const allOutlets = j.outlet_names || [j.outlet_name];

                  return (
                    <tr
                      key={j.id}
                      onClick={() => setSelectedJournalist(j)}
                      className="hover:bg-[#FBF9F6] transition-colors cursor-pointer group"
                    >
                      {/* Nome do Jornalista */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#EDE6DE] text-[#1A1A1A] font-semibold flex items-center justify-center text-xs shrink-0 font-title border border-[#D1C7BA]">
                            {j.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors">
                              {j.name}
                            </span>
                            {j.contact_origin && (
                              <p className="text-[10px] text-[#8A8A8A] truncate max-w-[150px]">
                                {j.contact_origin}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cargo Editorial */}
                      {visibleColumns.role && (
                        <td className="py-3 px-3 text-[#6B6B6B]">
                          {j.role_title || "Jornalista"}
                        </td>
                      )}

                      {/* Meios Associados com Logo */}
                      {visibleColumns.outlets && (
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {allOutlets.map((outletName) => {
                              const oData = getOutletData(outletName);
                              return (
                                <button
                                  key={outletName}
                                  onClick={() => onOpenOutletDetail ? onOpenOutletDetail(outletName) : null}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3] hover:border-[#6C1C37] hover:text-[#6C1C37] transition-all cursor-pointer"
                                  title={`Ver ficha de ${outletName}`}
                                >
                                  {oData?.logo_url ? (
                                    <img src={oData.logo_url} alt="" className="w-3.5 h-3.5 rounded object-cover" />
                                  ) : (
                                    <Building2 className="w-3 h-3 text-[#8A8A8A]" />
                                  )}
                                  <span>{outletName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      )}

                      {/* Contactos & Preferência */}
                      {visibleColumns.contacts && (
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-1">
                            {j.emails && j.emails.length > 0 && (
                              <a
                                href={`mailto:${j.emails[0]}`}
                                className="text-[11px] text-[#1A1A1A] hover:text-[#6C1C37] hover:underline flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-[#8A8A8A]" />
                                <span>{j.emails[0]}</span>
                              </a>
                            )}
                            {j.phones && j.phones.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
                                <Phone className="w-3 h-3 text-[#8A8A8A]" />
                                <span>{j.phones[0]}</span>
                                {j.contact_preference === 'whatsapp' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E3EFE3] text-[#2F6B3A]">WA</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Áreas de Intervenção */}
                      {visibleColumns.areas && (
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {(j.intervention_areas || []).map((area) => (
                              <span
                                key={area}
                                className="px-2 py-0.5 rounded-md bg-[#EDE6DE] text-[#5C554E] font-medium text-[10px]"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}

                      {/* Último Contacto */}
                      {visibleColumns.lastContact && (
                        <td className="py-3 px-3">
                          {j.last_contact_date ? (
                            <div>
                              <span className="font-mono text-[#1A1A1A]">{j.last_contact_date}</span>
                              {j.days_inactive !== undefined && (
                                <p className={`text-[10px] ${j.days_inactive >= 90 ? 'text-[#A3281E] font-medium' : 'text-[#8A8A8A]'}`}>
                                  {j.days_inactive === 0 ? "Hoje" : `há ${j.days_inactive} dias`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#8A8A8A] text-[11px]">—</span>
                          )}
                        </td>
                      )}

                      {/* RGPD */}
                      {visibleColumns.rgpd && (
                        <td className="py-3 px-3 text-center">
                          {j.rgpd_consent ? (
                            <span
                              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#2F6B3A] bg-[#E3EFE3] px-2 py-0.5 rounded-full"
                              title={`Consentimento RGPD válido desde ${j.rgpd_consent_date || "2026"}`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Sim</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-[#A3281E] bg-[#FDF6F5] px-2 py-0.5 rounded-full">
                              Pendente
                            </span>
                          )}
                        </td>
                      )}

                      {/* Estado */}
                      {visibleColumns.status && (
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              j.status === 'ativo'
                                ? 'bg-[#E3EFE3] text-[#2F6B3A]'
                                : j.status === 'mudou_de_meio'
                                ? 'bg-[#FDFBF2] text-[#805B00] border border-[#E8DFBA]'
                                : 'bg-[#EDE6DE] text-[#8A8A8A]'
                            }`}
                          >
                            {j.status === 'ativo' ? 'Ativo' : j.status === 'mudou_de_meio' ? 'Mudou de Meio' : 'Reformado'}
                          </span>
                        </td>
                      )}

                      {/* Ações */}
                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {onLogContactWithJournalist && (
                            <button
                              onClick={() => onLogContactWithJournalist(j)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] transition-colors cursor-pointer"
                              title="Registar contacto com este jornalista"
                            >
                              Contactar
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedJournalist(j)}
                            className="p-1 rounded-lg hover:bg-[#EDE6DE] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                            title="Ver ficha completa"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleDeleteJournalist(j.id, j.name)}
                              className="p-1 rounded-lg hover:bg-[#FBEAE8] text-[#8A8A8A] hover:text-[#A3281E] transition-colors"
                              title="Eliminar jornalista"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. GAVETA / FICHA COMPLETA DO JORNALISTA (DRAWER) */}
      {selectedJournalist && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Cabeçalho da Ficha */}
            <div className="p-6 border-b border-[#E4DDD3] bg-[#FBF9F6]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#EDE6DE] text-[#1A1A1A] font-bold text-base flex items-center justify-center border border-[#D1C7BA] font-title">
                    {selectedJournalist.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] font-title">
                      {selectedJournalist.name}
                    </h2>
                    <p className="text-xs text-[#6B6B6B]">
                      {selectedJournalist.role_title || "Jornalista"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      selectedJournalist.status === 'ativo'
                        ? 'bg-[#E3EFE3] text-[#2F6B3A]'
                        : selectedJournalist.status === 'mudou_de_meio'
                        ? 'bg-[#FDFBF2] text-[#805B00] border border-[#E8DFBA]'
                        : 'bg-[#EDE6DE] text-[#8A8A8A]'
                    }`}
                  >
                    {selectedJournalist.status === 'ativo' ? 'Ativo' : selectedJournalist.status === 'mudou_de_meio' ? 'Mudou de Meio' : 'Reformado'}
                  </span>
                  <button
                    onClick={() => setSelectedJournalist(null)}
                    className="p-1 rounded-lg hover:bg-[#E4DDD3]/60 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo da Ficha */}
            <div className="p-6 space-y-6 flex-1 text-xs text-[#1A1A1A]">
              {/* Meios de Comunicação Social Associados com Logo */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider">
                  Órgãos de Comunicação Social (OCS)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedJournalist.outlet_names || [selectedJournalist.outlet_name]).map((outName) => {
                    const outData = getOutletData(outName);
                    return (
                      <div
                        key={outName}
                        onClick={() => {
                          if (onOpenOutletDetail) {
                            setSelectedJournalist(null);
                            onOpenOutletDetail(outName);
                          }
                        }}
                        className="p-3 rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white hover:border-[#6C1C37] transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {outData?.logo_url ? (
                            <img src={outData.logo_url} alt="" className="w-7 h-7 rounded-lg object-cover border border-[#E4DDD3]" />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-[#EDE6DE] flex items-center justify-center font-bold text-[#6C1C37]">
                              {outName[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                              {outName}
                            </h4>
                            <p className="text-[10px] text-[#6B6B6B] truncate">
                              {outData?.media_group || "Órgão Nacional"}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#8A8A8A] group-hover:text-[#6C1C37] shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contactos Directos & Preferência */}
              <div className="space-y-3 pt-4 border-t border-[#E4DDD3]/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider">
                    Contactos & Canais
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EDE6DE] text-[#1A1A1A] font-medium">
                    Preferência: <strong>{selectedJournalist.contact_preference.toUpperCase()}</strong>
                  </span>
                </div>

                <div className="space-y-2 bg-[#FBF9F6] p-3.5 rounded-xl border border-[#E4DDD3]/70">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Emails</span>
                    {(selectedJournalist.emails || []).map((email, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <a href={`mailto:${email}`} className="text-xs text-[#6C1C37] hover:underline flex items-center gap-1.5 font-medium">
                          <Mail className="w-3.5 h-3.5 text-[#8A8A8A]" />
                          <span>{email}</span>
                        </a>
                        <span className="text-[10px] text-[#8A8A8A]">{idx === 0 ? "Principal" : "Secundário"}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E4DDD3]/60 space-y-1">
                    <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Telemóveis / WhatsApp</span>
                    {(selectedJournalist.phones || []).map((phone, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <a href={`tel:${phone}`} className="text-xs text-[#1A1A1A] hover:text-[#6C1C37] flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-[#8A8A8A]" />
                          <span>{phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#2F6B3A] font-medium hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Áreas de Intervenção */}
              <div className="space-y-2 pt-4 border-t border-[#E4DDD3]/60">
                <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider">
                  Áreas de Intervenção Editorial
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedJournalist.intervention_areas || []).map((area) => (
                    <span key={area} className="px-2.5 py-1 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3] text-xs font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links e Redes Sociais */}
              {selectedJournalist.links && (
                <div className="space-y-2 pt-4 border-t border-[#E4DDD3]/60">
                  <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider">
                    Presença Online & Autoria
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJournalist.links.linkedin && (
                      <a href={selectedJournalist.links.linkedin} target="_blank" rel="noreferrer" className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedJournalist.links.twitter_x && (
                      <a href={selectedJournalist.links.twitter_x} target="_blank" rel="noreferrer" className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span>X (Twitter)</span>
                      </a>
                    )}
                    {selectedJournalist.links.author_page && (
                      <a href={selectedJournalist.links.author_page} target="_blank" rel="noreferrer" className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span>Página de Autor</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* RGPD, Origem e Histórico */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E4DDD3]/60 bg-[#FBF9F6] p-3.5 rounded-xl border border-[#E4DDD3]/70">
                <div>
                  <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Consentimento RGPD</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-[#2F6B3A] mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{selectedJournalist.rgpd_consent ? "Válido" : "Pendente"}</span>
                  </div>
                  {selectedJournalist.rgpd_consent_date && (
                    <span className="text-[10px] text-[#8A8A8A] block">Data: {selectedJournalist.rgpd_consent_date}</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Último Contacto</span>
                  <span className="text-xs font-medium text-[#1A1A1A] block mt-0.5">
                    {selectedJournalist.last_contact_date || "Sem registo prévio"}
                  </span>
                  {selectedJournalist.days_inactive !== undefined && (
                    <span className="text-[10px] text-[#8A8A8A] block">Inativo há {selectedJournalist.days_inactive} dias</span>
                  )}
                </div>
              </div>

              {/* Notas e Observações */}
              {selectedJournalist.notes && (
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Notas Operacionais</span>
                  <p className="p-3 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/60 text-xs text-[#6B6B6B] leading-relaxed">
                    {selectedJournalist.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Rodapé da Ficha */}
            <div className="p-4 border-t border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between text-xs text-[#8A8A8A]">
              <div className="flex items-center gap-2">
                <span>Atualizado: {selectedJournalist.updated_at ? new Date(selectedJournalist.updated_at).toLocaleDateString("pt-PT") : "Hoje"}</span>
                {canEdit && (
                  <button
                    onClick={() => handleDeleteJournalist(selectedJournalist.id, selectedJournalist.name)}
                    className="px-2.5 py-1 text-xs font-medium text-[#A3281E] hover:bg-[#FBEAE8] border border-[#F5C2BE] rounded-lg transition-colors cursor-pointer ml-2"
                  >
                    Eliminar Jornalista
                  </button>
                )}
              </div>
              {onLogContactWithJournalist && (
                <button
                  onClick={() => {
                    onLogContactWithJournalist(selectedJournalist);
                    setSelectedJournalist(null);
                  }}
                  className="btn-primary py-1.5 px-4 text-xs font-medium"
                >
                  Registar Contacto
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL NOVO JORNALISTA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden">
            <div className="p-5 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">
                  {editingJournalist ? "Editar Ficha de Jornalista" : "Adicionar Novo Jornalista"}
                </h3>
                <p className="text-[11px] text-[#6B6B6B]">
                  Registo em conformidade com RGPD e associação a múltiplos órgãos.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B6B6B] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("j-name") as HTMLInputElement).value;
                const role = (form.elements.namedItem("j-role") as HTMLInputElement).value;
                const outlet = (form.elements.namedItem("j-outlet") as HTMLInputElement).value;
                const email = (form.elements.namedItem("j-email") as HTMLInputElement).value;
                const phone = (form.elements.namedItem("j-phone") as HTMLInputElement).value;
                const area = (form.elements.namedItem("j-area") as HTMLSelectElement).value;
                const pref = (form.elements.namedItem("j-pref") as HTMLSelectElement).value as ContactPreference;
                const origin = (form.elements.namedItem("j-origin") as HTMLInputElement).value;
                const notes = (form.elements.namedItem("j-notes") as HTMLTextAreaElement).value;

                const newJ: Journalist = {
                  id: "jour-" + Date.now(),
                  name,
                  role_title: role || "Jornalista",
                  outlet_name: outlet || "Geral",
                  outlet_names: [outlet || "Geral"],
                  emails: email ? [email] : [],
                  phones: phone ? [phone] : [],
                  contact_preference: pref || "email",
                  intervention_areas: [area || "Economia & Negócios"],
                  status: "ativo",
                  contact_origin: origin || "Registo Direto",
                  rgpd_consent: true,
                  rgpd_consent_date: new Date().toISOString().split("T")[0],
                  notes,
                  updated_at: new Date().toISOString(),
                };

                setJournalistsList([newJ, ...journalistsList]);
                setIsModalOpen(false);
              }}
              className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs"
            >
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Nome Completo *</label>
                <input required name="j-name" type="text" placeholder="Ex: Marta Figueiredo" className="crm-input" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Cargo Editorial</label>
                  <input name="j-role" type="text" placeholder="Ex: Editor de Economia, Grande Repórter" className="crm-input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Órgão de Comunicação (OCS) *</label>
                  <input required name="j-outlet" type="text" placeholder="Ex: Expresso, Público, ECO" className="crm-input" list="outlets-list" />
                  <datalist id="outlets-list">
                    {outlets.map(o => (
                      <option key={o.id} value={o.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Email Institucional</label>
                  <input name="j-email" type="email" placeholder="marta@publico.pt" className="crm-input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Telemóvel / WhatsApp</label>
                  <input name="j-phone" type="text" placeholder="+351 912 345 678" className="crm-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Área de Intervenção Principal</label>
                  <select name="j-area" className="crm-input">
                    {AVAILABLE_SPECIALTIES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Preferência de Contacto</label>
                  <select name="j-pref" className="crm-input">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="telefone">Chamada Telefónica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Origem do Contacto</label>
                <input name="j-origin" type="text" placeholder="Ex: Web Summit 2025, Acompanhamento de Pauta" className="crm-input" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Notas Editoriais & Horários de Fecho</label>
                <textarea name="j-notes" rows={3} placeholder="Prazos de fecho, preferências de pitch..." className="crm-input resize-none" />
              </div>

              <div className="p-3 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] text-[11px] text-[#6B6B6B] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2F6B3A] shrink-0 mt-0.5" />
                <span>O registo é gravado com consentimento RGPD ativo na data de hoje ({new Date().toLocaleDateString("pt-PT")}).</span>
              </div>

              <div className="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Gravar Jornalista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL IMPORTAR CSV */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden">
            <div className="p-5 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Importar Jornalistas por CSV</h3>
                <p className="text-[11px] text-[#6B6B6B]">Cola os dados em formato CSV para carregar em lote.</p>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-[#6B6B6B] hover:text-[#1A1A1A] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Dados CSV (com cabeçalho)</label>
                <textarea
                  rows={8}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`Nome,Cargo,Meios,Emails,Telemoveis,Preferencia,Areas,Estado,UltimoContacto,Origem,RGPD,DataRGPD,Notas\n"Carlos Silva","Editor","Observador","csilva@obs.pt","+351 912345678","whatsapp","Política & Sociedade","ativo","2026-11-20","Web Summit","Sim","2026-01-15","Notas..."`}
                  className="crm-input font-mono text-[11px] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsCsvModalOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="button" onClick={handleImportCsv} className="btn-primary">
                  Importar Linhas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalistsView;
