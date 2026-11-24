"use client";

import React from "react";
import { DailyContact, ContactStatus } from "@/types/pr-crm";

interface ContactsListProps {
  contacts: DailyContact[];
  onRowClick?: (contactId: string) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({ contacts, onRowClick }) => {
  const getAvatarInitials = (contact: DailyContact) => {
    if (contact.outlet_name) {
      const parts = contact.outlet_name.split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return contact.outlet_name.slice(0, 2).toUpperCase();
    }
    return contact.contact_name.slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case "respondeu":
        return { label: "Respondeu", class: "bg-[#DDEBDD] text-[#2F6B3A] border-[#DFE7D6]" };
      case "sem_resposta":
        return { label: "Sem resposta", class: "bg-[#F7E7BF] text-[#805B00] border-[#F3E3C3]" };
      case "enviado":
        return { label: "Enviado", class: "bg-[#E9E5E0] text-[#5C554E] border-[#E9E5E0]" };
      case "agendado":
        return { label: "Agendado", class: "bg-[#DCE7F0] text-[#2C5576] border-[#DDE6EE]" };
      default:
        return { label: status, class: "bg-[#E9E5E0] text-[#5C554E] border-[#E9E5E0]" };
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-[#6B6B6B]">
        <p className="font-medium text-[#1A1A1A] mb-1">Ainda não registaste contactos hoje.</p>
        <p>Clica em "+ Novo contacto" para adicionares uma nova interação de imprensa.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#E4DDD3]/60">
      {contacts.map((c) => {
        const badge = getStatusBadge(c.status);
        const initials = getAvatarInitials(c);

        return (
          <div
            key={c.id}
            onClick={() => onRowClick && onRowClick(c.id)}
            className="py-3 flex items-center justify-between gap-3 group hover:bg-[#F6F2EC]/60 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] text-[#1A1A1A] flex items-center justify-center text-[10px] font-mono font-medium shrink-0 group-hover:border-[#6C1C37]/30 transition-colors">
                {initials}
              </div>
              <div className="truncate">
                <h4 className="text-xs font-medium text-[#1A1A1A] truncate group-hover:text-[#6C1C37] transition-colors">
                  {c.contact_name}
                </h4>
                <p className="text-[11px] text-[#6B6B6B] truncate capitalize">
                  {c.outlet_name || "Geral"} • {c.contact_type}
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${badge.class}`}>
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ContactsList;
