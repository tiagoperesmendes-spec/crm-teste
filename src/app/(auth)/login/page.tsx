"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, User, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register" | "recover">("login");

  // Campos de Iniciar Sessão
  const [loginEmail, setLoginEmail] = useState("tiagoperesmendes@gmail.com");
  const [loginPassword, setLoginPassword] = useState("Direcao2026!");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Campos de Criar Conta
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState("director");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Campos de Recuperar
  const [recoverEmail, setRecoverEmail] = useState("tiagoperesmendes@gmail.com");
  const [recoverNewPassword, setRecoverNewPassword] = useState("");
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);

  // Estados de Operação
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Submissão de Início de Sessão
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    // Garante acesso direto com permissões de Diretor
    setTimeout(() => {
      router.push("/");
    }, 450);
  };

  // Submissão de Criar Conta
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setStatusMessage({
        text: "Conta registada com sucesso. A aceder ao Gabinete...",
        type: "success",
      });
      setTimeout(() => {
        router.push("/");
      }, 700);
    }, 450);
  };

  // Submissão de Recuperar
  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({
        text: "Palavra-passe atualizada com sucesso. Podes iniciar sessão agora.",
        type: "success",
      });
      setLoginPassword(recoverNewPassword || "Direcao2026!");
      setActiveTab("login");
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#EDE6DE] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E4DDD3] shadow-card p-6 sm:p-8 space-y-6">
        {/* Topo: Marca MODO */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <img
              src="/logo-modo.png"
              alt="MODO Agência de Comunicação"
              className="h-12 max-w-[210px] object-contain mx-auto mix-blend-multiply"
            />
          </div>
          <p className="text-xs font-normal text-[#6B6B6B]">CRM &amp; Plataforma de Gestão de Imprensa</p>
        </div>

        {/* Segmented Control Limpo: Iniciar Sessão vs Criar Conta vs Recuperar */}
        <div className="flex p-1 bg-[#F6F2EC] rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setStatusMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "login"
                ? "bg-white text-[#1A1A1A] shadow-xs"
                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
            }`}
          >
            Iniciar Sessão
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setStatusMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "register"
                ? "bg-white text-[#1A1A1A] shadow-xs"
                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
            }`}
          >
            Criar Conta
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("recover");
              setStatusMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "recover"
                ? "bg-white text-[#1A1A1A] shadow-xs"
                : "text-[#6B6B6B] hover:text-[#1A1A1A]"
            }`}
          >
            Recuperar
          </button>
        </div>

        {/* Mensagem de Feedback */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-medium leading-relaxed ${
              statusMessage.type === "success"
                ? "bg-[#DDEBDD] border border-[#DFE7D6] text-[#2F6B3A]"
                : "bg-[#F6D9D5] border border-[#F1D9CE] text-[#A3281E]"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* ABA 1: INICIAR SESSÃO */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 fade-in">
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Email Institucional *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nome@organizacao.pt"
                  className="crm-input pl-9 pr-3 py-2.5 text-xs font-mono w-full"
                />
                <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#1A1A1A]">Palavra-passe *</label>
                <button
                  type="button"
                  onClick={() => setActiveTab("recover")}
                  className="text-[11px] font-medium text-[#6C1C37] hover:underline"
                >
                  Esqueceu-se da palavra-passe?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Inserir palavra-passe"
                  className="crm-input pl-9 pr-10 py-2.5 text-xs font-mono w-full"
                />
                <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-[#6B6B6B] hover:text-[#1A1A1A] p-1"
                  title="Alternar visibilidade"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E4DDD3] text-[#6C1C37] focus:ring-[#6C1C37]"
                />
                <span>Manter sessão iniciada</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "A entrar no Gabinete..." : "Entrar no Gabinete"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ABA 2: CRIAR CONTA */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 fade-in">
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Nome Completo *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Tiago Mendes"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="crm-input pl-9 pr-3 py-2.5 text-xs w-full"
                />
                <User className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Email Institucional *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="tiagoperesmendes@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="crm-input pl-9 pr-3 py-2.5 text-xs font-mono w-full"
                />
                <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Nível de Permissão / Cargo *</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="crm-select py-2.5 text-xs font-medium w-full"
              >
                <option value="director">Diretor(a) de RP — Acesso Total</option>
                <option value="press_officer">Assessor(a) de Imprensa — Gestão</option>
                <option value="junior">Técnico(a) de Clipping — Registo</option>
                <option value="viewer">Observador(a) — Consulta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Palavra-passe *</label>
              <div className="relative">
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  placeholder="Definir palavra-passe"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="crm-input pl-9 pr-10 py-2.5 text-xs font-mono w-full"
                />
                <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-2.5 text-[#6B6B6B] hover:text-[#1A1A1A] p-1"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "A registar conta..." : "Criar Conta"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ABA 3: RECUPERAR PALAVRA-PASSE */}
        {activeTab === "recover" && (
          <form onSubmit={handleRecoverSubmit} className="space-y-4 fade-in">
            <div>
              <h3 className="text-xs font-semibold text-[#1A1A1A] font-title">Recuperação de Acesso</h3>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                Insere o teu email institucional para redefinir a palavra-passe da tua conta.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Email da Conta *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  className="crm-input pl-9 pr-3 py-2.5 text-xs font-mono w-full"
                />
                <Mail className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Nova Palavra-passe *</label>
              <div className="relative">
                <input
                  type={showRecoverPassword ? "text" : "password"}
                  required
                  placeholder="Ex: Diretor@2026"
                  value={recoverNewPassword}
                  onChange={(e) => setRecoverNewPassword(e.target.value)}
                  className="crm-input pl-9 pr-10 py-2.5 text-xs font-mono w-full"
                />
                <Lock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowRecoverPassword(!showRecoverPassword)}
                  className="absolute right-3 top-2.5 text-[#6B6B6B] hover:text-[#1A1A1A] p-1"
                >
                  {showRecoverPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "A redefinir..." : "Redefinir Palavra-passe"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
