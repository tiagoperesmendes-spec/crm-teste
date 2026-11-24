"use client";

import React, { useState } from "react";
import { DailyContact, ContactStatus, ContactType } from "@/types/pr-crm";
import { Search, Plus, Filter, ArrowLeft, Mail, Phone, MessageSquare, Users, Check } from "lucide-react";

interface ContactsViewProps {
  contacts: DailyContact[];
  initialFilter?: string; // "today", "week", "all"
  onBackToDashboard: () => void;
  onUpdateContactStatus: (contactId: string, status: ContactStatus) => void;
  onAddNewContact: (newContact: Partial<DailyContact>) => void;
  canEdit: boolean;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  initialFilter = "all",
  onBackToDashboard,
  onUpdateContactStatus,
  onAddNewContact,
  canEdit,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<string>(initialFilter);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // Formulário para novo contacto
  const [newJournalistName, setNewJournalistName] = useState("");
  const [newOutletName, setNewOutletName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newChannel, setNewChannel] = useState<ContactType>("email");
  const [newStatus, setNewStatus] = useState<ContactStatus>("enviado");

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case "respondeu":
        return { text: "Respondeu", class: "bg-[#DDEBDD] text-[#2F6B3A]" };
      case "sem_resposta":
        return { text: "Sem resposta", class: "bg-[#F7E7BF] text-[#805B00]" };
      case "enviado":
        return { text: "Enviado", class: "bg-[#DCE7F0] text-[#2C5576]" };
      case "agendado":
        return { text: "Agendado", class: "bg-[#E5DEEC] text-[#5A4378]" };
      default:
        return { text: status, class: "bg-[#E9E5E0] text-[#5C554E]" };
    }
  };

  const getChannelIcon = (type: ContactType) => {
    switch (type) {
      case "email":
        return <Mail className="w-3.5 h-3.5 text-[#2C5576]" />;
      case "chamada":
        return <Phone className="w-3.5 h-3.5 text-[#3F5A2E]" />;
      case "whatsapp":
        return <MessageSquare className="w-3.5 h-3.5 text-[#1F5B57]" />;
      case "reuniao":
        return <Users className="w-3.5 h-3.5 text-[#5A4378]" />;
    }
  };

  const filteredContacts = contacts.filter((c) => {
    // Filtro por período
    if (filterPeriod === "today" && c.contact_date !== "2026-11-17") return false;
    // Filtro por canal
    if (selectedChannel !== "all" && c.contact_type !== selectedChannel) return false;
    // Pesquisa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.contact_name.toLowerCase().includes(q);
      const matchOutlet = (c.outlet_name || "").toLowerCase().includes(q);
      const matchSubject = (c.subject_or_notes || "").toLowerCase().includes(q);
      if (!matchName && !matchOutlet && !matchSubject) return false;
    }
    return true;
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalistName.trim()) return;

    onAddNewContact({
      contact_name: newJournalistName,
      outlet_name: newOutletName || "Geral",
      subject_or_notes: newSubject || "Contacto de seguimento",
      contact_type: newChannel,
      status: newStatus,
      contact_date: "2026-11-17",
      contact_time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    });

    setNewJournalistName("");
    setNewOutletName("");
    setNewSubject("");
    setIsNewModalOpen(false);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Barra Superior de Controlo e Navegação */}
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
            <h1 className="text-xl font-semibold text-[#1A1A1A] font-title">Diário de Contactos com a Imprensa</h1>
            <p className="text-xs text-[#6B6B6B]">
              Consulta estruturada de todas as abordagens editoriais realizadas e retorno obtido.
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Registar Contacto
          </button>
        )}
      </div>

      {/* Cartão de Filtros & Consulta */}
      <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E4DDD3]/60">
          {/* Separadores de Período */}
          <div className="flex gap-1.5 bg-[#EDE6DE]/50 p-1 rounded-xl">
            {[
              { id: "all", label: `Todos (${contacts.length})` },
              { id: "today", label: "Hoje (12)" },
              { id: "week", label: "Esta Semana (41)" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setFilterPeriod(p.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  filterPeriod === p.id
                    ? "bg-white text-[#1A1A1A] shadow-xs"
                    : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Filtro de Canal & Barra de Pesquisa */}
          <div className="flex items-center gap-2">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="text-xs border border-[#E4DDD3] rounded-xl px-2.5 py-1.5 bg-white text-[#1A1A1A] outline-none"
            >
              <option value="all">Todos os canais</option>
              <option value="email">Email</option>
              <option value="chamada">Telefone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="reuniao">Reunião</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar jornalista ou órgão..."
                className="pl-8 pr-3 py-1.5 text-xs border border-[#E4DDD3] rounded-xl bg-white text-[#1A1A1A] focus:outline-none focus:border-[#6C1C37] w-48 sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Contactos Realizados */}
        {filteredContacts.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6B6B6B]">
            Nenhum contacto encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E4DDD3] text-[#6B6B6B] font-medium text-[11px]">
                  <th className="py-2.5 px-3">Data / Hora</th>
                  <th className="py-2.5 px-3">Jornalista</th>
                  <th className="py-2.5 px-3">Órgão de Comunicação</th>
                  <th className="py-2.5 px-3">Canal</th>
                  <th className="py-2.5 px-3">Assunto / Pauta</th>
                  <th className="py-2.5 px-3">Estado da Interação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DDD3]/60">
                {filteredContacts.map((contact) => {
                  const badge = getStatusBadge(contact.status);
                  return (
                    <tr key={contact.id} className="hover:bg-[#FBF9F6] transition-colors">
                      <td className="py-3 px-3 text-[#6B6B6B] font-mono text-[11px] whitespace-nowrap">
                        {contact.contact_date}
                        {contact.contact_time && <span className="ml-1.5 opacity-70">{contact.contact_time}</span>}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#EDE6DE] text-[#1A1A1A] font-semibold flex items-center justify-center text-[10px] shrink-0">
                            {contact.contact_name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#1A1A1A]">{contact.contact_name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[#6B6B6B] font-medium">
                        {contact.outlet_name || "Geral"}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-[#1A1A1A]">
                          {getChannelIcon(contact.contact_type)}
                          <span className="capitalize text-[11px]">{contact.contact_type}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[#6B6B6B] max-w-xs truncate">
                        {contact.subject_or_notes || "Seguimento de pauta"}
                      </td>

                      <td className="py-3 px-3">
                        {canEdit ? (
                          <select
                            value={contact.status}
                            onChange={(e) => onUpdateContactStatus(contact.id, e.target.value as ContactStatus)}
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-none cursor-pointer outline-none ${badge.class}`}
                          >
                            <option value="respondeu">Respondeu</option>
                            <option value="sem_resposta">Sem resposta</option>
                            <option value="enviado">Enviado</option>
                            <option value="agendado">Agendado</option>
                          </select>
                        ) : (
                          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${badge.class}`}>
                            {badge.text}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Formulário para Registar Novo Contacto */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#E4DDD3] shadow-modal w-full max-w-lg p-6 space-y-4 fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DDD3]">
              <h3 className="text-base font-semibold text-[#1A1A1A] font-title">Registar Interação de Imprensa</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A]"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#1A1A1A]">Nome do Jornalista *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marta Figueiredo"
                  value={newJournalistName}
                  onChange={(e) => setNewJournalistName(e.target.value)}
                  className="crm-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#1A1A1A]">Órgão de Comunicação</label>
                  <input
                    type="text"
                    placeholder="Ex: Público, Expresso, RTP"
                    value={newOutletName}
                    onChange={(e) => setNewOutletName(e.target.value)}
                    className="crm-input w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#1A1A1A]">Canal de Contacto</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as ContactType)}
                    className="crm-select w-full"
                  >
                    <option value="email">Email</option>
                    <option value="chamada">Telefone</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="reuniao">Reunião Presencial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#1A1A1A]">Assunto / Resumo da Conversa</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Envio de press release com solicitação de entrevista sobre energia solar."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="crm-input w-full resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#1A1A1A]">Estado Atual</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ContactStatus)}
                  className="crm-select w-full"
                >
                  <option value="enviado">Enviado</option>
                  <option value="respondeu">Respondeu</option>
                  <option value="sem_resposta">Sem resposta</option>
                  <option value="agendado">Agendado</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4DDD3]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Guardar Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsView;
