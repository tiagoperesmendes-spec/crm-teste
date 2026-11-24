"use client";

import React, { useState, useMemo } from "react";
import { MediaOutlet, Journalist, OutletFormat, OutletScope, OutletPeriodicity, OutletStatus } from "@/types/pr-crm";
import { AVAILABLE_SPECIALTIES, AVAILABLE_MEDIA_GROUPS } from "@/lib/mock-data";
import {
  Search,
  Building2,
  Globe,
  Phone,
  Mail,
  ArrowLeft,
  ExternalLink,
  Plus,
  Download,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Columns3,
  Users,
  LayoutGrid,
  List,
  FileText,
  Radio,
  Tv,
  Newspaper,
  Mic,
  Share2,
  Trash2
} from "lucide-react";

interface OutletsViewProps {
  outlets: MediaOutlet[];
  journalists?: Journalist[];
  onBackToDashboard: () => void;
  onOpenJournalistDetail?: (journalist: Journalist) => void;
  canEdit?: boolean;
}

type SortField = 'name' | 'media_group' | 'scope' | 'periodicity' | 'estimated_audience' | 'status';
type SortOrder = 'asc' | 'desc';

export const OutletsView: React.FC<OutletsViewProps> = ({
  outlets: initialOutlets,
  journalists = [],
  onBackToDashboard,
  onOpenJournalistDetail,
  canEdit = true,
}) => {
  const [outletsList, setOutletsList] = useState<MediaOutlet[]>(initialOutlets);
  const [groupsList, setGroupsList] = useState<string[]>(AVAILABLE_MEDIA_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Visibilidade de colunas
  const [visibleColumns, setVisibleColumns] = useState({
    group: true,
    formats: true,
    specialties: true,
    scope: true,
    periodicity: true,
    erc: true,
    contacts: true,
    audience: true,
    journalistsCount: true,
    status: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Ficha de Detalhe (Drawer)
  const [selectedOutlet, setSelectedOutlet] = useState<MediaOutlet | null>(null);

  // Modal Novo / Editar Meio
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<MediaOutlet | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
  const [selectedModalFormats, setSelectedModalFormats] = useState<OutletFormat[]>(["online"]);
  const [selectedModalSpecialties, setSelectedModalSpecialties] = useState<string[]>([]);

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

  const handleDeleteOutlet = (id: string, name: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar o órgão de comunicação "${name}"? Esta ação não pode ser desfeita.`)) return;
    setOutletsList(prev => prev.filter(o => o.id !== id));
    if (selectedOutlet?.id === id) {
      setSelectedOutlet(null);
    }
  };

  // Filtragem e Ordenação
  const filteredOutlets = useMemo(() => {
    return outletsList.filter((o) => {
      // Filtro de Formato
      if (selectedFormat !== "all") {
        const fmts = o.formats || [];
        if (!fmts.some(f => f.toLowerCase() === selectedFormat.toLowerCase())) {
          return false;
        }
      }
      // Filtro de Âmbito
      if (selectedScope !== "all" && o.scope !== selectedScope) {
        return false;
      }
      // Filtro de Especialidade
      if (selectedSpecialty !== "all") {
        const specs = o.specialties || [];
        if (!specs.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) {
          return false;
        }
      }
      // Filtro de Estado
      if (selectedStatus !== "all" && o.status !== selectedStatus) {
        return false;
      }
      // Pesquisa por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = o.name.toLowerCase().includes(q);
        const matchGroup = (o.media_group || "").toLowerCase().includes(q);
        const matchAddress = (o.address || "").toLowerCase().includes(q);
        const matchErc = (o.erc_registration || "").toLowerCase().includes(q);
        const matchSpec = (o.specialties || []).some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchGroup && !matchAddress && !matchErc && !matchSpec) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      if (sortField === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortField === 'media_group') {
        valA = a.media_group || "";
        valB = b.media_group || "";
      } else if (sortField === 'scope') {
        valA = a.scope || "";
        valB = b.scope || "";
      } else if (sortField === 'periodicity') {
        valA = a.periodicity || "";
        valB = b.periodicity || "";
      } else if (sortField === 'estimated_audience') {
        valA = a.estimated_audience || 0;
        valB = b.estimated_audience || 0;
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      } else if (sortField === 'status') {
        valA = a.status;
        valB = b.status;
      }
      return sortOrder === 'asc' ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
    });
  }, [outletsList, searchQuery, selectedFormat, selectedScope, selectedSpecialty, selectedStatus, sortField, sortOrder]);

  // Obter Jornalistas associados automaticamente a um meio
  const getAssociatedJournalists = (outlet: MediaOutlet) => {
    return journalists.filter(j =>
      (j.outlet_ids && j.outlet_ids.includes(outlet.id)) ||
      (j.outlet_names && j.outlet_names.some(n => n.toLowerCase() === outlet.name.toLowerCase())) ||
      (j.outlet_name && j.outlet_name.toLowerCase() === outlet.name.toLowerCase())
    );
  };

  // Exportar para CSV
  const handleExportCsv = () => {
    const headers = ["Nome", "Grupo", "Registo ERC", "Tipo ERC", "Formatos", "Especialidades", "Âmbito", "Periodicidade", "Audiência", "Morada", "Site", "Email Agenda", "Telefone", "Estado"];
    const rows = filteredOutlets.map(o => [
      `"${o.name}"`,
      `"${o.media_group || ""}"`,
      `"${o.erc_registration || ""}"`,
      `"${o.erc_type || ""}"`,
      `"${(o.formats || []).join("; ")}"`,
      `"${(o.specialties || []).join("; ")}"`,
      `"${o.scope || ""}"`,
      `"${o.periodicity || ""}"`,
      `"${o.estimated_audience || ""}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      `"${o.website_url || ""}"`,
      `"${o.agenda_email || ""}"`,
      `"${o.phone || ""}"`,
      `"${o.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orgaos_comunicacao_social_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Importar de CSV
  const handleImportCsv = () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return;

    const imported: MediaOutlet[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map(p => p.trim().replace(/^"|"$/g, ""));
      if (parts[0]) {
        const item: MediaOutlet = {
          id: "out-csv-" + Date.now() + "-" + i,
          name: parts[0],
          media_group: parts[1] || "Independente",
          erc_registration: parts[2] || "",
          erc_type: parts[3] || "Órgão Periódico",
          formats: parts[4] ? parts[4].split(";").map(s => s.trim() as OutletFormat) : ["online"],
          specialties: parts[5] ? parts[5].split(";").map(s => s.trim()) : ["Geral"],
          scope: (parts[6] as OutletScope) || "nacional",
          periodicity: (parts[7] as OutletPeriodicity) || "diario",
          estimated_audience: parts[8] ? parseInt(parts[8]) : undefined,
          address: parts[9] || "",
          website_url: parts[10] || "",
          agenda_email: parts[11] || "",
          phone: parts[12] || "",
          status: (parts[13] as OutletStatus) || "ativo",
          updated_at: new Date().toISOString(),
        };
        imported.push(item);
      }
    }

    if (imported.length > 0) {
      setOutletsList(prev => [...imported, ...prev]);
      setIsCsvModalOpen(false);
      setCsvText("");
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* 1. CABEÇALHO & AÇÕES PRINCIPAIS */}
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
              Órgãos de Comunicação Social (OCS)
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Diretório oficial de redações, grupos editoriais, registos ERC e equipas jornalísticas associadas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Exportar Dados */}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white text-[#1A1A1A] border border-[#E4DDD3] hover:bg-[#F6F2EC] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Exportar para CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Exportar dados</span>
          </button>

          {/* Novo Órgão */}
          {canEdit && (
            <button
              onClick={() => {
                setEditingOutlet(null);
                setSelectedModalFormats(["online"]);
                setSelectedModalSpecialties([]);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar Meio</span>
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
            placeholder="Pesquisar por nome, grupo editorial, morada ou registo ERC..."
            className="w-full bg-[#FBF9F6] border border-[#E4DDD3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-2xs"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#6B6B6B] px-1">
        <span>{filteredOutlets.length} de {outletsList.length} meios de comunicação listados</span>
        <span className="text-[11px]">Clica num órgão para abrir a ficha completa e ver os jornalistas associados</span>
      </div>

      {/* 3. VISTA TABELA */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4DDD3] text-[#6B6B6B] font-medium text-[11px] bg-[#FBF9F6]">
                <th className="py-3 px-3">Órgão de Comunicação (OCS)</th>
                <th className="py-3 px-3">Grupo Editorial</th>
                <th className="py-3 px-3">Formatos</th>
                <th className="py-3 px-3">Âmbito &amp; Periodicidade</th>
                <th className="py-3 px-3">Especialidade</th>
                <th className="py-3 px-3">Registo ERC</th>
                <th className="py-3 px-3">Email Agenda / Contacto</th>
                <th className="py-3 px-3 text-center">Jornalistas Associados</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>

              <tbody className="divide-y divide-[#E4DDD3]/60">
                {filteredOutlets.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-xs text-[#6B6B6B]">
                      <p className="font-medium text-[#1A1A1A] mb-1">Nenhum meio encontrado com os filtros selecionados.</p>
                      <p>Tenta outros termos ou adiciona um novo órgão à base.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOutlets.map((outlet) => {
                    const assocJournalists = getAssociatedJournalists(outlet);

                    return (
                      <tr
                        key={outlet.id}
                        onClick={() => setSelectedOutlet(outlet)}
                        className="hover:bg-[#FBF9F6] transition-colors cursor-pointer group"
                      >
                        {/* Nome & Logo */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            {outlet.logo_url ? (
                              <img src={outlet.logo_url} alt="" className="w-7 h-7 rounded-lg object-cover border border-[#E4DDD3]" />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-[#EDE6DE] flex items-center justify-center font-bold text-xs text-[#6C1C37] font-title border border-[#D1C7BA]">
                                {outlet.name[0]}
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors">
                                {outlet.name}
                              </span>
                              {outlet.website_url && (
                                <span className="block text-[10px] text-[#8A8A8A] truncate max-w-[140px]">
                                  {outlet.website_url.replace(/^https?:\/\//, '')}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Grupo */}
                        {visibleColumns.group && (
                          <td className="py-3 px-3 text-[#6B6B6B]">
                            <span className="font-medium text-[#1A1A1A]">{outlet.media_group || "Independente"}</span>
                          </td>
                        )}

                        {/* Formatos (Multi-etiqueta) */}
                        {visibleColumns.formats && (
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1">
                              {(outlet.formats || []).map((fmt) => (
                                <span
                                  key={fmt}
                                  className="px-2 py-0.5 rounded-md bg-[#EDE6DE] text-[#5C554E] font-medium text-[10px] capitalize"
                                >
                                  {fmt === 'agencia_noticiosa' ? 'Agência' : fmt}
                                </span>
                              ))}
                            </div>
                          </td>
                        )}

                        {/* Especialidades */}
                        {visibleColumns.specialties && (
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1">
                              {(outlet.specialties || []).slice(0, 2).map((spec) => (
                                <span
                                  key={spec}
                                  className="px-2 py-0.5 rounded-md bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3] font-medium text-[10px]"
                                >
                                  {spec}
                                </span>
                              ))}
                              {(outlet.specialties || []).length > 2 && (
                                <span className="text-[10px] text-[#8A8A8A] self-center">
                                  +{outlet.specialties!.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                        )}

                        {/* Âmbito & Periodicidade */}
                        {visibleColumns.scope && (
                          <td className="py-3 px-3 text-[#6B6B6B]">
                            <div className="capitalize font-medium text-[#1A1A1A]">{outlet.scope || "Nacional"}</div>
                            <div className="text-[10px] text-[#8A8A8A] capitalize">{outlet.periodicity || "Diário"}</div>
                          </td>
                        )}

                        {/* Registo ERC */}
                        {visibleColumns.erc && (
                          <td className="py-3 px-3 font-mono text-[11px] text-[#6B6B6B]">
                            {outlet.erc_registration || "—"}
                          </td>
                        )}

                        {/* Contactos */}
                        {visibleColumns.contacts && (
                          <td className="py-3 px-3 text-[#6B6B6B]" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-0.5">
                              {outlet.agenda_email && (
                                <a href={`mailto:${outlet.agenda_email}`} className="text-[11px] text-[#6C1C37] hover:underline flex items-center gap-1 font-medium">
                                  <Mail className="w-3 h-3 text-[#8A8A8A]" />
                                  <span className="truncate max-w-[140px]">{outlet.agenda_email}</span>
                                </a>
                              )}
                              {outlet.phone && (
                                <span className="text-[11px] font-mono flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#8A8A8A]" />
                                  <span>{outlet.phone}</span>
                                </span>
                              )}
                            </div>
                          </td>
                        )}

                        {/* Jornalistas Associados */}
                        {visibleColumns.journalistsCount && (
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
                              <Users className="w-3 h-3 text-[#6C1C37]" />
                              <span>{assocJournalists.length}</span>
                            </span>
                          </td>
                        )}

                        {/* Estado */}
                        {visibleColumns.status && (
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              outlet.status === 'ativo'
                                ? 'bg-[#E3EFE3] text-[#2F6B3A]'
                                : 'bg-[#EDE6DE] text-[#8A8A8A]'
                            }`}>
                              {outlet.status === 'ativo' ? 'Ativo' : 'Extinto'}
                            </span>
                          </td>
                        )}

                        {/* Ação */}
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedOutlet(outlet)}
                              className="p-1.5 rounded-lg hover:bg-[#EDE6DE] text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                              title="Ver ficha completa do meio"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            {canEdit && (
                              <button
                                onClick={() => handleDeleteOutlet(outlet.id, outlet.name)}
                                className="p-1.5 rounded-lg hover:bg-[#FBEAE8] text-[#8A8A8A] hover:text-[#A3281E] transition-colors"
                                title="Eliminar órgão de comunicação"
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
        ) : (
          /* 4. VISTA DE GRELHA DE CARTÕES */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOutlets.map((outlet) => {
              const assocJournalists = getAssociatedJournalists(outlet);

              return (
                <div
                  key={outlet.id}
                  onClick={() => setSelectedOutlet(outlet)}
                  className="p-5 rounded-2xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white hover:border-[#6C1C37]/40 transition-all space-y-3 cursor-pointer group shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {outlet.logo_url ? (
                          <img src={outlet.logo_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-[#E4DDD3]" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#EDE6DE] flex items-center justify-center font-bold text-sm text-[#6C1C37] font-title border border-[#D1C7BA]">
                            {outlet.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-[#1A1A1A] font-title group-hover:text-[#6C1C37] transition-colors truncate">
                            {outlet.name}
                          </h3>
                          <p className="text-xs text-[#6B6B6B] truncate">
                            {outlet.media_group || "Grupo Independente"}
                          </p>
                        </div>
                      </div>

                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                        outlet.status === 'ativo' ? 'bg-[#E3EFE3] text-[#2F6B3A]' : 'bg-[#EDE6DE] text-[#8A8A8A]'
                      }`}>
                        {outlet.status === 'ativo' ? 'Ativo' : 'Extinto'}
                      </span>
                    </div>

                    {/* Formatos e Âmbito */}
                    <div className="flex flex-wrap gap-1">
                      {(outlet.formats || []).map((fmt) => (
                        <span key={fmt} className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#EDE6DE] text-[#5C554E] capitalize">
                          {fmt}
                        </span>
                      ))}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3] capitalize">
                        {outlet.scope || "Nacional"}
                      </span>
                    </div>

                    {/* Especialidades */}
                    <div className="pt-2 border-t border-[#E4DDD3]/60 text-xs text-[#6B6B6B] space-y-1">
                      {outlet.specialties && outlet.specialties.length > 0 && (
                        <p className="line-clamp-1">
                          Especialidade: <strong className="text-[#1A1A1A] font-medium">{outlet.specialties.join(", ")}</strong>
                        </p>
                      )}
                      {outlet.erc_registration && (
                        <p className="font-mono text-[11px]">Registo ERC: {outlet.erc_registration}</p>
                      )}
                    </div>
                  </div>

                  {/* Rodapé do Cartão */}
                  <div className="pt-3 border-t border-[#E4DDD3]/60 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-[#6B6B6B]">
                      <Users className="w-3.5 h-3.5 text-[#6C1C37]" />
                      <span><strong>{assocJournalists.length}</strong> jornalistas</span>
                    </span>

                    {outlet.website_url && (
                      <span className="text-[#6C1C37] font-medium flex items-center gap-1">
                        Ver ficha &rarr;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. GAVETA / FICHA COMPLETA DO MEIO (DRAWER) */}
      {selectedOutlet && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Topo da Ficha */}
            <div className="p-6 border-b border-[#E4DDD3] bg-[#FBF9F6]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedOutlet.logo_url ? (
                    <img src={selectedOutlet.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#E4DDD3]" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#EDE6DE] text-[#6C1C37] font-bold text-lg flex items-center justify-center border border-[#D1C7BA] font-title">
                      {selectedOutlet.name[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] font-title">
                      {selectedOutlet.name}
                    </h2>
                    <p className="text-xs text-[#6B6B6B]">
                      {selectedOutlet.media_group || "Grupo Independente"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedOutlet.status === 'ativo' ? 'bg-[#E3EFE3] text-[#2F6B3A]' : 'bg-[#EDE6DE] text-[#8A8A8A]'
                  }`}>
                    {selectedOutlet.status === 'ativo' ? 'Ativo' : 'Extinto'}
                  </span>
                  <button onClick={() => setSelectedOutlet(null)} className="p-1 rounded-lg hover:bg-[#E4DDD3]/60 text-[#6B6B6B] hover:text-[#1A1A1A]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo Detalhado */}
            <div className="p-6 space-y-6 flex-1 text-xs text-[#1A1A1A]">
              {/* Características Regulamentares ERC & Âmbito */}
              <div className="grid grid-cols-2 gap-3 bg-[#FBF9F6] p-4 rounded-xl border border-[#E4DDD3]/70">
                <div>
                  <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Registo ERC</span>
                  <span className="font-mono text-xs font-semibold text-[#1A1A1A] block mt-0.5">
                    {selectedOutlet.erc_registration || "Pendente"}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] block">{selectedOutlet.erc_type || "Órgão Periódico"}</span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Âmbito & Periodicidade</span>
                  <span className="text-xs font-semibold text-[#1A1A1A] block mt-0.5 capitalize">
                    {selectedOutlet.scope || "Nacional"} · {selectedOutlet.periodicity || "Diário"}
                  </span>
                  {selectedOutlet.estimated_audience && (
                    <span className="text-[10px] text-[#6B6B6B] block">
                      Audiência: ~{selectedOutlet.estimated_audience.toLocaleString('pt-PT')} leitores
                    </span>
                  )}
                </div>
              </div>

              {/* Formatos e Especialidades */}
              <div className="space-y-3 pt-2">
                <div>
                  <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider mb-1.5">
                    Formatos de Distribuição
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedOutlet.formats || []).map((f) => (
                      <span key={f} className="px-2.5 py-1 rounded-lg bg-[#EDE6DE] text-[#5C554E] font-medium text-xs capitalize">
                        {f === 'agencia_noticiosa' ? 'Agência Noticiosa' : f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider mb-1.5">
                    Especialidade Editorial
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedOutlet.specialties || []).map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3] font-medium text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contactos da Redação & Morada */}
              <div className="space-y-3 pt-4 border-t border-[#E4DDD3]/60">
                <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider">
                  Contactos de Sede & Redação
                </h3>
                <div className="bg-[#FBF9F6] p-4 rounded-xl border border-[#E4DDD3]/70 space-y-2">
                  {selectedOutlet.address && (
                    <div>
                      <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Morada</span>
                      <p className="text-xs text-[#1A1A1A] mt-0.5">{selectedOutlet.address}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E4DDD3]/60">
                    {selectedOutlet.agenda_email && (
                      <div>
                        <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Email de Agenda</span>
                        <a href={`mailto:${selectedOutlet.agenda_email}`} className="text-xs text-[#6C1C37] hover:underline font-medium flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{selectedOutlet.agenda_email}</span>
                        </a>
                      </div>
                    )}
                    {selectedOutlet.phone && (
                      <div>
                        <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase block">Telefone Redação</span>
                        <a href={`tel:${selectedOutlet.phone}`} className="text-xs text-[#1A1A1A] font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#8A8A8A]" />
                          <span>{selectedOutlet.phone}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {selectedOutlet.website_url && (
                    <div className="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Portal Web</span>
                      <a href={selectedOutlet.website_url} target="_blank" rel="noreferrer" className="text-xs text-[#6C1C37] hover:underline font-medium flex items-center gap-1">
                        <span>{selectedOutlet.website_url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* JORNALISTAS ASSOCIADOS (AUTOMÁTICO A PARTIR DA BASE 2) */}
              <div className="space-y-3 pt-4 border-t border-[#E4DDD3]/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-xs text-[#6B6B6B] uppercase tracking-wider">
                    Jornalistas Associados ({getAssociatedJournalists(selectedOutlet).length})
                  </h3>
                  <span className="text-[11px] text-[#8A8A8A]">Ligação automática</span>
                </div>

                <div className="space-y-2">
                  {getAssociatedJournalists(selectedOutlet).length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/60 text-center text-xs text-[#6B6B6B]">
                      Ainda não existem jornalistas associados a este órgão.
                    </div>
                  ) : (
                    getAssociatedJournalists(selectedOutlet).map((jour) => (
                      <div
                        key={jour.id}
                        onClick={() => {
                          if (onOpenJournalistDetail) {
                            setSelectedOutlet(null);
                            onOpenJournalistDetail(jour);
                          }
                        }}
                        className="p-3 rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white hover:border-[#6C1C37] transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#EDE6DE] text-[#1A1A1A] font-semibold flex items-center justify-center text-xs shrink-0 font-title border border-[#D1C7BA]">
                            {jour.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                              {jour.name}
                            </h4>
                            <p className="text-[10px] text-[#6B6B6B] truncate">
                              {jour.role_title || "Jornalista"} · {jour.intervention_areas?.join(", ") || "Geral"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {jour.emails && jour.emails[0] && (
                            <span className="text-[11px] text-[#6B6B6B] hidden sm:inline">
                              {jour.emails[0]}
                            </span>
                          )}
                          <ExternalLink className="w-3.5 h-3.5 text-[#8A8A8A] group-hover:text-[#6C1C37]" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between text-xs text-[#8A8A8A]">
              <div className="flex items-center gap-2">
                <span>ID: {selectedOutlet.id}</span>
                {canEdit && (
                  <button
                    onClick={() => handleDeleteOutlet(selectedOutlet.id, selectedOutlet.name)}
                    className="px-2.5 py-1 text-xs font-medium text-[#A3281E] hover:bg-[#FBEAE8] border border-[#F5C2BE] rounded-lg transition-colors cursor-pointer ml-2"
                  >
                    Eliminar Meio
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedOutlet(null)}
                className="btn-secondary py-1.5 px-4 text-xs font-medium"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL NOVO ÓRGÃO (OCS) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden">
            <div className="p-5 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">
                  Adicionar Órgão de Comunicação Social (OCS)
                </h3>
                <p className="text-[11px] text-[#6B6B6B]">
                  Ficha cadastral de redação com ligação a grupos e registo ERC.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B6B6B] hover:text-[#1A1A1A] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("o-name") as HTMLInputElement).value;
                const group = isCreatingNewGroup
                  ? newGroupName
                  : (form.elements.namedItem("o-group") as HTMLSelectElement).value;
                const erc = (form.elements.namedItem("o-erc") as HTMLInputElement).value;
                const ercType = (form.elements.namedItem("o-erctype") as HTMLSelectElement).value;
                const scope = (form.elements.namedItem("o-scope") as HTMLSelectElement).value as OutletScope;
                const periodicity = (form.elements.namedItem("o-periodicity") as HTMLSelectElement).value as OutletPeriodicity;
                const audience = (form.elements.namedItem("o-audience") as HTMLInputElement).value;
                const website = (form.elements.namedItem("o-website") as HTMLInputElement).value;
                const agenda = (form.elements.namedItem("o-agenda") as HTMLInputElement).value;
                const phone = (form.elements.namedItem("o-phone") as HTMLInputElement).value;
                const address = (form.elements.namedItem("o-address") as HTMLTextAreaElement).value;

                if (isCreatingNewGroup && newGroupName && !groupsList.includes(newGroupName)) {
                  setGroupsList([...groupsList, newGroupName]);
                }

                const newO: MediaOutlet = {
                  id: "out-" + Date.now(),
                  name,
                  media_group: group || "Independente",
                  erc_registration: erc || "",
                  erc_type: ercType || "Publicação Periódica",
                  scope: scope || "nacional",
                  periodicity: periodicity || "diario",
                  estimated_audience: audience ? parseInt(audience) : undefined,
                  formats: selectedModalFormats,
                  specialties: selectedModalSpecialties.length > 0 ? selectedModalSpecialties : ["Geral"],
                  website_url: website || "",
                  agenda_email: agenda || "",
                  phone: phone || "",
                  address: address || "",
                  status: "ativo",
                  updated_at: new Date().toISOString(),
                };

                setOutletsList([newO, ...outletsList]);
                setIsModalOpen(false);
              }}
              className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs"
            >
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Nome do Meio (OCS) *</label>
                <input required name="o-name" type="text" placeholder="Ex: Expresso, Público, ECO" className="crm-input" />
              </div>

              {/* Grupo Editorial com criação de novo */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#1A1A1A]">Grupo Editorial *</label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewGroup(!isCreatingNewGroup)}
                    className="text-[11px] text-[#6C1C37] hover:underline font-medium"
                  >
                    {isCreatingNewGroup ? "Selecionar da lista existente" : "+ Criar novo grupo"}
                  </button>
                </div>

                {isCreatingNewGroup ? (
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nome do novo grupo editorial (ex: Medialivre)"
                    className="crm-input"
                  />
                ) : (
                  <select name="o-group" className="crm-input">
                    {groupsList.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                    <option value="Independente">Independente</option>
                  </select>
                )}
              </div>

              {/* Formatos (Multi-seleção) */}
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Formatos de Emissão *</label>
                <div className="flex flex-wrap gap-1.5">
                  {(["online", "papel", "tv", "radio", "podcast", "agencia_noticiosa"] as OutletFormat[]).map((fmt) => {
                    const isSel = selectedModalFormats.includes(fmt);
                    return (
                      <button
                        type="button"
                        key={fmt}
                        onClick={() => {
                          if (isSel) {
                            if (selectedModalFormats.length > 1) {
                              setSelectedModalFormats(selectedModalFormats.filter(f => f !== fmt));
                            }
                          } else {
                            setSelectedModalFormats([...selectedModalFormats, fmt]);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSel
                            ? "bg-[#6C1C37] text-white shadow-xs"
                            : "bg-[#F6F2EC] text-[#6B6B6B] border border-[#E4DDD3]"
                        }`}
                      >
                        {fmt === 'agencia_noticiosa' ? 'Agência Noticiosa' : fmt.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Registo ERC & Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Número de Registo ERC</label>
                  <input name="o-erc" type="text" placeholder="Ex: ERC-10112" className="crm-input font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Tipo de Meio (ERC)</label>
                  <select name="o-erctype" className="crm-input">
                    <option value="Publicação Periódica Impressa e Digital">Publicação Impressa e Digital</option>
                    <option value="Publicação Periódica Digital">Publicação Digital</option>
                    <option value="Operador de Televisão">Operador de Televisão</option>
                    <option value="Operador de Rádio">Operador de Rádio</option>
                    <option value="Agência Noticiosa">Agência Noticiosa</option>
                  </select>
                </div>
              </div>

              {/* Âmbito & Periodicidade & Audiência */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Âmbito</label>
                  <select name="o-scope" className="crm-input">
                    <option value="nacional">Nacional</option>
                    <option value="regional">Regional</option>
                    <option value="local">Local</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Periodicidade</label>
                  <select name="o-periodicity" className="crm-input">
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="continua">Contínua / Tempo Real</option>
                    <option value="outra">Outra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Audiência Estimada</label>
                  <input name="o-audience" type="number" placeholder="Ex: 500000" className="crm-input font-mono" />
                </div>
              </div>

              {/* Contactos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Email de Agenda</label>
                  <input name="o-agenda" type="email" placeholder="agenda@expresso.pt" className="crm-input" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Telefone da Redação</label>
                  <input name="o-phone" type="text" placeholder="+351 214 698 000" className="crm-input" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Link do Site Oficial</label>
                <input name="o-website" type="url" placeholder="https://expresso.pt" className="crm-input" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Morada da Redação</label>
                <textarea name="o-address" rows={2} placeholder="Rua, número, código postal e cidade..." className="crm-input resize-none" />
              </div>

              <div className="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Gravar Meio (OCS)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL IMPORTAR CSV */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden">
            <div className="p-5 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] font-title">Importar Órgãos (OCS) por CSV</h3>
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
                  placeholder={`Nome,Grupo,RegistoERC,TipoERC,Formatos,Especialidades,Ambito,Periodicidade,Audiencia,Morada,Site,EmailAgenda,Telefone,Estado\n"Expresso","Grupo Impresa","ERC-10112","Publicação Impressa","papel;online","Economia & Negócios","nacional","semanal","480000","Paço de Arcos","https://expresso.pt","agenda@expresso.pt","+351 214698000","ativo"`}
                  className="crm-input font-mono text-[11px] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsCsvModalOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="button" onClick={handleImportCsv} className="btn-primary">
                  Importar Meios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletsView;
