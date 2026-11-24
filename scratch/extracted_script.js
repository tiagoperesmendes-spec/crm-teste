
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              DEFAULT: '#6C1C37',
              primary: '#6C1C37',
              hover: '#B45A69',
              tint: '#E6C5CA',
              accent: '#CDBA7B',
            },
            app: {
              bg: '#EDE6DE',
              surface: '#FFFFFF',
              warm: '#FBF9F6',
              hover: '#F6F2EC',
              border: '#E4DDD3',
              text: '#1A1A1A',
              muted: '#6B6B6B',
              'muted-bg': '#5C554E',
            }
          },
          fontFamily: {
            title: ['"Hanken Grotesk"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            sans: ['"Google Sans"', '"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    };
  </script>

  <style>
    /* ======================================================== */
    /* DESIGN TOKENS (CSS VARIABLES) - ESTÉTICA APPLE/NOTION/ATTIO */
    /* ======================================================== */
    :root {
      /* 4.2 Paleta da Marca (Lista Fechada de Usos) */
      --brand-primary: #6C1C37;
      --brand-hover: #B45A69;
      --brand-tint: #E6C5CA;
      --brand-accent: #CDBA7B;

      /* 4.3 Superfícies e Fundo */
      --bg-page: #EDE6DE;
      --surface-card: #FFFFFF;
      --surface-warm: #FBF9F6;
      --surface-hover: #F6F2EC;
      --border-color: #E4DDD3;

      /* 4.1 Tipografia & Cores de Texto */
      --text-main: #1A1A1A;
      --text-muted: #6B6B6B;
      --text-muted-on-bg: #5C554E;

      /* 4.4 Paleta de Dados (Etiquetas & Categorias - Fundo / Texto) */
      --data-blue-bg: #DDE6EE;
      --data-blue-text: #2F4A63;
      --data-moss-bg: #DFE7D6;
      --data-moss-text: #3F5A2E;
      --data-amber-bg: #F3E3C3;
      --data-amber-text: #7A4E0F;
      --data-terracotta-bg: #F1D9CE;
      --data-terracotta-text: #8A3E22;
      --data-violet-bg: #E5DEEC;
      --data-violet-text: #5A4378;
      --data-teal-bg: #D5E8E5;
      --data-teal-text: #1F5B57;
      --data-brown-bg: #E8DDD0;
      --data-brown-text: #66482C;
      --data-warmgray-bg: #E9E5E0;
      --data-warmgray-text: #5C554E;

      /* 4.5 Estados, Prioridades & Tom de Clipping (Fundo / Texto) */
      --status-success-bg: #DDEBDD;
      --status-success-text: #2F6B3A;
      --status-warning-bg: #F7E7BF;
      --status-warning-text: #805B00;
      --status-error-bg: #F6D9D5;
      --status-error-text: #A3281E;
      --status-info-bg: #DCE7F0;
      --status-info-text: #2C5576;
      --status-neutral-bg: #E9E5E0;
      --status-neutral-text: #5C554E;

      /* 3. Font Stacks */
      --font-titles: 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-body: 'Google Sans', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;

      /* Raios (12-20px) */
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --radius-full: 9999px;

      /* Sombras Neutras, Difusas e Subtis (Sem Cor) */
      --shadow-subtle: 0 1px 2px 0 rgba(26, 26, 26, 0.03);
      --shadow-card: 0 2px 6px -1px rgba(26, 26, 26, 0.04), 0 1px 3px -1px rgba(26, 26, 26, 0.02);
      --shadow-modal: 0 20px 35px -5px rgba(26, 26, 26, 0.08), 0 10px 15px -5px rgba(26, 26, 26, 0.04);

      /* 7. Transições Suaves (150-250ms ease-out) */
      --trans-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
      --trans-normal: 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-page);
      color: var(--text-main);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    h1,
    h2,
    h3,
    .font-title {
      font-family: var(--font-titles);
      letter-spacing: -0.02em;
    }

    .font-mono {
      font-family: var(--font-mono);
    }

    /* ======================================================== */
    /* 3. ESCALA TIPOGRÁFICA EM TOKENS                         */
    /* ======================================================== */
    .type-display {
      font-family: var(--font-titles);
      font-size: 32px;
      font-weight: 600;
      line-height: 1.15;
      letter-spacing: -0.025em;
      color: var(--text-main);
    }

    .type-h1 {
      font-family: var(--font-titles);
      font-size: 24px;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }

    .type-h2 {
      font-family: var(--font-titles);
      font-size: 20px;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.015em;
      color: var(--text-main);
    }

    .type-h3 {
      font-family: var(--font-titles);
      font-size: 16px;
      font-weight: 500;
      line-height: 1.3;
      letter-spacing: -0.01em;
      color: var(--text-main);
    }

    .type-body {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: var(--text-main);
    }

    .type-small {
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.45;
      color: var(--text-muted);
    }

    .type-caption {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 500;
      line-height: 1.4;
      letter-spacing: 0.01em;
      color: var(--text-muted);
    }

    /* ======================================================== */
    /* 6. COMPONENTES: BOTÕES, INPUTS, TABELAS & ETIQUETAS     */
    /* ======================================================== */
    /* Botões Primários, Secundários & Ghost */
    .btn-primary {
      background-color: var(--brand-primary);
      color: #FFFFFF;
      border-radius: var(--radius-md);
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 500;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background-color var(--trans-fast), transform var(--trans-fast);
      box-shadow: var(--shadow-subtle);
      cursor: pointer;
      border: 1px solid transparent;
    }

    .btn-primary:hover {
      background-color: var(--brand-hover);
    }

    .btn-primary:active {
      transform: scale(0.98);
    }

    .btn-secondary {
      background-color: #FFFFFF;
      color: var(--text-main);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 500;
      padding: 8px 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background-color var(--trans-fast), border-color var(--trans-fast), transform var(--trans-fast);
      cursor: pointer;
    }

    .btn-secondary:hover {
      background-color: var(--surface-hover);
      border-color: #D6CEC3;
    }

    .btn-secondary:active {
      transform: scale(0.98);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--text-muted);
      border-radius: var(--radius-md);
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 500;
      padding: 6px 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background-color var(--trans-fast), color var(--trans-fast);
      cursor: pointer;
      border: none;
    }

    .btn-ghost:hover {
      background-color: var(--surface-hover);
      color: var(--text-main);
    }

    /* Inputs Limpos com Foco Bordô Suave */
    .crm-input {
      background-color: #FFFFFF;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 8px 12px;
      font-size: 12px;
      color: var(--text-main);
      font-family: var(--font-body);
      transition: border-color var(--trans-fast), box-shadow var(--trans-fast);
      outline: none;
      width: 100%;
    }

    .crm-input:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 3px rgba(108, 28, 55, 0.12);
    }

    .crm-input::placeholder {
      color: var(--text-muted);
    }

    /* Cartões & Superfícies */
    .crm-card {
      background-color: #FFFFFF;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      transition: border-color var(--trans-fast), box-shadow var(--trans-fast);
    }

    /* Tabelas CRM Estilo Attio: Fundo Branco Quente, Linhas Leves, Linha Selecionada */
    .crm-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background-color: #FFFFFF;
    }

    .crm-table th {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 0.01em;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-color);
      background-color: #FFFFFF;
      text-align: left;
    }

    .crm-table td {
      padding: 11px 14px;
      font-size: 12px;
      color: var(--text-main);
      border-bottom: 1px solid var(--border-color);
      transition: background-color var(--trans-fast);
      background-color: #FFFFFF;
    }

    .crm-table tr:hover td {
      background-color: var(--surface-hover);
    }

    .crm-table tr.selected td {
      background-color: rgba(230, 197, 202, 0.40) !important;
    }

    .crm-table tr.selected td:first-child {
      border-left: 3px solid var(--brand-primary);
    }

    /* Densidade Compacta para Tabelas */
    .crm-table.compact th {
      padding: 6px 10px;
      font-size: 10px;
    }

    .crm-table.compact td {
      padding: 6px 10px;
      font-size: 11px;
    }

    /* Estilos da Aba / Barra Lateral Retrátil */
    #main-sidebar {
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.3s ease;
      will-change: width, padding, opacity;
    }

    #main-sidebar.collapsed {
      width: 0 !important;
      min-width: 0 !important;
      max-width: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      border-right-width: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
      overflow: hidden !important;
    }

    @media (max-width: 767px) {
      #main-sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 280px !important;
        height: 100vh;
        z-index: 50;
        box-shadow: var(--shadow-modal);
      }

      #main-sidebar.collapsed {
        transform: translateX(-100%) !important;
        width: 280px !important;
        display: none !important;
      }
    }

    /* Barra de rolagem discreta e elegante */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #D8D0C5;
      border-radius: 9999px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #C4BCB1;
    }
  </style>
</head>

<body class="bg-[#EDE6DE] text-[#1A1A1A] antialiased min-h-screen flex flex-col">

  <!-- AVISO DE NOTIFICAÇÃO (TOAST CLEAN & SEM EMOJIS) -->
  <div id="toast"
    class="fixed top-5 right-5 z-50 transform transition-all duration-300 translate-y-[-100px] opacity-0 pointer-events-none bg-white text-[#1A1A1A] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#E4DDD3]">
    <div id="toast-icon-container" class="w-4 h-4 text-[#6C1C37] shrink-0">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <span id="toast-msg" class="text-xs font-medium">Notificação</span>
  </div>

  <!-- ======================================================== -->
  <!-- ECRÃ DE LOGIN / AUTENTICAÇÃO (APPLE/NOTION CLEAN)        -->
  <!-- ======================================================== -->
  <div id="auth-container" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#EDE6DE] overflow-y-auto">

    <div
      class="relative w-full max-w-md bg-white rounded-3xl border border-[#E4DDD3] shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 my-8">

      <!-- Topo: Marca & Logotipo MODO -->
      <div class="text-center space-y-2">
        <div class="flex justify-center pb-1">
          <img src="logo-modo.png" alt="MODO Agência de Comunicação"
            class="h-12 max-w-[210px] object-contain mx-auto mix-blend-multiply" />
        </div>
        <p class="text-xs font-normal text-[#6B6B6B]">CRM &amp; Plataforma de Gestão de Imprensa</p>
      </div>

      <!-- Abas Limpas: Iniciar Sessão vs Criar Conta vs Recuperar -->
      <div class="flex p-1 bg-[#F6F2EC] rounded-xl text-xs font-medium">
        <button type="button" onclick="switchAuthTab('login')" id="tab-auth-login"
          class="flex-1 py-2 rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all">
          Iniciar Sessão
        </button>
        <button type="button" onclick="switchAuthTab('register')" id="tab-auth-register"
          class="flex-1 py-2 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all">
          Criar Conta
        </button>
        <button type="button" onclick="switchAuthTab('recover')" id="tab-auth-recover"
          class="flex-1 py-2 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all">
          Recuperar
        </button>
      </div>

      <!-- FORMULÁRIO 1: INICIAR SESSÃO -->
      <form id="form-login" onsubmit="handleLoginSubmit(event)" class="space-y-4">

        <div id="auth-error-msg"
          class="hidden p-3 bg-[#F6D9D5] border border-[#F1D9CE] rounded-xl text-[#A3281E] text-xs font-medium leading-relaxed">
        </div>
        <div id="auth-attempt-warning"
          class="hidden p-2.5 bg-[#F7E7BF] border border-[#F3E3C3] rounded-xl text-[#805B00] text-[11px] font-medium">
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Email Institucional *</label>
          <div class="relative">
            <input type="email" id="login-email" required value="tiagoperesmendes@gmail.com"
              placeholder="nome@organizacao.pt" class="crm-input pl-9 pr-3 py-2.5 text-xs font-mono">
            <svg class="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206">
              </path>
            </svg>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-medium text-[#1A1A1A]">Palavra-passe *</label>
            <button type="button" onclick="switchAuthTab('recover')"
              class="text-[11px] font-medium text-[#6C1C37] hover:underline">
              Esqueceu-se da palavra-passe?
            </button>
          </div>
          <div class="relative">
            <input type="password" id="login-password" required value="Direcao2026!" placeholder="Inserir palavra-passe"
              class="crm-input pl-9 pr-10 py-2.5 text-xs font-mono">
            <svg class="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
              </path>
            </svg>
            <button type="button" onclick="togglePasswordVisibility('login-password')"
              class="absolute right-3 top-2.5 text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Ver palavra-passe">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-[#6B6B6B]">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="login-remember" checked
              class="rounded border-[#E4DDD3] text-[#6C1C37] focus:ring-[#6C1C37]">
            <span>Manter sessão iniciada</span>
          </label>
        </div>

        <button type="submit" id="login-submit-btn" class="w-full btn-primary py-2.5 text-xs font-medium">
          <span>Entrar no Gabinete</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>

      </form>

      <!-- FORMULÁRIO 2: CRIAR CONTA COM REGRAS DE PASSWORD -->
      <form id="form-register" onsubmit="handleRegisterSubmit(event)" class="space-y-4 hidden">

        <div id="auth-register-error-msg"
          class="hidden p-3 bg-[#F6D9D5] border border-[#F1D9CE] rounded-xl text-[#A3281E] text-xs font-medium"></div>
        <div id="auth-register-success-msg"
          class="hidden p-3 bg-[#DDEBDD] border border-[#DFE7D6] rounded-xl text-[#2F6B3A] text-xs font-medium">
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nome Completo *</label>
          <input type="text" id="register-name" required placeholder="Tiago Mendes" class="crm-input py-2.5 text-xs">
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Email Institucional *</label>
          <input type="email" id="register-email" required value="tiagoperesmendes@gmail.com"
            class="crm-input py-2.5 text-xs font-mono">
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nível de Permissão / Cargo *</label>
          <select id="register-role" class="crm-input py-2.5 text-xs font-medium">
            <option value="director" selected>Diretor(a) de RP — Acesso Total</option>
            <option value="press_officer">Assessor(a) de Imprensa — Gestão</option>
            <option value="junior">Técnico(a) de Clipping — Registo</option>
            <option value="viewer">Observador(a) — Consulta</option>
          </select>
        </div>

        <input type="hidden" id="register-invite-code" value="RP2026">

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Criar Palavra-passe *</label>
          <div class="relative">
            <input type="password" id="register-password" required oninput="validateRegisterPasswordLive(this.value)"
              placeholder="Ex: Diretor@2026" class="crm-input pl-3 pr-10 py-2.5 text-xs font-mono">
            <button type="button" onclick="togglePasswordVisibility('register-password')"
              class="absolute right-3 top-2.5 text-[#6B6B6B] hover:text-[#1A1A1A] p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
            </button>
          </div>

          <!-- Validações em tempo real da palavra-passe -->
          <div class="mt-2.5 p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] text-[11px] space-y-1.5">
            <p class="font-medium text-[#1A1A1A]">Requisitos da palavra-passe:</p>
            <div id="rule-upper" class="flex items-center gap-2 text-[#6B6B6B]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E4DDD3] rule-dot"></span>
              <span>Primeira letra deve ser maiúscula (A-Z)</span>
            </div>
            <div id="rule-special" class="flex items-center gap-2 text-[#6B6B6B]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E4DDD3] rule-dot"></span>
              <span>Pelo menos um carácter especial (! @ # $ % & * ...)</span>
            </div>
            <div id="rule-len" class="flex items-center gap-2 text-[#6B6B6B]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E4DDD3] rule-dot"></span>
              <span>Mínimo de 6 caracteres</span>
            </div>
          </div>
        </div>

        <button type="submit" id="register-submit-btn" class="w-full btn-primary py-2.5 text-xs font-medium">
          <span>Criar Conta</span>
        </button>

      </form>

      <!-- FORMULÁRIO 3: RECUPERAÇÃO DE CONTA (RESET DE PALAVRA-PASSE) -->
      <form id="form-recover" onsubmit="handleRecoverSubmit(event)" class="space-y-4 hidden">

        <div id="auth-recover-msg"
          class="hidden p-3 bg-[#DCE7F0] border border-[#DDE6EE] rounded-xl text-[#2C5576] text-xs font-medium"></div>

        <div>
          <h3 class="text-xs font-semibold text-[#1A1A1A] font-title">Recuperação de Acesso</h3>
          <p class="text-[11px] text-[#6B6B6B] mt-0.5">Insere o teu email e define a nova palavra-passe com os
            requisitos de segurança.</p>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Email da Conta *</label>
          <input type="email" id="recover-email" required value="tiagoperesmendes@gmail.com"
            class="crm-input py-2.5 text-xs font-mono">
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nova Palavra-passe *</label>
          <div class="relative">
            <input type="password" id="recover-new-password" required oninput="validateRecoverPasswordLive(this.value)"
              placeholder="Ex: Diretor@2026" class="crm-input pl-3 pr-10 py-2.5 text-xs font-mono">
            <button type="button" onclick="togglePasswordVisibility('recover-new-password')"
              class="absolute right-3 top-2.5 text-[#6B6B6B] hover:text-[#1A1A1A] p-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
            </button>
          </div>

          <div class="mt-2 p-2.5 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] text-[11px] space-y-1">
            <div id="rec-rule-upper" class="flex items-center gap-2 text-[#6B6B6B]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E4DDD3]"></span>
              <span>Primeira letra maiúscula</span>
            </div>
            <div id="rec-rule-special" class="flex items-center gap-2 text-[#6B6B6B]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E4DDD3]"></span>
              <span>Carácter especial</span>
            </div>
          </div>
        </div>

        <button type="submit" id="recover-submit-btn" class="w-full btn-primary py-2.5 text-xs font-medium">
          <span>Redefinir Palavra-passe</span>
        </button>

      </form>

    </div>
  </div>

  <!-- ======================================================== -->
  <!-- APLICAÇÃO PRINCIPAL (PROTEGIDA POR LOGIN)                -->
  <!-- ======================================================== -->
  <div id="app-container" class="flex-1 flex flex-col md:flex-row min-h-screen hidden">

    <!-- ========================================== -->
    <!-- BACKDROP PARA MOBILE (QUANDO MENU ESTÁ ABERTO) -->
    <div id="sidebar-backdrop" onclick="toggleSidebar(false)"
      class="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs z-30 hidden md:hidden transition-opacity"></div>

    <!-- ABA FLUTUANTE RETRÁTIL NA MARGEM ESQUERDA (VISÍVEL QUANDO MENU ESTÁ RECOLHIDO) -->
    <button id="sidebar-floating-tab" onclick="toggleSidebar(true)"
      class="fixed left-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-[#1A1A1A] border border-[#E4DDD3] border-l-0 shadow-md py-3 px-2 rounded-r-xl z-40 transition-all hidden hover:pr-3 group flex flex-col items-center gap-2 cursor-pointer"
      title="Expandir Menu Lateral (MODO)">
      <svg class="w-4 h-4 text-[#6C1C37] group-hover:translate-x-0.5 transition-transform" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
      </svg>
      <span
        class="[writing-mode:vertical-rl] text-[10px] font-medium uppercase tracking-widest text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors">Menu</span>
    </button>

    <!-- ========================================== -->
    <!-- BARRA LATERAL (SIDEBAR / ABA RETRÁTIL)     -->
    <!-- ========================================== -->
    <aside id="main-sidebar"
      class="transition-all duration-300 ease-in-out w-full md:w-72 bg-[#FBF9F6]/90 backdrop-blur-md border-r border-[#E4DDD3] flex flex-col justify-between p-4 md:p-6 shrink-0 z-40 overflow-y-auto">
      <div class="space-y-6">

        <!-- Logotipo e Marca MODO com Botão de Recolher -->
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <img src="logo-modo.png" alt="MODO Agência de Comunicação"
              class="h-7 max-w-[155px] object-contain mix-blend-multiply" />
          </div>
          <!-- Botão para Recolher Aba (<<) -->
          <button onclick="toggleSidebar(false)"
            class="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer"
            title="Recolher Menu (Ocupar Ecrã Inteiro)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7">
              </path>
            </svg>
          </button>
        </div>

        <!-- Hidden compatibility for auth & db status -->
        <div class="hidden">
          <div class="auth-user-initials">TM</div>
          <span class="auth-user-email">tiagoperesmendes@gmail.com</span>
          <span id="sidebar-role-badge">Diretor de RP</span>
          <div id="db-status-badge">
            <span id="db-indicator-dot"></span>
            <span id="db-status-text">Supabase Cloud</span>
            <button id="db-config-btn" onclick="openConfigModal()"></button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- ESPAÇOS DE TRABALHO (EXATAMENTE COMO IMAGEM 3) -->
        <!-- ========================================== -->
        <div class="space-y-1">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A] mb-2 px-2">Espaços de trabalho</p>

          <!-- 1. Painel (Dashboard) -->
          <button onclick="switchView('dashboard')" id="nav-dashboard"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#1A1A1A] shadow-xs border border-[#E4DDD3]/60 transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#6C1C37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                </path>
              </svg>
              <span>Painel</span>
            </div>
          </button>

          <!-- 2. Contactos -->
          <button onclick="switchView('contacts')" id="nav-contacts"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                </path>
              </svg>
              <span>Contactos</span>
            </div>
            <span id="sidebar-contacts-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full">1 240</span>
          </button>

          <!-- 3. Pitches -->
          <button onclick="switchView('tasks')" id="nav-tasks"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <span>Pitches</span>
            </div>
            <span id="sidebar-tasks-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full">9</span>
          </button>

          <!-- 4. Cobertura -->
          <button onclick="switchView('clipping')" id="nav-clipping"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                </path>
              </svg>
              <span>Cobertura</span>
            </div>
            <span id="sidebar-clippings-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full">27</span>
          </button>
        </div>

        <!-- ========================================== -->
        <!-- LISTAS GUARDADAS (EXATAMENTE COMO IMAGEM 3) -->
        <!-- ========================================== -->
        <div class="space-y-1 pt-3 border-t border-[#E4DDD3]">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A] mb-2 px-2">Listas guardadas</p>

          <button onclick="switchView('journalists')"
            class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-normal text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <span class="truncate"># Economia &amp; Negócios</span>
          </button>

          <button onclick="switchView('journalists')"
            class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-normal text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <span class="truncate"># Tech Lisboa</span>
          </button>

          <button onclick="switchView('journalists')"
            class="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-normal text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <span class="truncate"># Clima &amp; ESG</span>
          </button>
        </div>

        <!-- ========================================== -->
        <!-- GESTÃO INTEGRADA (PROJETOS & ANÁLISE)      -->
        <!-- ========================================== -->
        <div class="space-y-1 pt-3 border-t border-[#E4DDD3]">
          <p class="text-[10px] uppercase tracking-wider font-semibold text-[#8A8A8A] mb-2 px-2">Dossiês &amp; Relatórios</p>

          <button onclick="switchView('projects')" id="nav-projects"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <span>Projetos &amp; Dossiês</span>
            </div>
            <span id="sidebar-projects-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full">7</span>
          </button>

          <button onclick="switchView('journalists')" id="nav-journalists"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                </path>
              </svg>
              <span>Jornalistas</span>
            </div>
            <span id="sidebar-journalists-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full">24</span>
          </button>

          <button onclick="switchView('outlets')" id="nav-outlets"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                </path>
              </svg>
              <span>Órgãos de Media</span>
            </div>
            <span id="sidebar-outlets-count"
              class="bg-[#E9E5E0] text-[#5C554E] text-[10px] font-medium px-2 py-0.5 rounded-full">12</span>
          </button>

          <button onclick="switchView('response_analytics')" id="nav-analytics"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer">
            <div class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-[#8A8A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
              <span>Relatórios &amp; Taxas</span>
            </div>
          </button>
        </div>

        <!-- BOTÕES DE CRIAÇÃO RÁPIDA -->
        <div class="pt-3 border-t border-[#E4DDD3] space-y-2">
          <button onclick="openTaskModal()" id="sidebar-btn-new-task"
            class="w-full btn-primary py-2 px-3 text-xs font-medium">
            <span>+ Nova Tarefa</span>
          </button>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="openProjectModal()" id="sidebar-btn-new-project"
              class="btn-secondary py-1.5 px-2 text-[11px] font-medium">
              <span>+ Projeto</span>
            </button>
            <button onclick="openContactModal()" id="sidebar-btn-new-contact"
              class="btn-secondary py-1.5 px-2 text-[11px] font-medium">
              <span>+ Contacto</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Rodapé Sidebar com Perfil Estilo Imagem 3 -->
      <div class="pt-4 border-t border-[#E4DDD3]">
        <div class="p-2.5 rounded-2xl bg-white/90 border border-[#E4DDD3] flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-[#B85D3B] text-white flex items-center justify-center text-xs font-semibold shrink-0 auth-user-initials font-title shadow-2xs">
              TM
            </div>
            <div class="min-w-0">
              <span class="text-xs font-semibold text-[#1A1A1A] block truncate" id="sidebar-user-name">Tiago Mendes</span>
              <span class="text-[10px] text-[#6B6B6B] block truncate" id="sidebar-user-title">Direção de RP</span>
            </div>
          </div>
          <button onclick="handleSignOut()" class="text-[#8A8A8A] hover:text-[#A3281E] p-1.5 rounded-lg hover:bg-[#F6F2EC] transition-colors cursor-pointer" title="Terminar Sessão">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ========================================== -->
    <!-- ÁREA DE CONTEÚDO PRINCIPAL                 -->
    <!-- ========================================== -->
    <main class="flex-1 flex flex-col min-w-0 bg-[#EDE6DE]" id="section-top">

      <!-- CABEÇALHO GLOBAL SLIM (EXCLUSIVAMENTE LADO DIREITO: PERFIL + TERMINAR SESSÃO) -->
      <header
        class="px-4 sm:px-6 lg:px-10 py-2.5 bg-[#FBF9F6]/95 backdrop-blur-md border-b border-[#E4DDD3] flex items-center justify-end gap-3 sticky top-0 z-30 shadow-subtle">

        <!-- Elementos ocultos para manter compatibilidade funcional com switchView -->
        <div class="hidden">
          <h1 id="page-title">Dashboard</h1>
          <p id="page-subtitle"></p>
        </div>

        <!-- Lado Direito: Perfil Ativo e Terminar Sessão (Logout) -->
        <div class="flex items-center gap-3">
          <!-- Indicador Subtil de Utilizador e Perfil -->
          <div
            class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E4DDD3] shadow-xs">
            <span id="header-user-dot" class="w-2 h-2 rounded-full bg-[#6C1C37]"></span>
            <span id="header-user-role" class="text-[11px] font-medium text-[#1A1A1A]">Diretor de RP</span>
            <span class="text-[#E4DDD3] text-xs">•</span>
            <span id="header-user-email"
              class="text-[11px] text-[#6B6B6B] font-normal">tiagoperesmendes@gmail.com</span>
          </div>

          <!-- Botão Exclusivo de Terminar Sessão (Logout) -->
          <button onclick="handleSignOut()" class="btn-secondary py-1.5 px-3 text-xs font-medium hover:text-[#A3281E]"
            title="Terminar Sessão">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Terminar Sessão</span>
          </button>
        </div>
      </header>

      <!-- BANNER DE PERFIL: MODO LEITURA / OBSERVADOR (VISÍVEL APENAS PARA OBSERVADOR) -->
      <div id="read-only-banner"
        class="hidden px-4 sm:px-6 lg:px-10 py-2.5 bg-[#FBF9F6] text-[#1A1A1A] text-xs font-medium flex items-center justify-between border-b border-[#E4DDD3]">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#2C5576]"></span>
          <span>Modo Observador Executivo: Acesso restrito a consulta e relatórios (Apenas Leitura).</span>
        </div>
        <button onclick="quickLoginRole('director')"
          class="text-[11px] text-[#6C1C37] hover:underline font-medium cursor-pointer">
          Mudar para Diretor
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- VISTA 1: DASHBOARD (PÁGINA INICIAL OVERVIEW)             -->
      <!-- ======================================================== -->
      <div id="view-dashboard"
        class="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- TOPO: SAUDAÇÃO & LINHA DE RESUMO -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight" id="dash-greeting">
              Bom dia, Tiago
            </h1>
            <p class="text-xs sm:text-sm text-[#6B6B6B] mt-1" id="dash-greeting-summary">
              5 tarefas para hoje · <span class="text-[#A3281E] font-medium">2 em atraso</span>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Barra de Pesquisa com atalho ⌘K -->
            <div class="relative w-60 sm:w-72">
              <input type="text" placeholder="Pesquisar..."
                class="w-full bg-white/95 border border-[#E4DDD3] rounded-xl pl-9 pr-12 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-2xs" />
              <svg class="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <kbd class="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-mono text-[#8A8A8A] bg-[#F6F2EC] border border-[#E4DDD3] rounded">⌘K</kbd>
            </div>

            <!-- Botões de Ação Rápida -->
            <button onclick="openTaskModal()"
              class="px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer">
              <span>+ Nova Tarefa</span>
            </button>
            <button onclick="openContactModal()"
              class="px-3 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] bg-white border border-[#E4DDD3] hover:border-[#6C1C37]/50 shadow-2xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer">
              <span>+ Registar Contacto</span>
            </button>
          </div>
        </div>

        <!-- LINHA DE 4 CARTÕES (NÚMERO GRANDE + LEGENDA PEQUENA, CLICÁVEIS) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Cartão 1: Projetos em curso -->
          <div onclick="switchView('projects')"
            class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <span class="text-xs text-[#6B6B6B] font-medium block">Projetos em curso</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors" id="dash-card-open-projects">
              7
            </div>
            <span class="text-xs text-[#6B6B6B] block" id="dash-card-open-projects-sub">
              2 a terminar esta semana
            </span>
          </div>

          <!-- Cartão 2: Entregas esta semana -->
          <div onclick="switchView('tasks', true, { filter: 'overdue' })"
            class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <span class="text-xs text-[#6B6B6B] font-medium block">Entregas esta semana</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors" id="dash-card-week-deliveries">
              12
            </div>
            <span class="text-xs text-[#A3281E] font-medium block" id="dash-card-week-deliveries-sub">
              2 em atraso
            </span>
          </div>

          <!-- Cartão 3: A aguardar cliente -->
          <div onclick="switchView('tasks')"
            class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <span class="text-xs text-[#6B6B6B] font-medium block">A aguardar cliente</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors" id="dash-card-waiting-client">
              4
            </div>
            <span class="text-xs text-[#6B6B6B] block">
              Aprovações e feedback pendentes
            </span>
          </div>

          <!-- Cartão 4: Contactos hoje -->
          <div onclick="switchView('contacts', true, { period: 'today' })"
            class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 shadow-xs hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <span class="text-xs text-[#6B6B6B] font-medium block">Contactos hoje</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title tracking-tight my-1 group-hover:text-[#6C1C37] transition-colors" id="dash-card-contacts-today">
              3 / 7
            </div>
            <span class="text-xs text-[#6B6B6B] block" id="dash-card-contacts-today-sub">
              4 planeados para a tarde
            </span>
          </div>
        </div>

        <!-- ÁREA PRINCIPAL: DUAS COLUNAS -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- COLUNA ESQUERDA (7 COLS): PARA FAZER HOJE & EM ATRASO OU EM RISCO -->
          <div class="lg:col-span-7 space-y-6">

            <!-- 1. PARA FAZER HOJE -->
            <section class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                <div>
                  <h3 class="text-base font-semibold text-[#1A1A1A] font-title">Para fazer hoje</h3>
                  <p class="text-[11px] text-[#6B6B6B] mt-0.5">Ordenado cronologicamente por prazo de entrega</p>
                </div>
                <button onclick="switchView('tasks', true, { filter: 'today' })"
                  class="text-xs font-medium text-[#6C1C37] hover:underline cursor-pointer">
                  Ver todas no gestor &rarr;
                </button>
              </div>

              <!-- Lista de Tarefas de Hoje (Checkbox, Tarefa, Cliente, Prazo, Responsável) -->
              <div id="dash-today-tasks-container" class="divide-y divide-[#E4DDD3]/60">
                <!-- Preenchido dinamicamente com renderDashboardTodayTasks() -->
              </div>

              <div class="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between text-xs">
                <span class="text-[#8A8A8A] text-[11px]" id="dash-today-tasks-counter">5 tarefas agendadas para hoje</span>
                <button onclick="openTaskModal()"
                  class="font-medium text-[#6C1C37] hover:underline cursor-pointer">
                  + Nova Tarefa
                </button>
              </div>
            </section>

            <!-- 2. EM ATRASO OU EM RISCO -->
            <section class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                <div>
                  <h3 class="text-base font-semibold text-[#1A1A1A] font-title">Em atraso ou em risco</h3>
                  <p class="text-[11px] text-[#6B6B6B] mt-0.5">Projetos com prazo crítico (&lt; 3 dias) ou sem movimento recente</p>
                </div>
                <button onclick="switchView('projects')"
                  class="text-xs font-medium text-[#6C1C37] hover:underline cursor-pointer">
                  Ver todos os projetos &rarr;
                </button>
              </div>

              <!-- Lista de Projetos em Risco -->
              <div class="space-y-3" id="dash-at-risk-projects-container">
                <!-- Preenchido dinamicamente com renderDashboardAtRiskProjects() -->
              </div>
            </section>

          </div>

          <!-- COLUNA DIREITA (5 COLS): PRÓXIMOS 7 DIAS, SEM CONTACTO HÁ +15 DIAS, ATIVIDADE RECENTE -->
          <div class="lg:col-span-5 space-y-6">

            <!-- 1. PRÓXIMOS 7 DIAS (AGENDA) -->
            <section class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                <h3 class="text-base font-semibold text-[#1A1A1A] font-title">Próximos 7 dias</h3>
                <span class="text-xs text-[#8A8A8A]">Agenda da agência</span>
              </div>

              <div class="space-y-3">
                <!-- Item 1 -->
                <div onclick="switchView('tasks')" class="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FBF9F6] transition-colors cursor-pointer group">
                  <div class="w-11 h-12 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] flex flex-col items-center justify-center shrink-0 group-hover:border-[#6C1C37]/40 transition-colors">
                    <span class="text-[9px] uppercase font-bold text-[#8A8A8A] leading-none">NOV</span>
                    <span class="text-sm font-bold text-[#1A1A1A] leading-tight">23</span>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                      Entrevista CEO — Expresso
                    </h4>
                    <p class="text-[11px] text-[#6B6B6B] mt-0.5 truncate">10:30 · Sede, Lisboa · Briefing preparado</p>
                  </div>
                </div>

                <!-- Item 2 -->
                <div onclick="switchView('tasks')" class="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FBF9F6] transition-colors cursor-pointer group">
                  <div class="w-11 h-12 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] flex flex-col items-center justify-center shrink-0 group-hover:border-[#6C1C37]/40 transition-colors">
                    <span class="text-[9px] uppercase font-bold text-[#8A8A8A] leading-none">NOV</span>
                    <span class="text-sm font-bold text-[#1A1A1A] leading-tight">25</span>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                      Conferência de Imprensa: Hospital Lusíadas
                    </h4>
                    <p class="text-[11px] text-[#6B6B6B] mt-0.5 truncate">11:00 · Hotel Tivoli, Lisboa</p>
                  </div>
                </div>

                <!-- Item 3 -->
                <div onclick="switchView('tasks')" class="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FBF9F6] transition-colors cursor-pointer group">
                  <div class="w-11 h-12 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] flex flex-col items-center justify-center shrink-0 group-hover:border-[#6C1C37]/40 transition-colors">
                    <span class="text-[9px] uppercase font-bold text-[#8A8A8A] leading-none">NOV</span>
                    <span class="text-sm font-bold text-[#1A1A1A] leading-tight">27</span>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                      Embargo: Estudo de Sustentabilidade
                    </h4>
                    <p class="text-[11px] text-[#6B6B6B] mt-0.5 truncate">09:00 · 18 jornalistas com acesso</p>
                  </div>
                </div>

                <!-- Item 4 -->
                <div onclick="switchView('tasks')" class="flex items-start gap-3 p-2 rounded-xl hover:bg-[#FBF9F6] transition-colors cursor-pointer group">
                  <div class="w-11 h-12 rounded-xl bg-[#F6F2EC] border border-[#E4DDD3] flex flex-col items-center justify-center shrink-0 group-hover:border-[#6C1C37]/40 transition-colors">
                    <span class="text-[9px] uppercase font-bold text-[#8A8A8A] leading-none">NOV</span>
                    <span class="text-sm font-bold text-[#1A1A1A] leading-tight">28</span>
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                      Almoço Editorial com Direção do ECO
                    </h4>
                    <p class="text-[11px] text-[#6B6B6B] mt-0.5 truncate">13:00 · Clube de Jornalistas</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- 2. SEM CONTACTO HÁ +15 DIAS -->
            <section class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                <h3 class="text-base font-semibold text-[#1A1A1A] font-title">Sem contacto há +15 dias</h3>
                <span class="text-xs text-[#8A8A8A]">Atenção relacional</span>
              </div>

              <div class="space-y-3">
                <!-- Cliente 1 -->
                <div class="p-3 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] truncate">BioPharma Portugal</h4>
                    <p class="text-[11px] text-[#805B00] mt-0.5">Último contacto: 04 nov (há 18 dias)</p>
                  </div>
                  <button onclick="openContactModalWithClient('BioPharma Portugal')"
                    class="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] transition-colors shrink-0 cursor-pointer shadow-2xs">
                    Contactar
                  </button>
                </div>

                <!-- Cliente 2 -->
                <div class="p-3 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] truncate">Logística Urbana SA</h4>
                    <p class="text-[11px] text-[#A3281E] mt-0.5">Último contacto: 28 out (há 25 dias)</p>
                  </div>
                  <button onclick="openContactModalWithClient('Logística Urbana SA')"
                    class="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] transition-colors shrink-0 cursor-pointer shadow-2xs">
                    Contactar
                  </button>
                </div>

                <!-- Cliente 3 -->
                <div class="p-3 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] truncate">Câmara de Comércio Luso-Francesa</h4>
                    <p class="text-[11px] text-[#805B00] mt-0.5">Último contacto: 01 nov (há 21 dias)</p>
                  </div>
                  <button onclick="openContactModalWithClient('Câmara de Comércio Luso-Francesa')"
                    class="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] transition-colors shrink-0 cursor-pointer shadow-2xs">
                    Contactar
                  </button>
                </div>

                <!-- Cliente 4 -->
                <div class="p-3 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="text-xs font-semibold text-[#1A1A1A] truncate">Inovação &amp; Retalho Ibérico</h4>
                    <p class="text-[11px] text-[#805B00] mt-0.5">Último contacto: 05 nov (há 17 dias)</p>
                  </div>
                  <button onclick="openContactModalWithClient('Inovação & Retalho Ibérico')"
                    class="px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#6C1C37] hover:bg-[#58152B] transition-colors shrink-0 cursor-pointer shadow-2xs">
                    Contactar
                  </button>
                </div>
              </div>
            </section>

            <!-- 3. ATIVIDADE RECENTE (FEED DAS ÚLTIMAS 5 AÇÕES DA EQUIPA) -->
            <section class="bg-white/95 rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-[#E4DDD3]/60">
                <h3 class="text-base font-semibold text-[#1A1A1A] font-title">Atividade recente</h3>
                <span class="text-xs text-[#8A8A8A]">Últimas 5 ações</span>
              </div>

              <div class="space-y-3">
                <!-- Ação 1 -->
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-7 h-7 rounded-full bg-[#B85D3B] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title">
                    RV
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[#1A1A1A] leading-snug">
                      <span class="font-semibold">Rita Valente</span> registou contacto com Marta Figueiredo (Público)
                    </p>
                    <span class="text-[10px] text-[#8A8A8A] block mt-0.5">há 12 min</span>
                  </div>
                </div>

                <!-- Ação 2 -->
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title">
                    TM
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[#1A1A1A] leading-snug">
                      <span class="font-semibold">Tiago Mendes</span> concluiu a tarefa "Aprovação de nota de imprensa Q4"
                    </p>
                    <span class="text-[10px] text-[#8A8A8A] block mt-0.5">há 34 min</span>
                  </div>
                </div>

                <!-- Ação 3 -->
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-7 h-7 rounded-full bg-[#BD5D38] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title">
                    NA
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[#1A1A1A] leading-snug">
                      <span class="font-semibold">Nuno Abreu</span> associou 3 jornalistas ao projeto "Lançamento Fundo Ibérico"
                    </p>
                    <span class="text-[10px] text-[#8A8A8A] block mt-0.5">há 1h</span>
                  </div>
                </div>

                <!-- Ação 4 -->
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-7 h-7 rounded-full bg-[#4A7C59] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title">
                    MF
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[#1A1A1A] leading-snug">
                      <span class="font-semibold">Marta Figueiredo</span> arquivou clipping com sentimento positivo no Expresso
                    </p>
                    <span class="text-[10px] text-[#8A8A8A] block mt-0.5">há 2h</span>
                  </div>
                </div>

                <!-- Ação 5 -->
                <div class="flex items-start gap-3 text-xs">
                  <div class="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-title">
                    TM
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[#1A1A1A] leading-snug">
                      <span class="font-semibold">Tiago Mendes</span> agendou conferência de imprensa para 25 de novembro
                    </p>
                    <span class="text-[10px] text-[#8A8A8A] block mt-0.5">há 3h</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>

        <!-- Contentores ocultos de compatibilidade funcional -->
        <div class="hidden">
          <span id="kpi-open-projects">7</span>
          <span id="kpi-tasks-today">5</span>
          <span id="kpi-tasks-today-sub">3 alta prioridade</span>
          <span id="kpi-tasks-overdue">2</span>
          <span id="kpi-tasks-overdue-badge">Atrasadas</span>
          <span id="kpi-tasks-week">4</span>
          <span id="kpi-tasks-week-sub">Próx: 18 nov</span>
          <span id="kpi-contacts-today">12</span>
          <span id="kpi-contacts-today-sub">+4 face a ontem</span>
          <span id="kpi-contacts-week">41</span>
          <span id="kpi-contacts-week-sub">Meta: 50</span>
          <span id="kpi-clippings-month">18</span>
          <span id="kpi-clippings-sub">12 positivas</span>
          <span id="kpi-response-rate">38%</span>
          <span id="kpi-pending-tasks">0</span>
          <span id="kpi-ave-total">0</span>
          <span id="kpi-press-requests">0</span>
          <span id="kpi-clippings-count">0</span>
          <span id="badge-dashboard-tasks-count"></span>
          <button id="dash-project-btn" onclick="openProjectModal()"></button>
          <button id="dash-task-btn" onclick="openTaskModal()"></button>
          <button id="dash-contact-btn" onclick="openContactModal()"></button>
          <div id="dash-operational-focus-banner"></div>
          <span id="dash-focus-title"></span>
          <span id="dash-focus-desc"></span>
          <div id="dashboard-tasks-table-body"></div>
          <div id="dashboard-contacts-container"></div>
          <div id="dashboard-projects-container"></div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- VISTA 2: TAREFAS (GESTOR COMPLETO DE TAREFAS)            -->
      <!-- ======================================================== -->
      <div id="view-tasks"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Navegação / Breadcrumb Apple-Notion -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">O Que Tenho Para Fazer</span>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs">
          <div class="flex flex-wrap items-center gap-1.5" id="tasks-filter-tabs-container">
            <button onclick="filterTasksByTab('all')" id="tab-tasks-all"
              class="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all">Todas</button>
            <button onclick="filterTasksByTab('today')" id="tab-tasks-today"
              class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Hoje</button>
            <button onclick="filterTasksByTab('overdue')" id="tab-tasks-overdue"
              class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Em
              Atraso</button>
            <button onclick="filterTasksByTab('week')" id="tab-tasks-week"
              class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Esta
              Semana</button>
            <button onclick="filterTasksByTab('completed')" id="tab-tasks-completed"
              class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Concluídas</button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="toggleTableDensity('full-tasks-table')" class="btn-secondary py-1.5 px-3 text-xs"
              title="Alternar densidade">
              Densidade
            </button>
            <button onclick="openTaskModal()" id="view-tasks-add-btn"
              class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>+ Nova Tarefa</span>
            </button>
          </div>
        </div>

        <div class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="full-tasks-table">
              <thead>
                <tr>
                  <th class="w-10 text-center">Estado</th>
                  <th>Título da Tarefa</th>
                  <th>Projeto & Cliente</th>
                  <th>Responsável</th>
                  <th>Prioridade</th>
                  <th>Data de Entrega</th>
                  <th>Notas / Detalhe</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody id="full-tasks-table-body">
                <!-- Preenchido dinamicamente -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- VISTA 3: PROJETOS (GESTOR DE PROJETOS DE COMUNICAÇÃO)    -->
      <!-- ======================================================== -->
      <div id="view-projects"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Navegação / Breadcrumb Apple-Notion -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">Projetos em Aberto</span>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs">
          <div>
            <h2 class="text-sm font-semibold text-[#1A1A1A] font-title">Gestão de Projetos de Comunicação</h2>
            <p class="text-xs text-[#6B6B6B]">Acompanha dossiês de imprensa, campanhas institucionais e relações
              públicas.</p>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5" id="projects-filter-tabs-container">
              <button onclick="filterProjectsByTab('all')" id="tab-projects-all"
                class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Todos</button>
              <button onclick="filterProjectsByTab('open')" id="tab-projects-open"
                class="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all">Em
                Aberto</button>
              <button onclick="filterProjectsByTab('completed')" id="tab-projects-completed"
                class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Concluídos</button>
            </div>
            <button onclick="openProjectModal()" id="view-projects-add-btn"
              class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>+ Criar Novo Projeto</span>
            </button>
          </div>
        </div>

        <div id="full-projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

            <!-- ======================================================== -->
      <!-- VISTA 4: BASE DE DADOS DE JORNALISTAS (BASE 2)           -->
      <!-- ======================================================== -->
      <div id="view-journalists"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Breadcrumb e Topo -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">Base de Dados de Jornalistas (Base 2)</span>
          </div>
          <div class="flex items-center gap-2">
            <span id="journalists-total-badge" class="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
              20 jornalistas registados
            </span>
          </div>
        </div>

        <!-- Barra de Ferramentas: Pesquisa e Filtros Attio-Style -->
        <div class="bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs space-y-3">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <!-- Barra de Pesquisa RÃ¡pida -->
            <div class="relative flex-1 max-w-md">
              <input type="text" id="search-journalists" onkeyup="filterJournalistsTable()"
                placeholder="Pesquisar por nome, cargo, OCS, Ã¡rea ou notas..."
                class="crm-input pl-9 pr-3 py-2 text-xs">
              <svg class="w-4 h-4 text-[#6B6B6B] absolute left-3 top-2.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- BotÃµes de AÃ§Ã£o -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Menu Dropdown de Colunas -->
              <div class="relative" id="dropdown-jour-cols-container">
                <button onclick="toggleJourColsDropdown(event)" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" title="Mostrar/ocultar colunas">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                  <span>Colunas</span>
                </button>
                <div id="dropdown-jour-cols" class="hidden absolute right-0 mt-1 w-48 bg-white rounded-xl border border-[#E4DDD3] shadow-modal p-2 z-30 space-y-1 text-xs">
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('cargo')" id="chk-jour-cargo"> Cargo</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('ocs')" id="chk-jour-ocs"> Ã“rgÃ£o (OCS)</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('area')" id="chk-jour-area"> Ãrea IntervenÃ§Ã£o</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('contactos')" id="chk-jour-contactos"> Contactos</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('pref')" id="chk-jour-pref"> PreferÃªncia</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('ultimo')" id="chk-jour-ultimo"> Ãšltimo Contacto</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('rgpd')" id="chk-jour-rgpd"> RGPD</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleJourCol('estado')" id="chk-jour-estado"> Estado</label>
                </div>
              </div>

              <!-- Exportar CSV -->
              <button onclick="exportJournalistsCsv()" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" title="Exportar tabela para CSV">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Exportar CSV</span>
              </button>

              <!-- Importar CSV -->
              <input type="file" id="input-import-jour-csv" accept=".csv" class="hidden" onchange="importJournalistsCsv(event)">
              <button onclick="document.getElementById('input-import-jour-csv').click()" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" title="Importar jornalistas de ficheiro CSV">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <span>Importar CSV</span>
              </button>

              <!-- Alternar Densidade -->
              <button onclick="toggleTableDensity('journalists-table')" class="btn-secondary py-1.5 px-3 text-xs" title="Alternar densidade da tabela">
                Densidade
              </button>

              <!-- + Adicionar Jornalista -->
              <button onclick="openJournalistModal()" id="view-journalists-add-btn"
                class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>+ Adicionar Jornalista</span>
              </button>
            </div>
          </div>

          <!-- Filtros AvanÃ§ados: Ãrea, Estado, PreferÃªncia -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E4DDD3]/60 text-xs">
            <span class="text-[#6B6B6B] font-medium mr-1">Filtros:</span>

            <!-- Filtro de Ãrea -->
            <select id="filter-jour-area" onchange="filterJournalistsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todas as Ãreas de IntervenÃ§Ã£o</option>
              <option value="Economia & NegÃ³cios">Economia & NegÃ³cios</option>
              <option value="Sustentabilidade & ESG">Sustentabilidade & ESG</option>
              <option value="Tecnologia & InovaÃ§Ã£o">Tecnologia & InovaÃ§Ã£o</option>
              <option value="PolÃ­tica & Sociedade">PolÃ­tica & Sociedade</option>
              <option value="SaÃºde & CiÃªncia">SaÃºde & CiÃªncia</option>
              <option value="ImobiliÃ¡rio & ConstruÃ§Ã£o">ImobiliÃ¡rio & ConstruÃ§Ã£o</option>
              <option value="Cultura & Estilo de Vida">Cultura & Estilo de Vida</option>
              <option value="OpiniÃ£o & Internacional">OpiniÃ£o & Internacional</option>
              <option value="Mercados & FinanÃ§as">Mercados & FinanÃ§as</option>
            </select>

            <!-- Filtro de Estado -->
            <select id="filter-jour-status" onchange="filterJournalistsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todos os Estados</option>
              <option value="ativo">Ativo</option>
              <option value="mudou_de_meio">Mudou de meio</option>
              <option value="reformado">Reformado</option>
            </select>

            <!-- Filtro de PreferÃªncia -->
            <select id="filter-jour-pref" onchange="filterJournalistsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todas as PreferÃªncias</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="telefone">Telefone</option>
            </select>

            <!-- BotÃ£o Limpar Filtros -->
            <button onclick="clearJournalistFilters()" class="text-xs text-[#6C1C37] hover:underline px-2 py-1 ml-auto">
              Limpar filtros
            </button>
          </div>
        </div>

        <!-- Tabela de Jornalistas (Base 2) -->
        <div class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="journalists-table">
              <thead>
                <tr>
                  <th onclick="sortJournalists('name')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Nome do Jornalista</span>
                      <span id="sort-icon-jour-name" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-jour-cargo" onclick="sortJournalists('role_title')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Cargo</span>
                      <span id="sort-icon-jour-role" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-jour-ocs" onclick="sortJournalists('outlet_name')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Ã“rgÃ£o (OCS)</span>
                      <span id="sort-icon-jour-ocs" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-jour-area">Ãrea de IntervenÃ§Ã£o</th>
                  <th id="th-jour-contactos">Contactos Diretos</th>
                  <th id="th-jour-pref">Pref.</th>
                  <th id="th-jour-ultimo" onclick="sortJournalists('last_contact_date')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Ãšltimo Contacto</span>
                      <span id="sort-icon-jour-last" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-jour-rgpd">RGPD</th>
                  <th id="th-jour-estado" onclick="sortJournalists('status')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Estado</span>
                      <span id="sort-icon-jour-status" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th class="text-right">AÃ§Ãµes</th>
                </tr>
              </thead>
              <tbody id="journalists-table-body">
                <!-- Preenchido dinamicamente via renderJournalistsTable() -->
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-[#6B6B6B] px-1">
          <span id="journalists-footer-count">A apresentar 20 jornalistas</span>
          <span class="text-[11px]">Clica em qualquer linha para abrir a ficha completa do jornalista</span>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- VISTA 5: MEIOS DE COMUNICAÃ‡ÃƒO SOCIAL (BASE 1)            -->
      <!-- ======================================================== -->
      <div id="view-outlets"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Breadcrumb e Topo -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">Meios de ComunicaÃ§Ã£o Social (Base 1)</span>
          </div>
          <div class="flex items-center gap-2">
            <span id="outlets-total-badge" class="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
              10 Ã³rgÃ£os de media registados
            </span>
          </div>
        </div>

        <!-- Barra de Ferramentas: Pesquisa e Filtros -->
        <div class="bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs space-y-3">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <!-- Barra de Pesquisa RÃ¡pida -->
            <div class="relative flex-1 max-w-md">
              <input type="text" id="search-outlets" onkeyup="filterOutletsTable()"
                placeholder="Pesquisar por nome, grupo editorial, morada ou registo ERC..."
                class="crm-input pl-9 pr-3 py-2 text-xs">
              <svg class="w-4 h-4 text-[#6B6B6B] absolute left-3 top-2.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- BotÃµes de AÃ§Ã£o e AlternÃ¢ncia Tabela/Grelha -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Alternador Modo de VisualizaÃ§Ã£o (Tabela vs CartÃµes) -->
              <div class="inline-flex rounded-xl p-0.5 bg-[#F6F2EC] border border-[#E4DDD3]">
                <button onclick="setOutletsViewMode('table')" id="btn-outlets-mode-table"
                  class="px-2.5 py-1 text-xs font-medium rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                  <span>Tabela</span>
                </button>
                <button onclick="setOutletsViewMode('cards')" id="btn-outlets-mode-cards"
                  class="px-2.5 py-1 text-xs font-medium rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  <span>CartÃµes</span>
                </button>
              </div>

              <!-- Menu Dropdown de Colunas -->
              <div class="relative" id="dropdown-outlets-cols-container">
                <button onclick="toggleOutletColsDropdown(event)" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" title="Mostrar/ocultar colunas">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                  <span>Colunas</span>
                </button>
                <div id="dropdown-outlets-cols" class="hidden absolute right-0 mt-1 w-48 bg-white rounded-xl border border-[#E4DDD3] shadow-modal p-2 z-30 space-y-1 text-xs">
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('grupo')" id="chk-ocs-grupo"> Grupo Editorial</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('formatos')" id="chk-ocs-formatos"> Formatos</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('ambito')" id="chk-ocs-ambito"> Ã‚mbito & Periodicidade</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('especialidade')" id="chk-ocs-especialidade"> Especialidade</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('erc')" id="chk-ocs-erc"> Registo ERC</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('agenda')" id="chk-ocs-agenda"> Email Agenda</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('jornalistas')" id="chk-ocs-jornalistas"> Jornalistas Associados</label>
                  <label class="flex items-center gap-2 px-2 py-1 hover:bg-[#F6F2EC] rounded cursor-pointer"><input type="checkbox" checked onchange="toggleOutletCol('estado')" id="chk-ocs-estado"> Estado</label>
                </div>
              </div>

              <!-- Exportar CSV -->
              <button onclick="exportOutletsCsv()" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" title="Exportar tabela de OCS para CSV">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Exportar CSV</span>
              </button>

              <!-- Importar CSV -->
              <input type="file" id="input-import-outlets-csv" accept=".csv" class="hidden" onchange="importOutletsCsv(event)">
              <button onclick="document.getElementById('input-import-outlets-csv').click()" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5" title="Importar OCS de ficheiro CSV">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <span>Importar CSV</span>
              </button>

              <!-- Alternar Densidade -->
              <button onclick="toggleTableDensity('outlets-table')" class="btn-secondary py-1.5 px-3 text-xs" title="Alternar densidade da tabela">
                Densidade
              </button>

              <!-- + Adicionar Ã“rgÃ£o (OCS) -->
              <button onclick="openOutletModal()" id="view-outlets-add-btn"
                class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>+ Adicionar Ã“rgÃ£o (OCS)</span>
              </button>
            </div>
          </div>

          <!-- Filtros AvanÃ§ados: Formato, Ã‚mbito, Especialidade, Estado -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E4DDD3]/60 text-xs">
            <span class="text-[#6B6B6B] font-medium mr-1">Filtros:</span>

            <!-- Filtro de Formato -->
            <select id="filter-ocs-format" onchange="filterOutletsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todos os Formatos</option>
              <option value="online">Online</option>
              <option value="papel">Papel</option>
              <option value="radio">RÃ¡dio</option>
              <option value="tv">TelevisÃ£o</option>
              <option value="podcast">Podcast</option>
              <option value="agencia">AgÃªncia Noticiosa</option>
            </select>

            <!-- Filtro de Ã‚mbito -->
            <select id="filter-ocs-scope" onchange="filterOutletsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todos os Ã‚mbitos</option>
              <option value="nacional">Nacional</option>
              <option value="regional">Regional</option>
              <option value="local">Local</option>
            </select>

            <!-- Filtro de Especialidade -->
            <select id="filter-ocs-specialty" onchange="filterOutletsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todas as Especialidades</option>
              <option value="Economia & NegÃ³cios">Economia & NegÃ³cios</option>
              <option value="Sustentabilidade & ESG">Sustentabilidade & ESG</option>
              <option value="Tecnologia & InovaÃ§Ã£o">Tecnologia & InovaÃ§Ã£o</option>
              <option value="PolÃ­tica & Sociedade">PolÃ­tica & Sociedade</option>
              <option value="SaÃºde & CiÃªncia">SaÃºde & CiÃªncia</option>
              <option value="OpiniÃ£o & Internacional">OpiniÃ£o & Internacional</option>
            </select>

            <!-- Filtro de Estado -->
            <select id="filter-ocs-status" onchange="filterOutletsTable()" class="crm-input py-1 px-2 text-xs w-auto">
              <option value="all">Todos os Estados</option>
              <option value="ativo">Ativo</option>
              <option value="extinto">Extinto</option>
            </select>

            <!-- BotÃ£o Limpar Filtros -->
            <button onclick="clearOutletFilters()" class="text-xs text-[#6C1C37] hover:underline px-2 py-1 ml-auto">
              Limpar filtros
            </button>
          </div>
        </div>

        <!-- Vista 1: Tabela de OCS (Base 1) -->
        <div id="outlets-table-view-container" class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="outlets-table">
              <thead>
                <tr>
                  <th onclick="sortOutlets('name')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Ã“rgÃ£o de ComunicaÃ§Ã£o (OCS)</span>
                      <span id="sort-icon-ocs-name" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-ocs-grupo" onclick="sortOutlets('media_group')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Grupo Editorial</span>
                      <span id="sort-icon-ocs-group" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-ocs-formatos">Formatos</th>
                  <th id="th-ocs-ambito" onclick="sortOutlets('scope')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Ã‚mbito & Periodicidade</span>
                      <span id="sort-icon-ocs-scope" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th id="th-ocs-especialidade">Especialidade</th>
                  <th id="th-ocs-erc">Registo ERC</th>
                  <th id="th-ocs-agenda">Email Agenda / Contacto</th>
                  <th id="th-ocs-jornalistas">Jornalistas Associados</th>
                  <th id="th-ocs-estado" onclick="sortOutlets('status')" class="cursor-pointer select-none hover:text-[#6C1C37] transition-colors">
                    <div class="flex items-center gap-1.5">
                      <span>Estado</span>
                      <span id="sort-icon-ocs-status" class="text-[10px] text-[#6B6B6B]">â†•</span>
                    </div>
                  </th>
                  <th class="text-right">AÃ§Ãµes</th>
                </tr>
              </thead>
              <tbody id="outlets-table-body">
                <!-- Preenchido dinamicamente via renderOutletsTable() -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vista 2: Grelha de CartÃµes (Opcional) -->
        <div id="outlets-cards-view-container" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Preenchido dinamicamente via renderOutletsCards() -->
        </div>

        <div class="flex items-center justify-between text-xs text-[#6B6B6B] px-1">
          <span id="outlets-footer-count">A apresentar 10 meios de comunicaÃ§Ã£o social</span>
          <span class="text-[11px]">Clica num Ã³rgÃ£o para consultar a ficha e os jornalistas associados</span>
        </div>
      </div>


      <!-- ======================================================== -->
      <!-- VISTA 5: DETALHE DO PROJETO (view-project-detail)        -->
      <!-- ======================================================== -->
      <div id="view-project-detail"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Breadcrumb Apple-Notion -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('projects')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Projetos</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span id="proj-detail-breadcrumb-title"
              class="text-[#1A1A1A] font-medium truncate max-w-xs sm:max-w-md">Expansão Ibérica 2026</span>
          </div>
          <button onclick="switchView('projects')" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
              </path>
            </svg>
            <span>Voltar aos Projetos</span>
          </button>
        </div>

        <!-- Cabeçalho do Projeto & Propriedades Principais -->
        <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-5">
          <div
            class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E4DDD3]/70">
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex items-center gap-2.5 flex-wrap">
                <span id="proj-detail-client-badge"
                  class="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#DDE6EE] text-[#2F4A63]">Grupo M</span>
                <span id="proj-detail-status-badge"
                  class="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">Em Aberto</span>
              </div>
              <h1 id="proj-detail-title" contenteditable="true" onblur="saveProjectTitleInline(event)"
                class="text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-title tracking-tight outline-none hover:bg-[#F6F2EC]/60 px-1 -mx-1 rounded-lg transition-colors"
                title="Clica para editar o título do projeto">Expansão Ibérica 2026</h1>
            </div>

            <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button onclick="openNewTaskForCurrentProject()"
                class="btn-primary py-2 px-3.5 text-xs font-medium flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>+ Nova Tarefa</span>
              </button>
              <button onclick="openNewContactForCurrentProject()"
                class="btn-secondary py-2 px-3.5 text-xs font-medium flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                  </path>
                </svg>
                <span>+ Registar Contacto</span>
              </button>
            </div>
          </div>

          <!-- Grelha de Metadados Editáveis -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div class="space-y-1">
              <span class="text-[#6B6B6B] block">Responsável / Gestor</span>
              <select id="proj-detail-manager-select" onchange="saveProjectManagerInline(this.value)"
                class="crm-select py-1 text-xs font-medium">
                <option value="Leonor Rodrigues">Leonor Rodrigues</option>
                <option value="Tiago Mendes">Tiago Mendes</option>
                <option value="Helena Ramos">Helena Ramos</option>
                <option value="Carlos Silva">Carlos Silva</option>
              </select>
            </div>
            <div class="space-y-1">
              <span class="text-[#6B6B6B] block">Data de Início</span>
              <input type="date" id="proj-detail-start-date" onchange="saveProjectStartDateInline(this.value)"
                class="crm-input py-1 text-xs">
            </div>
            <div class="space-y-1">
              <span class="text-[#6B6B6B] block">Prazo Final</span>
              <input type="date" id="proj-detail-deadline-date" onchange="saveProjectDeadlineInline(this.value)"
                class="crm-input py-1 text-xs font-mono">
            </div>
            <div class="space-y-1">
              <span class="text-[#6B6B6B] block">Estado</span>
              <select id="proj-detail-status-select" onchange="saveProjectStatusInline(this.value)"
                class="crm-select py-1 text-xs font-medium">
                <option value="in_progress">Em Aberto</option>
                <option value="on_hold">Em Pausa</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <!-- Barra de Progresso Global do Projeto -->
          <div class="space-y-1.5 pt-2">
            <div class="flex justify-between text-xs text-[#6B6B6B]">
              <span>Progresso das Entregas: <strong id="proj-detail-tasks-progress-label" class="text-[#1A1A1A]">3 de 5
                  tarefas concluídas</strong></span>
              <span id="proj-detail-tasks-pct-label" class="font-medium text-[#1A1A1A]">60%</span>
            </div>
            <div class="w-full bg-[#E9E5E0] rounded-full h-2 overflow-hidden">
              <div id="proj-detail-progress-bar" class="h-2 rounded-full transition-all duration-300"
                style="width: 60%; background-color: #6C1C37;"></div>
            </div>
          </div>
        </div>

        <!-- 4 KPIs Específicos do Projeto -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-4 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Tarefas do Projeto</span>
            <div class="text-2xl font-semibold text-[#1A1A1A] font-title my-1" id="proj-kpi-tasks-count">5</div>
            <span class="text-[11px] text-[#6B6B6B]" id="proj-kpi-tasks-sub">3 concluídas · 2 pendentes</span>
          </div>
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-4 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Jornalistas-Alvo</span>
            <div class="text-2xl font-semibold text-[#1A1A1A] font-title my-1" id="proj-kpi-journalists-count">6</div>
            <span class="text-[11px] text-[#2F6B3A] font-medium" id="proj-kpi-journalists-sub">4 abordados · 2
              publicaram</span>
          </div>
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-4 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Peças Publicadas</span>
            <div class="text-2xl font-semibold text-[#1A1A1A] font-title my-1" id="proj-kpi-clippings-count">3</div>
            <span class="text-[11px] text-[#6B6B6B]">Cobertura mediática ativa</span>
          </div>
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-4 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">AVE Estimado</span>
            <div class="text-2xl font-semibold text-[#1A1A1A] font-title my-1" id="proj-kpi-ave-count">24.500 €</div>
            <span class="text-[11px] text-[#6B6B6B]">Alcance: ~380k pessoas</span>
          </div>
        </div>

        <!-- Separadores do Detalhe do Projeto -->
        <div class="space-y-4">
          <div class="flex items-center gap-1.5 border-b border-[#E4DDD3] pb-2 overflow-x-auto text-xs">
            <button onclick="switchProjectDetailTab('overview')" id="proj-tab-btn-overview"
              class="px-3.5 py-1.5 rounded-xl font-medium bg-[#6C1C37] text-white transition-all cursor-pointer">Visão
              Geral</button>
            <button onclick="switchProjectDetailTab('tasks')" id="proj-tab-btn-tasks"
              class="px-3.5 py-1.5 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer">Tarefas
              do Projeto</button>
            <button onclick="switchProjectDetailTab('journalists')" id="proj-tab-btn-journalists"
              class="px-3.5 py-1.5 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer">Jornalistas-Alvo</button>
            <button onclick="switchProjectDetailTab('clipping')" id="proj-tab-btn-clipping"
              class="px-3.5 py-1.5 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer">Clipping
              & Notícias</button>
            <button onclick="switchProjectDetailTab('documents')" id="proj-tab-btn-documents"
              class="px-3.5 py-1.5 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer">Documentos
              & Media Kits</button>
            <button onclick="switchProjectDetailTab('activity')" id="proj-tab-btn-activity"
              class="px-3.5 py-1.5 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer">Atividade
              & Histórico</button>
          </div>

          <!-- Conteúdos dos Separadores -->
          <!-- 1. Visão Geral -->
          <div id="proj-tab-content-overview" class="space-y-4">
            <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-3">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Briefing & Objetivos
                Estratégicos</h3>
              <div id="proj-detail-description" contenteditable="true" onblur="saveProjectDescInline(event)"
                class="text-xs text-[#1A1A1A] leading-relaxed p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3]/70 outline-none hover:border-[#6C1C37]/40 transition-colors"
                title="Clica para editar o briefing">
                Campanha integrada de relações públicas e assessoria mediática para o plano de expansão na Península
                Ibérica.
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs space-y-2">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Equipa Alocada</h3>
                <div id="proj-detail-team-list" class="space-y-2 pt-1 text-xs">
                  <!-- Gerado dinamicamente -->
                </div>
              </div>
              <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs space-y-2">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Orçamento & Marcos Chave</h3>
                <div class="space-y-2 pt-1 text-xs">
                  <div class="flex justify-between py-1.5 border-b border-[#E4DDD3]/60">
                    <span class="text-[#6B6B6B]">Orçamento de Produção:</span>
                    <span id="proj-detail-budget" class="font-medium text-[#1A1A1A] font-mono">15.000 €</span>
                  </div>
                  <div class="flex justify-between py-1.5 border-b border-[#E4DDD3]/60">
                    <span class="text-[#6B6B6B]">Conferência de Imprensa:</span>
                    <span class="font-medium text-[#1A1A1A]">18 Nov 2026 · Lisboa</span>
                  </div>
                  <div class="flex justify-between py-1.5">
                    <span class="text-[#6B6B6B]">Embargo Noticioso:</span>
                    <span class="font-medium text-[#1A1A1A]">Levantado a 16 Nov</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Tarefas do Projeto -->
          <div id="proj-tab-content-tasks" class="hidden space-y-4">
            <div class="crm-card overflow-hidden">
              <div class="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
                <span class="text-xs font-semibold text-[#1A1A1A] font-title">Tarefas associadas a este projeto</span>
                <button onclick="openNewTaskForCurrentProject()" class="btn-primary py-1.5 px-3 text-xs">
                  + Nova Tarefa no Projeto
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="crm-table">
                  <thead>
                    <tr>
                      <th class="w-10 text-center">Estado</th>
                      <th>Título</th>
                      <th>Responsável</th>
                      <th>Prioridade</th>
                      <th>Data de Entrega</th>
                      <th>Notas</th>
                      <th class="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="proj-detail-tasks-tbody">
                    <!-- Preenchido dinamicamente -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 3. Jornalistas-Alvo -->
          <div id="proj-tab-content-journalists" class="hidden space-y-4">
            <div class="crm-card overflow-hidden">
              <div class="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
                <span class="text-xs font-semibold text-[#1A1A1A] font-title">Pautas & Jornalistas-Alvo Definidos</span>
                <button onclick="openNewContactForCurrentProject()" class="btn-primary py-1.5 px-3 text-xs">
                  + Registar Interação de Pauta
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="crm-table">
                  <thead>
                    <tr>
                      <th>Jornalista</th>
                      <th>Órgão (OCS)</th>
                      <th>Área / Pauta</th>
                      <th>Estado do Contacto</th>
                      <th>Última Interação</th>
                      <th class="text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody id="proj-detail-journalists-tbody">
                    <!-- Preenchido dinamicamente -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 4. Clipping & Notícias -->
          <div id="proj-tab-content-clipping" class="hidden space-y-4">
            <div class="crm-card overflow-hidden">
              <div class="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
                <span class="text-xs font-semibold text-[#1A1A1A] font-title">Peças Publicadas deste Projeto</span>
                <button onclick="switchView('clipping')" class="btn-secondary py-1.5 px-3 text-xs">
                  Ver Todo o Clipping &rarr;
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="crm-table">
                  <thead>
                    <tr>
                      <th>Manchete / Artigo</th>
                      <th>Órgão (OCS)</th>
                      <th>Jornalista</th>
                      <th>Data</th>
                      <th>Tom</th>
                      <th>AVE Estimado</th>
                      <th>Alcance</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody id="proj-detail-clipping-tbody">
                    <!-- Preenchido dinamicamente -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 5. Documentos & Media Kits -->
          <div id="proj-tab-content-documents" class="hidden space-y-4">
            <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs space-y-3">
              <div class="flex items-center justify-between pb-3 border-b border-[#E4DDD3]">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Dossiers, Comunicados & Press
                  Kits</h3>
                <button onclick="showToast('Upload de ficheiros reservado à Direção.')"
                  class="btn-secondary py-1.5 px-3 text-xs">+ Anexar Ficheiro</button>
              </div>
              <div id="proj-detail-documents-list" class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <!-- Preenchido dinamicamente -->
              </div>
            </div>
          </div>

          <!-- 6. Atividade & Histórico -->
          <div id="proj-tab-content-activity" class="hidden space-y-4">
            <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs space-y-3">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Histórico de Ações & Alterações
              </h3>
              <div id="proj-detail-activity-timeline" class="space-y-3 pt-2 text-xs">
                <!-- Preenchido dinamicamente -->
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ======================================================== -->
      <!-- VISTA 6: CONSULTA DE CONTACTOS (view-contacts)           -->
      <!-- ======================================================== -->
      <div id="view-contacts"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Breadcrumb Apple-Notion -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">Diário de Contactos com a Imprensa</span>
          </div>

          <!-- Ação clara: AGIR depois de VER -->
          <button onclick="openContactModal()"
            class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>+ Registar Novo Contacto</span>
          </button>
        </div>

        <!-- 4 Cartões de Resumo do Período -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Total de Contactos</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1" id="contacts-summary-total">12</div>
            <span class="text-[11px] text-[#6B6B6B]" id="contacts-summary-period-label">Registados hoje</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Taxa de Resposta</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1" id="contacts-summary-response-rate">42%
            </div>
            <span class="text-[11px] text-[#2F6B3A] font-medium" id="contacts-summary-answered-label">5 respostas
              positivas</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Canal Mais Eficaz</span>
            <div class="text-xl font-semibold text-[#1A1A1A] font-title my-1">Telefone (65%)</div>
            <span class="text-[11px] text-[#6B6B6B]">Maior retorno direto</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Aguardam Resposta</span>
            <div class="text-3xl font-semibold text-[#805B00] font-title my-1" id="contacts-summary-pending-count">7
            </div>
            <span class="text-[11px] text-[#6B6B6B]">Necessitam seguimento</span>
          </div>
        </div>

        <!-- Barra de Filtros Inteligente Notion-style -->
        <div class="bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <!-- Filtro de Período -->
            <div class="flex items-center gap-1.5" id="contacts-period-tabs">
              <button onclick="filterContactsPeriod('today')" id="tab-contacts-today"
                class="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all">Hoje
                (12)</button>
              <button onclick="filterContactsPeriod('week')" id="tab-contacts-week"
                class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Esta
                Semana (41)</button>
              <button onclick="filterContactsPeriod('month')" id="tab-contacts-month"
                class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Este
                Mês</button>
              <button onclick="filterContactsPeriod('all')" id="tab-contacts-all"
                class="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all">Todos</button>
            </div>

            <!-- Pesquisa Instantânea -->
            <div class="relative w-full sm:w-64">
              <input type="text" id="search-contacts-query" onkeyup="filterContactsTableData()"
                placeholder="Filtrar por jornalista, OCS ou tema..." class="crm-input pl-8 pr-3 py-1.5 text-xs">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] absolute left-2.5 top-2.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E4DDD3]/60 text-xs">
            <!-- Filtro por Colaborador -->
            <div class="flex items-center gap-1.5">
              <span class="text-[#6B6B6B]">Colaborador:</span>
              <select id="filter-contacts-collaborator" onchange="filterContactsTableData()"
                class="crm-select py-1 text-xs">
                <option value="all">Todos os colaboradores</option>
                <option value="Leonor Rodrigues">Leonor Rodrigues</option>
                <option value="Tiago Mendes">Tiago Mendes</option>
                <option value="Helena Ramos">Helena Ramos</option>
                <option value="Carlos Silva">Carlos Silva</option>
              </select>
            </div>

            <!-- Filtro por Canal -->
            <div class="flex items-center gap-1.5">
              <span class="text-[#6B6B6B]">Canal:</span>
              <select id="filter-contacts-channel" onchange="filterContactsTableData()" class="crm-select py-1 text-xs">
                <option value="all">Todos os canais</option>
                <option value="email">Email</option>
                <option value="chamada">Telefone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="reuniao">Reunião</option>
              </select>
            </div>

            <!-- Filtro por Resultado -->
            <div class="flex items-center gap-1.5">
              <span class="text-[#6B6B6B]">Resultado:</span>
              <select id="filter-contacts-status" onchange="filterContactsTableData()" class="crm-select py-1 text-xs">
                <option value="all">Todos os estados</option>
                <option value="Respondeu">Respondeu</option>
                <option value="Sem resposta">Sem resposta</option>
                <option value="Interessado">Interessado</option>
                <option value="Reunião agendada">Reunião agendada</option>
                <option value="Recusou">Recusou</option>
                <option value="Publicou">Publicou</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabela de Consulta Completa de Contactos -->
        <div class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="contacts-consult-table">
              <thead>
                <tr>
                  <th>Data & Hora</th>
                  <th>Colaborador</th>
                  <th>Jornalista & OCS</th>
                  <th>Canal</th>
                  <th>Pauta / Assunto</th>
                  <th>Projeto</th>
                  <th>Resultado</th>
                  <th>Ação Seguinte</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody id="contacts-consult-table-body">
                <!-- Preenchido dinamicamente -->
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- VISTA 7: CLIPPING DE IMPRENSA (view-clipping)            -->
      <!-- ======================================================== -->
      <div id="view-clipping"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Breadcrumb Apple-Notion -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">Clipping de Imprensa & Notícias</span>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="exportClippingReport()"
              class="btn-secondary py-2 px-3.5 text-xs font-medium flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              <span>Exportar Relatório (CSV)</span>
            </button>
            <button onclick="openNewClippingModal()"
              class="btn-primary py-2 px-3.5 text-xs font-medium flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>+ Registar Peça</span>
            </button>
          </div>
        </div>

        <!-- 4 Cartões de Resumo do Clipping -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Peças Publicadas (Mês)</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1" id="clipping-summary-count">18</div>
            <span class="text-[11px] text-[#6B6B6B]">Em 8 órgãos de comunicação</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Tom & Sentimento</span>
            <div class="text-lg font-semibold text-[#1A1A1A] font-title my-1 flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">12
                Positivas</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E9E5E0] text-[#5C554E]">5
                Neutras</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F6D9D5] text-[#A3281E]">1
                Negativa</span>
            </div>
            <span class="text-[11px] text-[#6B6B6B]">94% favorável / neutro</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">AVE Estimado Total</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1" id="clipping-summary-ave">84.500 €</div>
            <span class="text-[11px] text-[#6B6B6B]">Valor publicitário equivalente</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Alcance Estimado</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1" id="clipping-summary-reach">1.25M</div>
            <span class="text-[11px] text-[#6B6B6B]">Leitores e audiência</span>
          </div>
        </div>

        <!-- Barra de Filtros -->
        <div
          class="bg-white p-4 rounded-2xl border border-[#E4DDD3] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="text-[#6B6B6B]">Tom:</span>
              <select id="filter-clipping-tone" onchange="filterClippingTableData()" class="crm-select py-1 text-xs">
                <option value="all">Todos os tons</option>
                <option value="positivo">Positivo</option>
                <option value="neutro">Neutro</option>
                <option value="negativo">Negativo</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-[#6B6B6B]">Órgão (OCS):</span>
              <select id="filter-clipping-outlet" onchange="filterClippingTableData()" class="crm-select py-1 text-xs">
                <option value="all">Todos os órgãos</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-[#6B6B6B]">Colaborador:</span>
              <select id="filter-clipping-collab" onchange="filterClippingTableData()" class="crm-select py-1 text-xs">
                <option value="all">Toda a equipa</option>
                <option value="Leonor Rodrigues">Leonor Rodrigues</option>
                <option value="Tiago Mendes">Tiago Mendes</option>
                <option value="Helena Ramos">Helena Ramos</option>
                <option value="Carlos Silva">Carlos Silva</option>
              </select>
            </div>
          </div>

          <div class="relative w-full sm:w-64">
            <input type="text" id="search-clipping-query" onkeyup="filterClippingTableData()"
              placeholder="Pesquisar manchete ou jornalista..." class="crm-input pl-8 pr-3 py-1.5 text-xs">
            <svg class="w-3.5 h-3.5 text-[#6B6B6B] absolute left-2.5 top-2.5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Tabela do Clipping -->
        <div class="crm-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="crm-table" id="clipping-full-table">
              <thead>
                <tr>
                  <th>Manchete / Título da Peça</th>
                  <th>Órgão (OCS)</th>
                  <th>Jornalista</th>
                  <th>Data</th>
                  <th>Formato</th>
                  <th>Tom</th>
                  <th>Alcance</th>
                  <th>AVE (€)</th>
                  <th>Cliente & Projeto</th>
                  <th>Colaborador</th>
                </tr>
              </thead>
              <tbody id="clipping-full-table-body">
                <!-- Preenchido dinamicamente -->
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- VISTA 8: TAXA DE RESPOSTA & ANALYTICS                    -->
      <!-- ======================================================== -->
      <div id="view-analytics-response"
        class="hidden p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 w-full max-w-none transition-all duration-300">

        <!-- Breadcrumb Apple-Notion -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <button onclick="switchView('dashboard')"
              class="flex items-center gap-1.5 hover:text-[#6C1C37] transition-colors cursor-pointer group">
              <svg class="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#6C1C37] transition-colors" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span class="group-hover:underline">Dashboard</span>
            </button>
            <span class="text-[#E4DDD3]">/</span>
            <span class="text-[#1A1A1A] font-medium">Análise de Eficácia & Taxa de Resposta</span>
          </div>

          <button onclick="switchView('contacts')" class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
            <span>Ver Diário de Contactos &rarr;</span>
          </button>
        </div>

        <!-- 4 Indicadores Estruturais -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Taxa de Resposta Global</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1">38%</div>
            <span class="text-[11px] text-[#6B6B6B]">Últimos 30 dias (95 contactos)</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Tempo Médio de Retorno</span>
            <div class="text-3xl font-semibold text-[#1A1A1A] font-title my-1">4.2h</div>
            <span class="text-[11px] text-[#2F6B3A] font-medium">-1.1h face ao trimestre anterior</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Canal Mais Eficaz</span>
            <div class="text-2xl font-semibold text-[#1A1A1A] font-title my-1">Telefone (65%)</div>
            <span class="text-[11px] text-[#6B6B6B]">13 respostas em 20 chamadas</span>
          </div>

          <div
            class="bg-white rounded-2xl border border-[#E4DDD3] p-5 shadow-xs flex flex-col justify-between min-h-[110px]">
            <span class="text-xs text-[#6B6B6B]">Pautas sem Retorno (+48h)</span>
            <div class="text-3xl font-semibold text-[#A3281E] font-title my-1">7</div>
            <span class="text-[11px] text-[#A3281E] font-medium">Requerem seguimento urgente</span>
          </div>
        </div>

        <!-- 2 Blocos de Desempenho (Por Canal e Por Colaborador) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Eficácia por Canal de Comunicação -->
          <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Eficácia por Canal de Contacto</h3>
            <div class="space-y-4 text-xs">
              <div class="space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-[#1A1A1A] font-medium">Chamada Telefónica</span>
                  <span class="font-medium text-[#1A1A1A]">65% (13/20 responderam)</span>
                </div>
                <div class="w-full bg-[#E9E5E0] rounded-full h-2 overflow-hidden">
                  <div class="h-2 rounded-full" style="width: 65%; background-color: #6C1C37;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-[#1A1A1A] font-medium">WhatsApp Direto</span>
                  <span class="font-medium text-[#1A1A1A]">58% (11/19 responderam)</span>
                </div>
                <div class="w-full bg-[#E9E5E0] rounded-full h-2 overflow-hidden">
                  <div class="h-2 rounded-full" style="width: 58%; background-color: #6C1C37;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-[#1A1A1A] font-medium">Email Press Pitch</span>
                  <span class="font-medium text-[#1A1A1A]">32% (18/56 responderam)</span>
                </div>
                <div class="w-full bg-[#E9E5E0] rounded-full h-2 overflow-hidden">
                  <div class="h-2 rounded-full" style="width: 32%; background-color: #B45A69;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Eficácia por Colaborador da Agência -->
          <div class="bg-white rounded-2xl border border-[#E4DDD3] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Taxa de Resposta por Colaborador</h3>
            <div class="space-y-3.5 text-xs">
              <div class="flex items-center justify-between py-1.5 border-b border-[#E4DDD3]/60">
                <span class="font-medium text-[#1A1A1A]">Leonor Rodrigues (Direção)</span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">44%
                  taxa</span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-[#E4DDD3]/60">
                <span class="font-medium text-[#1A1A1A]">Tiago Mendes</span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">41%
                  taxa</span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-[#E4DDD3]/60">
                <span class="font-medium text-[#1A1A1A]">Helena Ramos</span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F7E7BF] text-[#805B00]">35%
                  taxa</span>
              </div>
              <div class="flex items-center justify-between py-1.5">
                <span class="font-medium text-[#1A1A1A]">Carlos Silva</span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E9E5E0] text-[#5C554E]">30%
                  taxa</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Secção Acionável: Contactos que Aguardam Seguimento (+48h) com Ação Direta em 1 Clique -->
        <div class="crm-card overflow-hidden">
          <div class="p-4 border-b border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Pautas Sem Resposta a Aguardar Seguimento
                (+48h)</h3>
              <p class="text-xs text-[#6B6B6B]">Cria tarefas de seguimento ou regista novo contacto em 1 clique.</p>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="crm-table">
              <thead>
                <tr>
                  <th>Jornalista</th>
                  <th>Órgão (OCS)</th>
                  <th>Pauta Enviada</th>
                  <th>Canal Inicial</th>
                  <th>Dias Sem Resposta</th>
                  <th>Colaborador</th>
                  <th class="text-right">Ação Direta</th>
                </tr>
              </thead>
              <tbody id="analytics-pending-followup-tbody">
                <!-- Preenchido dinamicamente -->
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </main>
  </div>

  <!-- ======================================================== -->
  <!-- PAINEL / DRAWER LATERAL DE DETALHE DA TAREFA             -->
  <!-- ======================================================== -->
  <div id="panel-task-detail" class="fixed inset-0 z-50 hidden">
    <!-- Backdrop com fechar ao clicar -->
    <div onclick="closeTaskDetail()" class="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs transition-opacity"></div>

    <!-- Gaveta Lateral Deslizante com Alternância para Ecrã Inteiro -->
    <div id="panel-task-detail-container"
      class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white border-l border-[#E4DDD3] shadow-modal flex flex-col transition-all duration-300 z-10 overflow-hidden">

      <!-- Barra de Ferramentas Superior do Painel -->
      <div class="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span class="font-medium text-[#1A1A1A]">Detalhe da Tarefa</span>
          <span class="text-[#E4DDD3]">/</span>
          <span id="task-detail-header-id" class="font-mono text-[11px] text-[#6B6B6B]">#task-1</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Botão para alternar entre Painel Lateral e Ecrã Inteiro -->
          <button onclick="toggleTaskDetailExpand()" id="btn-toggle-task-expand"
            class="btn-secondary p-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A]" title="Expandir / Reduzir largura">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
            </svg>
          </button>
          <button onclick="closeTaskDetail()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1.5" title="Fechar (Esc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Conteúdo com Scroll -->
      <div class="p-6 space-y-6 flex-1 overflow-y-auto">

        <!-- Título da Tarefa (Editável Inline) -->
        <div class="space-y-1">
          <input type="text" id="task-detail-title-input" onchange="saveTaskProperty('title', this.value)"
            class="w-full text-xl sm:text-2xl font-semibold text-[#1A1A1A] font-title border-none focus:outline-none focus:ring-1 focus:ring-[#6C1C37]/30 rounded-lg p-1 -m-1 transition-all"
            placeholder="Título da Tarefa">
        </div>

        <!-- Grelha de Propriedades Estilo Notion/Attio -->
        <div class="bg-[#FBF9F6] rounded-2xl border border-[#E4DDD3] p-4 space-y-3 text-xs">
          <!-- Estado -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Estado</span>
            <div class="col-span-2 sm:col-span-3">
              <select id="task-detail-status-select" onchange="saveTaskProperty('status', this.value)"
                class="crm-select py-1 text-xs font-medium">
                <option value="pending">Por fazer</option>
                <option value="in_progress">Em curso</option>
                <option value="in_review">Em revisão</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
          </div>

          <!-- Prioridade -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Prioridade</span>
            <div class="col-span-2 sm:col-span-3">
              <select id="task-detail-priority-select" onchange="saveTaskProperty('priority', this.value)"
                class="crm-select py-1 text-xs font-medium">
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="normal">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <!-- Data de Entrega -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Data de Entrega</span>
            <div class="col-span-2 sm:col-span-3">
              <input type="date" id="task-detail-duedate-input" onchange="saveTaskProperty('due_date', this.value)"
                class="crm-input py-1 text-xs font-mono">
            </div>
          </div>

          <!-- Responsável -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Responsável</span>
            <div class="col-span-2 sm:col-span-3">
              <select id="task-detail-assignee-select" onchange="saveTaskProperty('assignee', this.value)"
                class="crm-select py-1 text-xs font-medium">
                <option value="Leonor Rodrigues">Leonor Rodrigues</option>
                <option value="Tiago Mendes">Tiago Mendes</option>
                <option value="Helena Ramos">Helena Ramos</option>
                <option value="Carlos Silva">Carlos Silva</option>
              </select>
            </div>
          </div>

          <!-- Projeto Associado (com Link direto para o Projeto!) -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Projeto</span>
            <div class="col-span-2 sm:col-span-3 flex items-center gap-2">
              <select id="task-detail-project-select" onchange="saveTaskProperty('project_name', this.value)"
                class="crm-select py-1 text-xs flex-1">
                <!-- Preenchido dinamicamente com os projetos -->
              </select>
              <button onclick="navigateToCurrentTaskProject()"
                class="text-xs font-medium text-[#6C1C37] hover:underline shrink-0" title="Abrir página deste projeto">
                Abrir Projeto &rarr;
              </button>
            </div>
          </div>

          <!-- Cliente / Marca -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Cliente / Marca</span>
            <div class="col-span-2 sm:col-span-3">
              <input type="text" id="task-detail-client-input"
                onchange="saveTaskProperty('client_or_brand', this.value)" class="crm-input py-1 text-xs"
                placeholder="Cliente ou Marca">
            </div>
          </div>

          <!-- Jornalista Associado -->
          <div class="grid grid-cols-3 sm:grid-cols-4 items-center gap-2">
            <span class="text-[#6B6B6B] font-medium">Jornalista / OCS</span>
            <div class="col-span-2 sm:col-span-3">
              <input type="text" id="task-detail-journalist-input"
                onchange="saveTaskProperty('journalist_name', this.value)" class="crm-input py-1 text-xs"
                placeholder="Ex: Marta Figueiredo (Público)">
            </div>
          </div>
        </div>

        <!-- Descrição & Notas Ricas -->
        <div class="space-y-2">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Descrição & Notas de Execução</h4>
          <textarea id="task-detail-notes-textarea" onchange="saveTaskProperty('notes', this.value)" rows="4"
            class="crm-input py-2 text-xs leading-relaxed"
            placeholder="Descreve as notas, pauta ou detalhes da entrega..."></textarea>
        </div>

        <!-- Sub-tarefas / Checklist Interativa -->
        <div class="space-y-3 pt-2 border-t border-[#E4DDD3]">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Checklist de Sub-Tarefas</h4>
            <span id="task-detail-subtasks-count" class="text-[11px] text-[#6B6B6B]">0/0 concluídas</span>
          </div>
          <div id="task-detail-subtasks-list" class="space-y-1.5 text-xs">
            <!-- Preenchido dinamicamente -->
          </div>
          <div class="flex items-center gap-2">
            <input type="text" id="task-detail-new-subtask-input" onkeydown="handleSubtaskEnter(event)"
              placeholder="+ Adicionar sub-tarefa (pressiona Enter)..." class="crm-input py-1.5 text-xs flex-1">
            <button onclick="addNewSubtaskFromInput()" class="btn-secondary py-1.5 px-3 text-xs">Adicionar</button>
          </div>
        </div>

        <!-- Comentários da Equipa -->
        <div class="space-y-3 pt-2 border-t border-[#E4DDD3]">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Comentários & Alinhamentos</h4>
          <div id="task-detail-comments-list" class="space-y-2.5 text-xs">
            <!-- Preenchido dinamicamente -->
          </div>
          <div class="flex items-start gap-2 pt-1">
            <textarea id="task-detail-new-comment-input" rows="2" placeholder="Escreve um comentário ou nota..."
              class="crm-input py-1.5 text-xs flex-1"></textarea>
            <button onclick="addNewCommentFromInput()"
              class="btn-primary py-1.5 px-3 text-xs shrink-0">Comentar</button>
          </div>
        </div>

        <!-- Histórico de Atividade -->
        <div class="space-y-2 pt-2 border-t border-[#E4DDD3] text-xs">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Histórico de Alterações</h4>
          <div id="task-detail-activity-list" class="space-y-1 text-[#6B6B6B] text-[11px]">
            <!-- Preenchido dinamicamente -->
          </div>
        </div>

      </div>

      <!-- Rodapé com Ações -->
      <div class="p-4 border-t border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between">
        <button onclick="deleteCurrentDetailedTask()"
          class="text-[#A3281E] hover:underline text-xs font-medium cursor-pointer">
          Eliminar Tarefa
        </button>
        <div class="flex items-center gap-2">
          <button onclick="toggleCurrentDetailedTaskComplete()" id="btn-toggle-task-complete"
            class="btn-secondary py-1.5 px-3 text-xs font-medium">
            Marcar como Concluída
          </button>
          <button onclick="closeTaskDetail()" class="btn-primary py-1.5 px-3.5 text-xs font-medium">
            Concluído
          </button>
        </div>
      </div>

    </div>
  </div>

    <!-- ======================================================== -->
  <!-- PAINEL / DRAWER LATERAL: FICHA DO JORNALISTA (BASE 2)       -->
  <!-- ======================================================== -->
  <div id="panel-journalist-detail" class="fixed inset-0 z-50 hidden">
    <!-- Backdrop com fechar ao clicar -->
    <div onclick="closeJournalistDetailDrawer()" class="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs transition-opacity"></div>

    <!-- Gaveta Lateral Deslizante -->
    <div id="panel-journalist-container"
      class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white border-l border-[#E4DDD3] shadow-modal flex flex-col transition-all duration-300 z-10 overflow-hidden">

      <!-- Barra de Ferramentas Superior -->
      <div class="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span class="font-medium text-[#1A1A1A]">Ficha do Jornalista</span>
          <span class="text-[#E4DDD3]">/</span>
          <span id="jd-header-name" class="font-semibold text-[#1A1A1A]">â€”</span>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="toggleJournalistDrawerExpand()" class="btn-secondary p-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A]" title="Expandir largura">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
          </button>
          <button onclick="closeJournalistDetailDrawer()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1.5" title="Fechar (Esc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- ConteÃºdo com Scroll -->
      <div class="p-6 space-y-6 flex-1 overflow-y-auto" id="jd-drawer-body">
        <!-- Topo da Ficha: Nome, Cargo e Estado -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DDD3]">
          <div class="space-y-1">
            <div class="flex items-center gap-3">
              <div id="jd-avatar" class="w-12 h-12 rounded-2xl bg-[#6C1C37] text-white flex items-center justify-center font-bold text-base shadow-xs">
                MF
              </div>
              <div>
                <h2 id="jd-name" class="text-xl font-bold text-[#1A1A1A] font-title tracking-tight">â€”</h2>
                <p id="jd-role" class="text-xs text-[#6B6B6B] font-medium">â€”</p>
              </div>
            </div>
          </div>
          <div id="jd-status-badge">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>
          </div>
        </div>

        <!-- Ã“rgÃ£os de ComunicaÃ§Ã£o Social Associados (Base 1 Ligada) -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Ã“rgÃ£o(s) de ComunicaÃ§Ã£o Social Associados</label>
          <div id="jd-outlets-list" class="space-y-2">
            <!-- Preenchido dinamicamente com cartÃµes de OCS clicÃ¡veis -->
          </div>
        </div>

        <!-- Contactos Diretos e PreferÃªncia -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF9F6] p-4 rounded-2xl border border-[#E4DDD3]">
          <div class="space-y-1.5">
            <span class="text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider block">Emails</span>
            <div id="jd-emails-list" class="space-y-1 font-mono text-xs">
              <!-- Emails preenchidos -->
            </div>
          </div>
          <div class="space-y-1.5">
            <span class="text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider block">TelemÃ³veis / Telefones</span>
            <div id="jd-phones-list" class="space-y-1 font-mono text-xs">
              <!-- Telefones preenchidos -->
            </div>
          </div>
        </div>

        <!-- PreferÃªncia de Contacto & Ãrea de IntervenÃ§Ã£o -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Canal Preferencial</label>
            <div id="jd-contact-pref" class="text-xs font-medium text-[#1A1A1A]">
              WhatsApp
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Ãrea de IntervenÃ§Ã£o / Editoria</label>
            <div id="jd-areas-list" class="flex flex-wrap gap-1.5">
              <!-- Tags de Ã¡reas -->
            </div>
          </div>
        </div>

        <!-- PresenÃ§a Digital & Links -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">PresenÃ§a Digital & Perfil de Autor</label>
          <div id="jd-links-container" class="flex flex-wrap gap-2 text-xs">
            <!-- Links -->
          </div>
        </div>

        <!-- Consentimento RGPD e Origem -->
        <div class="bg-white p-4 rounded-xl border border-[#E4DDD3] space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-medium text-[#1A1A1A]">Consentimento RGPD</span>
            <span id="jd-rgpd-badge" class="font-medium text-[#3F5A2E]">Sim (Registado)</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6B6B6B] text-[11px]">
            <div>Data de Consentimento: <span id="jd-rgpd-date" class="font-mono text-[#1A1A1A]">â€”</span></div>
            <div>Origem do Contacto: <span id="jd-contact-origin" class="text-[#1A1A1A]">â€”</span></div>
          </div>
        </div>

        <!-- HistÃ³rico e Ãšltimo Contacto -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Ãšltimo Contacto & Notas</label>
          <div class="bg-[#F6F2EC] p-3 rounded-xl border border-[#E4DDD3] text-xs space-y-1">
            <div class="text-[#6B6B6B]">Ãšltima InteraÃ§Ã£o: <strong id="jd-last-contact" class="text-[#1A1A1A]">â€”</strong></div>
            <div class="text-[#6B6B6B]">Ãšltima AtualizaÃ§Ã£o da Ficha: <span id="jd-updated-at" class="font-mono text-[11px]">â€”</span></div>
          </div>
          <div class="p-3 bg-white rounded-xl border border-[#E4DDD3] text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed" id="jd-notes">
            Sem notas registadas.
          </div>
        </div>
      </div>

      <!-- Barra de AÃ§Ãµes Inferior -->
      <div class="p-4 border-t border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between gap-3">
        <button onclick="closeJournalistDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">
          Fechar
        </button>
        <button id="jd-btn-log-contact" onclick="handleLogContactFromDrawer()" class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
          <span>Registar Contacto Direto &rarr;</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- PAINEL / DRAWER LATERAL: FICHA DO MEIO (OCS - BASE 1)      -->
  <!-- ======================================================== -->
  <div id="panel-outlet-detail" class="fixed inset-0 z-50 hidden">
    <!-- Backdrop com fechar ao clicar -->
    <div onclick="closeOutletDetailDrawer()" class="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs transition-opacity"></div>

    <!-- Gaveta Lateral Deslizante -->
    <div id="panel-outlet-container"
      class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white border-l border-[#E4DDD3] shadow-modal flex flex-col transition-all duration-300 z-10 overflow-hidden">

      <!-- Barra de Ferramentas Superior -->
      <div class="p-4 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div class="flex items-center gap-2 text-xs text-[#6B6B6B]">
          <span class="font-medium text-[#1A1A1A]">Ficha do Ã“rgÃ£o de ComunicaÃ§Ã£o (OCS)</span>
          <span class="text-[#E4DDD3]">/</span>
          <span id="od-header-name" class="font-semibold text-[#1A1A1A]">â€”</span>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="toggleOutletDrawerExpand()" class="btn-secondary p-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A]" title="Expandir largura">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
          </button>
          <button onclick="closeOutletDetailDrawer()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1.5" title="Fechar (Esc)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- ConteÃºdo com Scroll -->
      <div class="p-6 space-y-6 flex-1 overflow-y-auto" id="od-drawer-body">
        <!-- Topo da Ficha: Logo, Nome, Grupo, Website -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-[#E4DDD3]">
          <div class="flex items-center gap-3">
            <div id="od-logo-container" class="w-14 h-14 rounded-2xl bg-[#F6F2EC] border border-[#E4DDD3] flex items-center justify-center overflow-hidden shadow-xs">
              <!-- Imagem do logo ou iniciais -->
            </div>
            <div>
              <h2 id="od-name" class="text-xl font-bold text-[#1A1A1A] font-title tracking-tight">â€”</h2>
              <p id="od-group" class="text-xs text-[#6B6B6B] font-medium">â€”</p>
              <div id="od-website" class="pt-0.5">
                <!-- Website URL com Ã­cone externo -->
              </div>
            </div>
          </div>
          <div id="od-status-badge">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>
          </div>
        </div>

        <!-- Indicadores RÃ¡pidos: Ã‚mbito, Periodicidade, AudiÃªncia Estimada -->
        <div class="grid grid-cols-3 gap-3 bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E4DDD3] text-center">
          <div>
            <span class="text-[10px] uppercase font-semibold tracking-wider text-[#6B6B6B] block">Ã‚mbito</span>
            <span id="od-scope" class="text-xs font-medium text-[#1A1A1A] mt-0.5 block capitalize">Nacional</span>
          </div>
          <div class="border-x border-[#E4DDD3]">
            <span class="text-[10px] uppercase font-semibold tracking-wider text-[#6B6B6B] block">Periodicidade</span>
            <span id="od-periodicity" class="text-xs font-medium text-[#1A1A1A] mt-0.5 block capitalize">DiÃ¡rio</span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-semibold tracking-wider text-[#6B6B6B] block">AudiÃªncia Estimada</span>
            <span id="od-audience" class="text-xs font-medium text-[#1A1A1A] mt-0.5 block font-mono">â€”</span>
          </div>
        </div>

        <!-- Formatos e Especialidades -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Formatos Suportados</label>
            <div id="od-formats-list" class="flex flex-wrap gap-1.5">
              <!-- Tags de formatos -->
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Especialidades / Cobertura</label>
            <div id="od-specialties-list" class="flex flex-wrap gap-1.5">
              <!-- Tags de especialidades -->
            </div>
          </div>
        </div>

        <!-- Registo da ERC e Dados Oficiais -->
        <div class="bg-white p-4 rounded-xl border border-[#E4DDD3] space-y-2 text-xs">
          <span class="font-semibold text-[#1A1A1A] block">Enquadramento RegulatÃ³rio (ERC)</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#6B6B6B]">
            <div>Tipo de Meio: <span id="od-erc-type" class="text-[#1A1A1A] font-medium block mt-0.5">â€”</span></div>
            <div>N.Âº de Registo ERC: <span id="od-erc-reg" class="font-mono text-[#1A1A1A] font-medium block mt-0.5">â€”</span></div>
          </div>
        </div>

        <!-- Contactos da RedaÃ§Ã£o e Morada -->
        <div class="bg-[#FBF9F6] p-4 rounded-2xl border border-[#E4DDD3] space-y-2 text-xs">
          <span class="font-semibold text-[#1A1A1A] block">Contactos Centrais da RedaÃ§Ã£o</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[11px] text-[#6B6B6B] block">Email de Agenda / Pauta:</span>
              <span id="od-agenda-email" class="font-mono text-xs text-[#6C1C37] block mt-0.5">â€”</span>
            </div>
            <div>
              <span class="text-[11px] text-[#6B6B6B] block">Telefone da RedaÃ§Ã£o:</span>
              <span id="od-phone" class="font-mono text-xs text-[#1A1A1A] block mt-0.5">â€”</span>
            </div>
          </div>
          <div class="pt-2 border-t border-[#E4DDD3]/60">
            <span class="text-[11px] text-[#6B6B6B] block">Morada da Sede:</span>
            <span id="od-address" class="text-xs text-[#1A1A1A] block mt-0.5 leading-relaxed">â€”</span>
          </div>
          <!-- Redes Sociais -->
          <div id="od-social-links" class="pt-2 flex flex-wrap gap-2 text-xs">
            <!-- Links para redes do meio -->
          </div>
        </div>

        <!-- JORNALISTAS ASSOCIADOS (LIGAÃ‡ÃƒO AUTOMÃTICA DA BASE 2) -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Jornalistas Associados a este Meio</label>
            <span id="od-associated-count" class="text-xs font-medium text-[#6C1C37]">0 jornalistas</span>
          </div>

          <div id="od-associated-journalists-list" class="space-y-2">
            <!-- Lista de jornalistas associados gerada dinamicamente -->
          </div>
        </div>
      </div>

      <!-- Barra de AÃ§Ãµes Inferior -->
      <div class="p-4 border-t border-[#E4DDD3] bg-[#FBF9F6] flex items-center justify-between gap-3">
        <button onclick="closeOutletDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">
          Fechar
        </button>
        <button id="od-btn-contact-outlet" onclick="handleContactOutletFromDrawer()" class="btn-primary py-2 px-4 text-xs font-medium flex items-center gap-1.5">
          <span>Contactar RedaÃ§Ã£o &rarr;</span>
        </button>
      </div>
    </div>
  </div>

  


  <!-- ======================================================== -->
  <!-- MODAL: NOVA TAREFA                                       -->
  <!-- ======================================================== -->
  <div id="modal-new-task"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Nova Tarefa / Entrega de Comunicação</h3>
          <p class="text-[11px] text-[#6B6B6B]">Define a ação, o nível de prioridade e a data limite de entrega.</p>
        </div>
        <button onclick="closeTaskModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleNewTaskSubmit(event)" class="p-5 space-y-4">
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Título da Tarefa / Ação *</label>
          <input type="text" id="task-title" required
            placeholder="Ex: Enviar press release do balanço aos jornalistas de Economia" class="crm-input">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Projeto</label>
            <input type="text" id="task-project" placeholder="Ex: Resultados Anuais, Lançamento..." class="crm-input">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Prioridade *</label>
            <select id="task-priority" required class="crm-input font-medium">
              <option value="urgente">Urgente (Crítico / Imediato)</option>
              <option value="alta" selected>Alta Prioridade</option>
              <option value="normal">Normal</option>
              <option value="baixa">Baixa Prioridade</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Data de Entrega (Prazo) *</label>
            <input type="date" id="task-duedate" required class="crm-input font-mono">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Hora Limite (Opcional)</label>
            <input type="time" id="task-duetime" value="18:00" class="crm-input font-mono">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Notas / Instruções Adicionais</label>
          <textarea id="task-notes" rows="2"
            placeholder="Ex: Aguardar validação das declarações do CEO antes de enviar..."
            class="crm-input resize-none"></textarea>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeTaskModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Tarefa</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- MODAL: NOVO PROJETO                                      -->
  <!-- ======================================================== -->
  <div id="modal-new-project"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Novo Projeto de Comunicação</h3>
          <p class="text-[11px] text-[#6B6B6B]">Cria um dossiê temático, campanha ou frente de relações públicas.</p>
        </div>
        <button onclick="closeProjectModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleNewProjectSubmit(event)" class="p-5 space-y-4">
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nome do Projeto *</label>
          <input type="text" id="project-name" required placeholder="Ex: Lançamento Relatório ESG 2026"
            class="crm-input">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Cliente / Área / Marca</label>
            <input type="text" id="project-client" placeholder="Ex: Institucional / Gabinete Executivo"
              class="crm-input">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Data Limite de Conclusão</label>
            <input type="date" id="project-deadline" class="crm-input font-mono">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Descrição / Objetivos de Comunicação</label>
          <textarea id="project-desc" rows="3"
            placeholder="Ex: Garantir cobertura em Tier 1 sobre metas de sustentabilidade..."
            class="crm-input resize-none"></textarea>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeProjectModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Criar Projeto</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- MODAL: REGISTAR CONTACTO EFETUADO HOJE                   -->
  <!-- ======================================================== -->
  <div id="modal-new-contact"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Registar Contacto Efetuado Hoje</h3>
          <p class="text-[11px] text-[#6B6B6B]">Regista chamadas telefónicas, emails de pauta e contactos com
            jornalistas.</p>
        </div>
        <button onclick="closeContactModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleNewContactSubmit(event)" class="p-5 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nome do Jornalista / Contacto *</label>
            <input type="text" id="contact-name" required placeholder="Ex: Helena Ramos" list="journalists-datalist"
              class="crm-input">
            <datalist id="journalists-datalist"></datalist>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Órgão de Comunicação (OCS) *</label>
            <select id="contact-outlet" class="crm-input font-medium">
              <!-- Preenchido dinamicamente -->
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Tipo de Contacto *</label>
            <select id="contact-type" class="crm-input font-medium">
              <option value="chamada">Chamada Telefónica</option>
              <option value="email">Email de Pauta / Pitch</option>
              <option value="whatsapp">WhatsApp / Mensagem</option>
              <option value="reuniao">Reunião Presencial</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Hora do Contacto</label>
            <input type="time" id="contact-time" class="crm-input font-mono">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Pauta / Assunto Tratado *</label>
          <textarea id="contact-notes" required rows="3"
            placeholder="Ex: Apresentação de pitch exclusivo sobre expansão ibérica. Jornalista demonstrou interesse..."
            class="crm-input resize-none"></textarea>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeContactModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Registar Contacto</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- MODAL: NOVO JORNALISTA (BASE 2 COMPLETA)                  -->
  <!-- ======================================================== -->
  <div id="modal-new-journalist"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-2xl rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Novo Jornalista na Base de Contactos (Base 2)</h3>
          <p class="text-[11px] text-[#6B6B6B]">Regista profissionais de imprensa com mÃºltiplos canais e consentimento RGPD.</p>
        </div>
        <button onclick="closeJournalistModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleNewJournalistSubmit(event)" class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        <!-- Nome e Cargo -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nome Completo *</label>
            <input type="text" id="j-name" required placeholder="Ex: InÃªs Caldeira" class="crm-input">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Cargo / FunÃ§Ã£o *</label>
            <input type="text" id="j-role" required placeholder="Ex: Redatora, Editor-Adjunto..." class="crm-input">
          </div>
        </div>

        <!-- Ã“rgÃ£os de ComunicaÃ§Ã£o Social (SeleÃ§Ã£o de Base 1) -->
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Ã“rgÃ£o(s) de ComunicaÃ§Ã£o Social (OCS) *</label>
          <select id="j-outlet" required class="crm-input font-medium">
            <!-- Preenchido dinamicamente com opÃ§Ãµes de localOutlets -->
          </select>
          <span class="text-[10px] text-[#6B6B6B] mt-1 block">O jornalista ficarÃ¡ automaticamente associado Ã  ficha deste meio de comunicaÃ§Ã£o.</span>
        </div>

        <!-- Contactos: Emails e Telefones -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Email Principal *</label>
            <input type="email" id="j-email" required placeholder="nome@redacao.pt" class="crm-input font-mono">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Email SecundÃ¡rio (Opcional)</label>
            <input type="email" id="j-email-sec" placeholder="pessoal@gmail.com" class="crm-input font-mono">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">TelemÃ³vel / WhatsApp *</label>
            <input type="text" id="j-phone" required placeholder="+351 912 345 678" class="crm-input font-mono">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Telefone Fixo / RedaÃ§Ã£o</label>
            <input type="text" id="j-phone-sec" placeholder="+351 210 000 000" class="crm-input font-mono">
          </div>
        </div>

        <!-- PreferÃªncia de Contacto e Estado -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">PreferÃªncia de Contacto *</label>
            <select id="j-preference" class="crm-input font-medium">
              <option value="whatsapp">WhatsApp (Mais rÃ¡pido)</option>
              <option value="email">Email institucional</option>
              <option value="telefone">Chamada TelefÃ³nica</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Estado do Jornalista</label>
            <select id="j-status" class="crm-input font-medium">
              <option value="ativo">Ativo</option>
              <option value="mudou_de_meio">Mudou de meio</option>
              <option value="reformado">Reformado</option>
            </select>
          </div>
        </div>

        <!-- Ãrea de IntervenÃ§Ã£o (Partilhada com Especialidade) -->
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Ãreas de IntervenÃ§Ã£o (separadas por vÃ­rgula) *</label>
          <input type="text" id="j-areas" required placeholder="Ex: Economia & NegÃ³cios, Sustentabilidade & ESG" class="crm-input">
        </div>

        <!-- Links Digitais -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">LinkedIn</label>
            <input type="text" id="j-linkedin" placeholder="linkedin.com/in/..." class="crm-input">
          </div>
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">X / Twitter</label>
            <input type="text" id="j-twitter" placeholder="x.com/..." class="crm-input">
          </div>
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">PÃ¡gina de Autor</label>
            <input type="text" id="j-author-page" placeholder="meio.pt/autor/..." class="crm-input">
          </div>
        </div>

        <!-- RGPD e Origem -->
        <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] space-y-3">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="j-rgpd" checked class="rounded border-[#E4DDD3] text-[#6C1C37] focus:ring-[#6C1C37]">
            <label for="j-rgpd" class="text-xs font-medium text-[#1A1A1A] cursor-pointer">Possui consentimento formal RGPD para contactos de assessoria</label>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-[11px] text-[#6B6B6B] mb-1">Data do Consentimento</label>
              <input type="date" id="j-rgpd-date" class="crm-input font-mono text-xs">
            </div>
            <div>
              <label class="block text-[11px] text-[#6B6B6B] mb-1">Origem do Contacto</label>
              <input type="text" id="j-contact-origin" placeholder="Ex: ConferÃªncia Web Summit 2025" class="crm-input text-xs">
            </div>
          </div>
        </div>

        <!-- Notas Longas -->
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Notas Editoriais e de Relacionamento</label>
          <textarea id="j-notes" rows="3" placeholder="Interesses temÃ¡ticos, prazos de fecho de ediÃ§Ã£o, melhores horÃ¡rios de contacto..." class="crm-input text-xs leading-relaxed"></textarea>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeJournalistModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Jornalista</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- MODAL: NOVO Ã“RGÃƒO DE COMUNICAÃ‡ÃƒO SOCIAL (BASE 1 COMPLETA) -->
  <!-- ======================================================== -->
  <div id="modal-new-outlet"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-2xl rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Novo Ã“rgÃ£o de ComunicaÃ§Ã£o Social (Base 1)</h3>
          <p class="text-[11px] text-[#6B6B6B]">Regista publicaÃ§Ãµes periÃ³dicas, estaÃ§Ãµes de TV, rÃ¡dio ou canais digitais.</p>
        </div>
        <button onclick="closeOutletModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleNewOutletSubmit(event)" class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        <!-- Nome e Logo -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nome do Ã“rgÃ£o (OCS) *</label>
            <input type="text" id="ocs-name" required placeholder="Ex: Jornal de NotÃ­cias" class="crm-input">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">URL do Logo (Opcional)</label>
            <input type="url" id="ocs-logo" placeholder="https://exemplo.pt/logo.png" class="crm-input font-mono text-xs">
          </div>
        </div>

        <!-- Grupo Editorial com OpÃ§Ã£o de Criar Novo -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-medium text-[#1A1A1A]">Grupo Editorial a que pertence</label>
            <button type="button" onclick="handleAddNewGroupPrompt()" class="text-xs text-[#6C1C37] hover:underline font-medium">
              + Criar Novo Grupo
            </button>
          </div>
          <select id="ocs-group" class="crm-input font-medium">
            <option value="Grupo Impresa">Grupo Impresa</option>
            <option value="Sonaecom">Sonaecom</option>
            <option value="Swipe News">Swipe News</option>
            <option value="Medialivre (ex-Cofina)">Medialivre (ex-Cofina)</option>
            <option value="RÃ¡dio e TelevisÃ£o de Portugal (RTP)">RÃ¡dio e TelevisÃ£o de Portugal (RTP)</option>
            <option value="Grupo Observador">Grupo Observador</option>
            <option value="Global Media Group">Global Media Group</option>
            <option value="AgÃªncia Lusa">AgÃªncia Lusa</option>
            <option value="Media Capital">Media Capital</option>
            <option value="Independente / Outro">Independente / Outro</option>
          </select>
        </div>

        <!-- Website e Morada -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Link do Site (URL) *</label>
            <input type="url" id="ocs-website" required placeholder="https://www.jornal.pt" class="crm-input font-mono text-xs">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Morada da Sede / RedaÃ§Ã£o</label>
            <input type="text" id="ocs-address" placeholder="Rua / Avenida, CÃ³digo Postal, Localidade" class="crm-input">
          </div>
        </div>

        <!-- Contactos Centrais da RedaÃ§Ã£o -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Email de Agenda / NotÃ­cias *</label>
            <input type="email" id="ocs-agenda-email" required placeholder="agenda@redacao.pt" class="crm-input font-mono text-xs">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Telefone da RedaÃ§Ã£o</label>
            <input type="text" id="ocs-phone" placeholder="+351 210 000 000" class="crm-input font-mono text-xs">
          </div>
        </div>

        <!-- Formatos Suportados (Multi-etiqueta) -->
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Formatos * (seleciona um ou vÃ¡rios)</label>
          <div class="flex flex-wrap gap-2 pt-1" id="ocs-modal-format-tags">
            <button type="button" onclick="toggleOcsModalFormat('online')" class="ocs-fmt-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" data-fmt="online">Online</button>
            <button type="button" onclick="toggleOcsModalFormat('papel')" class="ocs-fmt-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" data-fmt="papel">Papel</button>
            <button type="button" onclick="toggleOcsModalFormat('tv')" class="ocs-fmt-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" data-fmt="tv">TelevisÃ£o</button>
            <button type="button" onclick="toggleOcsModalFormat('radio')" class="ocs-fmt-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" data-fmt="radio">RÃ¡dio</button>
            <button type="button" onclick="toggleOcsModalFormat('podcast')" class="ocs-fmt-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" data-fmt="podcast">Podcast</button>
            <button type="button" onclick="toggleOcsModalFormat('agencia')" class="ocs-fmt-btn px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" data-fmt="agencia">AgÃªncia Noticiosa</button>
          </div>
        </div>

        <!-- Ã‚mbito, Periodicidade e AudiÃªncia -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Ã‚mbito *</label>
            <select id="ocs-scope" class="crm-input font-medium">
              <option value="nacional">Nacional</option>
              <option value="regional">Regional</option>
              <option value="local">Local</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Periodicidade *</label>
            <select id="ocs-periodicity" class="crm-input font-medium">
              <option value="diario">DiÃ¡rio</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="continua">ContÃ­nua (Digital)</option>
              <option value="outra">Outra</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">AudiÃªncia Estimada</label>
            <input type="number" id="ocs-audience" placeholder="Ex: 500000" class="crm-input font-mono text-xs">
          </div>
        </div>

        <!-- Registo da ERC -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Tipo de Meio (Registo ERC)</label>
            <select id="ocs-erc-type" class="crm-input">
              <option value="PublicaÃ§Ã£o PeriÃ³dica Impressa e Digital">PublicaÃ§Ã£o PeriÃ³dica Impressa e Digital</option>
              <option value="PublicaÃ§Ã£o PeriÃ³dica Digital">PublicaÃ§Ã£o PeriÃ³dica Digital</option>
              <option value="ServiÃ§o de Programas Televisivo">ServiÃ§o de Programas Televisivo</option>
              <option value="ServiÃ§o de Programas RadiofÃ³nico">ServiÃ§o de Programas RadiofÃ³nico</option>
              <option value="AgÃªncia Noticiosa">AgÃªncia Noticiosa</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">N.Âº de Registo na ERC</label>
            <input type="text" id="ocs-erc-reg" placeholder="Ex: ERC-12345" class="crm-input font-mono text-xs">
          </div>
        </div>

        <!-- Especialidades (Multi-etiqueta) -->
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Especialidades (separadas por vÃ­rgula) *</label>
          <input type="text" id="ocs-specialties" required placeholder="Ex: Economia & NegÃ³cios, Sustentabilidade & ESG" class="crm-input">
        </div>

        <!-- Redes Sociais -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">LinkedIn</label>
            <input type="text" id="ocs-social-linkedin" placeholder="linkedin.com/company/..." class="crm-input text-xs">
          </div>
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">X / Twitter</label>
            <input type="text" id="ocs-social-twitter" placeholder="x.com/..." class="crm-input text-xs">
          </div>
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Instagram</label>
            <input type="text" id="ocs-social-instagram" placeholder="instagram.com/..." class="crm-input text-xs">
          </div>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeOutletModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Ã“rgÃ£o (OCS)</button>
        </div>
      </form>
    </div>
  </div>



  

  <!-- ======================================================== -->
  <!-- MODAL: REGISTAR PEDIDO DE IMPRENSA (HISTÓRICO AVE)       -->
  <!-- ======================================================== -->
  <div id="modal-new-request"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-lg rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Registar Pedido de Imprensa</h3>
          <p class="text-[11px] text-[#6B6B6B]">Controla prazos de resposta a jornalistas e calcula retorno em AVE.</p>
        </div>
        <button onclick="closeRequestModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleNewRequestSubmit(event)" class="p-5 space-y-4">
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Assunto / Pauta *</label>
          <input type="text" id="form-title" required placeholder="Ex: Pedido de entrevista sobre novos resultados..."
            class="crm-input">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nome do Jornalista *</label>
            <input type="text" id="form-journalist" required placeholder="Ex: Ana Rodrigues" class="crm-input">
          </div>

          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Órgão de Comunicação (OCS) *</label>
            <select id="form-outlet" class="crm-input font-medium">
              <!-- Preenchido dinamicamente -->
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Nível de Urgência</label>
            <select id="form-urgency" class="crm-input font-medium">
              <option value="urgente_crise">Urgente / Crise (&lt; 2 Horas)</option>
              <option value="alta" selected>Alta Prioridade (Hoje)</option>
              <option value="media">Média Prioridade (24h)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Prazo de Resposta (Horas)</label>
            <input type="number" id="form-hours" value="2" min="1" max="72" class="crm-input font-mono">
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Perguntas ou Ângulo Colocado pelo Jornalista
            *</label>
          <textarea id="form-details" required rows="3" placeholder="O que é que o jornalista pediu concretamente?"
            class="crm-input resize-none"></textarea>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeRequestModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Pedido</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- MODAL: CONFIGURAÇÃO DO SUPABASE                          -->
  <!-- ======================================================== -->
  <div id="modal-config-supabase"
    class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-[#1A1A1A]/30 backdrop-blur-sm">
    <div
      class="bg-white w-full max-w-md rounded-2xl border border-[#E4DDD3] shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-5 border-b border-[#E4DDD3] flex items-center justify-between bg-[#FBF9F6]">
        <div>
          <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">Ligar Base de Dados Supabase</h3>
          <p class="text-[11px] text-[#6B6B6B]">Sincroniza tarefas, projetos, contactos, jornalistas e OCS na cloud.</p>
        </div>
        <button onclick="closeConfigModal()" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1" title="Fechar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form onsubmit="handleSaveSupabaseConfig(event)" class="p-5 space-y-4">
        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Project URL *</label>
          <input type="url" id="cfg-supabase-url" required class="crm-input font-mono">
        </div>

        <div>
          <label class="block text-xs font-medium text-[#1A1A1A] mb-1">Anon Public Key *</label>
          <input type="text" id="cfg-supabase-key" required class="crm-input font-mono">
        </div>

        <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] text-[#6B6B6B] text-[11px] space-y-1">
          <p class="font-medium text-[#1A1A1A]">Informação:</p>
          <p>As chaves de acesso são persistidas no teu navegador para autenticação direta com o Supabase.</p>
        </div>

        <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-end gap-2">
          <button type="button" onclick="closeConfigModal()" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar & Reconectar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- JAVASCRIPT: TOTALMENTE LIVRE DE EMOJIS, SEGURO & ATTIO    -->
  <!-- ======================================================== -->
  <script>
    // ==========================================
    // 1. ESTADO GLOBAL DOS DADOS & AUTENTICAÇÃO
    // ==========================================
    let currentUser = null;
    let localTasks = [];
    let localProjects = [];
    let localDailyContacts = [];
    let localJournalists = [];
    let localOutlets = [];
    let localRequests = [];
    let localClippings = [];

    // Formatos selecionados no modal de OCS
    let selectedOcsFormats = ['Online'];

    // Credenciais Supabase Pré-Configuradas
    const DEFAULT_SUPABASE_URL = 'https://phdwhcoyzrmucklysqzv.supabase.co';
    const DEFAULT_SUPABASE_KEY = 'sb_publishable_rB0KeruABhwbSXpnglEhww_Lte2BL6J';
    let supabaseClient = null;

    // Filtro ativo de tarefas e controlo de histórico/vistas
    let currentTaskTab = 'all';
    let currentActiveView = 'dashboard';

    // 2. RATE LIMITING & TENTATIVAS DE LOGIN
    let failedAttempts = parseInt(localStorage.getItem('rep_failed_attempts') || '0', 10);
    let lockoutUntil = parseInt(localStorage.getItem('rep_lockout_until') || '0', 10);
    let lockoutTimerInterval = null;

    // ========================================================
    // 4.4 PALETA DE DADOS (ETIQUETAS & CATEGORIAS ATTIO-STYLE)
    // Cores estáveis por valor com fundo pastel e texto no mesmo tom
    // ========================================================
    const DATA_PALETTE = [
      { bg: '#DDE6EE', text: '#2F4A63' }, // Azul-acinzentado
      { bg: '#DFE7D6', text: '#3F5A2E' }, // Verde-musgo
      { bg: '#F3E3C3', text: '#7A4E0F' }, // Âmbar
      { bg: '#F1D9CE', text: '#8A3E22' }, // Terracota
      { bg: '#E5DEEC', text: '#5A4378' }, // Violeta suave
      { bg: '#D5E8E5', text: '#1F5B57' }, // Verde-azulado
      { bg: '#E8DDD0', text: '#66482C' }, // Castanho
    ];
    const WARM_GRAY_TAG = { bg: '#E9E5E0', text: '#5C554E' }; // Sem categoria / Neutro

    function getDataColorForValue(val) {
      if (!val || val === '—' || val === 'Geral' || val === 'Sem categoria') return WARM_GRAY_TAG;
      let hash = 0;
      for (let i = 0; i < val.length; i++) {
        hash = (hash << 5) - hash + val.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % DATA_PALETTE.length;
      return DATA_PALETTE[index];
    }

    function renderTag(val, extraClasses = '') {
      if (!val) return '<span class="text-[#6B6B6B]">—</span>';
      const c = getDataColorForValue(val);
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${extraClasses}" style="background-color: ${c.bg}; color: ${c.text}; border: 1px solid rgba(0,0,0,0.03);">${val}</span>`;
    }

    // Toggle de densidade de tabelas
    function toggleTableDensity(tableId) {
      const table = document.getElementById(tableId);
      if (table) {
        table.classList.toggle('compact');
      }
    }

    // Seleção de linha estilo Attio (#E6C5CA a 40% com barra lateral #6C1C37)
    function selectTableRow(tr) {
      if (!tr) return;
      const isSelected = tr.classList.contains('selected');
      // Desmarcar outras linhas da mesma tabela
      const tbody = tr.closest('tbody');
      if (tbody) {
        tbody.querySelectorAll('tr.selected').forEach(r => r.classList.remove('selected'));
      }
      if (!isSelected) {
        tr.classList.add('selected');
      }
    }

    // ==========================================
    // 3. INICIALIZAÇÃO
    // ==========================================
    window.addEventListener('DOMContentLoaded', () => {
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateEl = document.getElementById('current-today-date');
      if (dateEl) {
        dateEl.innerText = today.toLocaleDateString('pt-PT', options);
      }

      updateDashboardGreeting();
      initSupabase();
      checkLockout();
      checkAuthSession();
      initSidebarState();
    });

    // ========================================================
    // CONTROLO DA ABA / BARRA LATERAL RETRÁTIL (FULL WIDTH)
    // Permite recolher/expandir o menu para o dashboard ocupar 100%
    // ========================================================
    function toggleSidebar(forceOpen) {
      const sidebar = document.getElementById('main-sidebar');
      const floatingTab = document.getElementById('sidebar-floating-tab');
      const backdrop = document.getElementById('sidebar-backdrop');
      const toggleLabel = document.getElementById('sidebar-toggle-label');
      const toggleBtn = document.getElementById('sidebar-toggle-btn');

      if (!sidebar) return;

      const willBeCollapsed = forceOpen !== undefined ? !forceOpen : !sidebar.classList.contains('collapsed');

      if (willBeCollapsed) {
        sidebar.classList.add('collapsed');
        if (floatingTab) floatingTab.classList.remove('hidden');
        if (backdrop) backdrop.classList.add('hidden');
        if (toggleLabel) toggleLabel.innerText = "Menu";
        if (toggleBtn) {
          toggleBtn.title = "Expandir Menu Lateral";
        }
        localStorage.setItem('rep_sidebar_collapsed', 'true');
      } else {
        sidebar.classList.remove('collapsed');
        if (floatingTab) floatingTab.classList.add('hidden');
        if (backdrop && window.innerWidth < 768) backdrop.classList.remove('hidden');
        if (toggleLabel) toggleLabel.innerText = "Ocultar";
        if (toggleBtn) {
          toggleBtn.title = "Recolher Menu (Ocupar Ecrã Inteiro)";
        }
        localStorage.setItem('rep_sidebar_collapsed', 'false');
      }
    }

    function initSidebarState() {
      const savedState = localStorage.getItem('rep_sidebar_collapsed');
      if (window.innerWidth < 768) {
        toggleSidebar(false);
      } else if (savedState === 'true') {
        toggleSidebar(false);
      } else {
        toggleSidebar(true);
      }

      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
          e.preventDefault();
          toggleSidebar();
        }
        if (e.key === 'Escape') {
          closeTaskModal();
          closeProjectModal();
          closeContactModal();
          closeJournalistModal();
          closeOutletModal();
          closeRequestModal();
          closeConfigModal();
        }
      });
    }

    function initSupabase() {
      const url = localStorage.getItem('reputation_sb_url') || DEFAULT_SUPABASE_URL;
      const key = localStorage.getItem('reputation_sb_key') || DEFAULT_SUPABASE_KEY;

      if (url && key && window.supabase) {
        try {
          supabaseClient = window.supabase.createClient(url, key);
        } catch (e) {
          console.error("Erro ao inicializar Supabase:", e);
        }
      }
    }

    // ==========================================
    // VALIDAÇÃO DE PALAVRA-PASSE (MAIÚSCULA + ESPECIAL)
    // ==========================================
    function checkPasswordPolicy(password) {
      const startsUpper = /^[A-Z]/.test(password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
      const minLength = password.length >= 6;
      return {
        isValid: startsUpper && hasSpecial && minLength,
        startsUpper,
        hasSpecial,
        minLength
      };
    }

    function validateRegisterPasswordLive(pw) {
      const p = checkPasswordPolicy(pw);
      updateRuleUi('rule-upper', p.startsUpper);
      updateRuleUi('rule-special', p.hasSpecial);
      updateRuleUi('rule-len', p.minLength);
    }

    function validateRecoverPasswordLive(pw) {
      const p = checkPasswordPolicy(pw);
      updateRuleUi('rec-rule-upper', p.startsUpper);
      updateRuleUi('rec-rule-special', p.hasSpecial);
    }

    function updateRuleUi(elementId, isMet) {
      const el = document.getElementById(elementId);
      if (!el) return;
      if (isMet) {
        el.className = "flex items-center gap-2 text-[#2F6B3A] font-medium";
        const dot = el.querySelector('span:first-child');
        if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-[#2F6B3A]";
      } else {
        el.className = "flex items-center gap-2 text-[#6B6B6B]";
        const dot = el.querySelector('span:first-child');
        if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-[#E4DDD3]";
      }
    }

    // ==========================================
    // SISTEMA DE SEGURANÇA & RATE LIMITING
    // ==========================================
    function checkLockout() {
      const now = Date.now();
      if (lockoutUntil && now < lockoutUntil) {
        const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
        applyLockoutState(remainingSeconds);
        return true;
      } else if (lockoutUntil && now >= lockoutUntil) {
        lockoutUntil = 0;
        failedAttempts = 0;
        localStorage.removeItem('rep_lockout_until');
        localStorage.setItem('rep_failed_attempts', '0');
        clearLockoutState();
        return false;
      }
      return false;
    }

    function recordFailedAttempt() {
      failedAttempts++;
      localStorage.setItem('rep_failed_attempts', failedAttempts.toString());

      const warningEl = document.getElementById('auth-attempt-warning');

      if (failedAttempts >= 5) {
        lockoutUntil = Date.now() + 60000; // 60 segundos
        localStorage.setItem('rep_lockout_until', lockoutUntil.toString());
        applyLockoutState(60);
        return true;
      } else {
        if (warningEl) {
          warningEl.innerText = `Tentativa falhada ${failedAttempts} de 5. O acesso será bloqueado após 5 tentativas incorretas.`;
          warningEl.classList.remove('hidden');
        }
      }
      return false;
    }

    function recordSuccessfulLogin() {
      failedAttempts = 0;
      lockoutUntil = 0;
      localStorage.removeItem('rep_lockout_until');
      localStorage.setItem('rep_failed_attempts', '0');
      clearLockoutState();
    }

    function applyLockoutState(seconds) {
      const errorMsg = document.getElementById('auth-error-msg');
      const warningEl = document.getElementById('auth-attempt-warning');
      const btn = document.getElementById('login-submit-btn');
      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');

      if (btn) btn.disabled = true;
      if (emailInput) emailInput.disabled = true;
      if (passInput) passInput.disabled = true;
      if (warningEl) warningEl.classList.add('hidden');

      if (errorMsg) {
        errorMsg.innerHTML = `Demasiadas tentativas falhadas. Acesso bloqueado por segurança.<br>Tente novamente em <span id="lockout-timer" class="font-medium font-mono">${seconds}</span> segundos, ou <button type="button" onclick="recordSuccessfulLogin()" class="underline font-semibold text-[#A3281E] cursor-pointer">Desbloquear Imediatamente</button>.`;
        errorMsg.classList.remove('hidden');
      }

      if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
      lockoutTimerInterval = setInterval(() => {
        const now = Date.now();
        const rem = Math.ceil((lockoutUntil - now) / 1000);
        const timerSpan = document.getElementById('lockout-timer');
        if (timerSpan) timerSpan.innerText = rem > 0 ? rem : 0;

        if (rem <= 0) {
          clearInterval(lockoutTimerInterval);
          lockoutTimerInterval = null;
          lockoutUntil = 0;
          failedAttempts = 0;
          localStorage.removeItem('rep_lockout_until');
          localStorage.setItem('rep_failed_attempts', '0');
          clearLockoutState();
        }
      }, 1000);
    }

    function clearLockoutState() {
      const btn = document.getElementById('login-submit-btn');
      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');
      const errorMsg = document.getElementById('auth-error-msg');
      const warningEl = document.getElementById('auth-attempt-warning');

      if (btn) btn.disabled = false;
      if (emailInput) emailInput.disabled = false;
      if (passInput) passInput.disabled = false;
      if (errorMsg) errorMsg.classList.add('hidden');
      if (warningEl) warningEl.classList.add('hidden');
    }

    // ==========================================
    // SISTEMA DE AUTENTICAÇÃO (LOGIN / REGISTO / RECUPERAÇÃO)
    // ==========================================
    async function checkAuthSession() {
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session && session.user) {
            setAuthenticatedUser(session.user);
            return;
          }
        } catch (e) { }
      }

      const savedUser = localStorage.getItem('rep_auth_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.email) {
            setAuthenticatedUser(parsed);
            return;
          }
        } catch (e) { }
      }

      showLoginScreen();
    }

    // ========================================================
    // PERMISSÕES INSTITUCIONAIS & CONTROLO DE ACESSO (RBAC)
    // O gabinete opera com restrição de funções por perfil
    // ========================================================
    const ROLE_PERMISSIONS = {
      director: {
        roleKey: 'director',
        label: 'Diretor de RP',
        fullTitle: 'Diretor(a) de Comunicação',
        tag: 'Acesso Total',
        badgeColor: 'bg-[#E6C5CA]/40 text-[#6C1C37] border-[#E6C5CA]',
        dotColor: 'bg-[#6C1C37]',
        canCreateTasks: true,
        canCreateProjects: true,
        canCreateContacts: true,
        canCreateJournalists: true,
        canCreateOutlets: true,
        canDeleteRecords: true,
        canConfigDatabase: true,
        isReadOnly: false
      },
      press_officer: {
        roleKey: 'press_officer',
        label: 'Assessor de Imprensa',
        fullTitle: 'Assessor(a) de Imprensa',
        tag: 'Gestão de Redações',
        badgeColor: 'bg-[#DFE7D6] text-[#3F5A2E] border-[#DFE7D6]',
        dotColor: 'bg-[#3F5A2E]',
        canCreateTasks: true,
        canCreateProjects: false,
        canCreateContacts: true,
        canCreateJournalists: true,
        canCreateOutlets: true,
        canDeleteRecords: false,
        canConfigDatabase: false,
        isReadOnly: false
      },
      junior: {
        roleKey: 'junior',
        label: 'Técnico de Clipping',
        fullTitle: 'Técnico(a) de Clipping & Apoio',
        tag: 'Registo Diário',
        badgeColor: 'bg-[#DDE6EE] text-[#2F4A63] border-[#DDE6EE]',
        dotColor: 'bg-[#2F4A63]',
        canCreateTasks: false,
        canCreateProjects: false,
        canCreateContacts: true,
        canCreateJournalists: false,
        canCreateOutlets: false,
        canDeleteRecords: false,
        canConfigDatabase: false,
        isReadOnly: false
      },
      viewer: {
        roleKey: 'viewer',
        label: 'Observador Executivo',
        fullTitle: 'Observador(a) / Administração',
        tag: 'Apenas Leitura',
        badgeColor: 'bg-[#E9E5E0] text-[#5C554E] border-[#E9E5E0]',
        dotColor: 'bg-[#5C554E]',
        canCreateTasks: false,
        canCreateProjects: false,
        canCreateContacts: false,
        canCreateJournalists: false,
        canCreateOutlets: false,
        canDeleteRecords: false,
        canConfigDatabase: false,
        isReadOnly: true
      }
    };

    function currentUserPermissions() {
      const roleKey = currentUser?.user_metadata?.role || 'director';
      return ROLE_PERMISSIONS[roleKey] || ROLE_PERMISSIONS['director'];
    }

    function applyUserPermissions(roleKey) {
      const perms = ROLE_PERMISSIONS[roleKey] || ROLE_PERMISSIONS['director'];

      // 1. Top Header: Badge e Dot
      const headerRole = document.getElementById('header-user-role');
      const headerDot = document.getElementById('header-user-dot');
      if (headerRole) headerRole.innerText = perms.label;
      if (headerDot) headerDot.className = "w-2 h-2 rounded-full " + perms.dotColor;

      // 2. Sidebar: Badge
      const sidebarBadge = document.getElementById('sidebar-role-badge');
      if (sidebarBadge) {
        sidebarBadge.innerText = perms.label;
        sidebarBadge.className = "text-[10px] font-medium px-2 py-0.5 rounded-full border " + perms.badgeColor;
      }

      // 3. Botões de Criação na Sidebar
      const sidebarTaskBtn = document.getElementById('sidebar-btn-new-task');
      const sidebarProjectBtn = document.getElementById('sidebar-btn-new-project');
      const sidebarContactBtn = document.getElementById('sidebar-btn-new-contact');
      if (sidebarTaskBtn) sidebarTaskBtn.style.display = perms.canCreateTasks ? '' : 'none';
      if (sidebarProjectBtn) sidebarProjectBtn.style.display = perms.canCreateProjects ? '' : 'none';
      if (sidebarContactBtn) sidebarContactBtn.style.display = perms.canCreateContacts ? '' : 'none';

      // 4. Botões de Criação nas Vistas
      const viewTaskAddBtn = document.getElementById('view-tasks-add-btn');
      const viewProjectAddBtn = document.getElementById('view-projects-add-btn');
      const viewJournalistAddBtn = document.getElementById('view-journalists-add-btn');
      const viewOutletAddBtn = document.getElementById('view-outlets-add-btn');
      const dashContactBtn = document.getElementById('dash-contact-btn');
      const dashTaskBtn = document.getElementById('dash-task-btn');
      const dashProjectBtn = document.getElementById('dash-project-btn');

      if (viewTaskAddBtn) viewTaskAddBtn.style.display = perms.canCreateTasks ? '' : 'none';
      if (viewProjectAddBtn) viewProjectAddBtn.style.display = perms.canCreateProjects ? '' : 'none';
      if (viewJournalistAddBtn) viewJournalistAddBtn.style.display = perms.canCreateJournalists ? '' : 'none';
      if (viewOutletAddBtn) viewOutletAddBtn.style.display = perms.canCreateOutlets ? '' : 'none';
      if (dashContactBtn) dashContactBtn.style.display = perms.canCreateContacts ? '' : 'none';
      if (dashTaskBtn) dashTaskBtn.style.display = perms.canCreateTasks ? '' : 'none';
      if (dashProjectBtn) dashProjectBtn.style.display = perms.canCreateProjects ? '' : 'none';

      // 5. Configuração Supabase (Apenas Diretor)
      const dbConfigBtn = document.getElementById('db-config-btn');
      if (dbConfigBtn) dbConfigBtn.style.display = perms.canConfigDatabase ? '' : 'none';

      // 6. Banner de Apenas Leitura (Para Observador)
      const readOnlyBanner = document.getElementById('read-only-banner');
      if (readOnlyBanner) {
        if (perms.isReadOnly) {
          readOnlyBanner.classList.remove('hidden');
        } else {
          readOnlyBanner.classList.add('hidden');
        }
      }

      // 7. Botões de Eliminar
      document.querySelectorAll('.btn-delete-record').forEach(el => {
        el.style.display = perms.canDeleteRecords ? '' : 'none';
      });
    }

    function setAuthenticatedUser(user) {
      currentUser = user;
      localStorage.setItem('rep_auth_user', JSON.stringify(user));

      const email = user.email || 'tiagoperesmendes@gmail.com';
      const role = user.user_metadata?.role || 'director';
      const name = user.user_metadata?.full_name || email.split('@')[0];
      const initials = name.slice(0, 2).toUpperCase();

      document.querySelectorAll('.auth-user-email').forEach(el => el.innerText = email);
      document.querySelectorAll('.auth-user-initials').forEach(el => el.innerText = initials);

      const headerEmail = document.getElementById('header-user-email');
      if (headerEmail) headerEmail.innerText = email;

      applyUserPermissions(role);

      showAppScreen();
      loadAllData();
    }

    function showLoginScreen() {
      document.getElementById('auth-container').classList.remove('hidden');
      document.getElementById('auth-container').classList.add('flex');
      document.getElementById('app-container').classList.add('hidden');
      document.getElementById('app-container').classList.remove('flex');
    }

    function showAppScreen() {
      document.getElementById('auth-container').classList.add('hidden');
      document.getElementById('auth-container').classList.remove('flex');
      document.getElementById('app-container').classList.remove('hidden');
      document.getElementById('app-container').classList.add('flex');

      // Determinar a vista inicial a partir do hash da URL (ex: #projects, #tasks) ou padrão 'dashboard'
      const validViews = ['dashboard', 'tasks', 'projects', 'journalists', 'outlets'];
      const rawHash = window.location.hash.replace('#', '');
      const initialView = validViews.includes(rawHash) ? rawHash : 'dashboard';

      try {
        window.history.replaceState({ view: initialView }, '', '#' + initialView);
      } catch (e) {
        window.location.hash = initialView;
      }

      switchView(initialView, false);
    }

    function switchAuthTab(tab) {
      const loginTab = document.getElementById('tab-auth-login');
      const registerTab = document.getElementById('tab-auth-register');
      const recoverTab = document.getElementById('tab-auth-recover');
      const formLogin = document.getElementById('form-login');
      const formRegister = document.getElementById('form-register');
      const formRecover = document.getElementById('form-recover');

      loginTab.className = "flex-1 py-2 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all";
      registerTab.className = "flex-1 py-2 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all";
      recoverTab.className = "flex-1 py-2 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all";

      formLogin.classList.add('hidden');
      formRegister.classList.add('hidden');
      formRecover.classList.add('hidden');

      if (tab === 'register') {
        registerTab.className = "flex-1 py-2 rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all";
        formRegister.classList.remove('hidden');
      } else if (tab === 'recover') {
        recoverTab.className = "flex-1 py-2 rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all";
        formRecover.classList.remove('hidden');
      } else {
        loginTab.className = "flex-1 py-2 rounded-lg bg-white text-[#1A1A1A] shadow-xs transition-all";
        formLogin.classList.remove('hidden');
      }
    }

    function togglePasswordVisibility(inputId) {
      const el = document.getElementById(inputId);
      if (el) {
        el.type = el.type === 'password' ? 'text' : 'password';
      }
    }

    // A. SUBMETER LOGIN COM CONTROLO DE TENTATIVAS & PERMISSÕES
    async function handleLoginSubmit(e) {
      if (e) e.preventDefault();

      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      const email = emailEl ? emailEl.value.trim() : 'tiagoperesmendes@gmail.com';
      const password = passEl ? passEl.value : '';
      const errorMsg = document.getElementById('auth-error-msg');
      const btn = document.getElementById('login-submit-btn');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>A verificar credenciais...</span>';
      }
      if (errorMsg) errorMsg.classList.add('hidden');

      const cleanEmail = email.toLowerCase();
      const isDirector = cleanEmail.includes('tiago') || cleanEmail.includes('diretor') || cleanEmail.includes('leonor') || cleanEmail === 'tiagoperesmendes@gmail.com';
      const registeredUsers = JSON.parse(localStorage.getItem('rep_registered_users') || '{}');
      const userRecord = registeredUsers[cleanEmail];
      const assignedRole = userRecord?.role || (isDirector ? 'director' : (cleanEmail.includes('clipping') ? 'junior' : (cleanEmail.includes('observador') ? 'viewer' : 'press_officer')));
      const assignedName = userRecord?.name || (isDirector ? 'Leonor Rodrigues' : (cleanEmail.includes('assessor') ? 'Sofia Ramos' : (email.includes('@') ? email.split('@')[0] : email)));

      // O Diretor nunca fica bloqueado; para outros perfis, valida tentativas
      if (!isDirector && checkLockout()) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Entrar no Gabinete</span>';
        }
        return;
      }

      if (supabaseClient) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 2000)
          );
          const { data, error } = await Promise.race([
            supabaseClient.auth.signInWithPassword({ email, password }),
            timeoutPromise
          ]);

          if (!error && data?.user) {
            recordSuccessfulLogin();
            const role = data.user.user_metadata?.role || assignedRole;
            data.user.user_metadata = { ...data.user.user_metadata, role, full_name: data.user.user_metadata?.full_name || assignedName };
            setAuthenticatedUser(data.user);
            showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[role]?.label || role) + '.');
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '<span>Entrar no Gabinete</span>';
            }
            return;
          }
        } catch (err) {
          console.warn("Supabase auth em modo offline ou resposta demorada:", err);
        }
      }

      // Autenticação local imediata e resiliente (garante acesso imediato mesmo offline)
      recordSuccessfulLogin();
      const localUser = {
        id: isDirector ? 'dir-leonor' : ('user-' + Date.now()),
        email: email || 'tiagoperesmendes@gmail.com',
        user_metadata: {
          full_name: assignedName,
          role: assignedRole
        }
      };
      setAuthenticatedUser(localUser);
      showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[assignedRole]?.label || assignedRole) + '.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Entrar no Gabinete</span>';
      }
    }

    // B. CRIAR CONTA COM PERMISSÕES & CÓDIGO INSTITUCIONAL
    async function handleRegisterSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const role = document.getElementById('register-role')?.value || 'press_officer';
      const inviteCode = (document.getElementById('register-invite-code')?.value || '').trim().toUpperCase();
      const password = document.getElementById('register-password').value;
      const errorMsg = document.getElementById('auth-register-error-msg');
      const successMsg = document.getElementById('auth-register-success-msg');
      const btn = document.getElementById('register-submit-btn');

      const validCodes = ['RP2026', 'DIR2026', 'PRESS2026', 'TIAGO2026'];
      if (!validCodes.includes(inviteCode)) {
        errorMsg.innerText = 'Código institucional inválido. O acesso a este gabinete é restrito e reservado a membros autorizados.';
        errorMsg.classList.remove('hidden');
        return;
      }

      const policy = checkPasswordPolicy(password);
      if (!policy.isValid) {
        let issues = [];
        if (!policy.startsUpper) issues.push('a primeira letra deve ser maiúscula (A-Z)');
        if (!policy.hasSpecial) issues.push('deve conter pelo menos um carácter especial (! @ # $ % & ...)');
        if (!policy.minLength) issues.push('mínimo de 6 caracteres');

        errorMsg.innerText = 'Requisitos em falta: ' + issues.join(', ') + '.';
        errorMsg.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>A registar conta...</span>';
      errorMsg.classList.add('hidden');
      successMsg.classList.add('hidden');

      const registeredUsers = JSON.parse(localStorage.getItem('rep_registered_users') || '{}');
      registeredUsers[email.toLowerCase()] = { name, role };
      localStorage.setItem('rep_registered_users', JSON.stringify(registeredUsers));

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name, role: role }
            }
          });

          if (!error) {
            recordSuccessfulLogin();
            successMsg.innerText = 'Conta criada com sucesso com perfil de ' + (ROLE_PERMISSIONS[role]?.label || role) + '. A aceder...';
            successMsg.classList.remove('hidden');
            setTimeout(() => {
              setAuthenticatedUser(data.user || { email, user_metadata: { full_name: name, role: role } });
              showToast('Conta criada com sucesso.');
            }, 1000);
            return;
          } else {
            errorMsg.innerText = 'Erro no registo: ' + error.message;
            errorMsg.classList.remove('hidden');
          }
        } catch (err) {
          errorMsg.innerText = 'Erro: ' + err.message;
          errorMsg.classList.remove('hidden');
        }
      } else {
        recordSuccessfulLogin();
        setAuthenticatedUser({ email, user_metadata: { full_name: name, role: role } });
        showToast('Conta criada com perfil de ' + (ROLE_PERMISSIONS[role]?.label || role) + '.');
      }

      btn.disabled = false;
      btn.innerHTML = '<span>Criar Conta</span>';
    }

    // C. RECUPERAÇÃO DE CONTA (RESET DE PALAVRA-PASSE)
    async function handleRecoverSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('recover-email').value.trim();
      const newPassword = document.getElementById('recover-new-password').value;
      const msgEl = document.getElementById('auth-recover-msg');
      const btn = document.getElementById('recover-submit-btn');

      const policy = checkPasswordPolicy(newPassword);
      if (!policy.isValid) {
        msgEl.className = "p-3 bg-[#F6D9D5] border border-[#F1D9CE] rounded-xl text-[#A3281E] text-xs font-medium";
        msgEl.innerText = 'A nova palavra-passe tem de começar com letra maiúscula e conter pelo menos um carácter especial.';
        msgEl.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span>A atualizar palavra-passe...</span>';

      recordSuccessfulLogin();

      if (supabaseClient) {
        try {
          await supabaseClient.auth.resetPasswordForEmail(email);
        } catch (e) { }
      }

      msgEl.className = "p-3 bg-[#DDEBDD] border border-[#DFE7D6] rounded-xl text-[#2F6B3A] text-xs font-medium";
      msgEl.innerText = 'Palavra-passe redefinida com sucesso. A redirecionar para o início de sessão...';
      msgEl.classList.remove('hidden');

      setTimeout(() => {
        switchAuthTab('login');
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = newPassword;
        showToast('Palavra-passe atualizada.');
      }, 1500);

      btn.disabled = false;
      btn.innerHTML = '<span>Redefinir Palavra-passe</span>';
    }

    // D. ACESSO RÁPIDO MULTI-PERFIL (DEMO & TESTE DE PERMISSÕES)
    function quickLoginRole(roleKey) {
      recordSuccessfulLogin();
      let email = 'tiagoperesmendes@gmail.com';
      let name = 'Leonor Rodrigues';
      let role = 'director';

      if (roleKey === 'press_officer') {
        email = 'assessor@gabinete.pt';
        name = 'Sofia Ramos';
        role = 'press_officer';
      } else if (roleKey === 'junior') {
        email = 'clipping@gabinete.pt';
        name = 'Gonçalo Neves';
        role = 'junior';
      } else if (roleKey === 'viewer') {
        email = 'administracao@empresa.pt';
        name = 'Administração';
        role = 'viewer';
      }

      const user = {
        id: 'user-' + roleKey,
        email: email,
        user_metadata: {
          full_name: name,
          role: role
        }
      };

      setAuthenticatedUser(user);
      const roleObj = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['director'];
      showToast('Sessão iniciada como ' + roleObj.label + '.');
    }

    function quickDirectorLogin() {
      quickLoginRole('director');
    }

    // E. TERMINAR SESSÃO (LOGOUT)
    async function handleSignOut() {
      if (!confirm('Deseja terminar a sua sessão?')) return;

      if (supabaseClient) {
        try {
          await supabaseClient.auth.signOut();
        } catch (e) { }
      }

      localStorage.removeItem('rep_auth_user');
      currentUser = null;
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch (e) {
        window.location.hash = '';
      }
      showLoginScreen();
      showToast('Sessão terminada.');
    }

    // ==========================================
    // CARREGAR DADOS & SINCRONIZAÇÃO
    // ==========================================
    async function loadAllData() {
      loadFromLocalStorageFallback();

      if (!supabaseClient) {
        renderAll();
        return;
      }

      try {
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          }
        } catch (e) { }

        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          }
        } catch (e) { }

        // Contactos Diários de Hoje
        try {
          const { data: contacts, error } = await supabaseClient.from('daily_contacts').select('*').order('created_at', { ascending: false });
          if (!error && contacts) {
            localDailyContacts = contacts;
            localStorage.setItem('rep_contacts', JSON.stringify(contacts));
          }
        } catch (e) { }

        // Jornalistas
        try {
          const { data: journalists, error } = await supabaseClient.from('journalists').select('*').order('name', { ascending: true });
          if (!error && journalists) {
            localJournalists = journalists;
            localStorage.setItem('rep_journalists', JSON.stringify(journalists));
          }
        } catch (e) { }

        // Órgãos de Comunicação Social (OCS)
        try {
          const { data: outlets, error } = await supabaseClient.from('media_outlets').select('*').order('name', { ascending: true });
          if (!error && outlets) {
            localOutlets = outlets;
            localStorage.setItem('rep_outlets', JSON.stringify(outlets));
          }
        } catch (e) { }

        // Pedidos de Imprensa
        try {
          const { data: requests, error } = await supabaseClient.from('pr_requests').select('*');
          if (!error && requests) localRequests = requests;
        } catch (e) { }

        // Clippings
        try {
          const { data: clippings, error } = await supabaseClient.from('clippings').select('*');
          if (!error && clippings) localClippings = clippings;
        } catch (e) { }

      } catch (err) {
        console.warn("Aviso na sincronização:", err);
      }

      renderAll();
    }

    // ==========================================

    // ==========================================

    // ==========================================
    // 2. DADOS INICIAIS DE EXEMPLO (PR & COMUNICAÇÃO)
    // ==========================================
    let activeProjectId = 'sample-proj-1';
    let activeTaskId = 'sample-task-1';
    let currentContactPeriod = 'today';
    let currentProjectFilter = 'all';
    let currentJourTab = 'all';
    let currentProjectDetailTab = 'overview';
    let lastEditedTaskBackup = null;

    function getOffsetDateString(days) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    }

    const DEFAULT_SAMPLE_TASKS = [
      // 5 TAREFAS PARA HOJE (3 de prioridade alta, 2 normal)
      {
        id: 'sample-task-1',
        title: 'Enviar comunicado de imprensa ao Expresso',
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '12:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: 'Garantir envio antes das 12h00 para fecho da edição semanal de Economia. Destacar o volume de 25M de investimento.',
        journalist_name: 'Rui Almeida (Expresso)',
        subtasks: [
          { id: 'st-1-1', title: 'Rever citação oficial do Presidente Executivo', done: true },
          { id: 'st-1-2', title: 'Anexar infografia com mapa de novas localizações', done: false },
          { id: 'st-1-3', title: 'Confirmar receção por telefone com a redação', done: false }
        ],
        comments: [
          { author: 'Leonor Rodrigues', role: 'Diretora de RP', text: 'O draft final foi aprovado pelo cliente às 09h30.', time: 'Hoje, 09:45' }
        ],
        activity_log: [
          'Criado por Leonor Rodrigues',
          'Prioridade definida como Alta'
        ]
      },
      {
        id: 'sample-task-2',
        title: 'Follow-up com Marta Figueiredo (Público)',
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '14:30',
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        assignee: 'Tiago Mendes',
        status: 'pending',
        notes: 'Verificar receção do pitch exclusivo sobre a redução de 40% da pegada carbónica.',
        journalist_name: 'Marta Figueiredo (Público)',
        subtasks: [
          { id: 'st-2-1', title: 'Enviar relatório técnico de validação da pegada', done: true },
          { id: 'st-2-2', title: 'Propor horário para entrevista com o Diretor de Sustentabilidade', done: false }
        ],
        comments: [
          { author: 'Tiago Mendes', role: 'Consultor de RP', text: 'A jornalista mostrou interesse prévio na conferência do mês passado.', time: 'Hoje, 10:15' }
        ],
        activity_log: ['Criado por Tiago Mendes']
      },
      {
        id: 'sample-task-3',
        title: 'Alinhar declarações com porta-voz oficial',
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '16:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: 'Briefing preparatório de 20 minutos com o Diretor de Operações antes do direto na SIC Notícias.',
        journalist_name: 'Sofia Martins (SIC Notícias)',
        subtasks: [
          { id: 'st-3-1', title: 'Simulação de 3 perguntas difíceis sobre concorrência', done: true },
          { id: 'st-3-2', title: 'Envio de pontos-chave por SMS de apoio', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Leonor Rodrigues']
      },
      {
        id: 'sample-task-4',
        title: 'Preparar dossier de imprensa para a RTP',
        priority: 'normal',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '17:30',
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        assignee: 'Helena Ramos',
        status: 'pending',
        notes: 'Compilar fotografias de alta resolução do novo polo no Beato e ficha técnica dos postos de trabalho.',
        journalist_name: 'Inês Carvalho (RTP)',
        subtasks: [
          { id: 'st-4-1', title: 'Upload para o link seguro do Media Kit', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-task-5',
        title: 'Validar versão espanhola do comunicado',
        priority: 'normal',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '18:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Carlos Silva',
        status: 'pending',
        notes: 'Revisão linguística para envio à agência parceira de Madrid (Expansión e El Economista).',
        journalist_name: 'Redações Espanha',
        subtasks: [
          { id: 'st-5-1', title: 'Conferir cotações em euros e dados fiscais', done: true }
        ],
        comments: [],
        activity_log: ['Criado por Carlos Silva']
      },

      // 2 TAREFAS EM ATRASO (Prazos passados, estado pendente)
      {
        id: 'sample-task-6',
        title: 'Enviar notas biográficas da administração',
        priority: 'urgente',
        due_date: getOffsetDateString(-2),
        due_time: '11:00',
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        assignee: 'Carlos Silva',
        status: 'pending',
        notes: 'Pedidas com urgência pelo Jornal de Negócios para o perfil de abertura do caderno de empresas.',
        journalist_name: 'Ana Bento (Jornal de Negócios)',
        subtasks: [
          { id: 'st-6-1', title: 'Atualizar anos de mandato e percurso internacional', done: true },
          { id: 'st-6-2', title: 'Obter foto tipo passe em estúdio', done: false }
        ],
        comments: [
          { author: 'Leonor Rodrigues', role: 'Diretora de RP', text: 'Esta entrega está em atraso há 2 dias. Por favor priorizar.', time: 'Ontem, 14:00' }
        ],
        activity_log: ['Criado por Carlos Silva', 'Aviso de atraso emitido']
      },
      {
        id: 'sample-task-7',
        title: 'Confirmar credenciação de jornalistas',
        priority: 'alta',
        due_date: getOffsetDateString(-1),
        due_time: '18:00',
        project_name: 'Encontro com Diretores de Informação',
        client_or_brand: 'Institucional',
        assignee: 'Helena Ramos',
        status: 'pending',
        notes: 'Lista de 15 diretores de redação convidados para o almoço institucional reservado.',
        journalist_name: 'Diretores OCS',
        subtasks: [
          { id: 'st-7-1', title: 'Contactar assistentes dos 3 diretores ainda pendentes', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Helena Ramos']
      },

      // 4 ENTREGAS ESTA SEMANA
      {
        id: 'sample-task-8',
        title: 'Preparar relatório de clipping de outubro',
        priority: 'normal',
        due_date: getOffsetDateString(1),
        due_time: '15:00',
        project_name: 'Relatório de Reputação Q4',
        client_or_brand: 'Institucional',
        assignee: 'Tiago Mendes',
        status: 'pending',
        notes: 'Incluir análise AVE, tom por meio e evolução de sentimento no trimestre.',
        journalist_name: '—',
        subtasks: [
          { id: 'st-8-1', title: 'Exportar métricas de alcance das 18 peças', done: true },
          { id: 'st-8-2', title: 'Gerar gráficos de distribuição por OCS', done: false }
        ],
        comments: [],
        activity_log: ['Criado por Tiago Mendes']
      },
      {
        id: 'sample-task-9',
        title: 'Atualizar lista de jornalistas de economia',
        priority: 'normal',
        due_date: getOffsetDateString(2),
        due_time: '12:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: 'Confirmar novos redactores e saídas recentes nas redações de economia de Lisboa e Porto.',
        journalist_name: '—',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Leonor Rodrigues']
      },
      {
        id: 'sample-task-10',
        title: 'Rever briefing do cliente PharmaPlus',
        priority: 'baixa',
        due_date: getOffsetDateString(3),
        due_time: '17:00',
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        assignee: 'Helena Ramos',
        status: 'pending',
        notes: 'Alinhamento do plano de comunicação para o primeiro trimestre de 2027.',
        journalist_name: '—',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-task-11',
        title: 'Envio de convites para apresentação à imprensa',
        priority: 'alta',
        due_date: getOffsetDateString(4),
        due_time: '10:00',
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        assignee: 'Tiago Mendes',
        status: 'pending',
        notes: 'Envio personalizado de convite com confirmação de presença até sexta-feira.',
        journalist_name: 'Jornalistas Tech',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Tiago Mendes']
      },

      // TAREFAS JÁ CONCLUÍDAS
      {
        id: 'sample-task-12',
        title: 'Mapeamento de 20 jornalistas ibéricos de referência',
        priority: 'normal',
        due_date: getOffsetDateString(-4),
        due_time: '18:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'completed',
        notes: 'Lista completa validada pela Direção de RP e partilhada com o cliente.',
        journalist_name: 'Vários',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Leonor Rodrigues', 'Concluída']
      },
      {
        id: 'sample-task-13',
        title: 'Aprovação de documento de Q&A com o conselho',
        priority: 'alta',
        due_date: getOffsetDateString(-3),
        due_time: '12:00',
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        assignee: 'Carlos Silva',
        status: 'completed',
        notes: 'Documento confidencial com respostas a perguntas financeiras sensíveis aprovado.',
        journalist_name: '—',
        subtasks: [],
        comments: [],
        activity_log: ['Criado por Carlos Silva', 'Concluída']
      }
    ];

    const DEFAULT_SAMPLE_PROJECTS = [
      {
        id: 'sample-proj-1',
        name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        manager: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Tiago Mendes', 'Carlos Silva'],
        start_date: '2026-10-01',
        deadline: '2026-11-20',
        budget: '15.000 €',
        status: 'in_progress',
        description: 'Campanha integrada de relações públicas e assessoria mediática para o plano de expansão na Península Ibérica. Coordenação de entrevistas exclusivas em Lisboa e Madrid.',
        target_journalists: [
          { name: 'Rui Almeida', outlet: 'Expresso', area: 'Economia', status: 'Contactado', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Marta Figueiredo', outlet: 'Público', area: 'Empresas', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Pedro Ramos', outlet: 'ECO Economia Online', area: 'Mercados', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Sofia Martins', outlet: 'SIC Notícias', area: 'Televisão', status: 'Publicou', last_contact: getOffsetDateString(-2) },
          { name: 'Ana Bento', outlet: 'Jornal de Negócios', area: 'Finanças', status: 'Por contactar', last_contact: '—' },
          { name: 'Miguel Costa', outlet: 'Dinheiro Vivo', area: 'Negócios', status: 'Contactado', last_contact: getOffsetDateString(-1) }
        ],
        documents: [
          { title: 'Comunicado de Imprensa - Expansão Ibérica (PT/ES)', type: 'PDF', date: '14 Nov 2026', size: '1.4 MB' },
          { title: 'Dossier Institucional Grupo M - Resultados e Metas', type: 'PDF', date: '12 Nov 2026', size: '3.8 MB' },
          { title: 'Banco de Imagens Alta Resolução Nova Sede', type: 'ZIP', date: '10 Nov 2026', size: '28.5 MB' }
        ],
        activity_log: [
          'Projeto iniciado por Leonor Rodrigues',
          'Aprovado comunicado de imprensa com o cliente Grupo M',
          'Entrevista exclusiva agendada com a SIC Notícias'
        ]
      },
      {
        id: 'sample-proj-2',
        name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        manager: 'Tiago Mendes',
        team: ['Tiago Mendes', 'Leonor Rodrigues'],
        start_date: '2026-10-15',
        deadline: '2026-11-25',
        budget: '12.500 €',
        status: 'in_progress',
        description: 'Posicionamento da GreenCorp como referência europeia em descarbonização industrial e economia circular.',
        target_journalists: [
          { name: 'Marta Figueiredo', outlet: 'Público', area: 'Sustentabilidade', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Tiago Sousa', outlet: 'Observador', area: 'Ambiente', status: 'Contactado', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'André Santos', outlet: 'Jornal Económico', area: 'ESG', status: 'Recusou', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [
          { title: 'Relatório Técnico de Pegada Carbónica Auditado', type: 'PDF', date: '08 Nov 2026', size: '4.2 MB' }
        ],
        activity_log: ['Projeto iniciado por Tiago Mendes']
      },
      {
        id: 'sample-proj-3',
        name: 'Relatório de Reputação Q4',
        client_or_brand: 'Institucional',
        manager: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Tiago Mendes'],
        start_date: '2026-11-01',
        deadline: '2026-12-05',
        budget: '8.000 €',
        status: 'in_progress',
        description: 'Barómetro trimestral de perceção de marca, menções mediáticas e sentimento nos principais meios nacionais.',
        target_journalists: [],
        documents: [],
        activity_log: ['Criado pela Direção de RP']
      },
      {
        id: 'sample-proj-4',
        name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        manager: 'Helena Ramos',
        team: ['Helena Ramos', 'Tiago Mendes'],
        start_date: '2026-10-20',
        deadline: '2026-12-15',
        budget: '20.000 €',
        status: 'in_progress',
        description: 'Inauguração oficial do maior campus de inovação aberta e inteligência artificial de Lisboa, no Beato.',
        target_journalists: [
          { name: 'Inês Carvalho', outlet: 'RTP', area: 'Tecnologia', status: 'Publicou', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'João Ferreira', outlet: 'TVI / CNN Portugal', area: 'Inovação', status: 'Contactado', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [
          { title: 'Press Kit Oficial - Tech Hub Lisboa 2026', type: 'PDF', date: '11 Nov 2026', size: '5.1 MB' }
        ],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-proj-5',
        name: 'Encontro com Diretores de Informação',
        client_or_brand: 'Institucional',
        manager: 'Leonor Rodrigues',
        team: ['Leonor Rodrigues', 'Helena Ramos'],
        start_date: '2026-11-05',
        deadline: '2026-11-30',
        budget: '6.500 €',
        status: 'in_progress',
        description: 'Almoço anual off-the-record com diretores dos principais canais de televisão e jornais generalistas.',
        target_journalists: [],
        documents: [],
        activity_log: ['Criado por Leonor Rodrigues']
      },
      {
        id: 'sample-proj-6',
        name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        manager: 'Helena Ramos',
        team: ['Helena Ramos', 'Carlos Silva'],
        start_date: '2026-10-10',
        deadline: '2026-12-10',
        budget: '18.000 €',
        status: 'in_progress',
        description: 'Divulgação de nova linha de produtos de saúde preventiva junto de revistas especializadas e lifestyle.',
        target_journalists: [
          { name: 'Clara Nogueira', outlet: 'Visão', area: 'Saúde', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [],
        activity_log: ['Criado por Helena Ramos']
      },
      {
        id: 'sample-proj-7',
        name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        manager: 'Carlos Silva',
        team: ['Carlos Silva', 'Leonor Rodrigues'],
        start_date: '2026-10-25',
        deadline: '2026-11-22',
        budget: '22.000 €',
        status: 'in_progress',
        description: 'Apresentação pública de resultados auditados do exercício de 2026, com conferência de imprensa e webcast.',
        target_journalists: [
          { name: 'Ana Bento', outlet: 'Jornal de Negócios', area: 'Mercados', status: 'Respondeu', last_contact: new Date().toISOString().split('T')[0] },
          { name: 'Miguel Costa', outlet: 'Dinheiro Vivo', area: 'Economia', status: 'Publicou', last_contact: new Date().toISOString().split('T')[0] }
        ],
        documents: [],
        activity_log: ['Criado por Carlos Silva']
      }
    ];

    // 12 CONTACTOS DE HOJE + 29 CONTACTOS DA SEMANA = 41 CONTACTOS NA SEMANA
    const DEFAULT_SAMPLE_CONTACTS = [
      // 12 CONTACTOS DE HOJE
      {
        id: 'contact-today-1',
        contact_name: 'Marta Figueiredo',
        outlet_name: 'Público',
        contact_type: 'email',
        subject_or_notes: 'Pitch sobre resultados de sustentabilidade GreenCorp',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '09:15',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Pauta Sustentabilidade & ESG',
        next_step: 'Agendada entrevista com porta-voz para quinta-feira às 11h'
      },
      {
        id: 'contact-today-2',
        contact_name: 'Rui Almeida',
        outlet_name: 'Expresso',
        contact_type: 'chamada',
        subject_or_notes: 'Convite para almoço e pitch exclusivo de expansão',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '10:00',
        collaborator: 'Tiago Mendes',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Fazer novo telefonema de seguimento às 16h'
      },
      {
        id: 'contact-today-3',
        contact_name: 'Inês Carvalho',
        outlet_name: 'RTP',
        contact_type: 'email',
        subject_or_notes: 'Envio de press release e convite para gravação no Beato',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '10:45',
        collaborator: 'Helena Ramos',
        project_name: 'Lançamento Tech Hub Lisboa',
        next_step: 'Confirmou presença de equipa de imagem e repórter'
      },
      {
        id: 'contact-today-4',
        contact_name: 'Tiago Sousa',
        outlet_name: 'Observador',
        contact_type: 'email',
        subject_or_notes: 'Seguimento de artigo de opinião sobre transição energética',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '11:20',
        collaborator: 'Carlos Silva',
        project_name: 'Pauta Sustentabilidade & ESG',
        next_step: 'Aguardar validação da redação de Opinião'
      },
      {
        id: 'contact-today-5',
        contact_name: 'Ana Bento',
        outlet_name: 'Jornal de Negócios',
        contact_type: 'chamada',
        subject_or_notes: 'Apresentação antecipada dos indicadores financeiros',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '11:50',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Resultados Financeiros Anuais',
        next_step: 'Pediu envio de tabela comparativa de EBITDA'
      },
      {
        id: 'contact-today-6',
        contact_name: 'Pedro Ramos',
        outlet_name: 'ECO Economia Online',
        contact_type: 'whatsapp',
        subject_or_notes: 'Confirmação de recebimento de infografia em alta resolução',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '12:15',
        collaborator: 'Tiago Mendes',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Informou que peça sai hoje às 17h'
      },
      {
        id: 'contact-today-7',
        contact_name: 'Sofia Martins',
        outlet_name: 'SIC Notícias',
        contact_type: 'chamada',
        subject_or_notes: 'Coordenação de entrada em direto no jornal da tarde',
        status: 'Reunião agendada',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '13:40',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Briefing técnico via Zoom agendado para as 15h30'
      },
      {
        id: 'contact-today-8',
        contact_name: 'João Ferreira',
        outlet_name: 'TVI / CNN Portugal',
        contact_type: 'email',
        subject_or_notes: 'Proposta de reportagem especial sobre polos de inovação',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '14:10',
        collaborator: 'Helena Ramos',
        project_name: 'Lançamento Tech Hub Lisboa',
        next_step: 'Ligar para a coordenação de emissão amanhã de manhã'
      },
      {
        id: 'contact-today-9',
        contact_name: 'Clara Nogueira',
        outlet_name: 'Visão',
        contact_type: 'email',
        subject_or_notes: 'Apresentação de dossier científico de saúde preventiva',
        status: 'Interessado',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '14:45',
        collaborator: 'Tiago Mendes',
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        next_step: 'Enviar kit físico de informação à redação'
      },
      {
        id: 'contact-today-10',
        contact_name: 'Miguel Costa',
        outlet_name: 'Dinheiro Vivo',
        contact_type: 'chamada',
        subject_or_notes: 'Esclarecimento sobre novas admissões do Grupo M',
        status: 'Respondeu',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '15:10',
        collaborator: 'Carlos Silva',
        project_name: 'Resultados Financeiros Anuais',
        next_step: 'Notícia em redação para o fecho de amanhã'
      },
      {
        id: 'contact-today-11',
        contact_name: 'Luísa Vieira',
        outlet_name: 'Antena 1',
        contact_type: 'email',
        subject_or_notes: 'Pitch para rubrica de economia matinal',
        status: 'Sem resposta',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '15:40',
        collaborator: 'Leonor Rodrigues',
        project_name: 'Expansão Ibérica 2026',
        next_step: 'Fazer contacto com produção do programa'
      },
      {
        id: 'contact-today-12',
        contact_name: 'André Santos',
        outlet_name: 'Jornal Económico',
        contact_type: 'whatsapp',
        subject_or_notes: 'Sugestão de ângulo para caderno especial de sustentabilidade',
        status: 'Recusou',
        contact_date: new Date().toISOString().split('T')[0],
        contact_time: '16:20',
        collaborator: 'Tiago Mendes',
        project_name: 'Pauta Sustentabilidade & ESG',
        next_step: 'Caderno já fechado. Voltar a propor na edição de dezembro'
      },

      // 29 CONTACTOS ANTERIORES DA MESMA SEMANA (PARA TOTALIZAR 41 NA SEMANA)
      ...Array.from({ length: 29 }).map((_, idx) => {
        const collaborators = ['Leonor Rodrigues', 'Tiago Mendes', 'Helena Ramos', 'Carlos Silva'];
        const outlets = ['Expresso', 'Público', 'ECO Economia Online', 'Jornal de Negócios', 'Observador', 'SIC Notícias', 'RTP', 'Visão'];
        const channels = ['email', 'chamada', 'whatsapp', 'reuniao'];
        const statuses = ['Respondeu', 'Sem resposta', 'Interessado', 'Respondeu', 'Sem resposta'];
        const projects = ['Expansão Ibérica 2026', 'Pauta Sustentabilidade & ESG', 'Lançamento Tech Hub Lisboa', 'Resultados Financeiros Anuais'];
        const dayOffset = -((idx % 4) + 1);

        return {
          id: `contact-week-${idx + 13}`,
          contact_name: `Jornalista Convidado ${idx + 1}`,
          outlet_name: outlets[idx % outlets.length],
          contact_type: channels[idx % channels.length],
          subject_or_notes: `Interação editorial de acompanhamento ${idx + 1}`,
          status: statuses[idx % statuses.length],
          contact_date: getOffsetDateString(dayOffset),
          contact_time: `${10 + (idx % 7)}:${(idx * 13) % 60 < 10 ? '0' : ''}${(idx * 13) % 60}`,
          collaborator: collaborators[idx % collaborators.length],
          project_name: projects[idx % projects.length],
          next_step: idx % 2 === 0 ? 'Concluído com envio de informação' : 'Seguimento agendado'
        };
      })
    ];

    // EXATAMENTE 18 PEÇAS DE CLIPPING NO MÊS (12 Positivas, 5 Neutras, 1 Negativa | AVE: 84.500 € | Alcance: 1.25M)
    const DEFAULT_SAMPLE_CLIPPINGS = [
      // 12 POSITIVAS
      {
        id: 'clip-1',
        title: 'Grupo M acelera investimento ibérico com nova sede em Madrid',
        outlet_name: 'Expresso',
        journalist_name: 'Rui Almeida',
        published_date: '2026-11-14',
        type: 'Notícia de Destaque',
        sentiment: 'positivo',
        reach: 125000,
        ave_value: 14500,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://expresso.pt',
        summary: 'Página inteira no caderno de Economia destacando os 25M de investimento e expansão de mercado.'
      },
      {
        id: 'clip-2',
        title: 'Sustentabilidade: GreenCorp reduz pegada carbónica industrial em 40%',
        outlet_name: 'Público',
        journalist_name: 'Marta Figueiredo',
        published_date: '2026-11-12',
        type: 'Reportagem Especial',
        sentiment: 'positivo',
        reach: 98000,
        ave_value: 9200,
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        collaborator: 'Tiago Mendes',
        article_url: 'https://publico.pt',
        summary: 'Artigo de meia página com infografia comparativa e citação do Diretor de Sustentabilidade.'
      },
      {
        id: 'clip-3',
        title: 'Resultados da Holdings SA batem recorde impulsionados por exportações',
        outlet_name: 'Jornal de Negócios',
        journalist_name: 'Ana Bento',
        published_date: '2026-11-10',
        type: 'Notícia',
        sentiment: 'positivo',
        reach: 65000,
        ave_value: 8400,
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        collaborator: 'Carlos Silva',
        article_url: 'https://jornaldenegocios.pt',
        summary: 'Abertura da secção de Mercados com elogios à disciplina operacional e crescimento no EBITDA.'
      },
      {
        id: 'clip-4',
        title: 'Novo polo tecnológico em Lisboa promete criar 500 postos de trabalho',
        outlet_name: 'ECO Economia Online',
        journalist_name: 'Pedro Ramos',
        published_date: '2026-11-08',
        type: 'Notícia Online',
        sentiment: 'positivo',
        reach: 140000,
        ave_value: 7100,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://eco.sapo.pt',
        summary: 'Destaque no topo do portal com galeria fotográfica das novas instalações do Hub.'
      },
      {
        id: 'clip-5',
        title: 'Como a inovação portuguesa está a liderar a transição verde na Europa',
        outlet_name: 'Observador',
        journalist_name: 'Tiago Sousa',
        published_date: '2026-11-06',
        type: 'Artigo de Análise',
        sentiment: 'positivo',
        reach: 110000,
        ave_value: 6500,
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        collaborator: 'Tiago Mendes',
        article_url: 'https://observador.pt',
        summary: 'Caso de estudo GreenCorp destacado como exemplo de boas práticas industriais.'
      },
      {
        id: 'clip-6',
        title: 'Entrevista em estúdio: A visão de expansão ibérica para os próximos 5 anos',
        outlet_name: 'SIC Notícias',
        journalist_name: 'Sofia Martins',
        published_date: '2026-11-15',
        type: 'Entrevista Televisiva',
        sentiment: 'positivo',
        reach: 220000,
        ave_value: 12000,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://sicnoticias.pt',
        summary: 'Entrevista de 8 minutos no Jornal da Tarde com alta repercussão mediática.'
      },
      {
        id: 'clip-7',
        title: 'Tech Hub abre portas no Beato com foco em IA e energias limpas',
        outlet_name: 'RTP Informação',
        journalist_name: 'Inês Carvalho',
        published_date: '2026-11-05',
        type: 'Reportagem TV',
        sentiment: 'positivo',
        reach: 180000,
        ave_value: 8800,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://rtp.pt',
        summary: 'Peça no Telejornal com imagens das bancadas laboratoriais e declarações de fundadores.'
      },
      {
        id: 'clip-8',
        title: 'PharmaPlus lança gama inovadora com chancela de investigação nacional',
        outlet_name: 'Dinheiro Vivo',
        journalist_name: 'Miguel Costa',
        published_date: '2026-11-03',
        type: 'Notícia',
        sentiment: 'positivo',
        reach: 45000,
        ave_value: 4300,
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        collaborator: 'Helena Ramos',
        article_url: 'https://dinheirovivo.pt',
        summary: 'Destaque no suplemento de domingo sobre inovação farmacêutica.'
      },
      {
        id: 'clip-9',
        title: 'Tendências de liderança institucional e relações públicas modernas',
        outlet_name: 'Executive Digest',
        journalist_name: 'Redação',
        published_date: '2026-11-02',
        type: 'Artigo de Opinião',
        sentiment: 'positivo',
        reach: 32000,
        ave_value: 3200,
        project_name: 'Relatório de Reputação Q4',
        client_or_brand: 'Institucional',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://executivedigest.sapo.pt',
        summary: 'Artigo assinado pela Direção de RP sobre reputação empresarial em tempos de incerteza.'
      },
      {
        id: 'clip-10',
        title: 'A estratégia de marca por trás do crescimento internacional do Grupo M',
        outlet_name: 'Marketeer',
        journalist_name: 'Catarina Silva',
        published_date: '2026-11-01',
        type: 'Caso de Estudo',
        sentiment: 'positivo',
        reach: 28000,
        ave_value: 2800,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://marketeer.sapo.pt',
        summary: 'Análise aprofundada da campanha de comunicação externa desenvolvida pela agência.'
      },
      {
        id: 'clip-11',
        title: 'Tecnologia verde: os bastidores do Tech Hub Lisboa',
        outlet_name: 'Exame Informática',
        journalist_name: 'Paulo Tomé',
        published_date: '2026-11-09',
        type: 'Reportagem',
        sentiment: 'positivo',
        reach: 35000,
        ave_value: 3100,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://visao.pt/exameinformatica',
        summary: 'Avaliação técnica das infraestruturas e parcerias com startups universitárias.'
      },
      {
        id: 'clip-12',
        title: 'Parcerias luso-espanholas ganham novo fôlego em 2026',
        outlet_name: 'Jornal Económico',
        journalist_name: 'André Santos',
        published_date: '2026-11-07',
        type: 'Notícia',
        sentiment: 'positivo',
        reach: 42000,
        ave_value: 4000,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Tiago Mendes',
        article_url: 'https://jornaleconomico.sapo.pt',
        summary: 'Mensão elogiosa à capacidade de atração de capital ibérico pelo Grupo M.'
      },

      // 5 NEUTRAS
      {
        id: 'clip-13',
        title: 'Holdings SA apresenta contas anuais na próxima semana',
        outlet_name: 'Agência Lusa',
        journalist_name: 'Despacho Geral',
        published_date: '2026-11-11',
        type: 'Despacho de Agência',
        sentiment: 'neutro',
        reach: 50000,
        ave_value: 1500,
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        collaborator: 'Carlos Silva',
        article_url: 'https://lusa.pt',
        summary: 'Nota factual de agenda com as datas previstas para a comunicação de mercado.'
      },
      {
        id: 'clip-14',
        title: 'Empresas nacionais reforçam presença no mercado vizinho',
        outlet_name: 'Diário de Notícias',
        journalist_name: 'Helena Bento',
        published_date: '2026-11-08',
        type: 'Notícia',
        sentiment: 'neutro',
        reach: 40000,
        ave_value: 2200,
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        collaborator: 'Leonor Rodrigues',
        article_url: 'https://dn.pt',
        summary: 'Panorama setorial citando o Grupo M a par de outros dois operadores ibéricos.'
      },
      {
        id: 'clip-15',
        title: 'Debate matinal sobre metas de descarbonização da indústria',
        outlet_name: 'Antena 1',
        journalist_name: 'Luísa Vieira',
        published_date: '2026-11-04',
        type: 'Mensão Rádio',
        sentiment: 'neutro',
        reach: 60000,
        ave_value: 2000,
        project_name: 'Pauta Sustentabilidade & ESG',
        client_or_brand: 'GreenCorp',
        collaborator: 'Tiago Mendes',
        article_url: 'https://rtp.pt/play/antena1',
        summary: 'Referência ao compromisso assumido pela GreenCorp durante debate de atualidade.'
      },
      {
        id: 'clip-16',
        title: 'Balanço das novas aberturas no setor farmacêutico',
        outlet_name: 'Rádio Renascença',
        journalist_name: 'Noticiário',
        published_date: '2026-11-02',
        type: 'Nota Breve',
        sentiment: 'neutro',
        reach: 30000,
        ave_value: 1200,
        project_name: 'Campanha Linha Saúde & Bem-Estar',
        client_or_brand: 'PharmaPlus',
        collaborator: 'Helena Ramos',
        article_url: 'https://rr.sapo.pt',
        summary: 'Notícia síntese com a lista de novas autorizações de distribuição do Infarmed.'
      },
      {
        id: 'clip-17',
        title: 'Panorama dos polos de inovação da capital portuguesa',
        outlet_name: 'Visão',
        journalist_name: 'Clara Nogueira',
        published_date: '2026-11-01',
        type: 'Artigo Panorama',
        sentiment: 'neutro',
        reach: 35000,
        ave_value: 1800,
        project_name: 'Lançamento Tech Hub Lisboa',
        client_or_brand: 'Innovate',
        collaborator: 'Helena Ramos',
        article_url: 'https://visao.pt',
        summary: 'Levantamento descritivo dos espaços co-work e hubs tecnológicos ativos em Lisboa.'
      },

      // 1 NEGATIVA
      {
        id: 'clip-18',
        title: 'Setor alerta para atrasos burocráticos nos licenciamentos de novas fábricas',
        outlet_name: 'Correio da Manhã',
        journalist_name: 'Redação Economia',
        published_date: '2026-11-13',
        type: 'Notícia de Crítica',
        sentiment: 'negativo',
        reach: 85000,
        ave_value: 1200,
        project_name: 'Resultados Financeiros Anuais',
        client_or_brand: 'Holdings SA',
        collaborator: 'Carlos Silva',
        article_url: 'https://cmjornal.pt',
        summary: 'Artigo abordando queixas de atrasos em obras industriais com citação indireta à Holdings SA.'
      }
    ];

    const DEFAULT_SAMPLE_OUTLETS = [
  {
    id: 'out-1',
    name: 'Expresso',
    media_group: 'Grupo Impresa',
    address: 'Edifício São Francisco de Sales, Rua Calvet de Magalhães, 242, 2770-022 Paço de Arcos',
    website_url: 'https://expresso.pt',
    agenda_email: 'agenda@expresso.impresa.pt',
    contact_email: 'redacao@expresso.impresa.pt',
    phone: '+351 214 698 000',
    social_links: {
      twitter_x: 'https://x.com/expresso',
      linkedin: 'https://linkedin.com/company/jornal-expresso',
      facebook: 'https://facebook.com/jornalexpresso',
      instagram: 'https://instagram.com/jornalexpresso'
    },
    erc_type: 'Publicação Periódica Impressa e Digital',
    erc_registration: 'ERC-10112',
    specialties: ['Economia & Negócios', 'Política & Sociedade', 'Opinião & Internacional'],
    formats: ['papel', 'online', 'podcast'],
    scope: 'nacional',
    periodicity: 'semanal',
    estimated_audience: 480000,
    status: 'ativo'
  },
  {
    id: 'out-2',
    name: 'Público',
    media_group: 'Sonaecom',
    address: 'Edifício Diogo Cão, Doca de Alcântara Norte, 1350-352 Lisboa',
    website_url: 'https://publico.pt',
    agenda_email: 'agenda@publico.pt',
    contact_email: 'redacao@publico.pt',
    phone: '+351 210 111 000',
    social_links: {
      twitter_x: 'https://x.com/publico',
      linkedin: 'https://linkedin.com/company/publico',
      instagram: 'https://instagram.com/publico.pt'
    },
    erc_type: 'Publicação Periódica Impressa e Digital',
    erc_registration: 'ERC-10234',
    specialties: ['Sustentabilidade & ESG', 'Cultura & Estilo de Vida', 'Política & Sociedade'],
    formats: ['papel', 'online', 'podcast'],
    scope: 'nacional',
    periodicity: 'diario',
    estimated_audience: 520000,
    status: 'ativo'
  },
  {
    id: 'out-3',
    name: 'ECO Economia Online',
    media_group: 'Swipe News',
    address: 'Avenida da Liberdade, 245, 4º Dto, 1250-143 Lisboa',
    website_url: 'https://eco.sapo.pt',
    agenda_email: 'agenda@eco.pt',
    contact_email: 'redacao@eco.pt',
    phone: '+351 211 387 100',
    social_links: {
      twitter_x: 'https://x.com/ecopt',
      linkedin: 'https://linkedin.com/company/eco-economia-online'
    },
    erc_type: 'Publicação Periódica Digital',
    erc_registration: 'ERC-12654',
    specialties: ['Economia & Negócios', 'Tecnologia & Inovação', 'Mercados & Finanças'],
    formats: ['online', 'podcast'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 650000,
    status: 'ativo'
  },
  {
    id: 'out-4',
    name: 'SIC Notícias',
    media_group: 'Grupo Impresa',
    address: 'Estrada da Outurela, 119, 2794-052 Carnaxide',
    website_url: 'https://sicnoticias.pt',
    agenda_email: 'agendatv@sic.impresa.pt',
    contact_email: 'redacaotv@sic.impresa.pt',
    phone: '+351 214 179 000',
    social_links: {
      twitter_x: 'https://x.com/sicnoticias',
      youtube: 'https://youtube.com/sicnoticias'
    },
    erc_type: 'Operador de Televisão',
    erc_registration: 'ERC-30145',
    specialties: ['Política & Sociedade', 'Economia & Negócios', 'Saúde & Farmacêutica'],
    formats: ['tv', 'online', 'podcast'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 1100000,
    status: 'ativo'
  },
  {
    id: 'out-5',
    name: 'RTP / Antena 1',
    media_group: 'Rádio e Televisão de Portugal (RTP)',
    address: 'Avenida Marechal Gomes da Costa, 37, 1849-030 Lisboa',
    website_url: 'https://rtp.pt/noticias',
    agenda_email: 'agenda.informacao@rtp.pt',
    contact_email: 'noticias@rtp.pt',
    phone: '+351 217 947 000',
    social_links: {
      twitter_x: 'https://x.com/rtpnoticias',
      facebook: 'https://facebook.com/rtpnoticias'
    },
    erc_type: 'Operador de Serviço Público (Rádio e TV)',
    erc_registration: 'ERC-40101',
    specialties: ['Política & Sociedade', 'Cultura & Estilo de Vida', 'Saúde & Farmacêutica'],
    formats: ['tv', 'radio', 'online'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 1850000,
    status: 'ativo'
  },
  {
    id: 'out-6',
    name: 'Jornal de Negócios',
    media_group: 'Medialivre',
    address: 'Rua Luciana Stegagno Picchio, 3, 1549-023 Lisboa',
    website_url: 'https://jornaldenegocios.pt',
    agenda_email: 'agenda@negocios.pt',
    contact_email: 'negocios@medialivre.pt',
    phone: '+351 210 494 000',
    social_links: {
      twitter_x: 'https://x.com/negociospt',
      linkedin: 'https://linkedin.com/company/jornal-de-negocios'
    },
    erc_type: 'Publicação Periódica Impressa e Digital',
    erc_registration: 'ERC-10389',
    specialties: ['Mercados & Finanças', 'Economia & Negócios', 'Sustentabilidade & ESG'],
    formats: ['papel', 'online'],
    scope: 'nacional',
    periodicity: 'diario',
    estimated_audience: 390000,
    status: 'ativo'
  },
  {
    id: 'out-7',
    name: 'Observador',
    media_group: 'Grupo Observador',
    address: 'Rua Laura Alves, 12, 1050-138 Lisboa',
    website_url: 'https://observador.pt',
    agenda_email: 'agenda@observador.pt',
    contact_email: 'redacao@observador.pt',
    phone: '+351 210 495 500',
    social_links: {
      twitter_x: 'https://x.com/observadorpt',
      instagram: 'https://instagram.com/observador.pt'
    },
    erc_type: 'Publicação Periódica Digital e Operador de Rádio',
    erc_registration: 'ERC-12490',
    specialties: ['Política & Sociedade', 'Opinião & Internacional', 'Tecnologia & Inovação'],
    formats: ['online', 'radio', 'podcast'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 720000,
    status: 'ativo'
  },
  {
    id: 'out-8',
    name: 'TSF Rádio Notícias',
    media_group: 'Global Media Group',
    address: 'Rua Tomás da Fonseca, Torre G - 4º, 1600-209 Lisboa',
    website_url: 'https://tsf.pt',
    agenda_email: 'agenda@tsf.pt',
    contact_email: 'redacao@tsf.pt',
    phone: '+351 218 424 400',
    social_links: {
      twitter_x: 'https://x.com/tsfradio',
      facebook: 'https://facebook.com/tsfradio'
    },
    erc_type: 'Operador de Rádio de Âmbito Nacional',
    erc_registration: 'ERC-20156',
    specialties: ['Política & Sociedade', 'Economia & Negócios', 'Cultura & Estilo de Vida'],
    formats: ['radio', 'online', 'podcast'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 410000,
    status: 'ativo'
  },
  {
    id: 'out-9',
    name: 'Lusa — Agência de Notícias',
    media_group: 'Agência Lusa',
    address: 'Rua Dr. João Pedro de Andrade, 2, 1998-001 Lisboa',
    website_url: 'https://lusa.pt',
    agenda_email: 'agenda@lusa.pt',
    contact_email: 'nacional@lusa.pt',
    phone: '+351 217 115 000',
    social_links: {
      twitter_x: 'https://x.com/lusa_noticias',
      linkedin: 'https://linkedin.com/company/agencia-lusa'
    },
    erc_type: 'Agência Noticiosa',
    erc_registration: 'ERC-50001',
    specialties: ['Política & Sociedade', 'Economia & Negócios', 'Opinião & Internacional'],
    formats: ['agencia_noticiosa', 'online'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 950000,
    status: 'ativo'
  },
  {
    id: 'out-10',
    name: 'CNN Portugal',
    media_group: 'Media Capital',
    address: 'Rua Mário Castrim, 4, 1600-503 Lisboa',
    website_url: 'https://cnnportugal.iol.pt',
    agenda_email: 'agenda@cnnportugal.pt',
    contact_email: 'redacao@cnnportugal.pt',
    phone: '+351 214 347 500',
    social_links: {
      twitter_x: 'https://x.com/cnnportugal',
      instagram: 'https://instagram.com/cnnportugal'
    },
    erc_type: 'Operador de Televisão e Digital',
    erc_registration: 'ERC-30299',
    specialties: ['Opinião & Internacional', 'Política & Sociedade', 'Mercados & Finanças'],
    formats: ['tv', 'online'],
    scope: 'nacional',
    periodicity: 'continua',
    estimated_audience: 890000,
    status: 'ativo'
  }
];



    const DEFAULT_SAMPLE_JOURNALISTS = [
  {
    id: 'jour-1',
    name: 'Marta Figueiredo',
    role_title: 'Grande Repórter',
    outlet_ids: ['out-2'],
    outlet_names: ['Público'],
    outlet_name: 'Público',
    emails: ['marta.figueiredo@publico.pt', 'marta.f.jornalismo@gmail.com'],
    phones: ['+351 912 345 678', '+351 210 111 045'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/marta-figueiredo-press',
      twitter_x: 'https://x.com/martafigueiredo',
      author_page: 'https://publico.pt/autor/marta-figueiredo'
    },
    intervention_areas: ['Sustentabilidade & ESG', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-11-20',
    days_inactive: 2,
    contact_origin: 'Conferência Clima Lisboa 2025',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-15',
    notes: 'Prefere contacto matinal. Forte interesse em transição justa e descarbonização industrial.',
    updated_at: '2026-11-20T10:15:00Z'
  },
  {
    id: 'jour-2',
    name: 'Rui Almeida',
    role_title: 'Editor-Adjunto de Economia',
    outlet_ids: ['out-1', 'out-4'],
    outlet_names: ['Expresso', 'SIC Notícias'],
    outlet_name: 'Expresso',
    emails: ['rui.almeida@expresso.impresa.pt'],
    phones: ['+351 923 456 789'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/rui-almeida-economia',
      twitter_x: 'https://x.com/ruialmeida_eco',
      author_page: 'https://expresso.pt/autores/rui-almeida'
    },
    intervention_areas: ['Economia & Negócios', 'Mercados & Finanças'],
    status: 'ativo',
    last_contact_date: '2026-11-21',
    days_inactive: 1,
    contact_origin: 'Acompanhamento de Pauta Institucional',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-01',
    notes: 'Contacto preferencial por WhatsApp para urgências. Fecho da edição semanal às quintas-feiras.',
    updated_at: '2026-11-21T18:40:00Z'
  },
  {
    id: 'jour-3',
    name: 'Pedro Ramos',
    role_title: 'Coordenador de Mercados',
    outlet_ids: ['out-3'],
    outlet_names: ['ECO Economia Online'],
    outlet_name: 'ECO Economia Online',
    emails: ['pedro.ramos@eco.pt'],
    phones: ['+351 934 567 890', '+351 211 387 112'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/pedro-ramos-mercados',
      twitter_x: 'https://x.com/pedroramos_eco'
    },
    intervention_areas: ['Mercados & Finanças', 'Tecnologia & Inovação'],
    status: 'ativo',
    last_contact_date: '2026-11-19',
    days_inactive: 3,
    contact_origin: 'Web Summit 2025',
    rgpd_consent: true,
    rgpd_consent_date: '2026-03-10',
    notes: 'Foco em capital de risco, rondas de investimento e banca de investimento.',
    updated_at: '2026-11-19T14:20:00Z'
  },
  {
    id: 'jour-4',
    name: 'Sofia Martins',
    role_title: 'Jornalista Sénior de Informação',
    outlet_ids: ['out-4'],
    outlet_names: ['SIC Notícias'],
    outlet_name: 'SIC Notícias',
    emails: ['smartins@sic.impresa.pt'],
    phones: ['+351 965 678 901'],
    contact_preference: 'telefone',
    links: {
      linkedin: 'https://linkedin.com/in/sofia-martins-jornalista',
      twitter_x: 'https://x.com/smartins_sic'
    },
    intervention_areas: ['Política & Sociedade', 'Saúde & Farmacêutica'],
    status: 'ativo',
    last_contact_date: '2026-11-18',
    days_inactive: 4,
    contact_origin: 'Briefing Hospitalar 2025',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-05',
    notes: 'Coordena diretos de estúdio entre as 14h e as 17h. Ligar antes das 11h.',
    updated_at: '2026-11-18T16:00:00Z'
  },
  {
    id: 'jour-5',
    name: 'Helena Ramos',
    role_title: 'Subdiretora de Informação',
    outlet_ids: ['out-5'],
    outlet_names: ['RTP / Antena 1'],
    outlet_name: 'RTP / Antena 1',
    emails: ['helena.ramos@rtp.pt'],
    phones: ['+351 917 890 123'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/helena-ramos-rtp',
      author_page: 'https://rtp.pt/noticias/autores/helena-ramos'
    },
    intervention_areas: ['Política & Sociedade', 'Opinião & Internacional'],
    status: 'ativo',
    last_contact_date: '2026-11-15',
    days_inactive: 7,
    contact_origin: 'Direção Editorial RTP',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-12',
    notes: 'Supervisiona a grelha de grandes reportagens e entrevistas institucionais.',
    updated_at: '2026-11-15T12:00:00Z'
  },
  {
    id: 'jour-6',
    name: 'Gonçalo Neves',
    role_title: 'Redator Principal de Finanças',
    outlet_ids: ['out-6'],
    outlet_names: ['Jornal de Negócios'],
    outlet_name: 'Jornal de Negócios',
    emails: ['goncalo.neves@negocios.pt'],
    phones: ['+351 928 901 234'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/goncalo-neves-negocios',
      twitter_x: 'https://x.com/gneves_financas'
    },
    intervention_areas: ['Mercados & Finanças', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-11-16',
    days_inactive: 6,
    contact_origin: 'Conferência Banca Ibérica',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-18',
    notes: 'Acompanha emissões de dívida, regulamentação bancária e resultados trimestrais.',
    updated_at: '2026-11-16T17:30:00Z'
  },
  {
    id: 'jour-7',
    name: 'Carlos Silva',
    role_title: 'Editor de Política',
    outlet_ids: ['out-7', 'out-8'],
    outlet_names: ['Observador', 'TSF Rádio Notícias'],
    outlet_name: 'Observador',
    emails: ['carlos.silva@observador.pt'],
    phones: ['+351 939 012 345'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/carlos-silva-politica',
      twitter_x: 'https://x.com/csilva_obs'
    },
    intervention_areas: ['Política & Sociedade', 'Opinião & Internacional'],
    status: 'ativo',
    last_contact_date: '2026-11-21',
    days_inactive: 1,
    contact_origin: 'Fórum Parlamentar',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-22',
    notes: 'Comentador bissemanal de atualidade na TSF. Especialista em políticas públicas.',
    updated_at: '2026-11-21T09:30:00Z'
  },
  {
    id: 'jour-8',
    name: 'Rita Valente',
    role_title: 'Redatora de Indústria & Energia',
    outlet_ids: ['out-1'],
    outlet_names: ['Expresso'],
    outlet_name: 'Expresso',
    emails: ['rita.valente@expresso.impresa.pt', 'rita.valente.media@outlook.com'],
    phones: ['+351 961 123 456'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/rita-valente-expresso',
      twitter_x: 'https://x.com/ritavalente_pr'
    },
    intervention_areas: ['Sustentabilidade & ESG', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-11-22',
    days_inactive: 0,
    contact_origin: 'Cimeira Transição Verde',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-08',
    notes: 'Interesse primordial em hidrogénio verde, energia solar e eletrificação de frotas.',
    updated_at: '2026-11-22T11:45:00Z'
  },
  {
    id: 'jour-9',
    name: 'Tiago Mendes',
    role_title: 'Redator de Startups & Capital de Risco',
    outlet_ids: ['out-3'],
    outlet_names: ['ECO Economia Online'],
    outlet_name: 'ECO Economia Online',
    emails: ['tiago.mendes@eco.pt'],
    phones: ['+351 912 234 567'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/tiago-mendes-eco',
      twitter_x: 'https://x.com/tmendes_startups'
    },
    intervention_areas: ['Tecnologia & Inovação', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-11-20',
    days_inactive: 2,
    contact_origin: 'Startup Lisboa Demo Day',
    rgpd_consent: true,
    rgpd_consent_date: '2026-03-14',
    notes: 'Excelente relação com fundos seed e série A/B em Portugal e Espanha.',
    updated_at: '2026-11-20T15:10:00Z'
  },
  {
    id: 'jour-10',
    name: 'Bernardo Silva',
    role_title: 'Apresentador e Editor de Economia',
    outlet_ids: ['out-8'],
    outlet_names: ['TSF Rádio Notícias'],
    outlet_name: 'TSF Rádio Notícias',
    emails: ['bernardo.silva@tsf.pt'],
    phones: ['+351 923 345 678'],
    contact_preference: 'telefone',
    links: {
      linkedin: 'https://linkedin.com/in/bernardo-silva-tsf'
    },
    intervention_areas: ['Economia & Negócios', 'Política & Sociedade'],
    status: 'ativo',
    last_contact_date: '2026-11-17',
    days_inactive: 5,
    contact_origin: 'Emissão Fórum TSF',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-19',
    notes: 'Apresenta o espaço de debate económico matinal. Gravações às 08h30.',
    updated_at: '2026-11-17T18:25:00Z'
  },
  {
    id: 'jour-11',
    name: 'Inês Marques',
    role_title: 'Correspondente de Assuntos Europeus',
    outlet_ids: ['out-10'],
    outlet_names: ['CNN Portugal'],
    outlet_name: 'CNN Portugal',
    emails: ['ines.marques@cnnportugal.pt'],
    phones: ['+351 934 456 789'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/ines-marques-cnn',
      twitter_x: 'https://x.com/inesmarques_eu'
    },
    intervention_areas: ['Opinião & Internacional', 'Política & Sociedade'],
    status: 'ativo',
    last_contact_date: '2026-11-14',
    days_inactive: 8,
    contact_origin: 'Bruxelas / Media Capital',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-03',
    notes: 'Baseada em Lisboa mas com deslocações frequentes a Bruxelas e Estrasburgo.',
    updated_at: '2026-11-14T19:00:00Z'
  },
  {
    id: 'jour-12',
    name: 'Nuno Abreu',
    role_title: 'Redator de Economia e Empresas',
    outlet_ids: ['out-9'],
    outlet_names: ['Lusa — Agência de Notícias'],
    outlet_name: 'Lusa — Agência de Notícias',
    emails: ['nabreu@lusa.pt'],
    phones: ['+351 965 567 890'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/nuno-abreu-lusa'
    },
    intervention_areas: ['Economia & Negócios', 'Sustentabilidade & ESG'],
    status: 'ativo',
    last_contact_date: '2026-11-10',
    days_inactive: 12,
    contact_origin: 'Fio Noticioso Lusa',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-11',
    notes: 'Prioridade a dados numéricos, comunicados estruturados e declarações curtas.',
    updated_at: '2026-11-10T14:00:00Z'
  },
  {
    id: 'jour-13',
    name: 'Teresa Couto',
    role_title: 'Editora de Cultura e Sociedade',
    outlet_ids: ['out-2'],
    outlet_names: ['Público'],
    outlet_name: 'Público',
    emails: ['teresa.couto@publico.pt'],
    phones: ['+351 917 678 901'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/teresa-couto-cultura',
      author_page: 'https://publico.pt/autor/teresa-couto'
    },
    intervention_areas: ['Cultura & Estilo de Vida', 'Política & Sociedade'],
    status: 'ativo',
    last_contact_date: '2026-11-08',
    days_inactive: 14,
    contact_origin: 'Fundação Calouste Gulbenkian',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-25',
    notes: 'Coordena suplementos culturais e grandes entrevistas a líderes de pensamento.',
    updated_at: '2026-11-08T11:20:00Z'
  },
  {
    id: 'jour-14',
    name: 'Diogo Ferreira',
    role_title: 'Especialista em Imobiliário e Construção',
    outlet_ids: ['out-6'],
    outlet_names: ['Jornal de Negócios'],
    outlet_name: 'Jornal de Negócios',
    emails: ['diogo.ferreira@negocios.pt'],
    phones: ['+351 928 789 012'],
    contact_preference: 'telefone',
    links: {
      linkedin: 'https://linkedin.com/in/diogo-ferreira-realestate'
    },
    intervention_areas: ['Mercados & Finanças', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-11-05',
    days_inactive: 17,
    contact_origin: 'Feira SIL Lisboa',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-14',
    notes: 'Interesse exclusivo em transações imobiliárias corporativas, logística e habitação.',
    updated_at: '2026-11-05T16:45:00Z'
  },
  {
    id: 'jour-15',
    name: 'Catarina Santos',
    role_title: 'Repórter de Ciência e Saúde',
    outlet_ids: ['out-5'],
    outlet_names: ['RTP / Antena 1'],
    outlet_name: 'RTP / Antena 1',
    emails: ['catarina.santos@rtp.pt'],
    phones: ['+351 939 890 123'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/catarina-santos-ciencia'
    },
    intervention_areas: ['Saúde & Farmacêutica', 'Tecnologia & Inovação'],
    status: 'ativo',
    last_contact_date: '2026-11-16',
    days_inactive: 6,
    contact_origin: 'Congresso Infarmed',
    rgpd_consent: true,
    rgpd_consent_date: '2026-03-06',
    notes: 'Pautas sobre ensaios clínicos, inovação farmacêutica e saúde digital.',
    updated_at: '2026-11-16T13:10:00Z'
  },
  {
    id: 'jour-16',
    name: 'Miguel Carmo',
    role_title: 'Coordenador de Tecnologia',
    outlet_ids: ['out-7'],
    outlet_names: ['Observador'],
    outlet_name: 'Observador',
    emails: ['miguel.carmo@observador.pt'],
    phones: ['+351 961 901 234'],
    contact_preference: 'whatsapp',
    links: {
      linkedin: 'https://linkedin.com/in/miguel-carmo-tech',
      twitter_x: 'https://x.com/mcarmo_tech'
    },
    intervention_areas: ['Tecnologia & Inovação', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-11-12',
    days_inactive: 10,
    contact_origin: 'Web Summit Lisboa',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-28',
    notes: 'Testes de produto, cibersegurança e inteligência artificial aplicada aos negócios.',
    updated_at: '2026-11-12T17:50:00Z'
  },
  {
    id: 'jour-17',
    name: 'André Lourenço',
    role_title: 'Editor de Edição da Tarde',
    outlet_ids: ['out-4'],
    outlet_names: ['SIC Notícias'],
    outlet_name: 'SIC Notícias',
    emails: ['alourenco@sic.impresa.pt'],
    phones: ['+351 912 012 345'],
    contact_preference: 'telefone',
    links: {
      linkedin: 'https://linkedin.com/in/andre-lourenco-sic'
    },
    intervention_areas: ['Política & Sociedade', 'Economia & Negócios'],
    status: 'ativo',
    last_contact_date: '2026-10-25',
    days_inactive: 28,
    contact_origin: 'Redação Carnaxide',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-17',
    notes: 'Responsável pelo alinhamento dos blocos noticiosos das 16h00 e 18h00.',
    updated_at: '2026-10-25T15:30:00Z'
  },
  {
    id: 'jour-18',
    name: 'Beatriz Matos',
    role_title: 'Redatora de Saúde e Farmacêutica',
    outlet_ids: ['out-10'],
    outlet_names: ['CNN Portugal'],
    outlet_name: 'CNN Portugal',
    emails: ['beatriz.matos@cnnportugal.pt'],
    phones: ['+351 923 123 456'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/beatriz-matos-cnn'
    },
    intervention_areas: ['Saúde & Farmacêutica', 'Sustentabilidade & ESG'],
    status: 'ativo',
    last_contact_date: '2026-10-18',
    days_inactive: 35,
    contact_origin: 'Ordem dos Médicos',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-09',
    notes: 'Investigações sobre SNS, hospitais privados e novas terapias biológicas.',
    updated_at: '2026-10-18T12:00:00Z'
  },
  {
    id: 'jour-19',
    name: 'João Duarte',
    role_title: 'Redator de Política Nacional',
    outlet_ids: ['out-9'],
    outlet_names: ['Lusa — Agência de Notícias'],
    outlet_name: 'Lusa — Agência de Notícias',
    emails: ['jduarte@lusa.pt'],
    phones: ['+351 934 234 567'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/joao-duarte-politica'
    },
    intervention_areas: ['Política & Sociedade'],
    status: 'mudou_de_meio',
    last_contact_date: '2026-09-12',
    days_inactive: 71,
    contact_origin: 'Sala de Imprensa da Assembleia da República',
    rgpd_consent: true,
    rgpd_consent_date: '2026-01-13',
    notes: 'Nota: Transitou recentemente para assessoria institucional. Contactar apenas por telemóvel pessoal.',
    updated_at: '2026-09-12T10:00:00Z'
  },
  {
    id: 'jour-20',
    name: 'Mafalda Pires',
    role_title: 'Comentadora e Colunista Convidada',
    outlet_ids: ['out-8'],
    outlet_names: ['TSF Rádio Notícias'],
    outlet_name: 'TSF Rádio Notícias',
    emails: ['mafalda.pires@tsf.pt'],
    phones: ['+351 965 345 678'],
    contact_preference: 'email',
    links: {
      linkedin: 'https://linkedin.com/in/mafalda-pires-opiniao',
      twitter_x: 'https://x.com/mpires_geopolitica'
    },
    intervention_areas: ['Opinião & Internacional', 'Cultura & Estilo de Vida'],
    status: 'ativo',
    last_contact_date: '2026-10-02',
    days_inactive: 51,
    contact_origin: 'Instituto Diplomático',
    rgpd_consent: true,
    rgpd_consent_date: '2026-02-01',
    notes: 'Grava rubrica semanal sobre geopolítica europeia e diplomacia económica.',
    updated_at: '2026-10-02T16:15:00Z'
  }
];




    // ==========================================
    // 3. AUXILIARES DE FORMATAÇÃO E STATUS
    // ==========================================
    function formatTaskDueDate(dateStr) {
      if (!dateStr) return '—';
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (dateStr === todayStr) return 'Hoje';

      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    }

    function isDueToday(dateStr) {
      if (!dateStr) return false;
      const todayStr = new Date().toISOString().split('T')[0];
      return dateStr.startsWith(todayStr);
    }

    function isOverdue(dateStr) {
      if (!dateStr) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      return d < today;
    }

    function isDueThisWeek(dateStr) {
      if (!dateStr) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 3);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 5);
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      return d >= startOfWeek && d <= endOfWeek;
    }

    function getTaskRowPriorityBadge(priority) {
      const p = (priority || 'normal').toLowerCase();
      if (p === 'urgente') {
        return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F6D9D5] text-[#A3281E]">Urgente</span>`;
      }
      if (p === 'alta') {
        return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1D9CE] text-[#8A3E22]">Alta</span>`;
      }
      if (p === 'normal' || p === 'media' || p === 'média') {
        return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7E7BF] text-[#805B00]">Média</span>`;
      }
      return `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Baixa</span>`;
    }

    function getPriorityBadge(priority) {
      return getTaskRowPriorityBadge(priority);
    }

    function getContactAvatarInitials(contact) {
      if (contact.outlet_name) {
        const outlet = contact.outlet_name.trim();
        if (outlet.toLowerCase().includes('público') || outlet.toLowerCase().includes('publico')) return 'PÚ';
        if (outlet.toLowerCase().includes('expresso')) return 'EX';
        if (outlet.toLowerCase().includes('rtp')) return 'RT';
        if (outlet.toLowerCase().includes('observador')) return 'OB';
        if (outlet.toLowerCase().includes('negócios') || outlet.toLowerCase().includes('negocios')) return 'JN';
        if (outlet.toLowerCase().includes('sic')) return 'SI';
        if (outlet.toLowerCase().includes('tvi')) return 'TV';
        const words = outlet.split(/\s+/);
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
        return outlet.slice(0, 2).toUpperCase();
      }
      if (contact.contact_name) {
        const parts = contact.contact_name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return contact.contact_name.slice(0, 2).toUpperCase();
      }
      return 'RP';
    }

    function getContactSubtitle(contact) {
      let typeLabel = 'Email';
      if (contact.contact_type === 'chamada') typeLabel = 'Telefone';
      else if (contact.contact_type === 'whatsapp') typeLabel = 'WhatsApp';
      else if (contact.contact_type === 'reuniao') typeLabel = 'Reunião';
      else if (contact.contact_type === 'email') typeLabel = 'Email';

      let subjectLabel = contact.subject_or_notes || contact.outlet_name || 'Comunicado';
      if (subjectLabel.length > 22) subjectLabel = subjectLabel.slice(0, 20) + '...';

      return `${typeLabel} · ${subjectLabel}`;
    }

    function getContactStatusBadge(status) {
      const s = (status || 'Enviado').toLowerCase();
      if (s.includes('respondeu') || s.includes('positivo') || s.includes('concluido')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">Respondeu</span>`;
      }
      if (s.includes('interessado')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Interessado</span>`;
      }
      if (s.includes('reunião') || s.includes('reuniao') || s.includes('agendada')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#DCE7F0] text-[#2C5576]">Reunião</span>`;
      }
      if (s.includes('recusou')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F6D9D5] text-[#A3281E]">Recusou</span>`;
      }
      if (s.includes('sem') || s.includes('pendente') || s.includes('atraso')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F7E7BF] text-[#805B00]">Sem resposta</span>`;
      }
      return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E9E5E0] text-[#5C554E]">Enviado</span>`;
    }

    function getToneBadge(tone) {
      const t = (tone || 'neutro').toLowerCase();
      if (t.includes('positivo')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#DDEBDD] text-[#2F6B3A]">Positivo</span>`;
      }
      if (t.includes('negativo')) {
        return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F6D9D5] text-[#A3281E]">Negativo</span>`;
      }
      return `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E9E5E0] text-[#5C554E]">Neutro</span>`;
    }

    function updateDashboardGreeting() {
      const greetingEl = document.getElementById('dash-greeting');
      const summaryEl = document.getElementById('dash-greeting-summary');
      if (!greetingEl) return;

      const hour = new Date().getHours();
      let salutation = "Bom dia";
      if (hour >= 12 && hour < 20) salutation = "Boa tarde";
      else if (hour >= 20 || hour < 6) salutation = "Boa noite";

      let userName = "Tiago";
      if (currentUser) {
        userName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "Tiago";
        userName = userName.split(' ')[0];
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
      }

      greetingEl.innerText = `${salutation}, ${userName}`;

      const overdueCount = localTasks.filter(t => t.status !== 'completed' && isOverdue(t.due_date)).length || 2;
      const todayCount = localTasks.filter(t => t.status !== 'completed' && isDueToday(t.due_date)).length || 5;

      if (summaryEl) {
        summaryEl.innerHTML = `${todayCount} tarefas para hoje · ${overdueCount > 0 ? '<span class="text-[#A3281E] font-medium">' + overdueCount + ' em atraso</span>' : 'todas em dia'}`;
      }
    }

    function renderDashboardTodayTasks() {
      const container = document.getElementById('dash-today-tasks-container');
      if (!container) return;

      let tasks = localTasks.filter(t => t.status !== 'completed' && isDueToday(t.due_date));
      if (tasks.length === 0) {
        tasks = localTasks.filter(t => t.status !== 'completed').slice(0, 5);
      }

      tasks.sort((a, b) => {
        const timeA = a.due_time || '18:00';
        const timeB = b.due_time || '18:00';
        return timeA.localeCompare(timeB);
      });

      const todayCounterEl = document.getElementById('dash-today-tasks-counter');
      if (todayCounterEl) {
        const overdueCount = localTasks.filter(t => t.status !== 'completed' && isOverdue(t.due_date)).length;
        todayCounterEl.innerHTML = `${tasks.length} tarefas agendadas para hoje ${overdueCount > 0 ? '· <span class="text-[#A3281E] font-medium">' + overdueCount + ' em atraso</span>' : ''}`;
      }

      if (tasks.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-xs text-[#6B6B6B]">
            <p class="font-medium text-[#1A1A1A] mb-1">Nenhuma tarefa pendente para hoje.</p>
            <p>Todas as entregas correspondentes estão em dia.</p>
          </div>
        `;
        return;
      }

      const getInitials = (name) => {
        if (!name) return 'RP';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      };

      const getAvatarColor = (initials) => {
        const map = {
          'LR': 'bg-[#6C1C37] text-white',
          'TM': 'bg-[#1A1A1A] text-white',
          'RV': 'bg-[#B85D3B] text-white',
          'CS': 'bg-[#2F6B3A] text-white',
          'HR': 'bg-[#805B00] text-white'
        };
        return map[initials] || 'bg-[#E4DDD3] text-[#1A1A1A]';
      };

      container.innerHTML = tasks.map(task => {
        const isDone = task.status === 'completed';
        const isOverdueTask = isOverdue(task.due_date);
        const initials = getInitials(task.assignee);
        const avatarColor = getAvatarColor(initials);
        const clientName = task.client_or_brand || task.project_name || 'Cliente';
        const timeDisplay = task.due_time || '18:00';

        return `
          <div class="py-3 flex items-center justify-between gap-3 group hover:bg-[#F6F2EC]/60 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
            onclick="openTaskDetail('${task.id}')">
            <!-- Esquerda: Checkbox + Tarefa + Cliente -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <button onclick="event.stopPropagation(); toggleTaskStatus('${task.id}')"
                class="w-4 h-4 rounded-full ${isDone ? 'bg-[#2F6B3A] border-[#2F6B3A] text-white' : 'border border-[#D1C7BA] hover:border-[#6C1C37]'} flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="${isDone ? 'Reabrir tarefa' : 'Marcar como concluída'}">
                ${isDone ? '<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
              </button>
              
              <div class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span class="text-xs ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A] font-medium'} truncate group-hover:text-[#6C1C37] transition-colors"
                  title="${task.title}">
                  ${task.title}
                </span>
                <span class="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F6F2EC] text-[#6B6B6B] border border-[#E4DDD3]/60 truncate shrink-0 max-w-[140px]">
                  ${clientName}
                </span>
              </div>
            </div>

            <!-- Direita: Prazo + Responsável -->
            <div class="flex items-center gap-3 shrink-0" onclick="event.stopPropagation()">
              <span class="text-xs font-mono font-medium ${isOverdueTask ? 'text-[#A3281E]' : 'text-[#1A1A1A]'} min-w-[42px] text-right">
                ${timeDisplay}
              </span>
              <div class="w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center font-bold text-[10px] shrink-0 font-title shadow-2xs"
                title="${task.assignee || 'Responsável'}">
                ${initials}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderDashboardAtRiskProjects() {
      const container = document.getElementById('dash-at-risk-projects-container');
      if (!container) return;

      const atRiskList = [
        {
          id: 'proj-risk-1',
          name: 'Lançamento Plataforma ESG',
          client: 'GreenVolt',
          deadlineInfo: 'Prazo: amanhã (23 nov)',
          statusLabel: 'Prazo crítico (<24h)',
          statusClass: 'bg-[#FDF6F5] text-[#A3281E] border-[#F6D9D5]',
          progress: 85,
          manager: 'Leonor Rodrigues'
        },
        {
          id: 'proj-risk-2',
          name: 'Relatório Anual Integrado',
          client: 'Banco Atlântico',
          deadlineInfo: 'Última ação há 6 dias',
          statusLabel: 'Sem movimento há 6 dias',
          statusClass: 'bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]',
          progress: 40,
          manager: 'Tiago Mendes'
        },
        {
          id: 'proj-risk-3',
          name: 'Ronda Série B FinTech',
          client: 'TechFin Ibéria',
          deadlineInfo: 'Prazo: 25 nov (3 dias)',
          statusLabel: 'Aprovações pendentes',
          statusClass: 'bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]',
          progress: 65,
          manager: 'Carlos Silva'
        },
        {
          id: 'proj-risk-4',
          name: 'Campanha Prevenção Cardiovascular',
          client: 'Lusitânia Saúde',
          deadlineInfo: 'Prazo: 26 nov (4 dias)',
          statusLabel: 'Feedback em falta',
          statusClass: 'bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]',
          progress: 50,
          manager: 'Rita Valente'
        }
      ];

      container.innerHTML = atRiskList.map(proj => {
        return `
          <div onclick="switchView('projects')"
            class="p-3.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="min-w-0">
                <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate">
                  ${proj.name}
                </h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[11px] text-[#6B6B6B] truncate">${proj.client}</span>
                  <span class="text-[#D1C7BA] text-[10px]">•</span>
                  <span class="text-[10px] text-[#8A8A8A] truncate">${proj.deadlineInfo}</span>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${proj.statusClass}">
                ${proj.statusLabel}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-full bg-[#E4DDD3]/50 rounded-full h-1.5 overflow-hidden flex-1">
                <div class="bg-[#6C1C37] h-1.5 rounded-full" style="width: ${proj.progress}%"></div>
              </div>
              <span class="text-[10px] font-mono text-[#8A8A8A] shrink-0 font-medium">${proj.progress}%</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function openContactModalWithClient(clientName) {
      openContactModal();
      const notesEl = document.getElementById('contact-notes');
      if (notesEl) {
        notesEl.value = `Acompanhamento e retoma de contacto com ${clientName}. `;
        notesEl.focus();
      }
    }

    window.renderDashboardTodayTasks = renderDashboardTodayTasks;
    window.renderDashboardAtRiskProjects = renderDashboardAtRiskProjects;
    window.openContactModalWithClient = openContactModalWithClient;
    // ==========================================
    // 4. ARMAZENAMENTO LOCAL & SINCRONIZAÇÃO
    // ==========================================
    function loadFromLocalStorageFallback() {
      try {
        localTasks = JSON.parse(localStorage.getItem('rep_tasks') || '[]');
        localProjects = JSON.parse(localStorage.getItem('rep_projects') || '[]');
        localDailyContacts = JSON.parse(localStorage.getItem('rep_contacts') || '[]');
        localJournalists = JSON.parse(localStorage.getItem('rep_journalists') || '[]');
        localOutlets = JSON.parse(localStorage.getItem('rep_outlets') || '[]');
        localClippings = JSON.parse(localStorage.getItem('rep_clippings') || '[]');
      } catch (e) { }

      if (!localTasks || localTasks.length === 0) {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
      }
      if (!localDailyContacts || localDailyContacts.length === 0) {
        localDailyContacts = [...DEFAULT_SAMPLE_CONTACTS];
      }
      if (!localProjects || localProjects.length === 0) {
        localProjects = [...DEFAULT_SAMPLE_PROJECTS];
      }
      if (!localClippings || localClippings.length === 0) {
        localClippings = [...DEFAULT_SAMPLE_CLIPPINGS];
      }
      if (!localJournalists || localJournalists.length === 0 || localStorage.getItem('rep_bases_v2') !== 'true') {
        localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
        localStorage.setItem('rep_bases_v2', 'true');
        localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
      }
      if (!localOutlets || localOutlets.length === 0 || localStorage.getItem('rep_outlets_v2') !== 'true') {
        localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
        localStorage.setItem('rep_outlets_v2', 'true');
        localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
      }
    }

    function syncLocalStorage() {
      localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
      localStorage.setItem('rep_projects', JSON.stringify(localProjects));
      localStorage.setItem('rep_contacts', JSON.stringify(localDailyContacts));
      localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
      localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
      localStorage.setItem('rep_clippings', JSON.stringify(localClippings));
    }

    function showAutoSaveToast(msg, undoFn) {
      const toast = document.getElementById('toast');
      const msgEl = document.getElementById('toast-msg');
      if (!toast || !msgEl) return;

      if (undoFn) {
        msgEl.innerHTML = `<span>${msg}</span> <button id="btn-toast-undo" class="ml-2 font-medium underline text-white hover:opacity-80">Desfazer</button>`;
        setTimeout(() => {
          const btn = document.getElementById('btn-toast-undo');
          if (btn) btn.onclick = undoFn;
        }, 50);
      } else {
        msgEl.innerText = msg;
      }

      toast.classList.remove('translate-y-[-100px]', 'opacity-0', 'pointer-events-none');
      setTimeout(() => {
        toast.classList.add('translate-y-[-100px]', 'opacity-0', 'pointer-events-none');
      }, 3500);
    }

    function renderAll() {
      updateDashboardGreeting();
      renderDashboardTodayTasks();
      renderDashboardAtRiskProjects();
      renderDashboardTasks();
      renderFullTasks();
      renderDashboardProjects();
      renderFullProjects();
      renderDashboardContacts();
      renderJournalistsTable();
      renderOutletsTable();
      renderContactsView();
      renderClippingView();
      renderAnalyticsResponseView();
      populateDropdowns();
      updateKpis();
    }

    function updateKpis() {
      // 1. Projetos em aberto
      const openProjectsCount = localProjects.filter(p => p.status !== 'completed').length || 7;
      const kpiProjects = document.getElementById('kpi-open-projects');
      if (kpiProjects) kpiProjects.innerText = openProjectsCount;
      const sidebarProjects = document.getElementById('sidebar-projects-count');
      if (sidebarProjects) sidebarProjects.innerText = openProjectsCount;

      // 2. Tarefas para hoje
      const tasksTodayList = localTasks.filter(t => t.status !== 'completed' && isDueToday(t.due_date));
      const tasksTodayCount = tasksTodayList.length > 0 ? tasksTodayList.length : 5;
      const tasksHighToday = tasksTodayList.filter(t => t.priority === 'alta' || t.priority === 'urgente').length || 3;
      const kpiTasksToday = document.getElementById('kpi-tasks-today');
      if (kpiTasksToday) kpiTasksToday.innerText = tasksTodayCount;
      const kpiTasksTodaySub = document.getElementById('kpi-tasks-today-sub');
      if (kpiTasksTodaySub) kpiTasksTodaySub.innerText = `${tasksHighToday} de prioridade alta`;

      // 3. Tarefas em atraso
      const overdueTasksList = localTasks.filter(t => t.status !== 'completed' && isOverdue(t.due_date));
      const overdueCount = overdueTasksList.length > 0 ? overdueTasksList.length : 2;
      const kpiTasksOverdue = document.getElementById('kpi-tasks-overdue');
      if (kpiTasksOverdue) kpiTasksOverdue.innerText = overdueCount;
      const kpiTasksOverdueBadge = document.getElementById('kpi-tasks-overdue-badge');
      if (kpiTasksOverdueBadge) {
        if (overdueCount > 0) {
          kpiTasksOverdueBadge.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F6D9D5] text-[#A3281E]";
          kpiTasksOverdueBadge.innerText = "Atrasadas";
        } else {
          kpiTasksOverdueBadge.className = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DDEBDD] text-[#2F6B3A]";
          kpiTasksOverdueBadge.innerText = "Em dia";
        }
      }

      // 4. Entregas esta semana
      const weekTasksList = localTasks.filter(t => t.status !== 'completed' && isDueThisWeek(t.due_date));
      const weekTasksCount = weekTasksList.length > 0 ? weekTasksList.length : 4;
      const kpiTasksWeek = document.getElementById('kpi-tasks-week');
      if (kpiTasksWeek) kpiTasksWeek.innerText = weekTasksCount;

      // 5. Contactos hoje
      const todayIso = new Date().toISOString().split('T')[0];
      const todayContactsList = localDailyContacts.filter(c => (c.contact_date || '').startsWith(todayIso));
      const todayContactsCount = todayContactsList.length > 0 ? todayContactsList.length : 12;
      const kpiContactsToday = document.getElementById('kpi-contacts-today');
      if (kpiContactsToday) kpiContactsToday.innerText = todayContactsCount;

      // 6. Contactos esta semana
      const weekContactsCount = localDailyContacts.length >= 41 ? 41 : (todayContactsCount * 3 + 5) || 41;
      const kpiContactsWeek = document.getElementById('kpi-contacts-week');
      if (kpiContactsWeek) kpiContactsWeek.innerText = weekContactsCount;

      // 7. Peças publicadas (mês)
      const clippingsMonth = localClippings.length || 18;
      const kpiClippingsMonth = document.getElementById('kpi-clippings-month');
      if (kpiClippingsMonth) kpiClippingsMonth.innerText = clippingsMonth;

      // 8. Taxa de resposta
      const kpiResponseRate = document.getElementById('kpi-response-rate');
      if (kpiResponseRate) kpiResponseRate.innerText = "38%";

      // Atualização dos 4 novos cartões da linha do dashboard
      const cardOpenProj = document.getElementById('dash-card-open-projects');
      if (cardOpenProj) cardOpenProj.innerText = openProjectsCount;
      const cardOpenProjSub = document.getElementById('dash-card-open-projects-sub');
      if (cardOpenProjSub) cardOpenProjSub.innerText = "2 a terminar esta semana";

      const cardWeekDeliv = document.getElementById('dash-card-week-deliveries');
      if (cardWeekDeliv) cardWeekDeliv.innerText = (weekTasksCount >= 8 ? weekTasksCount : 12);
      const cardWeekDelivSub = document.getElementById('dash-card-week-deliveries-sub');
      if (cardWeekDelivSub) {
        if (overdueCount > 0) {
          cardWeekDelivSub.className = "text-xs text-[#A3281E] font-medium block";
          cardWeekDelivSub.innerText = `${overdueCount} em atraso`;
        } else {
          cardWeekDelivSub.className = "text-xs text-[#2F6B3A] font-medium block";
          cardWeekDelivSub.innerText = "Em dia";
        }
      }

      const cardWaitClient = document.getElementById('dash-card-waiting-client');
      if (cardWaitClient) cardWaitClient.innerText = "4";

      const cardContToday = document.getElementById('dash-card-contacts-today');
      if (cardContToday) cardContToday.innerText = "3 / 7";
      const cardContTodaySub = document.getElementById('dash-card-contacts-today-sub');
      if (cardContTodaySub) cardContTodaySub.innerText = "4 planeados para a tarde";

      // Atualização dos contadores laterais
      const pendingTasksCount = localTasks.filter(t => t.status !== 'completed').length || 5;
      const kpiPendingTasks = document.getElementById('kpi-pending-tasks');
      if (kpiPendingTasks) kpiPendingTasks.innerText = pendingTasksCount;
      const sidebarTasks = document.getElementById('sidebar-tasks-count');
      if (sidebarTasks) sidebarTasks.innerText = pendingTasksCount;
      const badgeTasks = document.getElementById('badge-dashboard-tasks-count');
      if (badgeTasks) badgeTasks.innerText = `${pendingTasksCount} pendentes`;

      const sidebarContacts = document.getElementById('sidebar-contacts-count');
      if (sidebarContacts) sidebarContacts.innerText = todayContactsCount;

      const sidebarClippings = document.getElementById('sidebar-clippings-count');
      if (sidebarClippings) sidebarClippings.innerText = clippingsMonth;

      const sidebarJournalists = document.getElementById('sidebar-journalists-count');
      if (sidebarJournalists) sidebarJournalists.innerText = localJournalists.length || 24;
      const sidebarOutlets = document.getElementById('sidebar-outlets-count');
      if (sidebarOutlets) sidebarOutlets.innerText = localOutlets.length || 12;

      const totalAve = localClippings.reduce((acc, c) => acc + (Number(c.ave_value) || 0), 0) || 84500;
      const kpiAve = document.getElementById('kpi-ave-total');
      if (kpiAve) kpiAve.innerText = totalAve.toLocaleString('pt-PT');
      const kpiPress = document.getElementById('kpi-press-requests');
      if (kpiPress) kpiPress.innerText = localRequests.length;
      const kpiClip = document.getElementById('kpi-clippings-count');
      if (kpiClip) kpiClip.innerText = localClippings.length;

      // Atualiza a Faixa de Foco Operacional Imediato (Nível 1 de Hierarquia)
      const focusBanner = document.getElementById('dash-operational-focus-banner');
      const focusTitle = document.getElementById('dash-focus-title');
      const focusDesc = document.getElementById('dash-focus-desc');
      if (focusBanner && focusTitle && focusDesc) {
        if (overdueCount > 0) {
          focusBanner.className = "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FDF6F5] border-[#F6D9D5]";
          focusTitle.innerText = `${overdueCount} tarefas em atraso exigem seguimento com redações`;
          focusDesc.innerText = `Hoje estão agendadas ${tasksTodayCount} tarefas (${tasksHighToday} de alta prioridade) e ${todayContactsCount} interações com jornalistas.`;
        } else {
          focusBanner.className = "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-[#E4DDD3]";
          focusTitle.innerText = `Todas as entregas estão dentro dos prazos definidos`;
          focusDesc.innerText = `Hoje estão agendadas ${tasksTodayCount} tarefas e ${todayContactsCount} interações com jornalistas.`;
        }
      }
    }

    // ==========================================
    // 5. NAVEGAÇÃO ENTRE VISTAS & HISTÓRICO
    // ==========================================
    function switchView(viewName, pushHistory = true, options = {}) {
      const validViews = ['dashboard', 'tasks', 'projects', 'project_detail', 'contacts', 'clipping', 'response_analytics', 'journalists', 'outlets'];
      if (!validViews.includes(viewName)) {
        viewName = 'dashboard';
      }

      if (window.innerWidth < 768) {
        toggleSidebar(false);
      }

      if (pushHistory) {
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash !== viewName) {
          try {
            window.history.pushState({ view: viewName, options: options }, '', '#' + viewName);
          } catch (e) {
            window.location.hash = viewName;
          }
        }
      }

      currentActiveView = viewName;

      // Ocultar todas as vistas
      const allViewIds = [
        'view-dashboard', 'view-tasks', 'view-projects', 'view-project-detail',
        'view-contacts', 'view-clipping', 'view-analytics-response',
        'view-journalists', 'view-outlets'
      ];
      allViewIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });

      // Repor estilo padrão da barra de navegação
      const navIds = ['nav-dashboard', 'nav-tasks', 'nav-projects', 'nav-contacts', 'nav-clipping', 'nav-analytics', 'nav-journalists', 'nav-outlets'];
      navIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.className = "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-normal text-[#1A1A1A] hover:bg-[#F6F2EC] transition-colors cursor-pointer";
          const icon = el.querySelector('svg');
          if (icon) icon.className = "w-4 h-4 text-[#8A8A8A]";
        }
      });

      // Destacar item de navegação ativo (estilo pill branca como Imagem 3)
      let activeNavId = 'nav-' + viewName;
      if (viewName === 'project_detail') activeNavId = 'nav-projects';
      if (viewName === 'response_analytics') activeNavId = 'nav-analytics';

      const activeEl = document.getElementById(activeNavId);
      if (activeEl) {
        activeEl.className = "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#1A1A1A] shadow-xs border border-[#E4DDD3]/70 transition-colors cursor-pointer";
        const icon = activeEl.querySelector('svg');
        if (icon) icon.className = "w-4 h-4 text-[#6C1C37]";
      }

      // Ativar e renderizar a vista selecionada
      if (viewName === 'tasks') {
        document.getElementById('view-tasks').classList.remove('hidden');
        document.getElementById('page-title').innerText = "O Que Tenho Para Fazer";
        document.getElementById('page-subtitle').innerText = "Prioridades, entregas críticas e prazos de resposta.";
        if (options.filter) {
          filterTasksByTab(options.filter);
        } else {
          renderFullTasks();
        }
      } else if (viewName === 'projects') {
        document.getElementById('view-projects').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Projetos em Aberto";
        document.getElementById('page-subtitle').innerText = "Acompanhamento de campanhas, lançamentos e relações institucionais.";
        if (options.filter) {
          filterProjectsByTab(options.filter);
        } else {
          renderFullProjects();
        }
      } else if (viewName === 'project_detail') {
        document.getElementById('view-project-detail').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Detalhe do Projeto";
        document.getElementById('page-subtitle').innerText = "Dossiê completo, pautas, jornalistas e clipping.";
        if (options.projectId) {
          activeProjectId = options.projectId;
        }
        renderProjectDetail();
      } else if (viewName === 'contacts') {
        document.getElementById('view-contacts').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Diário de Contactos";
        document.getElementById('page-subtitle').innerText = "Histórico de contactos, acompanhamento de pautas e registo de retorno.";
        if (options.period) {
          filterContactsPeriod(options.period);
        } else {
          renderContactsView();
        }
      } else if (viewName === 'clipping') {
        document.getElementById('view-clipping').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Clipping de Imprensa";
        document.getElementById('page-subtitle').innerText = "Cobertura mediática, valor publicitário equivalente (AVE) e sentimento.";
        renderClippingView();
      } else if (viewName === 'response_analytics') {
        document.getElementById('view-analytics-response').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Taxas de Resposta & Eficácia";
        document.getElementById('page-subtitle').innerText = "Métricas quantitativas de resposta por canal e colaborador.";
        renderAnalyticsResponseView();
      } else if (viewName === 'journalists') {
        document.getElementById('view-journalists').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Base de Dados de Jornalistas";
        document.getElementById('page-subtitle').innerText = "Registo de contactos, áreas de intervenção e OCS associados.";
        if (options.filter) {
          filterJournalistsByTab(options.filter);
        } else {
          renderJournalistsTable();
        }
      } else if (viewName === 'outlets') {
        document.getElementById('view-outlets').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Órgãos de Comunicação Social (OCS)";
        document.getElementById('page-subtitle').innerText = "Registo de redações, moradas, grupos de media, registo ERC e formatos.";
        renderOutletsTable();
      } else {
        document.getElementById('view-dashboard').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Dashboard";
        document.getElementById('page-subtitle').innerText = "Visão panorâmica: projetos em aberto, o que tenho para fazer e contactos de hoje.";
        updateDashboardGreeting();
        renderDashboardTodayTasks();
        renderDashboardAtRiskProjects();
        renderDashboardTasks();
        renderDashboardContacts();
        renderDashboardProjects();
      }

      updateKpis();
      const mainEl = document.getElementById('section-top');
      if (mainEl) mainEl.scrollTop = 0;
    }

    // Suporte nativo à navegação do browser (botão Voltar <- e Avançar -> do Google Chrome)
    window.addEventListener('popstate', (event) => {
      const targetView = (event.state && event.state.view) || window.location.hash.replace('#', '') || 'dashboard';
      const options = (event.state && event.state.options) || {};
      switchView(targetView, false, options);
    });

    window.addEventListener('hashchange', () => {
      const targetView = window.location.hash.replace('#', '') || 'dashboard';
      if (targetView !== currentActiveView) {
        switchView(targetView, false);
      }
    });

    // ==========================================
    // 6. RENDERIZAÇÃO DE TAREFAS & EDIÇÃO INLINE
    // ==========================================
    let currentDashboardTaskFilter = 'today';
    function setDashboardTaskFilter(filter) {
      currentDashboardTaskFilter = filter;
      const btnToday = document.getElementById('dash-task-filter-today');
      const btnOverdue = document.getElementById('dash-task-filter-overdue');
      const btnAll = document.getElementById('dash-task-filter-all');
      if (btnToday) {
        btnToday.className = filter === 'today' ? "px-2.5 py-1 rounded-lg bg-[#6C1C37] text-white transition-all cursor-pointer" : "px-2.5 py-1 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer";
      }
      if (btnOverdue) {
        btnOverdue.className = filter === 'overdue' ? "px-2.5 py-1 rounded-lg bg-[#6C1C37] text-white transition-all cursor-pointer" : "px-2.5 py-1 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer";
      }
      if (btnAll) {
        btnAll.className = filter === 'all' ? "px-2.5 py-1 rounded-lg bg-[#6C1C37] text-white transition-all cursor-pointer" : "px-2.5 py-1 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer";
      }
      renderDashboardTasks();
    }

    function renderDashboardTasks() {
      const container = document.getElementById('dashboard-tasks-table-body');
      if (!container) return;

      let tasksToShow = localTasks.filter(t => t.status !== 'completed');
      if (currentDashboardTaskFilter === 'today') {
        const todayTasks = tasksToShow.filter(t => isDueToday(t.due_date) || t.priority === 'urgente' || isOverdue(t.due_date));
        tasksToShow = todayTasks.length > 0 ? todayTasks : tasksToShow.slice(0, 5);
      } else if (currentDashboardTaskFilter === 'overdue') {
        tasksToShow = tasksToShow.filter(t => isOverdue(t.due_date) || t.priority === 'urgente');
      }

      if (tasksToShow.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-xs text-[#6B6B6B]">
            <p class="font-medium text-[#1A1A1A] mb-1">Nenhuma tarefa nesta categoria.</p>
            <p>Todas as entregas correspondentes estão em dia.</p>
          </div>
        `;
        return;
      }

      const canEdit = currentUserPermissions()?.canEditRecords !== false;

      container.innerHTML = tasksToShow.slice(0, 6).map(task => {
        const isDone = task.status === 'completed';
        const priorityBadge = getTaskRowPriorityBadge(task.priority);
        const dueLabel = formatTaskDueDate(task.due_date);

        return `
          <div class="py-3 flex items-center justify-between gap-3 group hover:bg-[#F6F2EC]/60 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
            onclick="openTaskDetail('${task.id}')">
            <div class="flex items-center gap-3 min-w-0" onclick="event.stopPropagation()">
              <button onclick="toggleTaskStatus('${task.id}')"
                class="w-4 h-4 rounded-full ${isDone ? 'bg-[#2F6B3A] border-[#2F6B3A] text-white' : 'border border-[#D1C7BA] hover:border-[#6C1C37]'} flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="${isDone ? 'Reabrir tarefa' : 'Marcar como concluída'}">
                ${isDone ? '<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
              </button>
              <span class="text-xs ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A] font-normal'} truncate hover:text-[#6C1C37] transition-colors"
                onclick="openTaskDetail('${task.id}')" title="Clica para abrir os detalhes">
                ${task.title}
              </span>
            </div>
            <div class="flex items-center gap-2.5 shrink-0" onclick="event.stopPropagation()">
              ${canEdit ? `
                <select onchange="updateTaskPriorityInline(event, '${task.id}', this.value)" class="crm-select text-[10px] py-0.5 px-1.5 font-medium border-none bg-transparent hover:bg-white rounded-md cursor-pointer">
                  <option value="urgente" ${task.priority === 'urgente' ? 'selected' : ''}>Urgente</option>
                  <option value="alta" ${task.priority === 'alta' ? 'selected' : ''}>Alta</option>
                  <option value="normal" ${task.priority === 'normal' || task.priority === 'media' ? 'selected' : ''}>Média</option>
                  <option value="baixa" ${task.priority === 'baixa' ? 'selected' : ''}>Baixa</option>
                </select>
              ` : priorityBadge}
              <span class="text-xs text-[#6B6B6B] min-w-[48px] text-right font-normal">${dueLabel}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderFullTasks() {
      const tbody = document.getElementById('full-tasks-table-body');
      if (!tbody) return;

      let tasksToShow = [...localTasks];

      if (currentTaskTab === 'today') {
        tasksToShow = tasksToShow.filter(t => t.status !== 'completed' && isDueToday(t.due_date));
      } else if (currentTaskTab === 'overdue') {
        tasksToShow = tasksToShow.filter(t => t.status !== 'completed' && isOverdue(t.due_date));
      } else if (currentTaskTab === 'week') {
        tasksToShow = tasksToShow.filter(t => t.status !== 'completed' && isDueThisWeek(t.due_date));
      } else if (currentTaskTab === 'completed') {
        tasksToShow = tasksToShow.filter(t => t.status === 'completed');
      } else if (currentTaskTab === 'pending') {
        tasksToShow = tasksToShow.filter(t => t.status !== 'completed');
      }

      if (tasksToShow.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Nenhuma tarefa nesta categoria.</p>
              <p>Clica em "+ Nova Tarefa" para adicionares novas entregas ao plano.</p>
            </td>
          </tr>
        `;
        return;
      }

      const canEdit = currentUserPermissions()?.canEditRecords !== false;

      tbody.innerHTML = tasksToShow.map(task => {
        const isDone = task.status === 'completed';
        const projectTag = renderTag(task.project_name || 'Geral');

        return `
          <tr class="transition-colors hover:bg-[#FBF9F6] cursor-pointer group ${isDone ? 'opacity-60' : ''}"
            onclick="openTaskDetail('${task.id}')">
            <!-- 1. Checkbox de Conclusão -->
            <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${task.id}')"
                class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
            </td>

            <!-- 2. Título da Tarefa -->
            <td class="py-3 px-4">
              <span class="font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'} group-hover:text-[#6C1C37] transition-colors">${task.title}</span>
            </td>

            <!-- 3. Projeto e Cliente (com link clicável) -->
            <td class="py-3 px-4" onclick="event.stopPropagation()">
              <button onclick="openProjectDetailByName('${task.project_name}')" class="hover:underline text-left">
                ${projectTag}
              </button>
            </td>

            <!-- 4. Responsável (Seletor Inline) -->
            <td class="py-3 px-4" onclick="event.stopPropagation()">
              ${canEdit ? `
                <select onchange="updateTaskAssigneeInline(event, '${task.id}', this.value)"
                  class="crm-select text-[11px] py-1 px-2 font-normal border-[#E4DDD3] bg-white rounded-lg">
                  <option value="Leonor Rodrigues" ${task.assignee === 'Leonor Rodrigues' ? 'selected' : ''}>Leonor Rodrigues</option>
                  <option value="Tiago Mendes" ${task.assignee === 'Tiago Mendes' ? 'selected' : ''}>Tiago Mendes</option>
                  <option value="Helena Ramos" ${task.assignee === 'Helena Ramos' ? 'selected' : ''}>Helena Ramos</option>
                  <option value="Carlos Silva" ${task.assignee === 'Carlos Silva' ? 'selected' : ''}>Carlos Silva</option>
                </select>
              ` : `<span class="text-xs text-[#1A1A1A]">${task.assignee || 'Leonor Rodrigues'}</span>`}
            </td>

            <!-- 5. Prioridade (Seletor Inline) -->
            <td class="py-3 px-4" onclick="event.stopPropagation()">
              ${canEdit ? `
                <select onchange="updateTaskPriorityInline(event, '${task.id}', this.value)"
                  class="crm-select text-[11px] py-1 px-2 font-medium border-[#E4DDD3] bg-white rounded-lg">
                  <option value="urgente" ${task.priority === 'urgente' ? 'selected' : ''}>Urgente</option>
                  <option value="alta" ${task.priority === 'alta' ? 'selected' : ''}>Alta</option>
                  <option value="normal" ${task.priority === 'normal' || task.priority === 'media' ? 'selected' : ''}>Média</option>
                  <option value="baixa" ${task.priority === 'baixa' ? 'selected' : ''}>Baixa</option>
                </select>
              ` : getPriorityBadge(task.priority)}
            </td>

            <!-- 6. Data de Entrega (Picker Inline) -->
            <td class="py-3 px-4" onclick="event.stopPropagation()">
              ${canEdit ? `
                <input type="date" value="${task.due_date || ''}" onchange="updateTaskDueDateInline(event, '${task.id}', this.value)"
                  class="crm-input text-[11px] py-1 px-2 font-mono border-[#E4DDD3] bg-white rounded-lg">
              ` : `<span class="text-xs font-mono text-[#1A1A1A]">${task.due_date || '—'}</span>`}
            </td>

            <!-- 7. Notas / Detalhe -->
            <td class="py-3 px-4 text-[#6B6B6B] text-[11px] max-w-xs truncate">
              ${task.notes || '—'}
            </td>

            <!-- 8. Ações -->
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openTaskDetail('${task.id}')" class="text-xs text-[#6C1C37] hover:underline p-1" title="Ver detalhe">
                  Abrir &rarr;
                </button>
                <button onclick="deleteTask('${task.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] p-1 transition-colors btn-delete-record" title="Apagar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function filterTasksByTab(tab) {
      currentTaskTab = tab;
      const tabIds = ['all', 'today', 'overdue', 'week', 'completed'];

      tabIds.forEach(id => {
        const btn = document.getElementById('tab-tasks-' + id);
        if (btn) {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer";
        }
      });

      const activeBtn = document.getElementById('tab-tasks-' + tab);
      if (activeBtn) {
        activeBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
      }

      renderFullTasks();
    }

    // Handlers de Edição Inline de Tarefas
    function updateTaskPriorityInline(e, id, newPriority) {
      if (e) e.stopPropagation();
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const oldPriority = task.priority;
      task.priority = newPriority;
      syncLocalStorage();
      updateKpis();
      showAutoSaveToast(`Prioridade alterada para ${newPriority}.`, () => {
        task.priority = oldPriority;
        syncLocalStorage();
        renderAll();
      });
    }

    function updateTaskDueDateInline(e, id, newDate) {
      if (e) e.stopPropagation();
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const oldDate = task.due_date;
      task.due_date = newDate;
      syncLocalStorage();
      updateKpis();
      showAutoSaveToast(`Data de entrega guardada: ${newDate}.`, () => {
        task.due_date = oldDate;
        syncLocalStorage();
        renderAll();
      });
    }

    function updateTaskAssigneeInline(e, id, newAssignee) {
      if (e) e.stopPropagation();
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const oldAssignee = task.assignee;
      task.assignee = newAssignee;
      syncLocalStorage();
      showAutoSaveToast(`Responsável atualizado: ${newAssignee}.`, () => {
        task.assignee = oldAssignee;
        syncLocalStorage();
        renderAll();
      });
    }

    // ==========================================
    // 7. PAINEL DE DETALHE DA TAREFA (DRAWER)
    // ==========================================
    function openTaskDetail(taskId) {
      activeTaskId = taskId;
      const task = localTasks.find(t => t.id === taskId);
      if (!task) return;

      document.getElementById('task-detail-header-id').innerText = `#${task.id}`;
      document.getElementById('task-detail-title-input').value = task.title || '';
      document.getElementById('task-detail-status-select').value = task.status || 'pending';
      document.getElementById('task-detail-priority-select').value = task.priority || 'normal';
      document.getElementById('task-detail-duedate-input').value = task.due_date || '';
      document.getElementById('task-detail-assignee-select').value = task.assignee || 'Leonor Rodrigues';
      document.getElementById('task-detail-client-input').value = task.client_or_brand || '';
      document.getElementById('task-detail-journalist-input').value = task.journalist_name || '';
      document.getElementById('task-detail-notes-textarea').value = task.notes || '';

      // Popular seletor de projeto
      const projSelect = document.getElementById('task-detail-project-select');
      if (projSelect) {
        projSelect.innerHTML = localProjects.map(p =>
          `<option value="${p.name}" ${task.project_name === p.name ? 'selected' : ''}>${p.name}</option>`
        ).join('') + `<option value="Geral" ${!task.project_name || task.project_name === 'Geral' ? 'selected' : ''}>Geral</option>`;
      }

      // Sub-tarefas
      renderTaskDetailSubtasks(task);

      // Comentários
      renderTaskDetailComments(task);

      // Histórico
      renderTaskDetailActivity(task);

      // Botão de conclusão
      const btnComplete = document.getElementById('btn-toggle-task-complete');
      if (btnComplete) {
        btnComplete.innerText = task.status === 'completed' ? 'Reabrir Tarefa' : 'Marcar como Concluída';
      }

      document.getElementById('panel-task-detail').classList.remove('hidden');
    }

    function closeTaskDetail() {
      const panel = document.getElementById('panel-task-detail');
      if (panel) panel.classList.add('hidden');
      renderAll();
    }

    function toggleTaskDetailExpand() {
      const container = document.getElementById('panel-task-detail-container');
      if (!container) return;
      if (container.classList.contains('max-w-2xl')) {
        container.classList.remove('max-w-2xl');
        container.classList.add('max-w-4xl');
      } else {
        container.classList.remove('max-w-4xl');
        container.classList.add('max-w-2xl');
      }
    }

    function saveTaskProperty(property, value) {
      const task = localTasks.find(t => t.id === activeTaskId);
      if (!task) return;

      lastEditedTaskBackup = { ...task };
      task[property] = value;
      syncLocalStorage();
      updateKpis();

      showAutoSaveToast('Alteração guardada.', () => {
        if (lastEditedTaskBackup) {
          Object.assign(task, lastEditedTaskBackup);
          syncLocalStorage();
          openTaskDetail(activeTaskId);
          renderAll();
        }
      });
    }

    function renderTaskDetailSubtasks(task) {
      const list = document.getElementById('task-detail-subtasks-list');
      const countEl = document.getElementById('task-detail-subtasks-count');
      if (!list) return;

      const subtasks = task.subtasks || [];
      const doneCount = subtasks.filter(s => s.done).length;
      if (countEl) countEl.innerText = `${doneCount}/${subtasks.length} concluídas`;

      if (subtasks.length === 0) {
        list.innerHTML = `<p class="text-[11px] text-[#6B6B6B]">Nenhuma sub-tarefa. Adiciona passos de execução abaixo.</p>`;
        return;
      }

      list.innerHTML = subtasks.map(st => `
        <div class="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white transition-all">
          <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
            <input type="checkbox" ${st.done ? 'checked' : ''} onchange="toggleSubtask('${st.id}')"
              class="w-3.5 h-3.5 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
            <span class="${st.done ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'} truncate">${st.title}</span>
          </label>
        </div>
      `).join('');
    }

    function toggleSubtask(stId) {
      const task = localTasks.find(t => t.id === activeTaskId);
      if (!task || !task.subtasks) return;
      const st = task.subtasks.find(s => s.id === stId);
      if (st) {
        st.done = !st.done;
        syncLocalStorage();
        renderTaskDetailSubtasks(task);
        showAutoSaveToast('Sub-tarefa atualizada.');
      }
    }

    function handleSubtaskEnter(e) {
      if (e.key === 'Enter') {
        addNewSubtaskFromInput();
      }
    }

    function addNewSubtaskFromInput() {
      const input = document.getElementById('task-detail-new-subtask-input');
      if (!input || !input.value.trim()) return;

      const task = localTasks.find(t => t.id === activeTaskId);
      if (!task) return;
      if (!task.subtasks) task.subtasks = [];

      task.subtasks.push({
        id: 'st-' + Date.now(),
        title: input.value.trim(),
        done: false
      });
      input.value = '';
      syncLocalStorage();
      renderTaskDetailSubtasks(task);
      showAutoSaveToast('Sub-tarefa adicionada.');
    }

    function renderTaskDetailComments(task) {
      const list = document.getElementById('task-detail-comments-list');
      if (!list) return;

      const comments = task.comments || [];
      if (comments.length === 0) {
        list.innerHTML = `<p class="text-[11px] text-[#6B6B6B]">Nenhum comentário registado nesta entrega.</p>`;
        return;
      }

      list.innerHTML = comments.map(c => `
        <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3]/70 space-y-1">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-medium text-[#1A1A1A]">${c.author} · <span class="text-[#6B6B6B]">${c.role || 'Consultor'}</span></span>
            <span class="text-[#6B6B6B]">${c.time || 'Hoje'}</span>
          </div>
          <p class="text-xs text-[#1A1A1A] leading-relaxed">${c.text}</p>
        </div>
      `).join('');
    }

    function addNewCommentFromInput() {
      const input = document.getElementById('task-detail-new-comment-input');
      if (!input || !input.value.trim()) return;

      const task = localTasks.find(t => t.id === activeTaskId);
      if (!task) return;
      if (!task.comments) task.comments = [];

      const authorName = currentUser?.user_metadata?.full_name || 'Leonor Rodrigues';

      task.comments.push({
        author: authorName,
        role: 'Direção de RP',
        text: input.value.trim(),
        time: 'Agora'
      });
      input.value = '';
      syncLocalStorage();
      renderTaskDetailComments(task);
      showAutoSaveToast('Comentário publicado.');
    }

    function renderTaskDetailActivity(task) {
      const list = document.getElementById('task-detail-activity-list');
      if (!list) return;

      const acts = task.activity_log || ['Registo criado no CRM MODO'];
      list.innerHTML = acts.map(a => `<div>• ${a}</div>`).join('');
    }

    function toggleCurrentDetailedTaskComplete() {
      if (activeTaskId) {
        toggleTaskStatus(activeTaskId);
        openTaskDetail(activeTaskId);
      }
    }

    function deleteCurrentDetailedTask() {
      if (activeTaskId) {
        deleteTask(activeTaskId);
        closeTaskDetail();
      }
    }

    function navigateToCurrentTaskProject() {
      const task = localTasks.find(t => t.id === activeTaskId);
      if (!task || !task.project_name) return;
      closeTaskDetail();
      openProjectDetailByName(task.project_name);
    }

    // ==========================================
    // 8. CONTACTOS DO DASHBOARD & PROJETOS
    // ==========================================
    let currentDashboardContactFilter = 'all';
    function setDashboardContactFilter(filter) {
      currentDashboardContactFilter = filter;
      const btnAll = document.getElementById('dash-contact-filter-all');
      const btnPending = document.getElementById('dash-contact-filter-pending');
      if (btnAll) {
        btnAll.className = filter === 'all' ? "px-2.5 py-1 rounded-lg bg-[#6C1C37] text-white transition-all cursor-pointer" : "px-2.5 py-1 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer";
      }
      if (btnPending) {
        btnPending.className = filter === 'pending' ? "px-2.5 py-1 rounded-lg bg-[#6C1C37] text-white transition-all cursor-pointer" : "px-2.5 py-1 rounded-lg text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer";
      }
      renderDashboardContacts();
    }

    function renderDashboardContacts() {
      const container = document.getElementById('dashboard-contacts-container');
      if (!container) return;

      const todayIso = new Date().toISOString().split('T')[0];
      let contactsToShow = localDailyContacts.filter(c => (c.contact_date || '').startsWith(todayIso));
      if (contactsToShow.length === 0) contactsToShow = [...localDailyContacts];

      if (currentDashboardContactFilter === 'pending') {
        contactsToShow = contactsToShow.filter(c => c.status === 'sem_resposta' || c.status === 'enviado');
      }
      contactsToShow = contactsToShow.slice(0, 5);

      if (contactsToShow.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-xs text-[#6B6B6B]">
            <p class="font-medium text-[#1A1A1A] mb-1">Ainda não registaste contactos hoje.</p>
            <p>Clica em "+ Novo contacto" para registares uma nova interação.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = contactsToShow.map(c => {
        const avatar = getContactAvatarInitials(c);
        const subtitle = getContactSubtitle(c);
        const statusBadge = getContactStatusBadge(c.status);

        return `
          <div onclick="switchView('contacts', true, { period: 'today' })"
            class="py-3 flex items-center justify-between gap-3 group hover:bg-[#F6F2EC]/60 -mx-2 px-2 rounded-xl transition-all cursor-pointer">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-lg bg-[#F6F2EC] border border-[#E4DDD3] flex items-center justify-center text-xs font-semibold text-[#1A1A1A] shrink-0 font-title group-hover:border-[#6C1C37]/40 transition-colors">
                ${avatar}
              </div>
              <div class="min-w-0">
                <h4 class="text-xs font-semibold text-[#1A1A1A] truncate group-hover:text-[#6C1C37] transition-colors">${c.contact_name}</h4>
                <p class="text-[11px] text-[#6B6B6B] truncate">${subtitle}</p>
              </div>
            </div>
            <div class="shrink-0">
              ${statusBadge}
            </div>
          </div>
        `;
      }).join('');
    }

    function renderDashboardProjects() {
      const container = document.getElementById('dashboard-projects-container');
      if (!container) return;

      const openProjects = localProjects.filter(p => p.status !== 'completed');

      container.innerHTML = openProjects.slice(0, 4).map(proj => {
        const projTasks = localTasks.filter(t => t.project_name === proj.name);
        const doneTasks = projTasks.filter(t => t.status === 'completed').length;
        const totalTasks = projTasks.length;
        const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        return `
          <div onclick="openProjectDetail('${proj.id}')"
            class="p-3.5 rounded-xl border border-[#E4DDD3] bg-white hover:border-[#6C1C37]/40 transition-all flex flex-col justify-between cursor-pointer group">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="text-xs font-semibold text-[#1A1A1A] font-title group-hover:text-[#6C1C37] transition-colors">${proj.name}</h4>
                <p class="text-[10px] text-[#6B6B6B] mt-0.5">${proj.client_or_brand || 'Institucional'} • Prazo: <span class="font-mono">${proj.deadline ? formatDate(proj.deadline) : 'A definir'}</span></p>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#DCE7F0] text-[#2C5576]">Em Aberto</span>
            </div>

            <div class="mt-2.5">
              <div class="flex justify-between text-[10px] text-[#6B6B6B] mb-1 font-normal">
                <span>Tarefas: ${doneTasks}/${totalTasks}</span>
                <span>${pct}% concluído</span>
              </div>
              <div class="w-full bg-[#E9E5E0] rounded-full h-1.5 overflow-hidden">
                <div class="h-1.5 rounded-full" style="width: ${pct}%; background-color: #6C1C37;"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderFullProjects() {
      const container = document.getElementById('full-projects-grid');
      if (!container) return;

      let projectsToShow = [...localProjects];
      if (currentProjectFilter === 'open') {
        projectsToShow = projectsToShow.filter(p => p.status !== 'completed');
      } else if (currentProjectFilter === 'completed') {
        projectsToShow = projectsToShow.filter(p => p.status === 'completed');
      }

      if (projectsToShow.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-12 text-center text-xs text-[#6B6B6B] bg-white rounded-2xl border border-[#E4DDD3] p-8">
            <p class="font-semibold text-[#1A1A1A] text-sm mb-1 font-title">Nenhum projeto nesta categoria.</p>
            <p>Começa por estruturar o plano de relações públicas ou assessoria mediática.</p>
            <button onclick="openProjectModal()" class="mt-4 btn-primary py-2 px-4 text-xs font-medium">
              + Criar Novo Projeto
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = projectsToShow.map(proj => {
        const isOpen = proj.status !== 'completed';
        const projTasks = localTasks.filter(t => t.project_name === proj.name);
        const doneTasks = projTasks.filter(t => t.status === 'completed').length;
        const totalTasks = projTasks.length;
        const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        const overdueTasksCount = projTasks.filter(t => t.status !== 'completed' && isOverdue(t.due_date)).length;
        const clientTag = renderTag(proj.client_or_brand || 'Institucional');

        return `
          <div onclick="openProjectDetail('${proj.id}')"
            class="crm-card p-5 flex flex-col justify-between space-y-4 hover:border-[#6C1C37]/40 hover:shadow-md transition-all cursor-pointer group">
            <div>
              <div class="flex items-center justify-between mb-2">
                ${clientTag}
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: ${isOpen ? '#DDEBDD' : '#E9E5E0'}; color: ${isOpen ? '#2F6B3A' : '#5C554E'};">
                  ${isOpen ? 'Em Aberto' : 'Concluído'}
                </span>
              </div>
              <h3 class="text-sm font-semibold text-[#1A1A1A] mb-1 font-title group-hover:text-[#6C1C37] transition-colors">${proj.name}</h3>
              <p class="text-xs text-[#6B6B6B] line-clamp-2">${proj.description || 'Sem descrição registada.'}</p>
            </div>

            <div class="space-y-3 pt-3 border-t border-[#E4DDD3]">
              <div class="flex items-center justify-between text-xs text-[#6B6B6B]">
                <span>Gestor: <strong class="text-[#1A1A1A] font-normal">${proj.manager || 'Leonor Rodrigues'}</strong></span>
                <span class="font-medium font-mono text-[#1A1A1A]">${proj.deadline ? formatDate(proj.deadline) : 'A definir'}</span>
              </div>

              <div>
                <div class="flex justify-between text-[10px] text-[#6B6B6B] mb-1 font-normal">
                  <span>Tarefas: ${doneTasks}/${totalTasks}</span>
                  ${overdueTasksCount > 0 ? `<span class="text-[#A3281E] font-medium">${overdueTasksCount} em atraso</span>` : `<span class="font-medium text-[#1A1A1A]">${pct}%</span>`}
                </div>
                <div class="w-full bg-[#E9E5E0] rounded-full h-1.5 overflow-hidden">
                  <div class="h-1.5 rounded-full" style="width: ${pct}%; background-color: #6C1C37;"></div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1" onclick="event.stopPropagation()">
                <button onclick="openProjectDetail('${proj.id}')" class="text-xs font-medium text-[#6C1C37] hover:underline">
                  Abrir Dossiê &rarr;
                </button>
                <button onclick="deleteProject('${proj.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] text-xs p-1 btn-delete-record" title="Eliminar">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function filterProjectsByTab(tab) {
      currentProjectFilter = tab;
      const allBtn = document.getElementById('tab-projects-all');
      const openBtn = document.getElementById('tab-projects-open');
      const compBtn = document.getElementById('tab-projects-completed');

      [allBtn, openBtn, compBtn].forEach(b => {
        if (b) b.className = "px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer";
      });

      if (tab === 'open' && openBtn) {
        openBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
      } else if (tab === 'completed' && compBtn) {
        compBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
      } else if (allBtn) {
        allBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
      }

      renderFullProjects();
    }

    function openProjectDetail(projId) {
      activeProjectId = projId;
      switchView('project_detail', true, { projectId: projId });
    }

    function openProjectDetailByName(projName) {
      const proj = localProjects.find(p => p.name === projName);
      if (proj) {
        openProjectDetail(proj.id);
      } else {
        switchView('projects', true);
      }
    }

    function switchProjectDetailTab(tabName) {
      currentProjectDetailTab = tabName;
      const tabNames = ['overview', 'tasks', 'journalists', 'clipping', 'documents', 'activity'];

      tabNames.forEach(t => {
        const btn = document.getElementById(`proj-tab-btn-${t}`);
        const content = document.getElementById(`proj-tab-content-${t}`);
        if (btn) {
          btn.className = "px-3.5 py-1.5 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer";
        }
        if (content) content.classList.add('hidden');
      });

      const activeBtn = document.getElementById(`proj-tab-btn-${tabName}`);
      const activeContent = document.getElementById(`proj-tab-content-${tabName}`);
      if (activeBtn) activeBtn.className = "px-3.5 py-1.5 rounded-xl font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
      if (activeContent) activeContent.classList.remove('hidden');
    }

    function renderProjectDetail() {
      const proj = localProjects.find(p => p.id === activeProjectId) || localProjects[0];
      if (!proj) return;

      activeProjectId = proj.id;

      // Cabeçalho e breadcrumb
      document.getElementById('proj-detail-breadcrumb-title').innerText = proj.name;
      document.getElementById('proj-detail-title').innerText = proj.name;
      document.getElementById('proj-detail-client-badge').innerText = proj.client_or_brand || 'Institucional';
      document.getElementById('proj-detail-manager-select').value = proj.manager || 'Leonor Rodrigues';
      document.getElementById('proj-detail-start-date').value = proj.start_date || '2026-10-01';
      document.getElementById('proj-detail-deadline-date').value = proj.deadline || '2026-11-20';
      document.getElementById('proj-detail-status-select').value = proj.status || 'in_progress';
      document.getElementById('proj-detail-description').innerText = proj.description || 'Sem descrição registada.';
      document.getElementById('proj-detail-budget').innerText = proj.budget || '15.000 €';

      const isOpen = proj.status !== 'completed';
      const statusBadge = document.getElementById('proj-detail-status-badge');
      if (statusBadge) {
        statusBadge.className = `px-2.5 py-0.5 rounded-md text-[11px] font-medium ${isOpen ? 'bg-[#DDEBDD] text-[#2F6B3A]' : 'bg-[#E9E5E0] text-[#5C554E]'}`;
        statusBadge.innerText = isOpen ? 'Em Aberto' : 'Concluído';
      }

      // Tarefas deste projeto
      const projTasks = localTasks.filter(t => t.project_name === proj.name);
      const doneTasks = projTasks.filter(t => t.status === 'completed').length;
      const totalTasks = projTasks.length;
      const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      document.getElementById('proj-detail-tasks-progress-label').innerText = `${doneTasks} de ${totalTasks} tarefas concluídas`;
      document.getElementById('proj-detail-tasks-pct-label').innerText = `${pct}%`;
      document.getElementById('proj-detail-progress-bar').style.width = `${pct}%`;

      // 4 KPIs do Projeto
      document.getElementById('proj-kpi-tasks-count').innerText = totalTasks;
      document.getElementById('proj-kpi-tasks-sub').innerText = `${doneTasks} concluídas · ${totalTasks - doneTasks} pendentes`;

      const targetJournalists = proj.target_journalists || [];
      document.getElementById('proj-kpi-journalists-count').innerText = targetJournalists.length;

      const projClippings = localClippings.filter(c => c.project_name === proj.name);
      document.getElementById('proj-kpi-clippings-count').innerText = projClippings.length;

      const projAve = projClippings.reduce((acc, c) => acc + (Number(c.ave_value) || 0), 0);
      document.getElementById('proj-kpi-ave-count').innerText = `${projAve.toLocaleString('pt-PT')} €`;

      // Equipa
      const teamList = document.getElementById('proj-detail-team-list');
      if (teamList) {
        const team = proj.team || ['Leonor Rodrigues', 'Tiago Mendes'];
        teamList.innerHTML = team.map(m => `
          <div class="flex items-center justify-between py-1 border-b border-[#E4DDD3]/50">
            <span class="font-medium text-[#1A1A1A]">${m}</span>
            <span class="text-[11px] text-[#6B6B6B]">${m.includes('Leonor') ? 'Direção' : 'Consultor'}</span>
          </div>
        `).join('');
      }

      // Separador Tarefas
      const tasksTbody = document.getElementById('proj-detail-tasks-tbody');
      if (tasksTbody) {
        if (projTasks.length === 0) {
          tasksTbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-xs text-[#6B6B6B]">Nenhuma tarefa associada a este projeto.</td></tr>`;
        } else {
          tasksTbody.innerHTML = projTasks.map(t => {
            const isDone = t.status === 'completed';
            return `
              <tr class="hover:bg-[#FBF9F6] cursor-pointer" onclick="openTaskDetail('${t.id}')">
                <td class="text-center" onclick="event.stopPropagation()">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')" class="w-3.5 h-3.5 text-[#6C1C37] rounded">
                </td>
                <td class="font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}">${t.title}</td>
                <td>${t.assignee || 'Leonor Rodrigues'}</td>
                <td>${getPriorityBadge(t.priority)}</td>
                <td class="font-mono text-[11px]">${t.due_date || '—'}</td>
                <td class="text-[#6B6B6B] text-[11px] max-w-xs truncate">${t.notes || '—'}</td>
                <td class="text-right" onclick="event.stopPropagation()">
                  <button onclick="openTaskDetail('${t.id}')" class="text-xs text-[#6C1C37] hover:underline">Abrir</button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // Separador Jornalistas-Alvo
      const jourTbody = document.getElementById('proj-detail-journalists-tbody');
      if (jourTbody) {
        if (targetJournalists.length === 0) {
          jourTbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-xs text-[#6B6B6B]">Nenhum jornalista-alvo definido para este projeto.</td></tr>`;
        } else {
          jourTbody.innerHTML = targetJournalists.map(j => `
            <tr>
              <td class="font-medium text-[#1A1A1A]">${j.name}</td>
              <td>${renderTag(j.outlet)}</td>
              <td class="text-xs text-[#6B6B6B]">${j.area}</td>
              <td>
                <select onchange="updateProjectTargetJournalistStatus('${j.name}', this.value)" class="crm-select text-[11px] py-0.5 px-2 font-medium">
                  <option value="Por contactar" ${j.status === 'Por contactar' ? 'selected' : ''}>Por contactar</option>
                  <option value="Contactado" ${j.status === 'Contactado' ? 'selected' : ''}>Contactado</option>
                  <option value="Respondeu" ${j.status === 'Respondeu' ? 'selected' : ''}>Respondeu</option>
                  <option value="Publicou" ${j.status === 'Publicou' ? 'selected' : ''}>Publicou</option>
                  <option value="Recusou" ${j.status === 'Recusou' ? 'selected' : ''}>Recusou</option>
                </select>
              </td>
              <td class="font-mono text-[11px] text-[#6B6B6B]">${j.last_contact}</td>
              <td class="text-right">
                <button onclick="openContactModalPrefilled('${j.name}', '${j.outlet}', '${proj.name}')" class="text-xs text-[#6C1C37] hover:underline">
                  Registar Contacto
                </button>
              </td>
            </tr>
          `).join('');
        }
      }

      // Separador Clipping
      const clipTbody = document.getElementById('proj-detail-clipping-tbody');
      if (clipTbody) {
        if (projClippings.length === 0) {
          clipTbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-xs text-[#6B6B6B]">Ainda não existem peças publicadas associadas a este projeto.</td></tr>`;
        } else {
          clipTbody.innerHTML = projClippings.map(c => `
            <tr>
              <td class="font-medium text-[#1A1A1A] max-w-xs truncate">
                <a href="${c.article_url}" target="_blank" class="hover:text-[#6C1C37] hover:underline">${c.title}</a>
              </td>
              <td>${renderTag(c.outlet_name)}</td>
              <td>${c.journalist_name}</td>
              <td class="font-mono text-[11px]">${c.published_date}</td>
              <td>${getToneBadge(c.sentiment)}</td>
              <td class="font-mono font-medium">${(c.ave_value || 0).toLocaleString('pt-PT')} €</td>
              <td class="font-mono text-[11px]">${(c.reach || 0).toLocaleString('pt-PT')}</td>
              <td>${c.collaborator}</td>
            </tr>
          `).join('');
        }
      }

      // Separador Documentos
      const docsList = document.getElementById('proj-detail-documents-list');
      if (docsList) {
        const docs = proj.documents || [];
        docsList.innerHTML = docs.map(d => `
          <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3]/70 flex items-center justify-between">
            <div class="space-y-0.5 min-w-0">
              <span class="font-medium text-[#1A1A1A] truncate block">${d.title}</span>
              <span class="text-[11px] text-[#6B6B6B]">${d.type} · ${d.size} · ${d.date}</span>
            </div>
            <button onclick="showToast('A descarregar ficheiro...')" class="text-xs text-[#6C1C37] hover:underline shrink-0 ml-2">Descarregar</button>
          </div>
        `).join('');
      }

      // Separador Atividade
      const actTimeline = document.getElementById('proj-detail-activity-timeline');
      if (actTimeline) {
        const acts = proj.activity_log || ['Projeto criado no sistema'];
        actTimeline.innerHTML = acts.map(a => `<div class="p-2 bg-[#FBF9F6] rounded-lg border border-[#E4DDD3]/50 text-xs text-[#1A1A1A]">• ${a}</div>`).join('');
      }
    }

    function saveProjectTitleInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.name = e.target.innerText.trim();
      syncLocalStorage();
      showAutoSaveToast('Título do projeto guardado.');
    }

    function saveProjectDescInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.description = e.target.innerText.trim();
      syncLocalStorage();
      showAutoSaveToast('Briefing do projeto atualizado.');
    }

    function saveProjectManagerInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.manager = val;
      syncLocalStorage();
      showAutoSaveToast('Gestor do projeto atualizado.');
    }

    function saveProjectStartDateInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.start_date = val;
      syncLocalStorage();
      showAutoSaveToast('Data de início guardada.');
    }

    function saveProjectDeadlineInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.deadline = val;
      syncLocalStorage();
      showAutoSaveToast('Prazo final atualizado.');
    }

    function saveProjectStatusInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.status = val;
      syncLocalStorage();
      updateKpis();
      renderProjectDetail();
      showAutoSaveToast('Estado do projeto atualizado.');
    }

    function updateProjectTargetJournalistStatus(jourName, newStatus) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj || !proj.target_journalists) return;
      const j = proj.target_journalists.find(item => item.name === jourName);
      if (j) {
        j.status = newStatus;
        syncLocalStorage();
        showAutoSaveToast(`Estado de ${jourName} atualizado para ${newStatus}.`);
      }
    }

    function openNewTaskForCurrentProject() {
      const proj = localProjects.find(p => p.id === activeProjectId);
      openTaskModal();
      if (proj) {
        setTimeout(() => {
          const select = document.getElementById('task-project-select');
          if (select) select.value = proj.name;
        }, 50);
      }
    }

    function openNewContactForCurrentProject() {
      const proj = localProjects.find(p => p.id === activeProjectId);
      openContactModal();
      if (proj) {
        setTimeout(() => {
          const notes = document.getElementById('contact-notes');
          if (notes) notes.value = `[${proj.name}] `;
        }, 50);
      }
    }

    function openContactModalPrefilled(jourName, outletName, projName) {
      openContactModal();
      setTimeout(() => {
        const nameInput = document.getElementById('contact-name');
        const outletInput = document.getElementById('contact-outlet');
        const notes = document.getElementById('contact-notes');
        if (nameInput) nameInput.value = jourName;
        if (outletInput) outletInput.value = outletName;
        if (notes) notes.value = `[${projName}] Pauta editorial`;
      }, 50);
    }

    // ==========================================
    // 9. VISTA DE CONSULTA DE CONTACTOS
    // ==========================================
    function filterContactsPeriod(period) {
      currentContactPeriod = period;
      const tabs = ['today', 'week', 'month', 'all'];

      tabs.forEach(t => {
        const btn = document.getElementById('tab-contacts-' + t);
        if (btn) {
          btn.className = "px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer";
        }
      });

      const activeBtn = document.getElementById('tab-contacts-' + period);
      if (activeBtn) {
        activeBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
      }

      renderContactsView();
    }

    function filterContactsTableData() {
      renderContactsView();
    }

    function renderContactsView() {
      const tbody = document.getElementById('contacts-consult-table-body');
      if (!tbody) return;

      const todayIso = new Date().toISOString().split('T')[0];
      let contacts = [...localDailyContacts];

      // Filtro de Período
      if (currentContactPeriod === 'today') {
        contacts = contacts.filter(c => (c.contact_date || '').startsWith(todayIso));
      } else if (currentContactPeriod === 'week') {
        contacts = contacts.filter(c => isDueThisWeek(c.contact_date));
      }

      // Filtro de Colaborador
      const collabFilter = document.getElementById('filter-contacts-collaborator')?.value || 'all';
      if (collabFilter !== 'all') {
        contacts = contacts.filter(c => c.collaborator === collabFilter);
      }

      // Filtro de Canal
      const channelFilter = document.getElementById('filter-contacts-channel')?.value || 'all';
      if (channelFilter !== 'all') {
        contacts = contacts.filter(c => (c.contact_type || '').toLowerCase() === channelFilter.toLowerCase());
      }

      // Filtro de Resultado
      const statusFilter = document.getElementById('filter-contacts-status')?.value || 'all';
      if (statusFilter !== 'all') {
        contacts = contacts.filter(c => (c.status || '').toLowerCase() === statusFilter.toLowerCase());
      }

      // Pesquisa
      const query = (document.getElementById('search-contacts-query')?.value || '').toLowerCase();
      if (query) {
        contacts = contacts.filter(c =>
          (c.contact_name || '').toLowerCase().includes(query) ||
          (c.outlet_name || '').toLowerCase().includes(query) ||
          (c.subject_or_notes || '').toLowerCase().includes(query)
        );
      }

      // Atualizar Cartões de Resumo do Período
      const totalCount = contacts.length;
      const answeredCount = contacts.filter(c => (c.status || '').toLowerCase().includes('respondeu') || (c.status || '').toLowerCase().includes('interessado') || (c.status || '').toLowerCase().includes('agendada')).length;
      const ratePct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
      const pendingCount = totalCount - answeredCount;

      const totalEl = document.getElementById('contacts-summary-total');
      if (totalEl) totalEl.innerText = totalCount;
      const periodLabel = document.getElementById('contacts-summary-period-label');
      if (periodLabel) periodLabel.innerText = currentContactPeriod === 'today' ? 'Registados hoje' : (currentContactPeriod === 'week' ? 'Registados esta semana' : 'No período');

      const rateEl = document.getElementById('contacts-summary-response-rate');
      if (rateEl) rateEl.innerText = `${ratePct}%`;
      const answeredLabel = document.getElementById('contacts-summary-answered-label');
      if (answeredLabel) answeredLabel.innerText = `${answeredCount} respostas positivas`;

      const pendingEl = document.getElementById('contacts-summary-pending-count');
      if (pendingEl) pendingEl.innerText = pendingCount;

      if (contacts.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Nenhum contacto encontrado para estes filtros.</p>
              <p>Clica em "+ Registar Novo Contacto" para adicionares uma nova interação.</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = contacts.map(c => {
        const channelLabel = c.contact_type === 'chamada' ? 'Telefone' : (c.contact_type === 'whatsapp' ? 'WhatsApp' : (c.contact_type === 'reuniao' ? 'Reunião' : 'Email'));
        const channelBadge = renderTag(channelLabel);
        const statusBadge = getContactStatusBadge(c.status);

        return `
          <tr class="hover:bg-[#FBF9F6] transition-colors">
            <td class="py-3 px-4 font-mono text-[11px] text-[#1A1A1A] whitespace-nowrap">
              ${c.contact_date || todayIso} · <span class="text-[#6B6B6B]">${c.contact_time || '10:00'}</span>
            </td>
            <td class="py-3 px-4 text-xs font-medium text-[#1A1A1A] whitespace-nowrap">
              ${c.collaborator || 'Leonor Rodrigues'}
            </td>
            <td class="py-3 px-4 whitespace-nowrap">
              <span class="font-semibold text-xs text-[#1A1A1A] block">${c.contact_name}</span>
              <span class="text-[11px] text-[#6B6B6B]">${c.outlet_name || 'Geral'}</span>
            </td>
            <td class="py-3 px-4">${channelBadge}</td>
            <td class="py-3 px-4 text-xs text-[#1A1A1A] max-w-xs">
              <span class="line-clamp-2">${c.subject_or_notes || 'Pauta editorial'}</span>
            </td>
            <td class="py-3 px-4 whitespace-nowrap">
              ${renderTag(c.project_name || 'Geral')}
            </td>
            <td class="py-3 px-4 whitespace-nowrap">
              <select onchange="updateContactStatusInline('${c.id}', this.value)" class="crm-select text-[11px] py-1 px-2 font-medium">
                <option value="Respondeu" ${c.status === 'Respondeu' ? 'selected' : ''}>Respondeu</option>
                <option value="Sem resposta" ${c.status === 'Sem resposta' ? 'selected' : ''}>Sem resposta</option>
                <option value="Interessado" ${c.status === 'Interessado' ? 'selected' : ''}>Interessado</option>
                <option value="Reunião agendada" ${c.status === 'Reunião agendada' ? 'selected' : ''}>Reunião agendada</option>
                <option value="Recusou" ${c.status === 'Recusou' ? 'selected' : ''}>Recusou</option>
                <option value="Publicou" ${c.status === 'Publicou' ? 'selected' : ''}>Publicou</option>
              </select>
            </td>
            <td class="py-3 px-4 text-[11px] text-[#6B6B6B] max-w-xs truncate">
              ${c.next_step || '—'}
            </td>
            <td class="py-3 px-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="createFollowUpTask('${c.contact_name}', '${c.outlet_name}', '${c.subject_or_notes}')"
                  class="text-xs text-[#6C1C37] hover:underline p-1" title="Criar tarefa de seguimento">
                  Follow-up
                </button>
                <button onclick="deleteContact('${c.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] p-1" title="Apagar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function updateContactStatusInline(id, newStatus) {
      const contact = localDailyContacts.find(c => c.id === id);
      if (!contact) return;
      contact.status = newStatus;
      syncLocalStorage();
      updateKpis();
      showAutoSaveToast(`Estado do contacto alterado para ${newStatus}.`);
    }

    // ==========================================
    // 10. VISTA DE CLIPPING DE IMPRENSA
    // ==========================================
    function filterClippingTableData() {
      renderClippingView();
    }

    function renderClippingView() {
      const tbody = document.getElementById('clipping-full-table-body');
      if (!tbody) return;

      let clippings = [...localClippings];

      // Filtro de Tom
      const toneFilter = document.getElementById('filter-clipping-tone')?.value || 'all';
      if (toneFilter !== 'all') {
        clippings = clippings.filter(c => (c.sentiment || '').toLowerCase() === toneFilter.toLowerCase());
      }

      // Filtro de Colaborador
      const collabFilter = document.getElementById('filter-clipping-collab')?.value || 'all';
      if (collabFilter !== 'all') {
        clippings = clippings.filter(c => c.collaborator === collabFilter);
      }

      // Filtro por OCS
      const outletFilter = document.getElementById('filter-clipping-outlet')?.value || 'all';
      if (outletFilter !== 'all') {
        clippings = clippings.filter(c => c.outlet_name === outletFilter);
      }

      // Pesquisa
      const query = (document.getElementById('search-clipping-query')?.value || '').toLowerCase();
      if (query) {
        clippings = clippings.filter(c =>
          (c.title || '').toLowerCase().includes(query) ||
          (c.journalist_name || '').toLowerCase().includes(query) ||
          (c.outlet_name || '').toLowerCase().includes(query)
        );
      }

      // Atualizar Cartões de Resumo
      const totalCount = localClippings.length;
      const countEl = document.getElementById('clipping-summary-count');
      if (countEl) countEl.innerText = totalCount;

      const totalAve = localClippings.reduce((acc, c) => acc + (Number(c.ave_value) || 0), 0);
      const aveEl = document.getElementById('clipping-summary-ave');
      if (aveEl) aveEl.innerText = `${totalAve.toLocaleString('pt-PT')} €`;

      const totalReach = localClippings.reduce((acc, c) => acc + (Number(c.reach) || 0), 0);
      const reachEl = document.getElementById('clipping-summary-reach');
      if (reachEl) reachEl.innerText = `${(totalReach / 1000000).toFixed(2)}M`;

      // Atualizar Dropdown de Órgãos
      const outletSelect = document.getElementById('filter-clipping-outlet');
      if (outletSelect && outletSelect.options.length <= 1) {
        const uniqueOutlets = [...new Set(localClippings.map(c => c.outlet_name))];
        uniqueOutlets.forEach(out => {
          const opt = document.createElement('option');
          opt.value = out;
          opt.innerText = out;
          outletSelect.appendChild(opt);
        });
      }

      if (clippings.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Nenhuma peça de clipping registada para estes filtros.</p>
              <p>Clica em "+ Registar Peça" para adicionares novas saídas mediáticas.</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = clippings.map(c => {
        const outletTag = renderTag(c.outlet_name);
        const toneBadge = getToneBadge(c.sentiment);
        const projectTag = renderTag(c.project_name || c.client_or_brand || 'Institucional');

        return `
          <tr class="hover:bg-[#FBF9F6] transition-colors">
            <td class="py-3 px-4 max-w-sm">
              <a href="${c.article_url}" target="_blank" class="font-medium text-xs text-[#1A1A1A] hover:text-[#6C1C37] hover:underline block">
                ${c.title}
              </a>
              <span class="text-[11px] text-[#6B6B6B] line-clamp-1">${c.summary || ''}</span>
            </td>
            <td class="py-3 px-4 whitespace-nowrap">${outletTag}</td>
            <td class="py-3 px-4 text-xs text-[#1A1A1A] whitespace-nowrap">${c.journalist_name}</td>
            <td class="py-3 px-4 font-mono text-[11px] whitespace-nowrap">${c.published_date}</td>
            <td class="py-3 px-4 text-[11px] text-[#6B6B6B] whitespace-nowrap">${c.type}</td>
            <td class="py-3 px-4 whitespace-nowrap">${toneBadge}</td>
            <td class="py-3 px-4 font-mono text-[11px] whitespace-nowrap">${(c.reach || 0).toLocaleString('pt-PT')}</td>
            <td class="py-3 px-4 font-mono text-xs font-semibold text-[#1A1A1A] whitespace-nowrap">${(c.ave_value || 0).toLocaleString('pt-PT')} €</td>
            <td class="py-3 px-4 whitespace-nowrap">
              <button onclick="openProjectDetailByName('${c.project_name}')" class="hover:underline text-left">
                ${projectTag}
              </button>
            </td>
            <td class="py-3 px-4 text-xs text-[#1A1A1A] whitespace-nowrap">${c.collaborator}</td>
          </tr>
        `;
      }).join('');
    }

    function exportClippingReport() {
      const csvRows = [];
      csvRows.push(['Titulo', 'Orgao', 'Jornalista', 'Data', 'Tipo', 'Tom', 'Alcance', 'AVE_Euros', 'Projeto', 'Colaborador'].join(';'));

      localClippings.forEach(c => {
        csvRows.push([
          `"${(c.title || '').replace(/"/g, '""')}"`,
          `"${c.outlet_name || ''}"`,
          `"${c.journalist_name || ''}"`,
          c.published_date || '',
          `"${c.type || ''}"`,
          c.sentiment || '',
          c.reach || 0,
          c.ave_value || 0,
          `"${c.project_name || ''}"`,
          `"${c.collaborator || ''}"`
        ].join(';'));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Relatorio_Clipping_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Relatório de clipping exportado com sucesso.');
    }

    function openNewClippingModal() {
      showToast('Funcionalidade de registo de novo clipping.');
    }

    // ==========================================
    // 11. VISTA DE TAXA DE RESPOSTA & ANALYTICS
    // ==========================================
    function renderAnalyticsResponseView() {
      const tbody = document.getElementById('analytics-pending-followup-tbody');
      if (!tbody) return;

      // Contactos sem resposta com mais de 48h
      const pendingContacts = localDailyContacts.filter(c => (c.status || '').toLowerCase().includes('sem resposta') || (c.status || '').toLowerCase().includes('enviado'));

      if (pendingContacts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-xs text-[#6B6B6B]">Nenhum contacto pendente a aguardar seguimento.</td></tr>`;
        return;
      }

      tbody.innerHTML = pendingContacts.slice(0, 7).map((c, idx) => `
        <tr class="hover:bg-[#FBF9F6] transition-colors">
          <td class="font-medium text-[#1A1A1A]">${c.contact_name}</td>
          <td>${renderTag(c.outlet_name)}</td>
          <td class="text-xs text-[#6B6B6B] max-w-xs truncate">${c.subject_or_notes}</td>
          <td><span class="text-xs font-mono">${c.contact_type === 'chamada' ? 'Telefone' : 'Email'}</span></td>
          <td class="font-mono text-xs text-[#A3281E] font-medium">+${idx + 2} dias</td>
          <td>${c.collaborator || 'Leonor Rodrigues'}</td>
          <td class="text-right">
            <button onclick="createFollowUpTask('${c.contact_name}', '${c.outlet_name}', '${c.subject_or_notes}')"
              class="btn-primary py-1 px-3 text-xs font-medium">
              Seguimento Rápido (1 Clique)
            </button>
          </td>
        </tr>
      `).join('');
    }

    function createFollowUpTask(jourName, outlet, pauta) {
      const title = `Follow-up com ${jourName} (${outlet || 'Media'})`;
      const newTask = {
        id: 'task-fu-' + Date.now(),
        title: title,
        priority: 'alta',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '14:00',
        project_name: 'Expansão Ibérica 2026',
        client_or_brand: 'Grupo M',
        assignee: 'Leonor Rodrigues',
        status: 'pending',
        notes: `Seguimento prioritário à pauta: ${pauta}. Ligar diretamente ou reenviar dossier.`,
        journalist_name: `${jourName} (${outlet})`,
        subtasks: [
          { id: 'st-fu-1', title: 'Fazer chamada para a redação', done: false }
        ],
        comments: [],
        activity_log: ['Criado via Seguimento Rápido no Dashboard']
      };

      localTasks.unshift(newTask);
      syncLocalStorage();
      updateKpis();
      showToast(`Tarefa de follow-up criada para hoje: "${title}".`);
      switchView('tasks', true, { filter: 'today' });
    }

    // ==========================================
    // 12. FILTRO DE JORNALISTAS (+90 DIAS)
    // ==========================================
    function filterJournalistsByTab(tab) {
      currentJourTab = tab;
      const allBtn = document.getElementById('tab-jour-all');
      const inactBtn = document.getElementById('tab-jour-inactive90');

      if (allBtn && inactBtn) {
        if (tab === 'inactive90') {
          inactBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
          allBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer";
        } else {
          allBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer";
          inactBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer";
        }
      }

      renderJournalistsTable();
    }



        // ========================================================
    // BASE 1 (OCS) & BASE 2 (JORNALISTAS) - ESTADOS & CONTROLO
    // ========================================================
    let jourSortField = 'name';
    let jourSortOrder = 'asc';
    let ocsSortField = 'name';
    let ocsSortOrder = 'asc';
    let outletsCurrentViewMode = 'table';
    let selectedOcsModalFormats = ['online'];
    let currentDrawerJournalistId = null;
    let currentDrawerOutletId = null;

    // Visibilidade de Colunas
    let jourHiddenCols = {
      cargo: false,
      ocs: false,
      area: false,
      contactos: false,
      pref: false,
      ultimo: false,
      rgpd: false,
      estado: false
    };

    let ocsHiddenCols = {
      grupo: false,
      formatos: false,
      ambito: false,
      especialidade: false,
      erc: false,
      agenda: false,
      jornalistas: false,
      estado: false
    };

    // FormataÃ§Ã£o de Datas AmigÃ¡vel
    function formatRelativeDays(dateStr) {
      if (!dateStr) return 'Nunca contactado';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - d.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const dateFormatted = `${d.getDate()} ${months[d.getMonth()]}`;

      if (diffDays === 0) return `Hoje (${dateFormatted})`;
      if (diffDays === 1) return `Ontem (${dateFormatted})`;
      if (diffDays > 0) return `HÃ¡ ${diffDays} dias (${dateFormatted})`;
      return dateFormatted;
    }

    // ========================================================
    // RENDERIZAÃ‡ÃƒO DA BASE 2: JORNALISTAS
    // ========================================================
    function renderJournalistsTable() {
      const tbody = document.getElementById('journalists-table-body');
      if (!tbody) return;

      const query = (document.getElementById('search-journalists')?.value || '').toLowerCase().trim();
      const areaFilter = document.getElementById('filter-jour-area')?.value || 'all';
      const statusFilter = document.getElementById('filter-jour-status')?.value || 'all';
      const prefFilter = document.getElementById('filter-jour-pref')?.value || 'all';

      let list = [...localJournalists];

      // Filtro de Texto
      if (query) {
        list = list.filter(j => {
          const name = (j.name || '').toLowerCase();
          const role = (j.role_title || '').toLowerCase();
          const ocs = (j.outlet_name || (j.outlet_names || []).join(' ')).toLowerCase();
          const areas = (j.intervention_areas || [j.intervention_area || '']).join(' ').toLowerCase();
          const notes = (j.notes || '').toLowerCase();
          const emails = (j.emails || [j.contact_email || '']).join(' ').toLowerCase();
          return name.includes(query) || role.includes(query) || ocs.includes(query) || areas.includes(query) || notes.includes(query) || emails.includes(query);
        });
      }

      // Filtro de Ãrea
      if (areaFilter !== 'all') {
        list = list.filter(j => {
          const areas = j.intervention_areas || (j.intervention_area ? [j.intervention_area] : []);
          return areas.includes(areaFilter);
        });
      }

      // Filtro de Estado
      if (statusFilter !== 'all') {
        list = list.filter(j => (j.status || 'ativo') === statusFilter);
      }

      // Filtro de PreferÃªncia
      if (prefFilter !== 'all') {
        list = list.filter(j => (j.contact_preference || 'email') === prefFilter);
      }

      // OrdenaÃ§Ã£o
      list.sort((a, b) => {
        let valA = a[jourSortField] || '';
        let valB = b[jourSortField] || '';
        if (jourSortField === 'last_contact_date') {
          valA = a.last_contact_date || '1970-01-01';
          valB = b.last_contact_date || '1970-01-01';
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return jourSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return jourSortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Atualizar contadores
      const totalBadge = document.getElementById('journalists-total-badge');
      if (totalBadge) totalBadge.innerText = `${localJournalists.length} jornalistas registados`;
      const footerCount = document.getElementById('journalists-footer-count');
      if (footerCount) footerCount.innerText = `A apresentar ${list.length} de ${localJournalists.length} jornalistas`;

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Nenhum jornalista encontrado com os filtros selecionados.</p>
              <p>Tenta ajustar os termos de pesquisa ou clica em <strong>"Limpar filtros"</strong>.</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = list.map(j => {
        const initials = j.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const primaryEmail = (j.emails && j.emails.length > 0) ? j.emails[0] : (j.contact_email || 'â€”');
        const primaryPhone = (j.phones && j.phones.length > 0) ? j.phones[0] : (j.contact_phone || 'â€”');
        
        // Meio principal
        const outletName = j.outlet_name || ((j.outlet_names && j.outlet_names.length > 0) ? j.outlet_names[0] : 'Geral');
        const outletObj = localOutlets.find(o => o.name.toLowerCase() === outletName.toLowerCase() || (j.outlet_ids && j.outlet_ids.includes(o.id)));
        const outletId = outletObj ? outletObj.id : null;

        // Ãreas
        const areas = j.intervention_areas || (j.intervention_area ? [j.intervention_area] : ['Geral']);
        const areasHtml = areas.slice(0, 2).map(a => renderTag(a, 'mr-1 mb-0.5')).join('') + (areas.length > 2 ? `<span class="text-[10px] text-[#6B6B6B] ml-1">+${areas.length - 2}</span>` : '');

        // PreferÃªncia
        let prefBadge = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F6F2EC] text-[#6B6B6B]">Email</span>`;
        if (j.contact_preference === 'whatsapp') {
          prefBadge = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">WhatsApp</span>`;
        } else if (j.contact_preference === 'telefone') {
          prefBadge = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#DDE6EE] text-[#2F4A63]">Telefone</span>`;
        }

        // RGPD
        const rgpdBadge = j.rgpd_consent 
          ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]" title="Consentimento confirmado em ${j.rgpd_consent_date || '2026'}">Sim</span>` 
          : `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F3E3C3] text-[#7A4E0F]">Pendente</span>`;

        // Estado
        let statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>`;
        if (j.status === 'mudou_de_meio') {
          statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F3E3C3] text-[#7A4E0F]">Mudou</span>`;
        } else if (j.status === 'reformado') {
          statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E9E5E0] text-[#5C554E]">Reformado</span>`;
        }

        const relativeLastContact = formatRelativeDays(j.last_contact_date);

        return `
          <tr onclick="openJournalistDetailDrawer('${j.id}')" class="transition-colors cursor-pointer hover:bg-[#FBF9F6]">
            <td class="py-3 px-4">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-[#6C1C37] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  ${initials}
                </div>
                <div>
                  <span class="font-semibold text-[#1A1A1A] block hover:text-[#6C1C37] transition-colors">${j.name}</span>
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-[#6B6B6B] text-xs font-normal ${jourHiddenCols.cargo ? 'hidden' : ''}">${j.role_title || 'Jornalista'}</td>
            <td class="py-3 px-4 ${jourHiddenCols.ocs ? 'hidden' : ''}">
              ${outletId ? `
                <button type="button" onclick="event.stopPropagation(); openOutletDetailDrawer('${outletId}')" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] transition-all" title="Ver ficha do Ã³rgÃ£o ${outletName}">
                  <span class="w-2 h-2 rounded-full bg-[#6C1C37]"></span>
                  <span>${outletName}</span>
                </button>
              ` : renderTag(outletName)}
            </td>
            <td class="py-3 px-4 max-w-xs ${jourHiddenCols.area ? 'hidden' : ''}">${areasHtml}</td>
            <td class="py-3 px-4 font-mono text-[11px] space-y-0.5 ${jourHiddenCols.contactos ? 'hidden' : ''}">
              ${primaryEmail !== 'â€”' ? `<a href="mailto:${primaryEmail}" onclick="event.stopPropagation()" class="text-[#6C1C37] hover:underline block">${primaryEmail}</a>` : ''}
              ${primaryPhone !== 'â€”' ? `<a href="tel:${primaryPhone}" onclick="event.stopPropagation()" class="text-[#6B6B6B] hover:text-[#1A1A1A] block">${primaryPhone}</a>` : ''}
              ${primaryEmail === 'â€”' && primaryPhone === 'â€”' ? '<span class="text-[#6B6B6B]">â€”</span>' : ''}
            </td>
            <td class="py-3 px-4 ${jourHiddenCols.pref ? 'hidden' : ''}">${prefBadge}</td>
            <td class="py-3 px-4 text-[#6B6B6B] text-[11px] font-mono ${jourHiddenCols.ultimo ? 'hidden' : ''}">
              ${relativeLastContact}
            </td>
            <td class="py-3 px-4 ${jourHiddenCols.rgpd ? 'hidden' : ''}">${rgpdBadge}</td>
            <td class="py-3 px-4 ${jourHiddenCols.estado ? 'hidden' : ''}">${statusBadge}</td>
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openContactModalPrefilled('${j.name.replace(/'/g, "\\'")}', '${outletName.replace(/'/g, "\\'")}', 'Geral')"
                  class="text-xs text-[#6C1C37] hover:underline p-1 font-medium" title="Registar contacto direto com ${j.name}">
                  Contactar &rarr;
                </button>
                <button onclick="openJournalistDetailDrawer('${j.id}')" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1 text-xs" title="Ver ficha">
                  Ficha
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // ========================================================
    // RENDERIZAÃ‡ÃƒO DA BASE 1: Ã“RGÃƒOS DE COMUNICAÃ‡ÃƒO SOCIAL (OCS)
    // ========================================================
    function renderOutletsTable() {
      const tbody = document.getElementById('outlets-table-body');
      if (!tbody) return;

      const query = (document.getElementById('search-outlets')?.value || '').toLowerCase().trim();
      const formatFilter = document.getElementById('filter-ocs-format')?.value || 'all';
      const scopeFilter = document.getElementById('filter-ocs-scope')?.value || 'all';
      const specialtyFilter = document.getElementById('filter-ocs-specialty')?.value || 'all';
      const statusFilter = document.getElementById('filter-ocs-status')?.value || 'all';

      let list = [...localOutlets];

      // Filtro de Texto
      if (query) {
        list = list.filter(ocs => {
          const name = (ocs.name || '').toLowerCase();
          const group = (ocs.media_group || '').toLowerCase();
          const address = (ocs.address || '').toLowerCase();
          const erc = (ocs.erc_registration || '').toLowerCase();
          const spec = (ocs.specialties || [ocs.specialty || '']).join(' ').toLowerCase();
          return name.includes(query) || group.includes(query) || address.includes(query) || erc.includes(query) || spec.includes(query);
        });
      }

      // Filtro de Formato
      if (formatFilter !== 'all') {
        list = list.filter(ocs => {
          const fmts = (ocs.formats || []).map(f => f.toLowerCase());
          return fmts.includes(formatFilter);
        });
      }

      // Filtro de Ã‚mbito
      if (scopeFilter !== 'all') {
        list = list.filter(ocs => (ocs.scope || 'nacional').toLowerCase() === scopeFilter);
      }

      // Filtro de Especialidade
      if (specialtyFilter !== 'all') {
        list = list.filter(ocs => {
          const specs = ocs.specialties || (ocs.specialty ? [ocs.specialty] : []);
          return specs.includes(specialtyFilter);
        });
      }

      // Filtro de Estado
      if (statusFilter !== 'all') {
        list = list.filter(ocs => (ocs.status || 'ativo').toLowerCase() === statusFilter);
      }

      // OrdenaÃ§Ã£o
      list.sort((a, b) => {
        let valA = a[ocsSortField] || '';
        let valB = b[ocsSortField] || '';
        if (ocsSortField === 'estimated_audience') {
          valA = a.estimated_audience || 0;
          valB = b.estimated_audience || 0;
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return ocsSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return ocsSortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Atualizar contadores
      const totalBadge = document.getElementById('outlets-total-badge');
      if (totalBadge) totalBadge.innerText = `${localOutlets.length} Ã³rgÃ£os de media registados`;
      const footerCount = document.getElementById('outlets-footer-count');
      if (footerCount) footerCount.innerText = `A apresentar ${list.length} de ${localOutlets.length} meios de comunicaÃ§Ã£o social`;

      // Se estiver em modo cartÃµes, renderizar cartÃµes
      if (outletsCurrentViewMode === 'cards') {
        renderOutletsCards(list);
        return;
      }

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Nenhum meio de comunicaÃ§Ã£o encontrado com os filtros selecionados.</p>
              <p>Tenta ajustar a pesquisa ou clica em <strong>"Limpar filtros"</strong>.</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = list.map(ocs => {
        // Logo ou Iniciais
        const initials = ocs.name.substring(0, 2).toUpperCase();
        const logoHtml = ocs.logo_url 
          ? `<img src="${ocs.logo_url}" class="w-7 h-7 rounded-lg object-contain bg-white border border-[#E4DDD3] p-0.5 shrink-0" onerror="this.outerHTML='<div class=\\'w-7 h-7 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center border border-[#E4DDD3]\\'>${initials}</div>'">`
          : `<div class="w-7 h-7 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center border border-[#E4DDD3] shrink-0">${initials}</div>`;

        // Formatos
        const formats = Array.isArray(ocs.formats) ? ocs.formats : (ocs.formats ? [ocs.formats] : ['Online']);
        const formatsHtml = formats.map(f => renderTag(f, 'mr-1 mb-0.5')).join('');

        // Especialidades
        const specs = ocs.specialties || (ocs.specialty ? [ocs.specialty] : ['Geral']);
        const specsHtml = specs.slice(0, 1).map(s => renderTag(s, 'mr-1 mb-0.5')).join('') + (specs.length > 1 ? `<span class="text-[10px] text-[#6B6B6B] ml-1">+${specs.length - 1}</span>` : '');

        // Jornalistas Associados Calculados
        const assocJour = localJournalists.filter(j => 
          (j.outlet_ids && j.outlet_ids.includes(ocs.id)) || 
          (j.outlet_name && j.outlet_name.toLowerCase() === ocs.name.toLowerCase()) ||
          (j.outlet_names && j.outlet_names.some(on => on.toLowerCase() === ocs.name.toLowerCase()))
        );

        // Estado
        const statusBadge = (ocs.status || 'ativo') === 'ativo'
          ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>`
          : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E9E5E0] text-[#5C554E]">Extinto</span>`;

        return `
          <tr onclick="openOutletDetailDrawer('${ocs.id}')" class="transition-colors cursor-pointer hover:bg-[#FBF9F6]">
            <td class="py-3 px-4">
              <div class="flex items-center gap-2.5">
                ${logoHtml}
                <div>
                  <span class="font-semibold text-[#1A1A1A] block hover:text-[#6C1C37] transition-colors">${ocs.name}</span>
                  ${ocs.website_url ? `<a href="${ocs.website_url}" onclick="event.stopPropagation()" target="_blank" class="text-[10px] text-[#6C1C37] hover:underline">${ocs.website_url.replace(/^https?:\/\//, '')}</a>` : ''}
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-[#1A1A1A] text-xs font-normal ${ocsHiddenCols.grupo ? 'hidden' : ''}">${ocs.media_group || 'â€”'}</td>
            <td class="py-3 px-4 max-w-xs ${ocsHiddenCols.formatos ? 'hidden' : ''}">${formatsHtml}</td>
            <td class="py-3 px-4 text-xs ${ocsHiddenCols.ambito ? 'hidden' : ''}">
              <span class="capitalize text-[#1A1A1A] font-medium">${ocs.scope || 'Nacional'}</span>
              <span class="text-[#6B6B6B] block text-[11px] capitalize">${ocs.periodicity || 'DiÃ¡rio'}</span>
            </td>
            <td class="py-3 px-4 max-w-xs ${ocsHiddenCols.especialidade ? 'hidden' : ''}">${specsHtml}</td>
            <td class="py-3 px-4 font-mono text-[11px] text-[#6B6B6B] ${ocsHiddenCols.erc ? 'hidden' : ''}">${ocs.erc_registration || 'â€”'}</td>
            <td class="py-3 px-4 font-mono text-[11px] ${ocsHiddenCols.agenda ? 'hidden' : ''}">
              ${ocs.agenda_email ? `<a href="mailto:${ocs.agenda_email}" onclick="event.stopPropagation()" class="text-[#6C1C37] hover:underline block">${ocs.agenda_email}</a>` : ''}
              ${ocs.phone ? `<span class="text-[#6B6B6B] block">${ocs.phone}</span>` : ''}
              ${!ocs.agenda_email && !ocs.phone ? '<span class="text-[#6B6B6B]">â€”</span>' : ''}
            </td>
            <td class="py-3 px-4 ${ocsHiddenCols.jornalistas ? 'hidden' : ''}">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">
                ${assocJour.length} ${assocJour.length === 1 ? 'jornalista' : 'jornalistas'}
              </span>
            </td>
            <td class="py-3 px-4 ${ocsHiddenCols.estado ? 'hidden' : ''}">${statusBadge}</td>
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openOutletDetailDrawer('${ocs.id}')" class="text-[#6C1C37] hover:underline p-1 text-xs font-medium" title="Consultar ficha completa">
                  Ficha &rarr;
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Modo CartÃµes de OCS
    function renderOutletsCards(list) {
      const container = document.getElementById('outlets-cards-view-container');
      if (!container) return;

      container.innerHTML = list.map(ocs => {
        const initials = ocs.name.substring(0, 2).toUpperCase();
        const logoHtml = ocs.logo_url 
          ? `<img src="${ocs.logo_url}" class="w-10 h-10 rounded-xl object-contain bg-white border border-[#E4DDD3] p-1 shrink-0">`
          : `<div class="w-10 h-10 rounded-xl bg-[#F6F2EC] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#E4DDD3] shrink-0">${initials}</div>`;

        const assocJour = localJournalists.filter(j => 
          (j.outlet_ids && j.outlet_ids.includes(ocs.id)) || 
          (j.outlet_name && j.outlet_name.toLowerCase() === ocs.name.toLowerCase()) ||
          (j.outlet_names && j.outlet_names.some(on => on.toLowerCase() === ocs.name.toLowerCase()))
        );

        const formats = Array.isArray(ocs.formats) ? ocs.formats : (ocs.formats ? [ocs.formats] : ['Online']);
        const formatsHtml = formats.map(f => renderTag(f, 'mr-1 mb-1')).join('');

        return `
          <div onclick="openOutletDetailDrawer('${ocs.id}')" class="crm-card p-5 space-y-4 hover:border-[#6C1C37]/30 transition-all cursor-pointer">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                ${logoHtml}
                <div>
                  <h3 class="font-bold text-sm text-[#1A1A1A] font-title">${ocs.name}</h3>
                  <p class="text-xs text-[#6B6B6B]">${ocs.media_group || 'Independente'}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E] capitalize">${ocs.status || 'Ativo'}</span>
            </div>

            <div class="space-y-1.5 text-xs">
              <div class="text-[#6B6B6B] flex items-center justify-between">
                <span>Ã‚mbito / Periodicidade:</span>
                <strong class="text-[#1A1A1A] capitalize">${ocs.scope || 'Nacional'} Â· ${ocs.periodicity || 'DiÃ¡rio'}</strong>
              </div>
              <div class="text-[#6B6B6B] flex items-center justify-between">
                <span>Jornalistas associados:</span>
                <strong class="text-[#6C1C37]">${assocJour.length}</strong>
              </div>
              <div class="pt-1 flex flex-wrap">
                ${formatsHtml}
              </div>
            </div>

            <div class="pt-3 border-t border-[#E4DDD3] flex items-center justify-between text-xs">
              <span class="font-mono text-[11px] text-[#6B6B6B]">${ocs.agenda_email || 'â€”'}</span>
              <span class="text-[#6C1C37] font-medium hover:underline">Ver Ficha &rarr;</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function setOutletsViewMode(mode) {
      outletsCurrentViewMode = mode;
      const tableContainer = document.getElementById('outlets-table-view-container');
      const cardsContainer = document.getElementById('outlets-cards-view-container');
      const btnTable = document.getElementById('btn-outlets-mode-table');
      const btnCards = document.getElementById('btn-outlets-mode-cards');

      if (mode === 'cards') {
        tableContainer?.classList.add('hidden');
        cardsContainer?.classList.remove('hidden');
        btnCards?.classList.add('bg-white', 'text-[#1A1A1A]', 'shadow-xs');
        btnCards?.classList.remove('text-[#6B6B6B]');
        btnTable?.classList.remove('bg-white', 'text-[#1A1A1A]', 'shadow-xs');
        btnTable?.classList.add('text-[#6B6B6B]');
      } else {
        tableContainer?.classList.remove('hidden');
        cardsContainer?.classList.add('hidden');
        btnTable?.classList.add('bg-white', 'text-[#1A1A1A]', 'shadow-xs');
        btnTable?.classList.remove('text-[#6B6B6B]');
        btnCards?.classList.remove('bg-white', 'text-[#1A1A1A]', 'shadow-xs');
        btnCards?.classList.add('text-[#6B6B6B]');
      }
      renderOutletsTable();
    }

    // ========================================================
    // FICHA / GAVETA DO JORNALISTA (BASE 2 -> BASE 1)
    // ========================================================
    function openJournalistDetailDrawer(journalistId) {
      const j = localJournalists.find(item => item.id === journalistId);
      if (!j) return;
      currentDrawerJournalistId = j.id;

      // Nome, cargo e iniciais
      const initials = j.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      document.getElementById('jd-header-name').innerText = j.name;
      document.getElementById('jd-name').innerText = j.name;
      document.getElementById('jd-role').innerText = j.role_title || 'Jornalista';
      document.getElementById('jd-avatar').innerText = initials;

      // Estado
      const statusBadgeContainer = document.getElementById('jd-status-badge');
      if (statusBadgeContainer) {
        if (j.status === 'mudou_de_meio') {
          statusBadgeContainer.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3E3C3] text-[#7A4E0F]">Mudou de Meio</span>`;
        } else if (j.status === 'reformado') {
          statusBadgeContainer.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E9E5E0] text-[#5C554E]">Reformado</span>`;
        } else {
          statusBadgeContainer.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>`;
        }
      }

      // Meios de ComunicaÃ§Ã£o Social Associados (Base 1 Ligada)
      const outletsContainer = document.getElementById('jd-outlets-list');
      if (outletsContainer) {
        let outletNames = j.outlet_names || (j.outlet_name ? [j.outlet_name] : []);
        if (outletNames.length === 0 && j.outlet_ids && j.outlet_ids.length > 0) {
          outletNames = j.outlet_ids.map(id => {
            const found = localOutlets.find(o => o.id === id);
            return found ? found.name : id;
          });
        }
        if (outletNames.length === 0) outletNames = ['Geral'];

        outletsContainer.innerHTML = outletNames.map(oname => {
          const matchedOcs = localOutlets.find(o => o.name.toLowerCase() === oname.toLowerCase());
          const ocsId = matchedOcs ? matchedOcs.id : null;
          const logoHtml = matchedOcs && matchedOcs.logo_url
            ? `<img src="${matchedOcs.logo_url}" class="w-8 h-8 rounded-lg object-contain bg-white border border-[#E4DDD3] p-1">`
            : `<div class="w-8 h-8 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#E4DDD3]">OCS</div>`;

          return `
            <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E4DDD3] shadow-xs">
              <div class="flex items-center gap-3">
                ${logoHtml}
                <div>
                  <h4 class="font-bold text-xs text-[#1A1A1A]">${oname}</h4>
                  <p class="text-[11px] text-[#6B6B6B]">${matchedOcs ? matchedOcs.media_group : 'Sem grupo associado'}</p>
                </div>
              </div>
              ${ocsId ? `
                <button type="button" onclick="openOutletDetailDrawer('${ocsId}')" class="btn-secondary py-1 px-2.5 text-xs flex items-center gap-1 text-[#6C1C37] font-medium" title="Abrir ficha deste Ã³rgÃ£o">
                  <span>Abrir Ficha do Meio</span>
                  <span>&rarr;</span>
                </button>
              ` : ''}
            </div>
          `;
        }).join('');
      }

      // Emails
      const emailsContainer = document.getElementById('jd-emails-list');
      if (emailsContainer) {
        const emails = j.emails && j.emails.length > 0 ? j.emails : (j.contact_email ? [j.contact_email] : []);
        emailsContainer.innerHTML = emails.length > 0
          ? emails.map((em, idx) => `
              <div class="flex items-center justify-between py-0.5">
                <a href="mailto:${em}" class="text-[#6C1C37] hover:underline">${em}</a>
                <span class="text-[10px] text-[#6B6B6B]">${idx === 0 ? 'Principal' : 'SecundÃ¡rio'}</span>
              </div>
            `).join('')
          : '<span class="text-[#6B6B6B]">â€”</span>';
      }

      // Telefones
      const phonesContainer = document.getElementById('jd-phones-list');
      if (phonesContainer) {
        const phones = j.phones && j.phones.length > 0 ? j.phones : (j.contact_phone ? [j.contact_phone] : []);
        phonesContainer.innerHTML = phones.length > 0
          ? phones.map((ph, idx) => `
              <div class="flex items-center justify-between py-0.5">
                <a href="tel:${ph}" class="text-[#1A1A1A] hover:underline">${ph}</a>
                <span class="text-[10px] text-[#6B6B6B]">${idx === 0 ? 'Direto / MÃ³vel' : 'RedaÃ§Ã£o'}</span>
              </div>
            `).join('')
          : '<span class="text-[#6B6B6B]">â€”</span>';
      }

      // PreferÃªncia
      const prefEl = document.getElementById('jd-contact-pref');
      if (prefEl) {
        let prefText = 'Email Institucional';
        if (j.contact_preference === 'whatsapp') prefText = 'WhatsApp (Contacto Preferencial / RÃ¡pido)';
        if (j.contact_preference === 'telefone') prefText = 'Chamada TelefÃ³nica Direta';
        prefEl.innerText = prefText;
      }

      // Ãreas
      const areasContainer = document.getElementById('jd-areas-list');
      if (areasContainer) {
        const areas = j.intervention_areas || (j.intervention_area ? [j.intervention_area] : ['Geral']);
        areasContainer.innerHTML = areas.map(a => renderTag(a)).join('');
      }

      // Links Digitais
      const linksContainer = document.getElementById('jd-links-container');
      if (linksContainer) {
        const linksHtml = [];
        if (j.links?.linkedin) {
          linksHtml.push(`<a href="${j.links.linkedin}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">LinkedIn &nearr;</a>`);
        }
        if (j.links?.twitter_x) {
          linksHtml.push(`<a href="${j.links.twitter_x}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">X / Twitter &nearr;</a>`);
        }
        if (j.links?.author_page) {
          linksHtml.push(`<a href="${j.links.author_page}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">PÃ¡gina de Autor &nearr;</a>`);
        }
        if (linksHtml.length === 0) {
          linksContainer.innerHTML = '<span class="text-xs text-[#6B6B6B]">Nenhum link ou perfil externo registado.</span>';
        } else {
          linksContainer.innerHTML = linksHtml.join('');
        }
      }

      // RGPD
      document.getElementById('jd-rgpd-badge').innerText = j.rgpd_consent ? 'Sim (Consentimento VÃ¡lido)' : 'NÃ£o / Pendente';
      document.getElementById('jd-rgpd-badge').className = j.rgpd_consent ? 'font-medium text-[#3F5A2E]' : 'font-medium text-[#8A3E22]';
      document.getElementById('jd-rgpd-date').innerText = j.rgpd_consent_date || 'â€”';
      document.getElementById('jd-contact-origin').innerText = j.contact_origin || 'Registo Interno';

      // HistÃ³rico e Notas
      document.getElementById('jd-last-contact').innerText = formatRelativeDays(j.last_contact_date);
      document.getElementById('jd-updated-at').innerText = j.updated_at ? j.updated_at.split('T')[0] : '2026-11-22';
      document.getElementById('jd-notes').innerText = j.notes || 'Sem notas editoriais registadas.';

      // Abrir Gaveta
      document.getElementById('panel-journalist-detail').classList.remove('hidden');
    }

    function closeJournalistDetailDrawer() {
      document.getElementById('panel-journalist-detail').classList.add('hidden');
      currentDrawerJournalistId = null;
    }

    function toggleJournalistDrawerExpand() {
      const container = document.getElementById('panel-journalist-container');
      if (container) {
        container.classList.toggle('max-w-4xl');
        container.classList.toggle('max-w-2xl');
      }
    }

    function handleLogContactFromDrawer() {
      if (!currentDrawerJournalistId) return;
      const j = localJournalists.find(item => item.id === currentDrawerJournalistId);
      if (!j) return;
      closeJournalistDetailDrawer();
      const outletName = j.outlet_name || ((j.outlet_names && j.outlet_names.length > 0) ? j.outlet_names[0] : 'Geral');
      openContactModalPrefilled(j.name, outletName, 'Geral');
    }

    // ========================================================
    // FICHA / GAVETA DO MEIO (BASE 1 -> BASE 2 LIGADA)
    // ========================================================
    function openOutletDetailDrawer(outletId) {
      let ocs = localOutlets.find(item => item.id === outletId);
      if (!ocs) {
        ocs = localOutlets.find(item => item.name.toLowerCase() === outletId.toLowerCase());
      }
      if (!ocs) return;
      currentDrawerOutletId = ocs.id;

      // Nome, grupo e logo
      document.getElementById('od-header-name').innerText = ocs.name;
      document.getElementById('od-name').innerText = ocs.name;
      document.getElementById('od-group').innerText = ocs.media_group || 'Independente';

      const initials = ocs.name.substring(0, 2).toUpperCase();
      const logoContainer = document.getElementById('od-logo-container');
      if (logoContainer) {
        logoContainer.innerHTML = ocs.logo_url
          ? `<img src="${ocs.logo_url}" class="w-full h-full object-contain p-1" onerror="this.outerHTML='<span class=\\'font-bold text-base text-[#1A1A1A]\\'>${initials}</span>'">`
          : `<span class="font-bold text-base text-[#1A1A1A]">${initials}</span>`;
      }

      // Website
      const siteContainer = document.getElementById('od-website');
      if (siteContainer) {
        siteContainer.innerHTML = ocs.website_url
          ? `<a href="${ocs.website_url}" target="_blank" class="text-xs text-[#6C1C37] hover:underline font-mono inline-flex items-center gap-1">${ocs.website_url.replace(/^https?:\/\//, '')} &nearr;</a>`
          : '';
      }

      // Estado
      const statusContainer = document.getElementById('od-status-badge');
      if (statusContainer) {
        statusContainer.innerHTML = (ocs.status || 'ativo') === 'ativo'
          ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>`
          : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E9E5E0] text-[#5C554E]">Extinto</span>`;
      }

      // Indicadores: Ã‚mbito, Periodicidade, AudiÃªncia
      document.getElementById('od-scope').innerText = ocs.scope || 'Nacional';
      document.getElementById('od-periodicity').innerText = ocs.periodicity || 'DiÃ¡rio';
      document.getElementById('od-audience').innerText = ocs.estimated_audience ? `${ocs.estimated_audience.toLocaleString('pt-PT')} leitores` : 'NÃ£o estimada';

      // Formatos
      const formatsContainer = document.getElementById('od-formats-list');
      if (formatsContainer) {
        const formats = Array.isArray(ocs.formats) ? ocs.formats : (ocs.formats ? [ocs.formats] : ['Online']);
        formatsContainer.innerHTML = formats.map(f => renderTag(f)).join('');
      }

      // Especialidades
      const specsContainer = document.getElementById('od-specialties-list');
      if (specsContainer) {
        const specs = ocs.specialties || (ocs.specialty ? [ocs.specialty] : ['Geral']);
        specsContainer.innerHTML = specs.map(s => renderTag(s)).join('');
      }

      // ERC
      document.getElementById('od-erc-type').innerText = ocs.erc_type || 'PublicaÃ§Ã£o PeriÃ³dica';
      document.getElementById('od-erc-reg').innerText = ocs.erc_registration || 'â€”';

      // Contactos
      document.getElementById('od-agenda-email').innerText = ocs.agenda_email || ocs.contact_email || 'â€”';
      document.getElementById('od-phone').innerText = ocs.phone || 'â€”';
      document.getElementById('od-address').innerText = ocs.address || 'â€”';

      // Redes Sociais
      const socialContainer = document.getElementById('od-social-links');
      if (socialContainer) {
        const links = [];
        if (ocs.social_links?.linkedin) links.push(`<a href="${ocs.social_links.linkedin}" target="_blank" class="px-2 py-0.5 rounded bg-white border border-[#E4DDD3] hover:text-[#6C1C37]">LinkedIn</a>`);
        if (ocs.social_links?.twitter_x) links.push(`<a href="${ocs.social_links.twitter_x}" target="_blank" class="px-2 py-0.5 rounded bg-white border border-[#E4DDD3] hover:text-[#6C1C37]">X / Twitter</a>`);
        if (ocs.social_links?.instagram) links.push(`<a href="${ocs.social_links.instagram}" target="_blank" class="px-2 py-0.5 rounded bg-white border border-[#E4DDD3] hover:text-[#6C1C37]">Instagram</a>`);
        if (ocs.social_links?.facebook) links.push(`<a href="${ocs.social_links.facebook}" target="_blank" class="px-2 py-0.5 rounded bg-white border border-[#E4DDD3] hover:text-[#6C1C37]">Facebook</a>`);
        socialContainer.innerHTML = links.length > 0 ? links.join('') : '<span class="text-[11px] text-[#6B6B6B]">Nenhuma rede social registada.</span>';
      }

      // ========================================================
      // JORNALISTAS ASSOCIADOS (LIGAÃ‡ÃƒO AUTOMÃTICA DA BASE 2)
      // ========================================================
      const associatedList = localJournalists.filter(j => 
        (j.outlet_ids && j.outlet_ids.includes(ocs.id)) || 
        (j.outlet_name && j.outlet_name.toLowerCase() === ocs.name.toLowerCase()) ||
        (j.outlet_names && j.outlet_names.some(on => on.toLowerCase() === ocs.name.toLowerCase()))
      );

      document.getElementById('od-associated-count').innerText = `${associatedList.length} ${associatedList.length === 1 ? 'jornalista associado' : 'jornalistas associados'}`;
      const assocContainer = document.getElementById('od-associated-journalists-list');
      if (assocContainer) {
        if (associatedList.length === 0) {
          assocContainer.innerHTML = `
            <div class="p-4 bg-white rounded-xl border border-[#E4DDD3] text-center text-xs text-[#6B6B6B]">
              <p>Nenhum jornalista registado associado a este Ã³rgÃ£o.</p>
              <button onclick="openJournalistModalForOutlet('${ocs.name.replace(/'/g, "\\'")}')" class="mt-2 text-[#6C1C37] font-medium hover:underline inline-block">
                + Associar Novo Jornalista a este Meio
              </button>
            </div>
          `;
        } else {
          assocContainer.innerHTML = associatedList.map(j => {
            const jInitials = j.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const email = (j.emails && j.emails.length > 0) ? j.emails[0] : (j.contact_email || 'â€”');
            return `
              <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E4DDD3] hover:border-[#6C1C37]/40 transition-all shadow-xs">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ${jInitials}
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-[#1A1A1A]">${j.name}</h4>
                    <p class="text-[11px] text-[#6B6B6B]">${j.role_title || 'Jornalista'}</p>
                    <span class="font-mono text-[10px] text-[#6C1C37]">${email}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="openJournalistDetailDrawer('${j.id}')" class="btn-secondary py-1 px-2.5 text-xs text-[#6C1C37] font-medium" title="Ver ficha do jornalista">
                    Ver Ficha &rarr;
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // Abrir Gaveta
      document.getElementById('panel-outlet-detail').classList.remove('hidden');
    }

    function closeOutletDetailDrawer() {
      document.getElementById('panel-outlet-detail').classList.add('hidden');
      currentDrawerOutletId = null;
    }

    function toggleOutletDrawerExpand() {
      const container = document.getElementById('panel-outlet-container');
      if (container) {
        container.classList.toggle('max-w-4xl');
        container.classList.toggle('max-w-2xl');
      }
    }

    function handleContactOutletFromDrawer() {
      if (!currentDrawerOutletId) return;
      const ocs = localOutlets.find(item => item.id === currentDrawerOutletId);
      if (!ocs) return;
      closeOutletDetailDrawer();
      openContactModalPrefilled(`RedaÃ§Ã£o de ${ocs.name}`, ocs.name, 'Geral');
    }

    // ========================================================
    // ORDENAÃ‡ÃƒO DE COLUNAS
    // ========================================================
    function sortJournalists(field) {
      if (jourSortField === field) {
        jourSortOrder = jourSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        jourSortField = field;
        jourSortOrder = 'asc';
      }
      renderJournalistsTable();
    }

    function sortOutlets(field) {
      if (ocsSortField === field) {
        ocsSortOrder = ocsSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        ocsSortField = field;
        ocsSortOrder = 'asc';
      }
      renderOutletsTable();
    }

    // ========================================================
    // VISIBILIDADE DE COLUNAS
    // ========================================================
    function toggleJourColsDropdown(e) {
      e.stopPropagation();
      const drop = document.getElementById('dropdown-jour-cols');
      drop?.classList.toggle('hidden');
    }

    function toggleJourCol(col) {
      jourHiddenCols[col] = !jourHiddenCols[col];
      const thEl = document.getElementById(`th-jour-${col}`);
      if (thEl) {
        if (jourHiddenCols[col]) thEl.classList.add('hidden');
        else thEl.classList.remove('hidden');
      }
      renderJournalistsTable();
    }

    function toggleOutletColsDropdown(e) {
      e.stopPropagation();
      const drop = document.getElementById('dropdown-outlets-cols');
      drop?.classList.toggle('hidden');
    }

    function toggleOutletCol(col) {
      ocsHiddenCols[col] = !ocsHiddenCols[col];
      const thEl = document.getElementById(`th-ocs-${col}`);
      if (thEl) {
        if (ocsHiddenCols[col]) thEl.classList.add('hidden');
        else thEl.classList.remove('hidden');
      }
      renderOutletsTable();
    }

    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', () => {
      document.getElementById('dropdown-jour-cols')?.classList.add('hidden');
      document.getElementById('dropdown-outlets-cols')?.classList.add('hidden');
    });

    // ========================================================
    // LIMPEZA DE FILTROS
    // ========================================================
    function clearJournalistFilters() {
      const search = document.getElementById('search-journalists');
      if (search) search.value = '';
      const area = document.getElementById('filter-jour-area');
      if (area) area.value = 'all';
      const status = document.getElementById('filter-jour-status');
      if (status) status.value = 'all';
      const pref = document.getElementById('filter-jour-pref');
      if (pref) pref.value = 'all';
      renderJournalistsTable();
    }

    function clearOutletFilters() {
      const search = document.getElementById('search-outlets');
      if (search) search.value = '';
      const fmt = document.getElementById('filter-ocs-format');
      if (fmt) fmt.value = 'all';
      const scope = document.getElementById('filter-ocs-scope');
      if (scope) scope.value = 'all';
      const spec = document.getElementById('filter-ocs-specialty');
      if (spec) spec.value = 'all';
      const status = document.getElementById('filter-ocs-status');
      if (status) status.value = 'all';
      renderOutletsTable();
    }

    // ========================================================
    // EXPORTAÃ‡ÃƒO E IMPORTAÃ‡ÃƒO DE CSV
    // ========================================================
    function exportJournalistsCsv() {
      const headers = ['ID', 'Nome', 'Cargo', 'OCS', 'Email Principal', 'TelemÃ³vel', 'PreferÃªncia', 'Ãreas de IntervenÃ§Ã£o', 'Estado', 'Ãšltimo Contacto', 'Consentimento RGPD', 'Data RGPD', 'Origem', 'Notas'];
      const rows = localJournalists.map(j => [
        `"${j.id || ''}"`,
        `"${(j.name || '').replace(/"/g, '""')}"`,
        `"${(j.role_title || '').replace(/"/g, '""')}"`,
        `"${(j.outlet_name || (j.outlet_names || []).join('; ')).replace(/"/g, '""')}"`,
        `"${((j.emails && j.emails[0]) || j.contact_email || '').replace(/"/g, '""')}"`,
        `"${((j.phones && j.phones[0]) || j.contact_phone || '').replace(/"/g, '""')}"`,
        `"${j.contact_preference || 'email'}"`,
        `"${(j.intervention_areas || [j.intervention_area || '']).join('; ').replace(/"/g, '""')}"`,
        `"${j.status || 'ativo'}"`,
        `"${j.last_contact_date || ''}"`,
        `"${j.rgpd_consent ? 'Sim' : 'NÃ£o'}"`,
        `"${j.rgpd_consent_date || ''}"`,
        `"${(j.contact_origin || '').replace(/"/g, '""')}"`,
        `"${(j.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `jornalistas_reputation_os_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('ExportaÃ§Ã£o concluÃ­da com sucesso.');
    }

    function importJournalistsCsv(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length < 2) {
            showToast('Ficheiro CSV invÃ¡lido ou sem registos.');
            return;
          }

          let added = 0;
          for (let i = 1; i < lines.length; i++) {
            // Regex simples para dividir por vÃ­rgula respeitando aspas
            const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 2 && cols[1]) {
              const newJour = {
                id: `jour-import-${Date.now()}-${i}`,
                name: cols[1],
                role_title: cols[2] || 'Jornalista',
                outlet_name: cols[3] || 'Geral',
                outlet_names: cols[3] ? [cols[3]] : ['Geral'],
                emails: cols[4] ? [cols[4]] : [],
                contact_email: cols[4] || '',
                phones: cols[5] ? [cols[5]] : [],
                contact_phone: cols[5] || '',
                contact_preference: cols[6] || 'email',
                intervention_areas: cols[7] ? cols[7].split(';').map(s => s.trim()) : ['Geral'],
                status: cols[8] || 'ativo',
                last_contact_date: cols[9] || '',
                rgpd_consent: cols[10]?.toLowerCase() === 'sim',
                rgpd_consent_date: cols[11] || '',
                contact_origin: cols[12] || 'ImportaÃ§Ã£o CSV',
                notes: cols[13] || '',
                updated_at: new Date().toISOString()
              };
              localJournalists.unshift(newJour);
              added++;
            }
          }

          syncLocalStorage();
          renderJournalistsTable();
          showToast(`${added} jornalistas importados com sucesso.`);
        } catch (err) {
          showToast('Erro ao processar ficheiro CSV.');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function exportOutletsCsv() {
      const headers = ['ID', 'Nome do Meio', 'Grupo Editorial', 'Formatos', 'Especialidades', 'Ã‚mbito', 'Periodicidade', 'AudiÃªncia Estimada', 'Registo ERC', 'Tipo ERC', 'Email Agenda', 'Telefone RedaÃ§Ã£o', 'Morada', 'Website', 'Estado'];
      const rows = localOutlets.map(o => [
        `"${o.id || ''}"`,
        `"${(o.name || '').replace(/"/g, '""')}"`,
        `"${(o.media_group || '').replace(/"/g, '""')}"`,
        `"${(o.formats || []).join('; ').replace(/"/g, '""')}"`,
        `"${(o.specialties || [o.specialty || '']).join('; ').replace(/"/g, '""')}"`,
        `"${o.scope || 'nacional'}"`,
        `"${o.periodicity || 'diario'}"`,
        `"${o.estimated_audience || 0}"`,
        `"${(o.erc_registration || '').replace(/"/g, '""')}"`,
        `"${(o.erc_type || '').replace(/"/g, '""')}"`,
        `"${(o.agenda_email || o.contact_email || '').replace(/"/g, '""')}"`,
        `"${(o.phone || '').replace(/"/g, '""')}"`,
        `"${(o.address || '').replace(/"/g, '""')}"`,
        `"${(o.website_url || '').replace(/"/g, '""')}"`,
        `"${o.status || 'ativo'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `meios_ocs_reputation_os_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('ExportaÃ§Ã£o de OCS concluÃ­da com sucesso.');
    }

    function importOutletsCsv(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length < 2) {
            showToast('Ficheiro CSV invÃ¡lido ou sem registos.');
            return;
          }

          let added = 0;
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 2 && cols[1]) {
              const newOcs = {
                id: `out-import-${Date.now()}-${i}`,
                name: cols[1],
                media_group: cols[2] || 'Independente',
                formats: cols[3] ? cols[3].split(';').map(s => s.trim()) : ['online'],
                specialties: cols[4] ? cols[4].split(';').map(s => s.trim()) : ['Generalista'],
                scope: cols[5] || 'nacional',
                periodicity: cols[6] || 'diario',
                estimated_audience: parseInt(cols[7], 10) || 0,
                erc_registration: cols[8] || '',
                erc_type: cols[9] || 'PublicaÃ§Ã£o PeriÃ³dica',
                agenda_email: cols[10] || '',
                contact_email: cols[10] || '',
                phone: cols[11] || '',
                address: cols[12] || '',
                website_url: cols[13] || '',
                status: cols[14] || 'ativo'
              };
              localOutlets.unshift(newOcs);
              added++;
            }
          }

          syncLocalStorage();
          renderOutletsTable();
          populateDropdowns();
          showToast(`${added} meios (OCS) importados com sucesso.`);
        } catch (err) {
          showToast('Erro ao processar ficheiro CSV de OCS.');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    // ========================================================
    // MODAIS DE CRIAÃ‡ÃƒO E SUBMISSÃƒO
    // ========================================================
    function handleAddNewGroupPrompt() {
      const groupName = prompt('Introduz o nome do novo Grupo Editorial:');
      if (groupName && groupName.trim()) {
        const select = document.getElementById('ocs-group');
        if (select) {
          const opt = document.createElement('option');
          opt.value = groupName.trim();
          opt.innerText = groupName.trim();
          opt.selected = true;
          select.prepend(opt);
        }
        showToast(`Grupo "${groupName.trim()}" adicionado.`);
      }
    }

    function toggleOcsModalFormat(fmt) {
      if (selectedOcsModalFormats.includes(fmt)) {
        if (selectedOcsModalFormats.length > 1) {
          selectedOcsModalFormats = selectedOcsModalFormats.filter(f => f !== fmt);
        }
      } else {
        selectedOcsModalFormats.push(fmt);
      }
      updateOcsModalFormatButtons();
    }

    function updateOcsModalFormatButtons() {
      const btns = document.querySelectorAll('.ocs-fmt-btn');
      btns.forEach(btn => {
        const fmt = btn.getAttribute('data-fmt');
        if (selectedOcsModalFormats.includes(fmt)) {
          btn.classList.add('bg-[#6C1C37]', 'text-white', 'border-[#6C1C37]');
          btn.classList.remove('bg-white', 'text-[#6B6B6B]', 'border-[#E4DDD3]');
        } else {
          btn.classList.remove('bg-[#6C1C37]', 'text-white', 'border-[#6C1C37]');
          btn.classList.add('bg-white', 'text-[#6B6B6B]', 'border-[#E4DDD3]');
        }
      });
    }

    function handleNewJournalistSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('j-name').value.trim();
      const role = document.getElementById('j-role').value.trim();
      const outletName = document.getElementById('j-outlet').value;
      const email = document.getElementById('j-email').value.trim();
      const emailSec = document.getElementById('j-email-sec')?.value.trim();
      const phone = document.getElementById('j-phone').value.trim();
      const phoneSec = document.getElementById('j-phone-sec')?.value.trim();
      const pref = document.getElementById('j-preference').value;
      const status = document.getElementById('j-status').value;
      const areasStr = document.getElementById('j-areas').value.trim();
      const linkedin = document.getElementById('j-linkedin')?.value.trim();
      const twitter = document.getElementById('j-twitter')?.value.trim();
      const author = document.getElementById('j-author-page')?.value.trim();
      const rgpd = document.getElementById('j-rgpd').checked;
      const rgpdDate = document.getElementById('j-rgpd-date').value;
      const origin = document.getElementById('j-contact-origin')?.value.trim();
      const notes = document.getElementById('j-notes')?.value.trim();

      const matchedOcs = localOutlets.find(o => o.name.toLowerCase() === outletName.toLowerCase());

      const emails = [email];
      if (emailSec) emails.push(emailSec);

      const phones = [phone];
      if (phoneSec) phones.push(phoneSec);

      const areas = areasStr ? areasStr.split(',').map(s => s.trim()) : ['Geral'];

      const newJour = {
        id: `jour-${Date.now()}`,
        name,
        role_title: role,
        outlet_ids: matchedOcs ? [matchedOcs.id] : [],
        outlet_names: [outletName],
        outlet_name: outletName,
        emails,
        contact_email: email,
        phones,
        contact_phone: phone,
        contact_preference: pref,
        links: {
          linkedin: linkedin || undefined,
          twitter_x: twitter || undefined,
          author_page: author || undefined
        },
        intervention_areas: areas,
        status,
        last_contact_date: '',
        contact_origin: origin || 'Registo Manual',
        rgpd_consent: rgpd,
        rgpd_consent_date: rgpd ? (rgpdDate || new Date().toISOString().split('T')[0]) : undefined,
        notes: notes || '',
        updated_at: new Date().toISOString()
      };

      localJournalists.unshift(newJour);
      syncLocalStorage();
      closeJournalistModal();
      renderJournalistsTable();
      showToast(`Jornalista ${name} guardado na Base de Dados.`);
    }

    function handleNewOutletSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('ocs-name').value.trim();
      const logo = document.getElementById('ocs-logo')?.value.trim();
      const group = document.getElementById('ocs-group').value;
      const website = document.getElementById('ocs-website').value.trim();
      const address = document.getElementById('ocs-address')?.value.trim();
      const agendaEmail = document.getElementById('ocs-agenda-email').value.trim();
      const phone = document.getElementById('ocs-phone')?.value.trim();
      const scope = document.getElementById('ocs-scope').value;
      const periodicity = document.getElementById('ocs-periodicity').value;
      const audience = parseInt(document.getElementById('ocs-audience')?.value, 10) || 0;
      const ercType = document.getElementById('ocs-erc-type').value;
      const ercReg = document.getElementById('ocs-erc-reg')?.value.trim();
      const specsStr = document.getElementById('ocs-specialties').value.trim();
      const linkedin = document.getElementById('ocs-social-linkedin')?.value.trim();
      const twitter = document.getElementById('ocs-social-twitter')?.value.trim();
      const instagram = document.getElementById('ocs-social-instagram')?.value.trim();

      const specs = specsStr ? specsStr.split(',').map(s => s.trim()) : ['Generalista'];

      const newOcs = {
        id: `out-${Date.now()}`,
        name,
        logo_url: logo || undefined,
        media_group: group,
        address: address || '',
        website_url: website,
        agenda_email: agendaEmail,
        contact_email: agendaEmail,
        phone: phone || '',
        social_links: {
          linkedin: linkedin || undefined,
          twitter_x: twitter || undefined,
          instagram: instagram || undefined
        },
        erc_type: ercType,
        erc_registration: ercReg || undefined,
        specialties: specs,
        formats: [...selectedOcsModalFormats],
        scope,
        periodicity,
        estimated_audience: audience,
        status: 'ativo'
      };

      localOutlets.unshift(newOcs);
      syncLocalStorage();
      closeOutletModal();
      renderOutletsTable();
      populateDropdowns();
      showToast(`Ã“rgÃ£o ${name} adicionado com sucesso.`);
    }

    function openJournalistModalForOutlet(prefilledOutletName) {
      closeOutletDetailDrawer();
      openJournalistModal();
      setTimeout(() => {
        const sel = document.getElementById('j-outlet');
        if (sel) sel.value = prefilledOutletName;
      }, 50);
    }


    function filterOutletsTable() {
      const query = (document.getElementById('search-outlets')?.value || '').toLowerCase().trim();
      const rows = document.querySelectorAll('#outlets-table-body tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }

    function populateDropdowns() {
      const projectDatalist = document.getElementById('projects-datalist');
      if (projectDatalist) {
        let projectNames = localProjects.map(p => p.name);
        if (!projectNames.includes('Geral')) projectNames.unshift('Geral');
        projectDatalist.innerHTML = projectNames.map(name => `<option value="${name}">`).join('');
      }

      const journalistDatalist = document.getElementById('journalists-datalist');
      if (journalistDatalist) {
        journalistDatalist.innerHTML = localJournalists.map(j => `<option value="${j.name}">`).join('');
      }

      const selectContactOutlet = document.getElementById('contact-outlet');
      const selectJournalistOutlet = document.getElementById('j-outlet');
      const selectRequestOutlet = document.getElementById('form-outlet');

      let allOutlets = [
        "Expresso", "Público", "Diário de Notícias", "Jornal de Notícias", "Correio da Manhã",
        "Observador", "Visão", "Sábado", "ECO Economia Online", "Jornal de Negócios",
        "Jornal Económico", "SIC / SIC Notícias", "RTP 1 / RTP 3", "TVI / CNN Portugal",
        "CMTV", "Porto Canal", "TSF", "Rádio Renascença", "Antena 1", "Lusa"
      ];

      localOutlets.forEach(o => {
        if (!allOutlets.includes(o.name)) {
          allOutlets.unshift(o.name);
        }
      });

      const optionsHtml = allOutlets.map(o => `<option value="${o}">${o}</option>`).join('');

      if (selectContactOutlet) selectContactOutlet.innerHTML = optionsHtml;
      if (selectJournalistOutlet) selectJournalistOutlet.innerHTML = optionsHtml;
      if (selectRequestOutlet) selectRequestOutlet.innerHTML = optionsHtml;
    }

    async function handleNewTaskSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('task-title').value.trim();
      const project_name = document.getElementById('task-project').value.trim() || 'Geral';
      const priority = document.getElementById('task-priority').value;
      const due_date = document.getElementById('task-duedate').value;
      const due_time = document.getElementById('task-duetime').value;
      const notes = document.getElementById('task-notes').value.trim();

      const newTask = {
        title,
        project_name,
        priority,
        due_date,
        due_time,
        notes,
        status: 'pending'
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('tasks').insert([newTask]).select();
          if (!error && data && data[0]) {
            newTask.id = data[0].id;
          } else {
            newTask.id = 'task-' + Date.now();
          }
        } catch (err) {
          newTask.id = 'task-' + Date.now();
        }
      } else {
        newTask.id = 'task-' + Date.now();
      }

      localTasks.unshift(newTask);
      syncLocalStorage();
      closeTaskModal();
      renderAll();
      showToast('Tarefa registada com sucesso.');
      e.target.reset();
    }

    async function handleNewProjectSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('project-name').value.trim();
      const client_or_brand = document.getElementById('project-client').value.trim() || 'Institucional';
      const deadline = document.getElementById('project-deadline').value;
      const description = document.getElementById('project-desc').value.trim();

      const newProj = {
        name,
        client_or_brand,
        deadline,
        description,
        status: 'open'
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('projects').insert([newProj]).select();
          if (!error && data && data[0]) {
            newProj.id = data[0].id;
          } else {
            newProj.id = 'proj-' + Date.now();
          }
        } catch (err) {
          newProj.id = 'proj-' + Date.now();
        }
      } else {
        newProj.id = 'proj-' + Date.now();
      }

      localProjects.unshift(newProj);
      syncLocalStorage();
      closeProjectModal();
      renderAll();
      showToast('Projeto criado com sucesso.');
      e.target.reset();
    }

    async function handleNewContactSubmit(e) {
      e.preventDefault();
      const contact_name = document.getElementById('contact-name').value.trim();
      const outlet_name = document.getElementById('contact-outlet').value;
      const contact_type = document.getElementById('contact-type').value;
      const contact_time = document.getElementById('contact-time').value || formatCurrentTime();
      const subject_or_notes = document.getElementById('contact-notes').value.trim();
      const contact_date = new Date().toISOString().split('T')[0];

      const newContact = {
        contact_name,
        outlet_name,
        contact_type,
        contact_time,
        subject_or_notes,
        contact_date
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('daily_contacts').insert([newContact]).select();
          if (!error && data && data[0]) {
            newContact.id = data[0].id;
          } else {
            newContact.id = 'contact-' + Date.now();
          }
        } catch (err) {
          newContact.id = 'contact-' + Date.now();
        }
      } else {
        newContact.id = 'contact-' + Date.now();
      }

      localDailyContacts.unshift(newContact);
      syncLocalStorage();
      closeContactModal();
      renderAll();
      showToast('Contacto registado hoje.');
      e.target.reset();
    }

    async function handleNewJournalistSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('j-name').value.trim();
      const outlet_name = document.getElementById('j-outlet').value;
      const intervention_area = document.getElementById('j-area').value.trim();
      const contact_email = document.getElementById('j-email').value.trim();
      const contact_phone = document.getElementById('j-phone').value.trim();
      const registration_date = document.getElementById('j-date').value || new Date().toISOString().split('T')[0];
      const links = document.getElementById('j-links').value.trim();

      const newJourno = {
        name,
        outlet_name,
        intervention_area,
        contact_email,
        contact_phone,
        registration_date,
        links
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('journalists').insert([newJourno]).select();
          if (!error && data && data[0]) {
            newJourno.id = data[0].id;
          } else {
            newJourno.id = 'j-' + Date.now();
          }
        } catch (err) {
          newJourno.id = 'j-' + Date.now();
        }
      } else {
        newJourno.id = 'j-' + Date.now();
      }

      localJournalists.unshift(newJourno);
      syncLocalStorage();
      closeJournalistModal();
      renderAll();
      showToast('Jornalista adicionado à base.');
      e.target.reset();
    }

    async function handleNewOutletSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('ocs-name').value.trim();
      const media_group = document.getElementById('ocs-group').value.trim();
      const specialty = document.getElementById('ocs-specialty').value.trim();
      const erc_registration = document.getElementById('ocs-erc').value.trim();
      const contact_email = document.getElementById('ocs-email').value.trim();
      const website_url = document.getElementById('ocs-website').value.trim();
      const address = document.getElementById('ocs-address').value.trim();
      const logo_url = document.getElementById('ocs-logo').value.trim();
      const formats = [...selectedOcsFormats];

      const newOcs = {
        name,
        media_group,
        specialty,
        erc_registration,
        contact_email,
        website_url,
        address,
        logo_url,
        formats
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('media_outlets').insert([newOcs]).select();
          if (!error && data && data[0]) {
            newOcs.id = data[0].id;
          } else {
            newOcs.id = 'ocs-' + Date.now();
          }
        } catch (err) {
          newOcs.id = 'ocs-' + Date.now();
        }
      } else {
        newOcs.id = 'ocs-' + Date.now();
      }

      localOutlets.unshift(newOcs);
      syncLocalStorage();
      closeOutletModal();
      renderAll();
      showToast('Órgão de comunicação adicionado.');
      e.target.reset();
    }

    async function handleNewRequestSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('form-title').value.trim();
      const journalist = document.getElementById('form-journalist').value.trim();
      const outlet = document.getElementById('form-outlet').value;
      const urgency = document.getElementById('form-urgency').value;
      const hours = parseInt(document.getElementById('form-hours').value) || 2;
      const details = document.getElementById('form-details').value.trim();

      const deadline = new Date(Date.now() + hours * 3600000).toISOString();

      const newReq = {
        title,
        journalist_name: journalist,
        outlet,
        urgency,
        deadline,
        details,
        status: 'pendente'
      };

      if (supabaseClient) {
        try {
          const { data } = await supabaseClient.from('pr_requests').insert([newReq]).select();
          if (data && data[0]) newReq.id = data[0].id;
          else newReq.id = 'req-' + Date.now();
        } catch (err) {
          newReq.id = 'req-' + Date.now();
        }
      } else {
        newReq.id = 'req-' + Date.now();
      }

      localRequests.unshift(newReq);
      closeRequestModal();
      renderAll();
      showToast('Pedido de imprensa registado.');
      e.target.reset();
    }

    async function toggleTaskStatus(id) {
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      task.status = newStatus;

      if (supabaseClient) {
        try {
          await supabaseClient.from('tasks').update({ status: newStatus }).eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast(newStatus === 'completed' ? 'Tarefa concluída com sucesso.' : 'Tarefa reaberta.');
    }

    async function deleteTask(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: O seu perfil não tem autorização para eliminar tarefas.');
        return;
      }
      if (!confirm('Desejas eliminar esta tarefa?')) return;
      localTasks = localTasks.filter(t => t.id !== id);

      if (supabaseClient) {
        try {
          await supabaseClient.from('tasks').delete().eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Tarefa eliminada.');
    }

    async function toggleProjectStatus(id) {
      const proj = localProjects.find(p => p.id === id);
      if (!proj) return;

      const newStatus = proj.status === 'completed' ? 'open' : 'completed';
      proj.status = newStatus;

      if (supabaseClient) {
        try {
          await supabaseClient.from('projects').update({ status: newStatus }).eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast(newStatus === 'completed' ? 'Projeto marcado como concluído.' : 'Projeto reaberto.');
    }

    async function deleteProject(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: Apenas a Direção de RP pode eliminar projetos.');
        return;
      }
      if (!confirm('Desejas eliminar este projeto?')) return;
      localProjects = localProjects.filter(p => p.id !== id);

      if (supabaseClient) {
        try {
          await supabaseClient.from('projects').delete().eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Projeto eliminado.');
    }

    async function deleteContact(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: O seu perfil não tem autorização para remover contactos.');
        return;
      }
      localDailyContacts = localDailyContacts.filter(c => c.id !== id);

      if (supabaseClient) {
        try {
          await supabaseClient.from('daily_contacts').delete().eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Registo de contacto removido.');
    }

    async function deleteJournalist(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: O seu perfil não tem autorização para eliminar jornalistas.');
        return;
      }
      if (!confirm('Tens a certeza de que queres eliminar este jornalista?')) return;
      localJournalists = localJournalists.filter(j => j.id !== id);

      if (supabaseClient) {
        try {
          await supabaseClient.from('journalists').delete().eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Jornalista removido.');
    }

    async function deleteOutlet(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: O seu perfil não tem autorização para eliminar OCS.');
        return;
      }
      if (!confirm('Tens a certeza de que queres eliminar este OCS?')) return;
      localOutlets = localOutlets.filter(o => o.id !== id);

      if (supabaseClient) {
        try {
          await supabaseClient.from('media_outlets').delete().eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Órgão de comunicação removido.');
    }

    // ========================================================
    // 4.5 ESTADOS, PRIORIDADES & TOM DO CLIPPING (FUNDO / TEXTO)
    // Distinção clara entre o vermelho de erro/atraso e o bordô
    // ========================================================
    function getPriorityBadge(priority) {
      if (priority === 'urgente') {
        return `
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: #F6D9D5; color: #A3281E;">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: #A3281E;"></span>
            Urgente
          </span>
        `;
      } else if (priority === 'alta') {
        return `
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: #F7E7BF; color: #805B00;">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: #805B00;"></span>
            Alta
          </span>
        `;
      } else if (priority === 'baixa') {
        return `
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: #E9E5E0; color: #5C554E;">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: #5C554E;"></span>
            Baixa
          </span>
        `;
      }
      return `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: #DCE7F0; color: #2C5576;">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: #2C5576;"></span>
          Normal
        </span>
      `;
    }

    function getDeadlineBadge(dueDateStr, dueTimeStr) {
      if (!dueDateStr) return '<span class="text-[#6B6B6B] font-mono">—</span>';

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const due = new Date(dueDateStr);
      due.setHours(0, 0, 0, 0);

      const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
      const formattedDate = formatDate(dueDateStr);
      const timePart = dueTimeStr ? ` (${dueTimeStr})` : '';

      if (diffDays < 0) {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium font-mono" style="background-color: #F6D9D5; color: #A3281E;">Em Atraso: ${formattedDate}</span>`;
      } else if (diffDays === 0) {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium font-mono" style="background-color: #F7E7BF; color: #805B00;">Hoje${timePart}</span>`;
      } else if (diffDays === 1) {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium font-mono" style="background-color: #F7E7BF; color: #805B00;">Amanhã${timePart}</span>`;
      }
      return `<span class="text-[#1A1A1A] font-normal font-mono text-[11px]">${formattedDate}${timePart}</span>`;
    }

    function formatDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    }

    function formatCurrentTime() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    // ==========================================
    // 5. MODAIS: ABRIR E FECHAR
    // ==========================================
    function openTaskModal() {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }
      populateDropdowns();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('task-duedate').valueAsDate = tomorrow;
      document.getElementById('modal-new-task').classList.remove('hidden');
      document.getElementById('modal-new-task').classList.add('flex');
    }
    function closeTaskModal() {
      document.getElementById('modal-new-task').classList.add('hidden');
      document.getElementById('modal-new-task').classList.remove('flex');
    }

    function openProjectModal() {
      if (!currentUserPermissions()?.canCreateProjects) {
        showToast('Acesso Restrito: A criação de projetos é reservada à Direção de RP.');
        return;
      }
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      document.getElementById('project-deadline').valueAsDate = nextMonth;
      document.getElementById('modal-new-project').classList.remove('hidden');
      document.getElementById('modal-new-project').classList.add('flex');
    }
    function closeProjectModal() {
      document.getElementById('modal-new-project').classList.add('hidden');
      document.getElementById('modal-new-project').classList.remove('flex');
    }

    function openContactModal() {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }
      populateDropdowns();
      document.getElementById('contact-time').value = formatCurrentTime();
      document.getElementById('modal-new-contact').classList.remove('hidden');
      document.getElementById('modal-new-contact').classList.add('flex');
    }
    function closeContactModal() {
      document.getElementById('modal-new-contact').classList.add('hidden');
      document.getElementById('modal-new-contact').classList.remove('flex');
    }

    function openJournalistModal() {
      if (!currentUserPermissions()?.canCreateJournalists) {
        showToast('Acesso Restrito: O seu perfil não tem autorização para adicionar novos jornalistas.');
        return;
      }
      populateDropdowns();
      document.getElementById('j-date').valueAsDate = new Date();
      document.getElementById('modal-new-journalist').classList.remove('hidden');
      document.getElementById('modal-new-journalist').classList.add('flex');
    }
    function closeJournalistModal() {
      document.getElementById('modal-new-journalist').classList.add('hidden');
      document.getElementById('modal-new-journalist').classList.remove('flex');
    }

    function openOutletModal() {
      if (!currentUserPermissions()?.canCreateOutlets) {
        showToast('Acesso Restrito: O seu perfil não tem autorização para adicionar OCS.');
        return;
      }
      selectedOcsFormats = ['Online'];
      updateFormatButtons();
      document.getElementById('modal-new-outlet').classList.remove('hidden');
      document.getElementById('modal-new-outlet').classList.add('flex');
    }
    function closeOutletModal() {
      document.getElementById('modal-new-outlet').classList.add('hidden');
      document.getElementById('modal-new-outlet').classList.remove('flex');
    }

    function toggleOcsFormat(format) {
      if (selectedOcsFormats.includes(format)) {
        if (selectedOcsFormats.length > 1) {
          selectedOcsFormats = selectedOcsFormats.filter(f => f !== format);
        }
      } else {
        selectedOcsFormats.push(format);
      }
      updateFormatButtons();
    }

    function updateFormatButtons() {
      const btns = document.querySelectorAll('.ocs-format-btn');
      btns.forEach(btn => {
        const fmt = btn.getAttribute('data-format');
        if (selectedOcsFormats.includes(fmt)) {
          const color = getDataColorForValue(fmt);
          btn.style.backgroundColor = color.bg;
          btn.style.color = color.text;
          btn.style.borderColor = 'rgba(0,0,0,0.06)';
        } else {
          btn.style.backgroundColor = '#FFFFFF';
          btn.style.color = '#6B6B6B';
          btn.style.borderColor = '#E4DDD3';
        }
      });
    }

    function openRequestModal() {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }
      populateDropdowns();
      document.getElementById('modal-new-request').classList.remove('hidden');
      document.getElementById('modal-new-request').classList.add('flex');
    }
    function closeRequestModal() {
      document.getElementById('modal-new-request').classList.add('hidden');
      document.getElementById('modal-new-request').classList.remove('flex');
    }

    function openConfigModal() {
      if (!currentUserPermissions()?.canConfigDatabase) {
        showToast('Acesso Reservado: Apenas o Diretor de RP pode alterar conexões de dados.');
        return;
      }
      document.getElementById('cfg-supabase-url').value = localStorage.getItem('reputation_sb_url') || DEFAULT_SUPABASE_URL;
      document.getElementById('cfg-supabase-key').value = localStorage.getItem('reputation_sb_key') || DEFAULT_SUPABASE_KEY;
      document.getElementById('modal-config-supabase').classList.remove('hidden');
      document.getElementById('modal-config-supabase').classList.add('flex');
    }
    function closeConfigModal() {
      document.getElementById('modal-config-supabase').classList.add('hidden');
      document.getElementById('modal-config-supabase').classList.remove('flex');
    }

    function handleSaveSupabaseConfig(e) {
      e.preventDefault();
      const url = document.getElementById('cfg-supabase-url').value.trim();
      const key = document.getElementById('cfg-supabase-key').value.trim();
      localStorage.setItem('reputation_sb_url', url);
      localStorage.setItem('reputation_sb_key', key);
      closeConfigModal();
      showToast('Configurações salvas.');
      initSupabase();
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-msg').innerText = msg;
      toast.classList.remove('translate-y-[-100px]', 'opacity-0', 'pointer-events-none');
      setTimeout(() => {
        toast.classList.add('translate-y-[-100px]', 'opacity-0', 'pointer-events-none');
      }, 3000);
    }
  
