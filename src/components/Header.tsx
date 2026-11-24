"use client";

import React from "react";
import { Search, Command } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onSearchClick,
}) => {
  return (
    <header className="px-6 py-3.5 bg-white/70 backdrop-blur-md border-b border-[#E4DDD3] flex items-center justify-between gap-4 sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-[#1A1A1A] font-title">{title}</h1>
        {subtitle && <p className="text-xs text-[#6B6B6B] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FBF9F6] hover:bg-white border border-[#E4DDD3] rounded-xl text-xs text-[#6B6B6B] transition-all cursor-pointer shadow-2xs"
            title="Pesquisa universal (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span>Pesquisar...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#6B6B6B] bg-white border border-[#E4DDD3] rounded">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
