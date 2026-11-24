
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
          if (!error && journalists && journalists.length > 0) {
            localJournalists = journalists;
            localStorage.setItem('rep_journalists', JSON.stringify(journalists));
          } else if (!localJournalists || localJournalists.length === 0) {
            localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
            localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
          }
        } catch (e) { }

        // Órgãos de Comunicação Social (OCS)
        try {
          const { data: outlets, error } = await supabaseClient.from('media_outlets').select('*').order('name', { ascending: true });
          if (!error && outlets && outlets.length > 0) {
            localOutlets = outlets;
            localStorage.setItem('rep_outlets', JSON.stringify(outlets));
          } else if (!localOutlets || localOutlets.length === 0) {
            localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
            localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
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
    let activeProjectId = 'proj-1';
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
  {
    id: 'task-1',
    title: 'Contactar Rui Almeida sobre fecho de caderno',
    project_id: 'proj-1',
    project_name: 'Expansão Ibérica 2026',
    client: 'Grupo M',
    client_or_brand: 'Grupo M',
    type: 'contacto_jornalista',
    journalist_id: 'jour-2',
    journalist_name: 'Rui Almeida',
    responsible: 'Leonor Rodrigues',
    assignee_name: 'Leonor Rodrigues',
    due_date: '2026-11-22',
    due_time: '11:30',
    priority: 'alta',
    status: 'por_fazer',
    notes: 'Confirmar receção do comunicado sob embargo e interesse em declaração exclusiva do CEO.',
    created_at: '2026-11-21T09:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Enviar minuta de resultados sob embargo à TSF',
    project_id: 'proj-4',
    project_name: 'Resultados Financeiros Anuais',
    client: 'Holdings SA',
    client_or_brand: 'Holdings SA',
    type: 'contacto_jornalista',
    journalist_id: 'jour-10',
    journalist_name: 'Bernardo Silva',
    responsible: 'Carlos Silva',
    assignee_name: 'Carlos Silva',
    due_date: '2026-11-19',
    due_time: '14:00',
    priority: 'alta',
    status: 'por_fazer',
    is_overdue: true,
    notes: 'Pauta atrasada devido a pendência na aprovação do CFO. Prioridade crítica.',
    created_at: '2026-11-17T11:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Revisão jurídica do comunicado de imprensa',
    project_id: 'proj-4',
    project_name: 'Resultados Financeiros Anuais',
    client: 'Holdings SA',
    client_or_brand: 'Holdings SA',
    type: 'aprovacao_cliente',
    responsible: 'Carlos Silva',
    assignee_name: 'Carlos Silva',
    due_date: '2026-11-18',
    due_time: '18:00',
    priority: 'alta',
    status: 'por_fazer',
    is_overdue: true,
    notes: 'Validação final de conformidade de mercado com o departamento jurídico.',
    created_at: '2026-11-16T15:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Acompanhar visita técnica com Pedro Ramos',
    project_id: 'proj-1',
    project_name: 'Expansão Ibérica 2026',
    client: 'Grupo M',
    client_or_brand: 'Grupo M',
    type: 'contacto_jornalista',
    journalist_id: 'jour-3',
    journalist_name: 'Pedro Ramos',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-22',
    due_time: '15:00',
    priority: 'media',
    status: 'em_curso',
    notes: 'Apresentação prévia do centro logístico com fotógrafo da redação do ECO.',
    created_at: '2026-11-21T10:00:00Z'
  },
  {
    id: 'task-5',
    title: 'Redigir nota explicativa sobre emissões industriais',
    project_id: 'proj-5',
    project_name: 'Gestão de Crítica Fabril',
    client: 'BioFarma',
    client_or_brand: 'BioFarma',
    type: 'redacao',
    responsible: 'Leonor Rodrigues',
    assignee_name: 'Leonor Rodrigues',
    due_date: '2026-11-22',
    due_time: '17:00',
    priority: 'alta',
    status: 'em_curso',
    notes: 'Nota técnica para responder aos esclarecimentos pedidos pela SIC e CNN.',
    created_at: '2026-11-22T08:30:00Z'
  },
  {
    id: 'task-6',
    title: 'Reunião de alinhamento com porta-voz da GreenCorp',
    project_id: 'proj-2',
    project_name: 'Pauta Sustentabilidade & ESG',
    client: 'GreenCorp',
    client_or_brand: 'GreenCorp',
    type: 'reuniao',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-22',
    due_time: '10:00',
    priority: 'media',
    status: 'concluida',
    completed_at: '2026-11-22T10:45:00Z',
    notes: 'Reunião terminada com aprovação dos pontos focais para as reportagens.',
    created_at: '2026-11-21T16:00:00Z'
  },
  {
    id: 'task-7',
    title: 'Apresentar pitch de sustentabilidade à Marta Figueiredo',
    project_id: 'proj-2',
    project_name: 'Pauta Sustentabilidade & ESG',
    client: 'GreenCorp',
    client_or_brand: 'GreenCorp',
    type: 'contacto_jornalista',
    journalist_id: 'jour-1',
    journalist_name: 'Marta Figueiredo',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-20',
    due_time: '11:00',
    priority: 'alta',
    status: 'concluida',
    completed_at: '2026-11-20T10:15:00Z',
    notes: 'Pitch enviado e bem acolhido. Jornalista solicitou dados comparativos de emissões.',
    created_at: '2026-11-19T09:30:00Z'
  },
  {
    id: 'task-8',
    title: 'Contacto exploratório com Rita Valente sobre energia',
    project_id: 'proj-2',
    project_name: 'Pauta Sustentabilidade & ESG',
    client: 'GreenCorp',
    client_or_brand: 'GreenCorp',
    type: 'contacto_jornalista',
    journalist_id: 'jour-8',
    journalist_name: 'Rita Valente',
    responsible: 'Helena Ramos',
    assignee_name: 'Helena Ramos',
    due_date: '2026-11-24',
    due_time: '14:30',
    priority: 'media',
    status: 'por_fazer',
    notes: 'Proposta de ângulo industrial sobre a eletrificação do parque produtivo.',
    created_at: '2026-11-21T11:00:00Z'
  },
  {
    id: 'task-9',
    title: 'Confirmar lista de jornalistas credenciados no Tech Hub',
    project_id: 'proj-3',
    project_name: 'Lançamento Tech Hub Lisboa',
    client: 'Innovate Tech',
    client_or_brand: 'Innovate Tech',
    type: 'contacto_jornalista',
    journalist_id: 'jour-16',
    journalist_name: 'Miguel Carmo',
    responsible: 'Helena Ramos',
    assignee_name: 'Helena Ramos',
    due_date: '2026-11-23',
    due_time: '12:00',
    priority: 'alta',
    status: 'em_curso',
    notes: 'Verificar credenciação da equipa do Observador e disponibilizar links de livestream.',
    created_at: '2026-11-20T14:00:00Z'
  },
  {
    id: 'task-10',
    title: 'Validar catering e audiovisuais para conferência',
    project_id: 'proj-3',
    project_name: 'Lançamento Tech Hub Lisboa',
    client: 'Innovate Tech',
    client_or_brand: 'Innovate Tech',
    type: 'outra',
    responsible: 'Carlos Silva',
    assignee_name: 'Carlos Silva',
    due_date: '2026-11-23',
    due_time: '16:00',
    priority: 'baixa',
    status: 'por_fazer',
    notes: 'Garantir microfones de lapela para a mesa de debate e zona de entrevistas rápidas.',
    created_at: '2026-11-19T10:00:00Z'
  },
  {
    id: 'task-11',
    title: 'Envio do convite formal ao Diretor do ECO',
    project_id: 'proj-3',
    project_name: 'Lançamento Tech Hub Lisboa',
    client: 'Innovate Tech',
    client_or_brand: 'Innovate Tech',
    type: 'contacto_jornalista',
    journalist_id: 'jour-9',
    journalist_name: 'Tiago Mendes',
    responsible: 'Helena Ramos',
    assignee_name: 'Helena Ramos',
    due_date: '2026-11-15',
    due_time: '16:00',
    priority: 'alta',
    status: 'concluida',
    completed_at: '2026-11-15T16:00:00Z',
    notes: 'Convite entregue e presença confirmada na abertura do evento.',
    created_at: '2026-11-14T09:00:00Z'
  },
  {
    id: 'task-12',
    title: 'Resposta a pedido de esclarecimento da SIC Notícias',
    project_id: 'proj-5',
    project_name: 'Gestão de Crítica Fabril',
    client: 'BioFarma',
    client_or_brand: 'BioFarma',
    type: 'contacto_jornalista',
    journalist_id: 'jour-4',
    journalist_name: 'Sofia Martins',
    responsible: 'Leonor Rodrigues',
    assignee_name: 'Leonor Rodrigues',
    due_date: '2026-11-19',
    due_time: '18:00',
    priority: 'alta',
    status: 'em_curso',
    is_overdue: true,
    notes: 'Atrasado aguardando dados da Agência Portuguesa do Ambiente.',
    created_at: '2026-11-18T16:00:00Z'
  },
  {
    id: 'task-13',
    title: 'Alinhamento com assessoria jurídica da BioFarma',
    project_id: 'proj-5',
    project_name: 'Gestão de Crítica Fabril',
    client: 'BioFarma',
    client_or_brand: 'BioFarma',
    type: 'reuniao',
    responsible: 'Carlos Silva',
    assignee_name: 'Carlos Silva',
    due_date: '2026-11-21',
    due_time: '14:30',
    priority: 'alta',
    status: 'concluida',
    completed_at: '2026-11-21T14:30:00Z',
    notes: 'Termos legais da declaração oficial validados sem reservas.',
    created_at: '2026-11-20T11:00:00Z'
  },
  {
    id: 'task-14',
    title: 'Mapeamento de reportagens publicadas sobre a fábrica',
    project_id: 'proj-5',
    project_name: 'Gestão de Crítica Fabril',
    client: 'BioFarma',
    client_or_brand: 'BioFarma',
    type: 'redacao',
    responsible: 'Leonor Rodrigues',
    assignee_name: 'Leonor Rodrigues',
    due_date: '2026-11-20',
    due_time: '18:00',
    priority: 'media',
    status: 'concluida',
    completed_at: '2026-11-20T18:00:00Z',
    notes: 'Clipping compilado e enviado para a Comissão Executiva.',
    created_at: '2026-11-20T09:00:00Z'
  },
  {
    id: 'task-15',
    title: 'Envio de press kit do Grupo M a Gonçalo Neves',
    project_id: 'proj-1',
    project_name: 'Expansão Ibérica 2026',
    client: 'Grupo M',
    client_or_brand: 'Grupo M',
    type: 'contacto_jornalista',
    journalist_id: 'jour-6',
    journalist_name: 'Gonçalo Neves',
    responsible: 'Carlos Silva',
    assignee_name: 'Carlos Silva',
    due_date: '2026-11-18',
    due_time: '11:00',
    priority: 'media',
    status: 'concluida',
    completed_at: '2026-11-18T11:00:00Z',
    notes: 'Informação remetida com gráficos de investimento e citação do Presidente.',
    created_at: '2026-11-17T14:00:00Z'
  },
  {
    id: 'task-16',
    title: 'Gravação da entrevista com Inês Marques na CNN',
    project_id: 'proj-6',
    project_name: 'Entrevista CEO Diário',
    client: 'Vanguarda Invest',
    client_or_brand: 'Vanguarda Invest',
    type: 'contacto_jornalista',
    journalist_id: 'jour-11',
    journalist_name: 'Inês Marques',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-12',
    due_time: '16:30',
    priority: 'alta',
    status: 'concluida',
    completed_at: '2026-11-12T16:30:00Z',
    notes: 'Gravação decorreu com sucesso nos estúdios da CNN Portugal em Queluz.',
    created_at: '2026-11-10T10:00:00Z'
  },
  {
    id: 'task-17',
    title: 'Transcrição e arquivo do registo áudio do CEO',
    project_id: 'proj-6',
    project_name: 'Entrevista CEO Diário',
    client: 'Vanguarda Invest',
    client_or_brand: 'Vanguarda Invest',
    type: 'redacao',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-14',
    due_time: '12:00',
    priority: 'baixa',
    status: 'concluida',
    completed_at: '2026-11-14T12:00:00Z',
    notes: 'Documento de texto partilhado na pasta partilhada com o cliente.',
    created_at: '2026-11-13T09:00:00Z'
  },
  {
    id: 'task-18',
    title: 'Envio de agradecimento e clipping ao cliente Vanguarda',
    project_id: 'proj-6',
    project_name: 'Entrevista CEO Diário',
    client: 'Vanguarda Invest',
    client_or_brand: 'Vanguarda Invest',
    type: 'aprovacao_cliente',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-18',
    due_time: '17:00',
    priority: 'media',
    status: 'concluida',
    completed_at: '2026-11-18T17:00:00Z',
    notes: 'Relatório de impacto editorial com AVE estimado de 18.000 € aprovado.',
    created_at: '2026-11-17T11:00:00Z'
  },
  {
    id: 'task-19',
    title: 'Agendar almoço de relacionamento com Direção da Lusa',
    project_id: '',
    project_name: 'Geral',
    client: 'Geral',
    client_or_brand: 'Geral',
    type: 'reuniao',
    responsible: 'Leonor Rodrigues',
    assignee_name: 'Leonor Rodrigues',
    due_date: '2026-11-27',
    due_time: '13:00',
    priority: 'baixa',
    status: 'por_fazer',
    notes: 'Almoço institucional para apresentação da nova equipa sénior da agência.',
    created_at: '2026-11-21T15:00:00Z'
  },
  {
    id: 'task-20',
    title: 'Atualização trimestral da base de contactos de media',
    project_id: '',
    project_name: 'Geral',
    client: 'Geral',
    client_or_brand: 'Geral',
    type: 'outra',
    responsible: 'Tiago Mendes',
    assignee_name: 'Tiago Mendes',
    due_date: '2026-11-30',
    due_time: '18:00',
    priority: 'baixa',
    status: 'por_fazer',
    notes: 'Revisão dos registos na ERC e novas contratações das redações de Lisboa e Porto.',
    created_at: '2026-11-20T17:00:00Z'
  }
];

    const DEFAULT_SAMPLE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Expansão Ibérica 2026',
    client: 'Grupo M',
    client_or_brand: 'Grupo M',
    type: 'lancamento',
    status: 'em_curso',
    priority: 'alta',
    start_date: '2026-10-01',
    deadline: '2026-11-28',
    responsible: 'Leonor Rodrigues',
    manager_name: 'Leonor Rodrigues',
    team: ['Leonor Rodrigues', 'Tiago Mendes', 'Carlos Silva'],
    team_members: ['Leonor Rodrigues', 'Tiago Mendes', 'Carlos Silva'],
    objective: 'Coordenação do anúncio ibérico e abertura de sede em Madrid. Articulação de entrevistas exclusivas com a imprensa de economia em Lisboa e Madrid.',
    description: 'Coordenação do anúncio ibérico e abertura de sede em Madrid. Articulação de entrevistas exclusivas com a imprensa de economia em Lisboa e Madrid.',
    target_journalist_ids: ['jour-2', 'jour-3', 'jour-6'],
    target_journalists: ['Rui Almeida', 'Pedro Ramos', 'Gonçalo Neves'],
    target_outlets: ['Expresso', 'ECO Economia Online', 'Jornal de Negócios'],
    links_documents: [
      { label: 'Briefing Executivo Grupo M', url: 'https://docs.google.com/briefing-grupo-m', type: 'briefing' },
      { label: 'Press Kit Madrid 2026', url: 'https://drive.google.com/presskit-madrid', type: 'pasta' }
    ],
    notes: 'Conferência de imprensa em Madrid marcada para dia 26. Embargo noticioso até 25 de novembro às 18h00.',
    progress: 67,
    is_overdue: false,
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-11-21T18:00:00Z'
  },
  {
    id: 'proj-2',
    name: 'Pauta Sustentabilidade & ESG',
    client: 'GreenCorp',
    client_or_brand: 'GreenCorp',
    type: 'campanha',
    status: 'em_curso',
    priority: 'media',
    start_date: '2026-10-15',
    deadline: '2026-12-15',
    responsible: 'Tiago Mendes',
    manager_name: 'Tiago Mendes',
    team: ['Tiago Mendes', 'Helena Ramos'],
    team_members: ['Tiago Mendes', 'Helena Ramos'],
    objective: 'Posicionamento da GreenCorp como referência na transição energética industrial em Portugal e descarbonização fabril.',
    description: 'Posicionamento da GreenCorp como referência na transição energética industrial em Portugal e descarbonização fabril.',
    target_journalist_ids: ['jour-1', 'jour-8'],
    target_journalists: ['Marta Figueiredo', 'Rita Valente'],
    target_outlets: ['Público', 'Expresso'],
    links_documents: [
      { label: 'Relatório ESG 2026', url: 'https://greencorp.pt/esg-2026.pdf', type: 'briefing' },
      { label: 'Minuta Comunicado Transição', url: 'https://greencorp.pt/press-release', type: 'comunicado' }
    ],
    notes: 'Destaque para o investimento de 12M de euros na reconversão da unidade fabril do Norte.',
    progress: 50,
    is_overdue: false,
    created_at: '2026-10-15T10:00:00Z',
    updated_at: '2026-11-20T17:00:00Z'
  },
  {
    id: 'proj-3',
    name: 'Lançamento Tech Hub Lisboa',
    client: 'Innovate Tech',
    client_or_brand: 'Innovate Tech',
    type: 'evento',
    status: 'em_preparacao',
    priority: 'alta',
    start_date: '2026-11-01',
    deadline: '2026-11-24',
    responsible: 'Helena Ramos',
    manager_name: 'Helena Ramos',
    team: ['Helena Ramos', 'Carlos Silva'],
    team_members: ['Helena Ramos', 'Carlos Silva'],
    objective: 'Inauguração oficial do polo tecnológico na zona ribeirinha de Lisboa com presença governamental e apresentação de 500 postos de trabalho.',
    description: 'Inauguração oficial do polo tecnológico na zona ribeirinha de Lisboa com presença governamental e apresentação de 500 postos de trabalho.',
    target_journalist_ids: ['jour-9', 'jour-16'],
    target_journalists: ['Tiago Mendes', 'Miguel Carmo'],
    target_outlets: ['ECO Economia Online', 'Observador'],
    links_documents: [
      { label: 'Guia de Imprensa do Evento', url: 'https://innovate.pt/tech-hub-guide', type: 'briefing' }
    ],
    notes: 'Confirmação de presenças de jornalistas até dia 23 às 12h00. Sessão de fotos antes da cerimónia oficial.',
    progress: 33,
    is_overdue: false,
    created_at: '2026-11-01T08:30:00Z',
    updated_at: '2026-11-21T14:00:00Z'
  },
  {
    id: 'proj-4',
    name: 'Resultados Financeiros Anuais',
    client: 'Holdings SA',
    client_or_brand: 'Holdings SA',
    type: 'comunicado',
    status: 'aguarda_aprovacao',
    priority: 'alta',
    start_date: '2026-11-10',
    deadline: '2026-11-20',
    responsible: 'Carlos Silva',
    manager_name: 'Carlos Silva',
    team: ['Carlos Silva', 'Leonor Rodrigues'],
    team_members: ['Carlos Silva', 'Leonor Rodrigues'],
    objective: 'Apresentação de resultados anuais com EBITDA recorde e redução do endividamento financeiro líquido.',
    description: 'Apresentação de resultados anuais com EBITDA recorde e redução do endividamento financeiro líquido.',
    target_journalist_ids: ['jour-2', 'jour-10'],
    target_journalists: ['Rui Almeida', 'Bernardo Silva'],
    target_outlets: ['Expresso', 'TSF Rádio Notícias'],
    links_documents: [
      { label: 'Apresentação Financeira Auditada', url: 'https://holdings.pt/results-audit.pdf', type: 'briefing' }
    ],
    notes: 'Aguarda luz verde da Comissão de Auditoria para envio sob embargo ao caderno de economia.',
    progress: 25,
    is_overdue: true,
    created_at: '2026-11-10T09:15:00Z',
    updated_at: '2026-11-21T19:30:00Z'
  },
  {
    id: 'proj-5',
    name: 'Gestão de Crítica Fabril',
    client: 'BioFarma',
    client_or_brand: 'BioFarma',
    type: 'crise',
    status: 'em_curso',
    priority: 'alta',
    start_date: '2026-11-18',
    deadline: '2026-11-30',
    responsible: 'Leonor Rodrigues',
    manager_name: 'Leonor Rodrigues',
    team: ['Leonor Rodrigues', 'Carlos Silva'],
    team_members: ['Leonor Rodrigues', 'Carlos Silva'],
    objective: 'Controlo e resposta coordenada à contestação comunitária e laboral relativamente a odores na fábrica de Loures.',
    description: 'Controlo e resposta coordenada à contestação comunitária e laboral relativamente a odores na fábrica de Loures.',
    target_journalist_ids: ['jour-4', 'jour-18'],
    target_journalists: ['Sofia Martins', 'Beatriz Matos'],
    target_outlets: ['SIC Notícias', 'CNN Portugal'],
    links_documents: [
      { label: 'Matriz de Mensagens & Q&A de Crise', url: 'https://biofarma.pt/qa-crise.pdf', type: 'briefing' }
    ],
    notes: 'Monitorização diária de redes sociais e telejornais. Reunião de alinhamento às 09h00 diárias.',
    progress: 40,
    is_overdue: false,
    created_at: '2026-11-18T08:00:00Z',
    updated_at: '2026-11-22T08:30:00Z'
  },
  {
    id: 'proj-6',
    name: 'Entrevista CEO Diário',
    client: 'Vanguarda Invest',
    client_or_brand: 'Vanguarda Invest',
    type: 'entrevista',
    status: 'concluido',
    priority: 'media',
    start_date: '2026-11-05',
    deadline: '2026-11-18',
    responsible: 'Tiago Mendes',
    manager_name: 'Tiago Mendes',
    team: ['Tiago Mendes'],
    team_members: ['Tiago Mendes'],
    objective: 'Grande entrevista televisiva e online do Presidente Executivo sobre perspetivas de taxas de juro e consolidação da banca europeia.',
    description: 'Grande entrevista televisiva e online do Presidente Executivo sobre perspetivas de taxas de juro e consolidação da banca europeia.',
    target_journalist_ids: ['jour-11'],
    target_journalists: ['Inês Marques'],
    target_outlets: ['CNN Portugal'],
    links_documents: [
      { label: 'Registo Áudio & Transcrição', url: 'https://vanguarda.pt/transcricao-entrevista', type: 'briefing' }
    ],
    notes: 'Entrevista transmitida no sábado com boa repercussão mediática. Dossiê encerrado.',
    progress: 100,
    is_overdue: false,
    created_at: '2026-11-05T11:00:00Z',
    updated_at: '2026-11-18T18:00:00Z'
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

      const isTaskDone = (t) => t.status === 'concluida' || t.status === 'completed';
      const todayIso = new Date().toISOString().split('T')[0];
      const overdueCount = localTasks.filter(t => !isTaskDone(t) && isOverdue(t.due_date)).length;
      const todayCount = localTasks.filter(t => !isTaskDone(t) && (isDueToday(t.due_date) || t.due_date === todayIso)).length;

      if (summaryEl) {
        summaryEl.innerHTML = `${todayCount} tarefas para hoje · ${overdueCount > 0 ? '<span class="text-[#A3281E] font-medium">' + overdueCount + ' em atraso</span>' : '<span class="text-[#2F6B3A] font-medium">todas em dia</span>'}`;
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

      const isProjDone = (p) => p.status === 'concluido' || p.status === 'completed';
      const openProjects = localProjects.filter(p => !isProjDone(p));
      const today = new Date();

      const atRisk = openProjects.filter(p => {
        if (p.status === 'aguarda_aprovacao') return true;
        if (!p.deadline) return false;
        const d = new Date(p.deadline);
        const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      });

      const listToDisplay = atRisk.length > 0 ? atRisk.slice(0, 4) : openProjects.slice(0, 4);

      if (listToDisplay.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-xs text-[#6B6B6B]">
            Nenhum projeto em risco. Todos os prazos e aprovações estão em dia.
          </div>
        `;
        return;
      }

      container.innerHTML = listToDisplay.map(proj => {
        const isOverdueProj = proj.deadline && isOverdue(proj.deadline);
        let statusLabel = 'Em curso';
        let statusClass = 'bg-[#FDFBF2] text-[#805B00] border-[#E8DFBA]';

        if (isOverdueProj) {
          statusLabel = 'Em atraso';
          statusClass = 'bg-[#FDF6F5] text-[#A3281E] border-[#F6D9D5]';
        } else if (proj.status === 'aguarda_aprovacao') {
          statusLabel = 'Aguarda cliente';
          statusClass = 'bg-[#FDF0DB] text-[#8A5D18] border-[#E4DDD3]';
        } else if (proj.deadline) {
          statusLabel = 'Prazo próximo (<3 dias)';
          statusClass = 'bg-[#FDF6F5] text-[#A3281E] border-[#F6D9D5]';
        }

        const clientName = proj.client || proj.client_or_brand || 'Institucional';
        const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
        const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
        const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : (proj.progress || 0);

        return `
          <div onclick="openProjectDetail('${proj.id}')"
            class="p-3.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3]/70 hover:border-[#6C1C37]/40 transition-all cursor-pointer group">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="min-w-0">
                <h4 class="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors truncate font-title">
                  ${proj.name}
                </h4>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[11px] text-[#6B6B6B] truncate">${clientName}</span>
                  <span class="text-[#D1C7BA] text-[10px]">&bull;</span>
                  <span class="text-[10px] font-mono text-[#8A8A8A] truncate">Entrega: ${proj.deadline ? formatDate(proj.deadline) : 'A definir'}</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${statusClass}">
                ${statusLabel}
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between text-[10px] text-[#6B6B6B]">
                <span>Progresso: ${done}/${projTasks.length} tarefas</span>
                <span class="font-medium text-[#1A1A1A]">${pct}%</span>
              </div>
              <div class="w-full bg-[#E9E5E0] rounded-full h-1 overflow-hidden">
                <div class="h-1 rounded-full" style="width: ${pct}%; background-color: #6C1C37;"></div>
              </div>
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

      if (!localTasks || localTasks.length === 0 || localStorage.getItem('rep_projects_v5') !== 'true') {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
        localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
      }
      if (!localDailyContacts || localDailyContacts.length === 0) {
        localDailyContacts = [...DEFAULT_SAMPLE_CONTACTS];
      }
      if (!localProjects || localProjects.length === 0 || localStorage.getItem('rep_projects_v5') !== 'true') {
        localProjects = [...DEFAULT_SAMPLE_PROJECTS];
        localStorage.setItem('rep_projects_v5', 'true');
        localStorage.setItem('rep_projects', JSON.stringify(localProjects));
      }
      if (!localClippings || localClippings.length === 0) {
        localClippings = [...DEFAULT_SAMPLE_CLIPPINGS];
      }
      if (!localJournalists || localJournalists.length === 0 || localStorage.getItem('rep_bases_v4') !== 'true') {
        localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
        localStorage.setItem('rep_bases_v4', 'true');
        localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
      }
      if (!localOutlets || localOutlets.length === 0 || localStorage.getItem('rep_outlets_v4') !== 'true') {
        localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
        localStorage.setItem('rep_outlets_v4', 'true');
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
      const isTaskDone = (t) => t.status === 'concluida' || t.status === 'completed';
      const isProjDone = (p) => p.status === 'concluido' || p.status === 'completed';
      const todayIso = new Date().toISOString().split('T')[0];

      // 1. Projetos em aberto
      const openProjects = localProjects.filter(p => !isProjDone(p));
      const openProjectsCount = openProjects.length;
      const endingThisWeek = openProjects.filter(p => p.deadline && isDueThisWeek(p.deadline)).length;

      const kpiProjects = document.getElementById('kpi-open-projects');
      if (kpiProjects) kpiProjects.innerText = openProjectsCount;
      const sidebarProjects = document.getElementById('sidebar-projects-count');
      if (sidebarProjects) sidebarProjects.innerText = openProjectsCount;

      // 2. Tarefas para hoje e em atraso
      const todayTasks = localTasks.filter(t => !isTaskDone(t) && (isDueToday(t.due_date) || t.due_date === todayIso));
      const overdueTasks = localTasks.filter(t => !isTaskDone(t) && isOverdue(t.due_date));
      const weekTasks = localTasks.filter(t => !isTaskDone(t) && isDueThisWeek(t.due_date));

      const overdueCount = overdueTasks.length;
      const weekDeliveriesCount = weekTasks.length;

      // 3. A aguardar cliente (tarefas de aprovação pendentes + projetos em aguarda_aprovacao)
      const tasksWaitClient = localTasks.filter(t => !isTaskDone(t) && t.type === 'aprovacao_cliente').length;
      const projsWaitClient = localProjects.filter(p => p.status === 'aguarda_aprovacao').length;
      const awaitingClientTotal = tasksWaitClient + projsWaitClient;

      // 4. Contactos hoje
      const todayContactTasks = localTasks.filter(t => (t.type === 'contacto_jornalista' || t.type === 'contacto com jornalista') && t.due_date === todayIso);
      const todayContactDone = todayContactTasks.filter(t => isTaskDone(t)).length;
      const totalPlannedContacts = Math.max(todayContactTasks.length, 3);

      // Atualização dos 4 cartões do topo do Dashboard
      const cardOpenProj = document.getElementById('dash-card-open-projects');
      if (cardOpenProj) cardOpenProj.innerText = openProjectsCount;
      const cardOpenProjSub = document.getElementById('dash-card-open-projects-sub');
      if (cardOpenProjSub) cardOpenProjSub.innerText = `${endingThisWeek} a terminar esta semana`;

      const cardWeekDeliv = document.getElementById('dash-card-week-deliveries');
      if (cardWeekDeliv) cardWeekDeliv.innerText = weekDeliveriesCount;
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
      if (cardWaitClient) cardWaitClient.innerText = awaitingClientTotal;
      const cardWaitClientSub = document.getElementById('dash-card-waiting-client-sub');
      if (cardWaitClientSub) cardWaitClientSub.innerText = "aprovações e feedback pendentes";

      const cardContToday = document.getElementById('dash-card-contacts-today');
      if (cardContToday) cardContToday.innerText = `${todayContactDone} / ${totalPlannedContacts}`;
      const cardContTodaySub = document.getElementById('dash-card-contacts-today-sub');
      if (cardContTodaySub) cardContTodaySub.innerText = "feitos / planeados";

      // Contadores adicionais
      const pendingTasksCount = localTasks.filter(t => !isTaskDone(t)).length;
      const sidebarTasks = document.getElementById('sidebar-tasks-count');
      if (sidebarTasks) sidebarTasks.innerText = pendingTasksCount;
    }
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

// [Tasks logic moved to unified block]

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

// [Projects logic moved to unified block]

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

    // Formatação de Datas Amigável
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
      if (diffDays > 0) return `Há ${diffDays} dias (${dateFormatted})`;
      return dateFormatted;
    }

    // Atualização de Ícones SVG de Ordenação
    function updateSortIcons() {
      const neutralSvg = '<svg class="w-3 h-3 text-[#6B6B6B] inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>';
      const ascSvg = '<svg class="w-3 h-3 text-[#6C1C37] inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
      const descSvg = '<svg class="w-3 h-3 text-[#6C1C37] inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';

      const jourMap = {
        name: 'sort-icon-jour-name',
        role_title: 'sort-icon-jour-role',
        outlet_name: 'sort-icon-jour-ocs',
        last_contact_date: 'sort-icon-jour-last',
        status: 'sort-icon-jour-status'
      };

      Object.keys(jourMap).forEach(key => {
        const el = document.getElementById(jourMap[key]);
        if (el) {
          el.innerHTML = jourSortField === key ? (jourSortOrder === 'asc' ? ascSvg : descSvg) : neutralSvg;
        }
      });

      const ocsMap = {
        name: 'sort-icon-ocs-name',
        media_group: 'sort-icon-ocs-group',
        scope: 'sort-icon-ocs-scope',
        status: 'sort-icon-ocs-status'
      };

      Object.keys(ocsMap).forEach(key => {
        const el = document.getElementById(ocsMap[key]);
        if (el) {
          el.innerHTML = ocsSortField === key ? (ocsSortOrder === 'asc' ? ascSvg : descSvg) : neutralSvg;
        }
      });
    }

    // ========================================================
    // RENDERIZAÇÃO DA BASE 2: JORNALISTAS
    // ========================================================
    function renderJournalistsTable() {
      const tbody = document.getElementById('journalists-table-body');
      if (!tbody) return;

      if (!localJournalists || localJournalists.length === 0) {
        localJournalists = (typeof DEFAULT_SAMPLE_JOURNALISTS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_JOURNALISTS)) ? [...DEFAULT_SAMPLE_JOURNALISTS] : [];
      }

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

      // Filtro de Área
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

      // Filtro de Preferência
      if (prefFilter !== 'all') {
        list = list.filter(j => (j.contact_preference || 'email') === prefFilter);
      }

      // Ordenação
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

      // Atualizar ícones de ordenação
      updateSortIcons();

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
        const primaryEmail = (j.emails && j.emails.length > 0) ? j.emails[0] : (j.contact_email || '—');
        const primaryPhone = (j.phones && j.phones.length > 0) ? j.phones[0] : (j.contact_phone || '—');
        
        // Meio principal
        const outletName = j.outlet_name || ((j.outlet_names && j.outlet_names.length > 0) ? j.outlet_names[0] : 'Geral');
        const outletObj = localOutlets.find(o => o.name.toLowerCase() === outletName.toLowerCase() || (j.outlet_ids && j.outlet_ids.includes(o.id)));
        const outletId = outletObj ? outletObj.id : null;

        // Áreas
        const areas = j.intervention_areas || (j.intervention_area ? [j.intervention_area] : ['Geral']);
        const areasHtml = areas.slice(0, 2).map(a => renderTag(a, 'mr-1 mb-0.5')).join('') + (areas.length > 2 ? `<span class="text-[10px] text-[#6B6B6B] ml-1">+${areas.length - 2}</span>` : '');

        // Preferência
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
                <button type="button" onclick="event.stopPropagation(); openOutletDetailDrawer('${outletId}')" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] transition-all" title="Ver ficha do órgão ${outletName}">
                  <span class="w-2 h-2 rounded-full bg-[#6C1C37]"></span>
                  <span>${outletName}</span>
                </button>
              ` : renderTag(outletName)}
            </td>
            <td class="py-3 px-4 max-w-xs ${jourHiddenCols.area ? 'hidden' : ''}">${areasHtml}</td>
            <td class="py-3 px-4 font-mono text-[11px] space-y-0.5 ${jourHiddenCols.contactos ? 'hidden' : ''}">
              ${primaryEmail !== '—' ? `<a href="mailto:${primaryEmail}" onclick="event.stopPropagation()" class="text-[#6C1C37] hover:underline block">${primaryEmail}</a>` : ''}
              ${primaryPhone !== '—' ? `<a href="tel:${primaryPhone}" onclick="event.stopPropagation()" class="text-[#6B6B6B] hover:text-[#1A1A1A] block">${primaryPhone}</a>` : ''}
              ${primaryEmail === '—' && primaryPhone === '—' ? '<span class="text-[#6B6B6B]">—</span>' : ''}
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
    // RENDERIZAÇÃO DA BASE 1: ÓRGÃOS DE COMUNICAÇÃO SOCIAL (OCS)
    // ========================================================
    function renderOutletsTable() {
      const tbody = document.getElementById('outlets-table-body');
      if (!tbody) return;

      if (!localOutlets || localOutlets.length === 0) {
        localOutlets = (typeof DEFAULT_SAMPLE_OUTLETS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_OUTLETS)) ? [...DEFAULT_SAMPLE_OUTLETS] : [];
      }

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

      // Filtro de Âmbito
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

      // Ordenação
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
      if (totalBadge) totalBadge.innerText = `${localOutlets.length} órgãos de media registados`;
      const footerCount = document.getElementById('outlets-footer-count');
      if (footerCount) footerCount.innerText = `A apresentar ${list.length} de ${localOutlets.length} meios de comunicação social`;

      // Atualizar ícones de ordenação
      updateSortIcons();

      // Se estiver em modo cartões, renderizar cartões
      if (outletsCurrentViewMode === 'cards') {
        renderOutletsCards(list);
        return;
      }

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Nenhum meio de comunicação encontrado com os filtros selecionados.</p>
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
            <td class="py-3 px-4 text-[#1A1A1A] text-xs font-normal ${ocsHiddenCols.grupo ? 'hidden' : ''}">${ocs.media_group || '—'}</td>
            <td class="py-3 px-4 max-w-xs ${ocsHiddenCols.formatos ? 'hidden' : ''}">${formatsHtml}</td>
            <td class="py-3 px-4 text-xs ${ocsHiddenCols.ambito ? 'hidden' : ''}">
              <span class="capitalize text-[#1A1A1A] font-medium">${ocs.scope || 'Nacional'}</span>
              <span class="text-[#6B6B6B] block text-[11px] capitalize">${ocs.periodicity || 'Diário'}</span>
            </td>
            <td class="py-3 px-4 max-w-xs ${ocsHiddenCols.especialidade ? 'hidden' : ''}">${specsHtml}</td>
            <td class="py-3 px-4 font-mono text-[11px] text-[#6B6B6B] ${ocsHiddenCols.erc ? 'hidden' : ''}">${ocs.erc_registration || '—'}</td>
            <td class="py-3 px-4 font-mono text-[11px] ${ocsHiddenCols.agenda ? 'hidden' : ''}">
              ${ocs.agenda_email ? `<a href="mailto:${ocs.agenda_email}" onclick="event.stopPropagation()" class="text-[#6C1C37] hover:underline block">${ocs.agenda_email}</a>` : ''}
              ${ocs.phone ? `<span class="text-[#6B6B6B] block">${ocs.phone}</span>` : ''}
              ${!ocs.agenda_email && !ocs.phone ? '<span class="text-[#6B6B6B]">—</span>' : ''}
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

    // Modo Cartões de OCS
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
                <span>Âmbito / Periodicidade:</span>
                <strong class="text-[#1A1A1A] capitalize">${ocs.scope || 'Nacional'} · ${ocs.periodicity || 'Diário'}</strong>
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
              <span class="font-mono text-[11px] text-[#6B6B6B]">${ocs.agenda_email || '—'}</span>
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

      // Meios de Comunicação Social Associados (Base 1 Ligada)
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
                <button type="button" onclick="openOutletDetailDrawer('${ocsId}')" class="btn-secondary py-1 px-2.5 text-xs flex items-center gap-1 text-[#6C1C37] font-medium" title="Abrir ficha deste órgão">
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
                <span class="text-[10px] text-[#6B6B6B]">${idx === 0 ? 'Principal' : 'Secundário'}</span>
              </div>
            `).join('')
          : '<span class="text-[#6B6B6B]">—</span>';
      }

      // Telefones
      const phonesContainer = document.getElementById('jd-phones-list');
      if (phonesContainer) {
        const phones = j.phones && j.phones.length > 0 ? j.phones : (j.contact_phone ? [j.contact_phone] : []);
        phonesContainer.innerHTML = phones.length > 0
          ? phones.map((ph, idx) => `
              <div class="flex items-center justify-between py-0.5">
                <a href="tel:${ph}" class="text-[#1A1A1A] hover:underline">${ph}</a>
                <span class="text-[10px] text-[#6B6B6B]">${idx === 0 ? 'Direto / Móvel' : 'Redação'}</span>
              </div>
            `).join('')
          : '<span class="text-[#6B6B6B]">—</span>';
      }

      // Preferência
      const prefEl = document.getElementById('jd-contact-pref');
      if (prefEl) {
        let prefText = 'Email Institucional';
        if (j.contact_preference === 'whatsapp') prefText = 'WhatsApp (Contacto Preferencial / Rápido)';
        if (j.contact_preference === 'telefone') prefText = 'Chamada Telefónica Direta';
        prefEl.innerText = prefText;
      }

      // Áreas
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
          linksHtml.push(`<a href="${j.links.author_page}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">Página de Autor &nearr;</a>`);
        }
        if (linksHtml.length === 0) {
          linksContainer.innerHTML = '<span class="text-xs text-[#6B6B6B]">Nenhum link ou perfil externo registado.</span>';
        } else {
          linksContainer.innerHTML = linksHtml.join('');
        }
      }

      // RGPD
      document.getElementById('jd-rgpd-badge').innerText = j.rgpd_consent ? 'Sim (Consentimento Válido)' : 'Não / Pendente';
      document.getElementById('jd-rgpd-badge').className = j.rgpd_consent ? 'font-medium text-[#3F5A2E]' : 'font-medium text-[#8A3E22]';
      document.getElementById('jd-rgpd-date').innerText = j.rgpd_consent_date || '—';
      document.getElementById('jd-contact-origin').innerText = j.contact_origin || 'Registo Interno';

      // Histórico e Notas
      document.getElementById('jd-last-contact').innerText = formatRelativeDays(j.last_contact_date);
      document.getElementById('jd-updated-at').innerText = j.updated_at ? j.updated_at.split('T')[0] : '2026-11-22';
      document.getElementById('jd-notes').innerText = j.notes || 'Sem notas editoriais registadas.';

      // Abrir Gaveta
      renderJournalistTasksInDrawer(j);
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

      // Indicadores: Âmbito, Periodicidade, Audiência
      document.getElementById('od-scope').innerText = ocs.scope || 'Nacional';
      document.getElementById('od-periodicity').innerText = ocs.periodicity || 'Diário';
      document.getElementById('od-audience').innerText = ocs.estimated_audience ? `${ocs.estimated_audience.toLocaleString('pt-PT')} leitores` : 'Não estimada';

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
      document.getElementById('od-erc-type').innerText = ocs.erc_type || 'Publicação Periódica';
      document.getElementById('od-erc-reg').innerText = ocs.erc_registration || '—';

      // Contactos
      document.getElementById('od-agenda-email').innerText = ocs.agenda_email || ocs.contact_email || '—';
      document.getElementById('od-phone').innerText = ocs.phone || '—';
      document.getElementById('od-address').innerText = ocs.address || '—';

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
      // JORNALISTAS ASSOCIADOS (LIGAÇÃO AUTOMÁTICA DA BASE 2)
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
              <p>Nenhum jornalista registado associado a este órgão.</p>
              <button onclick="openJournalistModalForOutlet('${ocs.name.replace(/'/g, "\\'")}')" class="mt-2 text-[#6C1C37] font-medium hover:underline inline-block">
                + Associar Novo Jornalista a este Meio
              </button>
            </div>
          `;
        } else {
          assocContainer.innerHTML = associatedList.map(j => {
            const jInitials = j.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const email = (j.emails && j.emails.length > 0) ? j.emails[0] : (j.contact_email || '—');
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
      renderOutletProjectsInDrawer(ocs);
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
      openContactModalPrefilled(`Redação de ${ocs.name}`, ocs.name, 'Geral');
    }

    // ========================================================
    // ORDENAÇÃO DE COLUNAS
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
    // EXPORTAÇÃO E IMPORTAÇÃO DE CSV
    // ========================================================
    function exportJournalistsCsv() {
      const headers = ['ID', 'Nome', 'Cargo', 'OCS', 'Email Principal', 'Telemóvel', 'Preferência', 'Áreas de Intervenção', 'Estado', 'Último Contacto', 'Consentimento RGPD', 'Data RGPD', 'Origem', 'Notas'];
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
        `"${j.rgpd_consent ? 'Sim' : 'Não'}"`,
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
      showToast('Exportação concluída com sucesso.');
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
            showToast('Ficheiro CSV inválido ou sem registos.');
            return;
          }

          let added = 0;
          for (let i = 1; i < lines.length; i++) {
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
                contact_origin: cols[12] || 'Importação CSV',
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
      const headers = ['ID', 'Nome do Meio', 'Grupo Editorial', 'Formatos', 'Especialidades', 'Âmbito', 'Periodicidade', 'Audiência Estimada', 'Registo ERC', 'Tipo ERC', 'Email Agenda', 'Telefone Redação', 'Morada', 'Website', 'Estado'];
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
      showToast('Exportação de OCS concluída com sucesso.');
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
            showToast('Ficheiro CSV inválido ou sem registos.');
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
                erc_type: cols[9] || 'Publicação Periódica',
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
    // MODAIS DE CRIAÇÃO E SUBMISSÃO
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
      showToast(`Órgão ${name} adicionado com sucesso.`);
    }

    function openJournalistModalForOutlet(prefilledOutletName) {
      closeOutletDetailDrawer();
      openJournalistModal();
      setTimeout(() => {
        const sel = document.getElementById('j-outlet');
        if (sel) sel.value = prefilledOutletName;
      }, 50);
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

// [handleNewTaskSubmit and handleNewProjectSubmit moved to unified block]

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

// [toggleTaskStatus moved to unified block]

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
// [openTaskModal and openProjectModal moved to unified block]

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

    // ========================================================
    // MÓDULO 1: PROJETOS & MÓDULO 2: TAREFAS (LÓGICA CRM)
    // ========================================================

    let currentProjectsViewMode = 'list'; // 'list' | 'kanban'
    let currentProjStatusFilter = 'all';
    let currentProjClientFilter = 'all';
    let currentProjRespFilter = 'all';
    let currentProjPriorityFilter = 'all';

    currentTaskTab = 'all'; // 'all' | 'today' | 'week' | 'overdue' | 'my'
    let currentTaskGrouping = 'none'; // 'none' | 'project' | 'due_date'

    let activeProjectDetailTab = 'overview'; // 'overview' | 'tasks' | 'journalists'

    // Formatação de Badges
    function getProjectStatusBadge(status) {
      const map = {
        'em_preparacao': { bg: '#EBF1F5', text: '#2F4A63', label: 'Em preparação' },
        'em_curso': { bg: '#DDEBDD', text: '#2F6B3A', label: 'Em curso' },
        'in_progress': { bg: '#DDEBDD', text: '#2F6B3A', label: 'Em curso' },
        'aguarda_aprovacao': { bg: '#FDF0DB', text: '#8A5D18', label: 'A aguardar aprovação' },
        'concluido': { bg: '#E9E5E0', text: '#5C554E', label: 'Concluído' },
        'completed': { bg: '#E9E5E0', text: '#5C554E', label: 'Concluído' },
        'em_pausa': { bg: '#F6F2EC', text: '#6B6B6B', label: 'Em pausa' },
        'on_hold': { bg: '#F6F2EC', text: '#6B6B6B', label: 'Em pausa' }
      };
      const conf = map[status] || { bg: '#F6F2EC', text: '#6B6B6B', label: status || '—' };
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium" style="background-color: ${conf.bg}; color: ${conf.text};">${conf.label}</span>`;
    }

    function getProjectTypeBadge(type) {
      const map = {
        'lancamento': 'Lançamento',
        'evento': 'Evento',
        'comunicado': 'Comunicado',
        'entrevista': 'Entrevista',
        'campanha': 'Campanha',
        'crise': 'Gestão de Crise'
      };
      const label = map[type] || type || 'Geral';
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F6F2EC] text-[#1A1A1A] border border-[#E4DDD3]">${label}</span>`;
    }

    function getProjectPriorityBadge(priority) {
      if (priority === 'alta') {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Alta</span>`;
      }
      if (priority === 'baixa') {
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F6F2EC] text-[#6B6B6B]">Baixa</span>`;
      }
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FDF0DB] text-[#8A5D18]">Média</span>`;
    }

    function getTaskTypeBadge(type) {
      const map = {
        'contacto_jornalista': { label: 'Contacto jornalista', bg: '#F4EAE6', text: '#6C1C37' },
        'contacto com jornalista': { label: 'Contacto jornalista', bg: '#F4EAE6', text: '#6C1C37' },
        'redacao': { label: 'Redação', bg: '#EBF1F5', text: '#2F4A63' },
        'reuniao': { label: 'Reunião', bg: '#F6F2EC', text: '#1A1A1A' },
        'aprovacao_cliente': { label: 'Aprovação cliente', bg: '#FDF0DB', text: '#8A5D18' },
        'outra': { label: 'Outra', bg: '#F6F2EC', text: '#6B6B6B' }
      };
      const conf = map[type] || { label: type || 'Geral', bg: '#F6F2EC', text: '#6B6B6B' };
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium" style="background-color: ${conf.bg}; color: ${conf.text};">${conf.label}</span>`;
    }

    // Alternar modo de visualização de projetos
    function setProjectsViewMode(mode) {
      currentProjectsViewMode = mode;
      const btnList = document.getElementById('btn-proj-view-list');
      const btnKanban = document.getElementById('btn-proj-view-kanban');
      const listContainer = document.getElementById('projects-list-container');
      const kanbanContainer = document.getElementById('projects-kanban-container');

      if (mode === 'list') {
        btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5';
        btnKanban.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5';
        listContainer?.classList.remove('hidden');
        kanbanContainer?.classList.add('hidden');
      } else {
        btnKanban.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer flex items-center gap-1.5';
        btnList.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5';
        listContainer?.classList.add('hidden');
        kanbanContainer?.classList.remove('hidden');
      }
      renderFullProjects();
    }

    function filterProjectsByState(val) {
      currentProjStatusFilter = val;
      renderFullProjects();
    }

    function filterProjectsByClient(val) {
      currentProjClientFilter = val;
      renderFullProjects();
    }

    function filterProjectsByResponsible(val) {
      currentProjRespFilter = val;
      renderFullProjects();
    }

    function filterProjectsByPriority(val) {
      currentProjPriorityFilter = val;
      renderFullProjects();
    }

    // ========================================================
    // RENDERIZAÇÃO COMPLETA DE PROJETOS (LISTA & KANBAN)
    // ========================================================
    function renderFullProjects() {
      // Atualizar badge total
      const totalBadge = document.getElementById('projects-total-badge');
      if (totalBadge) totalBadge.innerText = `${localProjects.length} projetos registados`;

      // Atualizar dropdown de clientes
      const clientSelect = document.getElementById('filter-proj-client');
      if (clientSelect) {
        const clients = [...new Set(localProjects.map(p => p.client || p.client_or_brand).filter(Boolean))];
        const currentVal = clientSelect.value;
        clientSelect.innerHTML = `<option value="all">Todos os Clientes (${clients.length})</option>` +
          clients.map(c => `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`).join('');
      }

      // Filtragem
      let filtered = [...localProjects];
      if (currentProjStatusFilter !== 'all') {
        filtered = filtered.filter(p => {
          if (currentProjStatusFilter === 'em_curso') return p.status === 'em_curso' || p.status === 'in_progress';
          if (currentProjStatusFilter === 'concluido') return p.status === 'concluido' || p.status === 'completed';
          return p.status === currentProjStatusFilter;
        });
      }
      if (currentProjClientFilter !== 'all') {
        filtered = filtered.filter(p => (p.client || p.client_or_brand) === currentProjClientFilter);
      }
      if (currentProjRespFilter !== 'all') {
        filtered = filtered.filter(p => (p.responsible || p.manager || p.manager_name) === currentProjRespFilter);
      }
      if (currentProjPriorityFilter !== 'all') {
        filtered = filtered.filter(p => p.priority === currentProjPriorityFilter);
      }

      // 1. RENDERIZAR LISTA
      const tbody = document.getElementById('projects-table-body');
      if (tbody) {
        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="9" class="py-12 text-center text-xs text-[#6B6B6B]">Nenhum projeto encontrado com os filtros selecionados.</td></tr>`;
        } else {
          tbody.innerHTML = filtered.map(proj => {
            const clientName = proj.client || proj.client_or_brand || 'Institucional';
            const clientTag = renderTag(clientName);
            const manager = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
            const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
            const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;

            // Calcular progresso a partir das tarefas
            const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
            const doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
            const totalTasks = projTasks.length;
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

            return `
              <tr class="hover:bg-[#FBF9F6] transition-colors cursor-pointer group" onclick="openProjectDetail('${proj.id}')">
                <td class="font-semibold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors py-3 px-4">
                  ${proj.name}
                </td>
                <td class="py-3 px-4" onclick="event.stopPropagation()">
                  ${clientTag}
                </td>
                <td class="py-3 px-4">
                  ${getProjectTypeBadge(proj.type)}
                </td>
                <td class="py-3 px-4">
                  ${getProjectStatusBadge(proj.status)}
                </td>
                <td class="py-3 px-4">
                  ${getProjectPriorityBadge(proj.priority)}
                </td>
                <td class="py-3 px-4 font-mono text-xs">
                  ${isProjOverdue 
                    ? `<div class="flex items-center gap-1.5"><span class="text-[#A3281E] font-medium font-mono">${formatDate(proj.deadline)}</span><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Em atraso</span></div>`
                    : `<span class="text-[#1A1A1A]">${proj.deadline ? formatDate(proj.deadline) : '—'}</span>`
                  }
                </td>
                <td class="py-3 px-4 text-xs text-[#1A1A1A]">
                  <div class="flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-[#E4DDD3] text-[#1A1A1A] flex items-center justify-center font-bold text-[10px]">${manager.substring(0, 2).toUpperCase()}</span>
                    <span>${manager}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="w-32 space-y-1">
                    <div class="flex justify-between text-[10px] text-[#6B6B6B]">
                      <span>${doneTasks}/${totalTasks}</span>
                      <span class="font-medium text-[#1A1A1A]">${pct}%</span>
                    </div>
                    <div class="w-full bg-[#E9E5E0] rounded-full h-1.5 overflow-hidden">
                      <div class="h-1.5 rounded-full transition-all duration-300" style="width: ${pct}%; background-color: #6C1C37;"></div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
                  <div class="flex items-center justify-end gap-2">
                    <button onclick="openProjectDetail('${proj.id}')" class="text-xs font-medium text-[#6C1C37] hover:underline">Ver Ficha &rarr;</button>
                    <button onclick="deleteProject('${proj.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] text-xs p-1" title="Eliminar">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 2. RENDERIZAR QUADRO KANBAN (5 Colunas por Estado)
      const kanbanContainer = document.getElementById('projects-kanban-container');
      if (kanbanContainer) {
        const columns = [
          { id: 'em_preparacao', title: 'Em preparação', bg: '#FBF9F6' },
          { id: 'em_curso', title: 'Em curso', bg: '#FBF9F6' },
          { id: 'aguarda_aprovacao', title: 'A aguardar aprovação', bg: '#FBF9F6' },
          { id: 'em_pausa', title: 'Em pausa', bg: '#FBF9F6' },
          { id: 'concluido', title: 'Concluído', bg: '#FBF9F6' }
        ];

        kanbanContainer.innerHTML = columns.map(col => {
          const colProjects = filtered.filter(p => {
            if (col.id === 'em_curso') return p.status === 'em_curso' || p.status === 'in_progress';
            if (col.id === 'concluido') return p.status === 'concluido' || p.status === 'completed';
            if (col.id === 'em_pausa') return p.status === 'em_pausa' || p.status === 'on_hold';
            return p.status === col.id;
          });

          return `
            <div class="bg-[#F8F5F1] rounded-2xl border border-[#E4DDD3] p-3 flex flex-col space-y-3 min-h-[450px]">
              <div class="flex items-center justify-between px-1 pb-2 border-b border-[#E4DDD3]/70">
                <span class="text-xs font-semibold text-[#1A1A1A] font-title">${col.title}</span>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E4DDD3] text-[#1A1A1A]">${colProjects.length}</span>
              </div>

              <div class="space-y-3 flex-1 overflow-y-auto">
                ${colProjects.length === 0 ? `
                  <div class="py-8 text-center text-xs text-[#6B6B6B] border border-dashed border-[#E4DDD3] rounded-xl p-3">
                    Sem projetos nesta fase.
                  </div>
                ` : colProjects.map(proj => {
                  const clientName = proj.client || proj.client_or_brand || 'Institucional';
                  const clientTag = renderTag(clientName);
                  const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
                  const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;
                  const manager = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';

                  const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
                  const doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
                  const totalTasks = projTasks.length;
                  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

                  return `
                    <div onclick="openProjectDetail('${proj.id}')"
                      class="crm-card p-4 space-y-3 hover:border-[#6C1C37]/40 hover:shadow-md transition-all cursor-pointer group bg-white">
                      <div class="flex items-center justify-between gap-2">
                        <div onclick="event.stopPropagation()">${clientTag}</div>
                        <div>${getProjectPriorityBadge(proj.priority)}</div>
                      </div>

                      <h4 class="text-xs font-bold text-[#1A1A1A] group-hover:text-[#6C1C37] transition-colors leading-snug">
                        ${proj.name}
                      </h4>

                      <div class="flex items-center gap-1.5">
                        ${getProjectTypeBadge(proj.type)}
                      </div>

                      <!-- Prazo & Atraso -->
                      <div class="text-[11px] flex items-center justify-between pt-1 border-t border-[#E4DDD3]/60">
                        <span class="text-[#6B6B6B]">Entrega:</span>
                        ${isProjOverdue 
                          ? `<span class="font-bold text-[#A3281E] bg-[#FBEAE8] px-1.5 py-0.5 rounded text-[10px] font-mono border border-[#F5C2BE]">Atrasado (${formatDate(proj.deadline)})</span>`
                          : `<span class="font-mono text-[#1A1A1A]">${proj.deadline ? formatDate(proj.deadline) : '—'}</span>`
                        }
                      </div>

                      <!-- Progresso -->
                      <div class="space-y-1">
                        <div class="flex justify-between text-[10px] text-[#6B6B6B]">
                          <span>Tarefas: ${doneTasks}/${totalTasks}</span>
                          <span class="font-medium text-[#1A1A1A]">${pct}%</span>
                        </div>
                        <div class="w-full bg-[#E9E5E0] rounded-full h-1.5 overflow-hidden">
                          <div class="h-1.5 rounded-full" style="width: ${pct}%; background-color: #6C1C37;"></div>
                        </div>
                      </div>

                      <!-- Responsável & Mover -->
                      <div class="flex items-center justify-between pt-1 border-t border-[#E4DDD3]/60 text-[11px]" onclick="event.stopPropagation()">
                        <span class="text-[#6B6B6B]">${manager}</span>
                        <select onchange="updateProjectStatusQuick(event, '${proj.id}', this.value)" class="crm-select text-[10px] py-0.5 px-1.5 font-medium border-[#E4DDD3] bg-[#FBF9F6]">
                          <option value="em_preparacao" ${proj.status === 'em_preparacao' ? 'selected' : ''}>Mover: Preparação</option>
                          <option value="em_curso" ${(proj.status === 'em_curso' || proj.status === 'in_progress') ? 'selected' : ''}>Mover: Em curso</option>
                          <option value="aguarda_aprovacao" ${proj.status === 'aguarda_aprovacao' ? 'selected' : ''}>Mover: Aguarda aprovação</option>
                          <option value="em_pausa" ${(proj.status === 'em_pausa' || proj.status === 'on_hold') ? 'selected' : ''}>Mover: Em pausa</option>
                          <option value="concluido" ${(proj.status === 'concluido' || proj.status === 'completed') ? 'selected' : ''}>Mover: Concluído</option>
                        </select>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Mudança rápida de estado no Kanban
    async function updateProjectStatusQuick(e, projId, newStatus) {
      e.stopPropagation();
      const proj = localProjects.find(p => p.id === projId);
      if (!proj) return;
      proj.status = newStatus;
      proj.updated_at = new Date().toISOString();

      if (supabaseClient) {
        try {
          await supabaseClient.from('projects').update({ status: newStatus }).eq('id', projId);
        } catch (err) { }
      }

      syncLocalStorage();
      renderAll();
      showToast('Estado do projeto atualizado.');
    }

    // ========================================================
    // RENDERIZAÇÃO COMPLETA DE TAREFAS (MÓDULO 2)
    // ========================================================
    function filterTasksByTab(tab) {
      currentTaskTab = tab;
      const tabs = ['all', 'today', 'week', 'overdue', 'my'];
      tabs.forEach(t => {
        const btn = document.getElementById(`tab-tasks-${t}`);
        if (btn) {
          if (t === tab) {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6C1C37] text-white transition-all cursor-pointer';
          } else {
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-all cursor-pointer';
          }
        }
      });
      renderFullTasks();
    }

    function changeTasksGrouping(mode) {
      currentTaskGrouping = mode;
      renderFullTasks();
    }

    function renderFullTasks() {
      const wrapper = document.getElementById('tasks-content-wrapper');
      if (!wrapper) return;

      const totalBadge = document.getElementById('tasks-total-badge');
      if (totalBadge) totalBadge.innerText = `${localTasks.length} tarefas registadas`;

      // Filtragem
      let filtered = [...localTasks];
      const todayStr = new Date().toISOString().split('T')[0];

      if (currentTaskTab === 'today') {
        filtered = filtered.filter(t => t.due_date === todayStr);
      } else if (currentTaskTab === 'week') {
        filtered = filtered.filter(t => isDueThisWeek(t.due_date));
      } else if (currentTaskTab === 'overdue') {
        filtered = filtered.filter(t => {
          const isDone = t.status === 'concluida' || t.status === 'completed';
          return !isDone && isOverdue(t.due_date);
        });
      } else if (currentTaskTab === 'my') {
        filtered = filtered.filter(t => (t.responsible || t.assignee || t.assignee_name) === 'Tiago Mendes' || (t.responsible || t.assignee || t.assignee_name) === 'Leonor Rodrigues');
      }

      if (filtered.length === 0) {
        wrapper.innerHTML = `
          <div class="crm-card p-12 text-center text-xs text-[#6B6B6B] bg-white rounded-2xl border border-[#E4DDD3]">
            <p class="font-semibold text-sm text-[#1A1A1A] mb-1 font-title">Nenhuma tarefa encontrada.</p>
            <p>Não existem tarefas ativas para este filtro de pesquisa.</p>
            <button onclick="openTaskModal()" class="btn-primary py-2 px-4 text-xs font-medium mt-4">
              + Criar Nova Tarefa
            </button>
          </div>
        `;
        return;
      }

      // Função auxiliar para renderizar uma linha de tabela de tarefas
      function renderTaskTableRow(t) {
        const isDone = t.status === 'concluida' || t.status === 'completed';
        const isTaskOverdue = t.due_date && isOverdue(t.due_date) && !isDone;
        const projName = t.project_name || 'Geral';
        const clientName = t.client || t.client_or_brand || (t.project_id ? (localProjects.find(p => p.id === t.project_id)?.client || '—') : '—');
        const respName = t.responsible || t.assignee || t.assignee_name || 'Leonor Rodrigues';

        // Link de jornalista se tipo for contacto
        let journalistCell = '<span class="text-[#6B6B6B]">—</span>';
        if (t.journalist_name || t.journalist_id) {
          const jName = t.journalist_name || 'Jornalista';
          const jId = t.journalist_id || (localJournalists.find(j => j.name === jName)?.id);
          if (jId) {
            journalistCell = `<button onclick="openJournalistDetailDrawer('${jId}')" class="text-xs font-medium text-[#6C1C37] hover:underline flex items-center gap-1">
              <span>${jName}</span>
              <span class="text-[10px] text-[#6B6B6B]">&rarr;</span>
            </button>`;
          } else {
            journalistCell = `<span class="text-xs text-[#1A1A1A]">${jName}</span>`;
          }
        }

        // Link de projeto
        let projCell = `<span class="text-[#6B6B6B]">—</span>`;
        if (projName && projName !== 'Geral') {
          const pObj = localProjects.find(p => p.name === projName || p.id === t.project_id);
          if (pObj) {
            projCell = `<button onclick="openProjectDetail('${pObj.id}')" class="text-xs font-medium text-[#1A1A1A] hover:text-[#6C1C37] hover:underline text-left">
              ${projName}
            </button>`;
          } else {
            projCell = `<span class="text-xs text-[#1A1A1A]">${projName}</span>`;
          }
        }

        return `
          <tr class="hover:bg-[#FBF9F6] transition-colors ${isDone ? 'opacity-60 bg-[#FAFAFA]' : ''}">
            <td class="w-10 text-center py-3 px-3" onclick="event.stopPropagation()">
              <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')"
                class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
            </td>
            <td class="py-3 px-4">
              <span class="font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}">${t.title}</span>
            </td>
            <td class="py-3 px-4">
              ${getTaskTypeBadge(t.type)}
            </td>
            <td class="py-3 px-4">
              ${projCell}
            </td>
            <td class="py-3 px-4">
              ${clientName !== '—' ? renderTag(clientName) : '<span class="text-[#6B6B6B]">—</span>'}
            </td>
            <td class="py-3 px-4">
              ${journalistCell}
            </td>
            <td class="py-3 px-4 text-xs text-[#1A1A1A]">
              ${respName}
            </td>
            <td class="py-3 px-4 font-mono text-xs">
              ${isTaskOverdue 
                ? `<div class="flex items-center gap-1.5"><span class="text-[#A3281E] font-medium font-mono">${t.due_date} ${t.due_time || ''}</span><span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Em atraso</span></div>`
                : `<span class="${isDone ? 'text-[#6B6B6B]' : 'text-[#1A1A1A]'}">${t.due_date ? t.due_date : '—'} ${t.due_time || ''}</span>`
              }
            </td>
            <td class="py-3 px-4">
              ${getProjectPriorityBadge(t.priority)}
            </td>
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <button onclick="deleteTask('${t.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] p-1" title="Eliminar Tarefa">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </td>
          </tr>
        `;
      }

      // 1. MODO: SEM AGRUPAMENTO
      if (currentTaskGrouping === 'none') {
        // Ordenar por prazo
        filtered.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));

        wrapper.innerHTML = `
          <div class="crm-card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="crm-table">
                <thead>
                  <tr>
                    <th class="w-10 text-center">Estado</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Jornalista</th>
                    <th>Responsável</th>
                    <th>Prazo</th>
                    <th>Prioridade</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.map(renderTaskTableRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        return;
      }

      // 2. MODO: AGRUPAR POR PROJETO
      if (currentTaskGrouping === 'project') {
        const groups = {};
        filtered.forEach(t => {
          const pName = t.project_name || 'Sem Projeto / Geral';
          if (!groups[pName]) groups[pName] = [];
          groups[pName].push(t);
        });

        wrapper.innerHTML = Object.keys(groups).map(pName => {
          const groupTasks = groups[pName];
          groupTasks.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));
          const pObj = localProjects.find(p => p.name === pName);
          const done = groupTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;

          return `
            <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden space-y-2">
              <div class="p-4 bg-[#FBF9F6] border-b border-[#E4DDD3] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold text-[#1A1A1A] font-title">${pName}</h3>
                  ${pObj?.client ? renderTag(pObj.client) : ''}
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-[#6B6B6B]">${done} de ${groupTasks.length} concluídas</span>
                  ${pObj ? `<button onclick="openProjectDetail('${pObj.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline">Abrir Projeto &rarr;</button>` : ''}
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="crm-table">
                  <thead>
                    <tr>
                      <th class="w-10 text-center">Estado</th>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Projeto</th>
                      <th>Cliente</th>
                      <th>Jornalista</th>
                      <th>Responsável</th>
                      <th>Prazo</th>
                      <th>Prioridade</th>
                      <th class="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${groupTasks.map(renderTaskTableRow).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('');
        return;
      }

      // 3. MODO: AGRUPAR POR PRAZO
      if (currentTaskGrouping === 'due_date') {
        const overdue = filtered.filter(t => isOverdue(t.due_date) && t.status !== 'concluida' && t.status !== 'completed');
        const today = filtered.filter(t => t.due_date === todayStr);
        const thisWeek = filtered.filter(t => isDueThisWeek(t.due_date) && t.due_date !== todayStr && !isOverdue(t.due_date));
        const future = filtered.filter(t => !isOverdue(t.due_date) && t.due_date !== todayStr && !isDueThisWeek(t.due_date));

        const sections = [
          { title: 'Em Atraso', tasks: overdue, color: 'text-[#A3281E]', badgeBg: 'bg-[#FBEAE8] text-[#A3281E]' },
          { title: 'Para Hoje', tasks: today, color: 'text-[#6C1C37]', badgeBg: 'bg-[#F4EAE6] text-[#6C1C37]' },
          { title: 'Esta Semana', tasks: thisWeek, color: 'text-[#1A1A1A]', badgeBg: 'bg-[#F6F2EC] text-[#1A1A1A]' },
          { title: 'Próximas Semanas & Sem Prazo', tasks: future, color: 'text-[#6B6B6B]', badgeBg: 'bg-[#F6F2EC] text-[#6B6B6B]' }
        ];

        wrapper.innerHTML = sections.filter(s => s.tasks.length > 0).map(s => `
          <div class="bg-white rounded-2xl border border-[#E4DDD3] shadow-xs overflow-hidden space-y-2">
            <div class="p-4 bg-[#FBF9F6] border-b border-[#E4DDD3] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold ${s.color} font-title">${s.title}</h3>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${s.badgeBg}">${s.tasks.length}</span>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="crm-table">
                <thead>
                  <tr>
                    <th class="w-10 text-center">Estado</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Jornalista</th>
                    <th>Responsável</th>
                    <th>Prazo</th>
                    <th>Prioridade</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.tasks.map(renderTaskTableRow).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `).join('');
      }
    }

    // ========================================================
    // FICHA DETALHADA DO PROJETO (view-project-detail)
    // ========================================================
    function switchProjectDetailTab(tab) {
      activeProjectDetailTab = tab;
      const tabs = ['overview', 'tasks', 'journalists'];
      tabs.forEach(t => {
        const btn = document.getElementById(`proj-tab-btn-${t}`);
        const content = document.getElementById(`proj-tab-content-${t}`);
        if (btn && content) {
          if (t === tab) {
            btn.className = 'px-4 py-2 rounded-xl font-medium bg-[#6C1C37] text-white transition-all cursor-pointer';
            content.classList.remove('hidden');
          } else {
            btn.className = 'px-4 py-2 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer flex items-center gap-1.5';
            content.classList.add('hidden');
          }
        }
      });
    }

    function renderProjectDetail() {
      const proj = localProjects.find(p => p.id === activeProjectId) || localProjects[0];
      if (!proj) return;
      activeProjectId = proj.id;

      const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
      const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;

      // Topo & Breadcrumb
      document.getElementById('proj-detail-breadcrumb-title').innerText = proj.name;
      document.getElementById('proj-detail-title').innerText = proj.name;
      
      const clientName = proj.client || proj.client_or_brand || 'Institucional';
      document.getElementById('proj-detail-client-badge').innerText = clientName;
      document.getElementById('proj-detail-type-badge').innerHTML = getProjectTypeBadge(proj.type);
      document.getElementById('proj-detail-status-badge').innerHTML = getProjectStatusBadge(proj.status);
      document.getElementById('proj-detail-priority-badge').innerHTML = getProjectPriorityBadge(proj.priority);

      const overdueAlert = document.getElementById('proj-detail-overdue-alert');
      if (overdueAlert) {
        if (isProjOverdue) overdueAlert.classList.remove('hidden');
        else overdueAlert.classList.add('hidden');
      }

      // Progresso calculado pelas tarefas deste projeto
      const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
      const doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
      const totalTasks = projTasks.length;
      const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

      document.getElementById('proj-detail-tasks-progress-label').innerText = `${doneTasks} de ${totalTasks} tarefas concluídas`;
      document.getElementById('proj-detail-tasks-pct-label').innerText = `${pct}%`;
      document.getElementById('proj-detail-progress-bar').style.width = `${pct}%`;

      // Atualizar contadores das abas
      document.getElementById('proj-detail-tab-tasks-badge').innerText = totalTasks;
      
      const targetJourIds = proj.target_journalist_ids || [];
      document.getElementById('proj-detail-tab-journalists-badge').innerText = targetJourIds.length;

      // 1. SEPARADOR RESUMO
      const typeSelect = document.getElementById('proj-detail-type-select');
      if (typeSelect) typeSelect.value = proj.type || 'campanha';
      const statusSelect = document.getElementById('proj-detail-status-select');
      if (statusSelect) statusSelect.value = proj.status || 'em_curso';
      const prioritySelect = document.getElementById('proj-detail-priority-select');
      if (prioritySelect) prioritySelect.value = proj.priority || 'alta';
      const managerSelect = document.getElementById('proj-detail-manager-select');
      if (managerSelect) managerSelect.value = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
      const startDateInput = document.getElementById('proj-detail-start-date');
      if (startDateInput) startDateInput.value = proj.start_date || '2026-10-01';
      const deadlineInput = document.getElementById('proj-detail-deadline-date');
      if (deadlineInput) deadlineInput.value = proj.deadline || '2026-11-28';

      // Equipa Alocada
      const teamContainer = document.getElementById('proj-detail-team-badges');
      if (teamContainer) {
        const team = proj.team || proj.team_members || ['Leonor Rodrigues', 'Tiago Mendes'];
        teamContainer.innerHTML = team.map(m => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] text-xs font-medium border border-[#E4DDD3]">
            <span class="w-4 h-4 rounded-full bg-[#6C1C37] text-white flex items-center justify-center text-[9px] font-bold">${m.substring(0, 2).toUpperCase()}</span>
            <span>${m}</span>
          </span>
        `).join('');
      }

      // Objetivo
      const objEl = document.getElementById('proj-detail-objective');
      if (objEl) objEl.innerText = proj.objective || proj.description || 'Sem objetivo estratégico registado.';

      // Meios-Alvo (Automático a partir dos jornalistas-alvo, só leitura)
      const outletsContainer = document.getElementById('proj-detail-target-outlets-list');
      if (outletsContainer) {
        const targetJourObjs = localJournalists.filter(j => targetJourIds.includes(j.id) || (proj.target_journalists && proj.target_journalists.includes(j.name)));
        const derivedOutlets = new Set();
        targetJourObjs.forEach(j => {
          if (j.outlet_name) derivedOutlets.add(j.outlet_name);
          if (j.outlet_names) j.outlet_names.forEach(o => derivedOutlets.add(o));
        });
        if (proj.target_outlets) proj.target_outlets.forEach(o => derivedOutlets.add(o));

        const outletsArr = [...derivedOutlets];
        if (outletsArr.length === 0) {
          outletsContainer.innerHTML = '<span class="text-xs text-[#6B6B6B]">Nenhum órgão de comunicação identificado automaticamente.</span>';
        } else {
          outletsContainer.innerHTML = outletsArr.map(oName => {
            const ocsObj = localOutlets.find(item => item.name === oName);
            if (ocsObj) {
              return `
                <button type="button" onclick="openOutletDetailDrawer('${ocsObj.id}')"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3] text-xs text-[#1A1A1A] hover:border-[#6C1C37] hover:shadow-xs transition-all cursor-pointer">
                  <span class="w-4 h-4 rounded bg-[#E4DDD3] flex items-center justify-center font-bold text-[9px]">${oName.substring(0, 2).toUpperCase()}</span>
                  <span class="font-medium">${oName}</span>
                  <span class="text-[10px] text-[#6C1C37]">&rarr;</span>
                </button>
              `;
            }
            return `<span class="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#F6F2EC] text-xs font-medium text-[#1A1A1A] border border-[#E4DDD3]">${oName}</span>`;
          }).join('');
        }
      }

      // Links & Documentos
      const linksContainer = document.getElementById('proj-detail-links-list');
      if (linksContainer) {
        const links = proj.links_documents || proj.documents || [
          { label: 'Briefing Executivo do Projeto', url: '#', type: 'briefing' }
        ];
        linksContainer.innerHTML = links.map(doc => {
          const title = doc.label || doc.title || 'Documento';
          const url = doc.url || '#';
          return `
            <a href="${url}" target="_blank" class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] hover:border-[#6C1C37]/50 hover:bg-white transition-all flex items-center justify-between group">
              <div class="space-y-0.5 truncate mr-2">
                <span class="font-medium text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate">${title}</span>
                <span class="text-[10px] text-[#6B6B6B] uppercase font-mono">${doc.type || 'Link'}</span>
              </div>
              <svg class="w-4 h-4 text-[#6B6B6B] group-hover:text-[#6C1C37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          `;
        }).join('');
      }

      // Notas
      const notesEl = document.getElementById('proj-detail-notes');
      if (notesEl) notesEl.innerText = proj.notes || 'Sem notas internas registadas.';

      // 2. SEPARADOR TAREFAS DESTE PROJETO
      const tasksTbody = document.getElementById('proj-detail-tasks-tbody');
      if (tasksTbody) {
        if (projTasks.length === 0) {
          tasksTbody.innerHTML = `<tr><td colspan="8" class="py-12 text-center text-xs text-[#6B6B6B]">Nenhuma tarefa associada a este projeto. Clica em "+ Nova Tarefa" acima para adicionar.</td></tr>`;
        } else {
          tasksTbody.innerHTML = projTasks.map(t => {
            const isDone = t.status === 'concluida' || t.status === 'completed';
            const isTaskOverdue = t.due_date && isOverdue(t.due_date) && !isDone;
            const resp = t.responsible || t.assignee || 'Leonor Rodrigues';
            const jourName = t.journalist_name || '—';

            return `
              <tr class="hover:bg-[#FBF9F6] transition-colors ${isDone ? 'opacity-60 bg-[#FAFAFA]' : ''}">
                <td class="w-10 text-center py-3 px-3" onclick="event.stopPropagation()">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')"
                    class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
                </td>
                <td class="py-3 px-4 font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}">
                  ${t.title}
                </td>
                <td class="py-3 px-4">
                  ${getTaskTypeBadge(t.type)}
                </td>
                <td class="py-3 px-4 text-xs">
                  ${t.journalist_id ? `<button onclick="openJournalistDetailDrawer('${t.journalist_id}')" class="text-[#6C1C37] hover:underline">${jourName}</button>` : jourName}
                </td>
                <td class="py-3 px-4 text-xs text-[#1A1A1A]">
                  ${resp}
                </td>
                <td class="py-3 px-4 font-mono text-xs">
                  ${isTaskOverdue 
                    ? `<span class="text-[#A3281E] font-medium">${t.due_date} (Em atraso)</span>` 
                    : (t.due_date || '—')}
                </td>
                <td class="py-3 px-4">
                  ${getProjectPriorityBadge(t.priority)}
                </td>
                <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
                  <button onclick="deleteTask('${t.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] text-xs p-1">Eliminar</button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 3. SEPARADOR JORNALISTAS-ALVO
      const jourGrid = document.getElementById('proj-detail-journalists-grid');
      if (jourGrid) {
        const targetJourObjs = localJournalists.filter(j => targetJourIds.includes(j.id) || (proj.target_journalists && proj.target_journalists.includes(j.name)));
        if (targetJourObjs.length === 0) {
          jourGrid.innerHTML = `
            <div class="col-span-full py-12 text-center text-xs text-[#6B6B6B] bg-white rounded-2xl border border-[#E4DDD3] p-8">
              Nenhum jornalista-alvo associado a este projeto.
            </div>
          `;
        } else {
          jourGrid.innerHTML = targetJourObjs.map(j => {
            const outletName = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral';
            const ocs = localOutlets.find(o => o.name === outletName);

            return `
              <div class="crm-card p-4 space-y-3 bg-white">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ${j.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-[#1A1A1A]">${j.name}</h4>
                      <p class="text-[11px] text-[#6B6B6B]">${j.role || 'Jornalista'}</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-[#E4DDD3]/60 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Órgão (OCS):</span>
                    ${ocs ? `
                      <button onclick="openOutletDetailDrawer('${ocs.id}')" class="font-medium text-[#6C1C37] hover:underline flex items-center gap-1">
                        <span>${ocs.name}</span> &nearr;
                      </button>
                    ` : `<span class="font-medium text-[#1A1A1A]">${outletName}</span>`}
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Último contacto:</span>
                    <span class="font-mono text-[#1A1A1A]">${formatRelativeDays(j.last_contact_date)}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Editoria:</span>
                    <span class="text-[#1A1A1A]">${(j.intervention_areas && j.intervention_areas[0]) || 'Geral'}</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between">
                  <button onclick="openJournalistDetailDrawer('${j.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline">Ver Ficha &rarr;</button>
                  <button onclick="openTaskModalForJournalist('${j.id}')" class="btn-secondary py-1 px-2.5 text-xs">Agendar Contacto</button>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }

    // Ações inline da ficha de projeto
    function saveProjectTitleInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.name = e.target.innerText.trim();
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectTypeInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.type = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectStatusInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.status = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderAll();
    }
    function saveProjectPriorityInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.priority = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectManagerInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.responsible = val;
      proj.manager = val;
      proj.manager_name = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectStartDateInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.start_date = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectDeadlineInline(val) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.deadline = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderAll();
    }
    function saveProjectObjectiveInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.objective = e.target.innerText.trim();
      proj.description = proj.objective;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectNotesInline(e) {
      const proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.notes = e.target.innerText.trim();
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }

    function openNewTaskForCurrentProject() {
      const proj = localProjects.find(p => p.id === activeProjectId);
      openTaskModal(proj ? proj.id : null);
    }

    function openNewContactForCurrentProject() {
      const proj = localProjects.find(p => p.id === activeProjectId);
      openContactModalPrefilled('', '', proj ? proj.name : '');
    }

    function openTaskModalForJournalist(journalistId) {
      openTaskModal(null, journalistId);
    }

    // ========================================================
    // REGRAS DE LIGAÇÃO & CONCLUSÃO DE TAREFAS (REGRAS 1, 4)
    // ========================================================
    async function toggleTaskStatus(id) {
      const task = localTasks.find(t => t.id === id);
      if (!task) return;

      const wasCompleted = task.status === 'concluida' || task.status === 'completed';
      const newStatus = wasCompleted ? 'por_fazer' : 'concluida';
      task.status = newStatus;
      
      const todayStr = new Date().toISOString().split('T')[0];

      if (!wasCompleted) {
        task.completed_at = new Date().toISOString();

        // REGRA 1: Ao concluir uma tarefa do tipo "contacto com jornalista",
        // atualiza automaticamente o campo "Último contacto" desse jornalista com a data de conclusão,
        // e conta para o indicador "Contactos hoje" do Painel.
        if (task.type === 'contacto_jornalista' || task.type === 'contacto com jornalista') {
          let jour = null;
          if (task.journalist_id) {
            jour = localJournalists.find(j => j.id === task.journalist_id);
          }
          if (!jour && task.journalist_name) {
            jour = localJournalists.find(j => j.name === task.journalist_name);
          }
          if (jour) {
            jour.last_contact_date = todayStr;
            jour.updated_at = new Date().toISOString();
            localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
          }
        }
      } else {
        task.completed_at = null;
      }

      // REGRA 4: O progresso do projeto atualiza-se sempre que uma tarefa muda de estado.
      if (task.project_id || task.project_name) {
        const proj = localProjects.find(p => (task.project_id && p.id === task.project_id) || (task.project_name && p.name === task.project_name));
        if (proj) {
          const projTasks = localTasks.filter(t => (t.project_id && t.project_id === proj.id) || (t.project_name && t.project_name === proj.name));
          const doneCount = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
          proj.progress = projTasks.length > 0 ? Math.round((doneCount / projTasks.length) * 100) : 0;
          proj.updated_at = new Date().toISOString();
          localStorage.setItem('rep_projects', JSON.stringify(localProjects));
        }
      }

      if (supabaseClient) {
        try {
          await supabaseClient.from('tasks').update({ status: newStatus, completed_at: task.completed_at }).eq('id', id);
        } catch (e) { }
      }

      syncLocalStorage();
      renderAll();
      showToast(newStatus === 'concluida' ? 'Tarefa concluída com sucesso.' : 'Tarefa reaberta.');
    }

    // ========================================================
    // SUBMISSÃO DE MODAIS: NOVA TAREFA & NOVO PROJETO
    // ========================================================
    function handleTaskTypeChange(type) {
      const jWrapper = document.getElementById('task-journalist-field-wrapper');
      const jSelect = document.getElementById('task-journalist-select');
      if (type === 'contacto_jornalista') {
        jWrapper?.classList.remove('hidden');
        if (jSelect) jSelect.required = true;
      } else {
        jWrapper?.classList.add('hidden');
        if (jSelect) {
          jSelect.required = false;
          jSelect.value = '';
        }
      }
    }

    async function handleNewTaskSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('task-title').value.trim();
      const projSelect = document.getElementById('task-project-select');
      const project_id = projSelect ? projSelect.value : '';
      let project_name = 'Geral';
      let client = 'Geral';

      if (project_id) {
        const pObj = localProjects.find(p => p.id === project_id);
        if (pObj) {
          project_name = pObj.name;
          client = pObj.client || pObj.client_or_brand || 'Geral';
        }
      }

      const type = document.getElementById('task-type-select').value;
      const jSelect = document.getElementById('task-journalist-select');
      const journalist_id = jSelect ? jSelect.value : '';
      let journalist_name = '';
      if (journalist_id) {
        const jObj = localJournalists.find(j => j.id === journalist_id);
        if (jObj) journalist_name = jObj.name;
      }

      const responsible = document.getElementById('task-responsible-select').value;
      const priority = document.getElementById('task-priority-select').value;
      const due_date = document.getElementById('task-duedate').value;
      const due_time = document.getElementById('task-duetime').value;
      const status = document.getElementById('task-status-select').value;
      const notes = document.getElementById('task-notes').value.trim();

      const newTask = {
        id: 'task-' + Date.now(),
        title,
        project_id,
        project_name,
        client,
        client_or_brand: client,
        type,
        journalist_id,
        journalist_name,
        responsible,
        assignee: responsible,
        assignee_name: responsible,
        priority,
        due_date,
        due_time,
        status,
        notes,
        created_at: new Date().toISOString()
      };

      if (status === 'concluida') {
        newTask.completed_at = new Date().toISOString();
        if (type === 'contacto_jornalista' && journalist_id) {
          const jour = localJournalists.find(j => j.id === journalist_id);
          if (jour) jour.last_contact_date = new Date().toISOString().split('T')[0];
        }
      }

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('tasks').insert([newTask]).select();
          if (!error && data && data[0]) newTask.id = data[0].id;
        } catch (err) { }
      }

      localTasks.unshift(newTask);

      // Recalcular progresso do projeto
      if (project_id) {
        const pObj = localProjects.find(p => p.id === project_id);
        if (pObj) {
          const projTasks = localTasks.filter(t => t.project_id === project_id);
          const done = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
          pObj.progress = Math.round((done / projTasks.length) * 100);
        }
      }

      syncLocalStorage();
      closeTaskModal();
      renderAll();
      showToast('Tarefa registada com sucesso.');
      e.target.reset();
    }

    async function handleNewProjectSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('project-name').value.trim();
      const client = document.getElementById('project-client').value.trim() || 'Institucional';
      const type = document.getElementById('project-type').value;
      const status = document.getElementById('project-status').value;
      const priority = document.getElementById('project-priority').value;
      const start_date = document.getElementById('project-start-date').value;
      const deadline = document.getElementById('project-deadline').value;
      const responsible = document.getElementById('project-responsible').value;

      // Equipa selecionada
      const teamCheckboxes = document.querySelectorAll('input[name="proj-team-member"]:checked');
      const team = Array.from(teamCheckboxes).map(cb => cb.value);
      if (!team.includes(responsible)) team.unshift(responsible);

      const objective = document.getElementById('project-objective').value.trim();

      // Jornalistas-alvo selecionados
      const jourCheckboxes = document.querySelectorAll('input[name="proj-target-jour"]:checked');
      const target_journalist_ids = Array.from(jourCheckboxes).map(cb => cb.value);
      const target_journalists = target_journalist_ids.map(jid => {
        const j = localJournalists.find(item => item.id === jid);
        return j ? j.name : '';
      }).filter(Boolean);

      // Meios-alvo derivados automaticamente
      const derivedOutlets = new Set();
      target_journalist_ids.forEach(jid => {
        const j = localJournalists.find(item => item.id === jid);
        if (j) {
          if (j.outlet_name) derivedOutlets.add(j.outlet_name);
          if (j.outlet_names) j.outlet_names.forEach(o => derivedOutlets.add(o));
        }
      });
      const target_outlets = [...derivedOutlets];

      // Links
      const linkBriefing = document.getElementById('project-link-briefing').value.trim();
      const linkFolder = document.getElementById('project-link-folder').value.trim();
      const links_documents = [];
      if (linkBriefing) links_documents.push({ label: 'Briefing Executivo', url: linkBriefing, type: 'briefing' });
      if (linkFolder) links_documents.push({ label: 'Pasta Partilhada', url: linkFolder, type: 'pasta' });

      const notes = document.getElementById('project-notes').value.trim();

      const newProj = {
        id: 'proj-' + Date.now(),
        name,
        client,
        client_or_brand: client,
        type,
        status,
        priority,
        start_date,
        deadline,
        responsible,
        manager: responsible,
        manager_name: responsible,
        team,
        team_members: team,
        objective,
        description: objective,
        target_journalist_ids,
        target_journalists,
        target_outlets,
        links_documents,
        notes,
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('projects').insert([newProj]).select();
          if (!error && data && data[0]) newProj.id = data[0].id;
        } catch (err) { }
      }

      localProjects.unshift(newProj);
      syncLocalStorage();
      closeProjectModal();
      renderAll();
      showToast('Projeto criado com sucesso.');
      e.target.reset();
    }

    // Abertura e fecho de modais com pré-preenchimento
    function openTaskModal(prefilledProjId = null, prefilledJourId = null) {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      // Preencher seletor de projetos
      const projSelect = document.getElementById('task-project-select');
      if (projSelect) {
        projSelect.innerHTML = '<option value="">Nenhum / Geral</option>' +
          localProjects.map(p => `<option value="${p.id}" ${p.id === prefilledProjId ? 'selected' : ''}>${p.name} (${p.client || p.client_or_brand})</option>`).join('');
      }

      // Preencher seletor de jornalistas
      const jourSelect = document.getElementById('task-journalist-select');
      if (jourSelect) {
        jourSelect.innerHTML = '<option value="">Selecionar jornalista da Base 2...</option>' +
          localJournalists.map(j => {
            const outlet = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || '';
            return `<option value="${j.id}" ${j.id === prefilledJourId ? 'selected' : ''}>${j.name} (${outlet})</option>`;
          }).join('');
      }

      if (prefilledJourId) {
        const typeSelect = document.getElementById('task-type-select');
        if (typeSelect) typeSelect.value = 'contacto_jornalista';
        handleTaskTypeChange('contacto_jornalista');
      } else {
        handleTaskTypeChange(document.getElementById('task-type-select')?.value || 'contacto_jornalista');
      }

      // Data de entrega por defeito: hoje
      const dueInput = document.getElementById('task-duedate');
      if (dueInput && !dueInput.value) {
        dueInput.value = new Date().toISOString().split('T')[0];
      }

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

      // Preencher datalist de clientes
      const clientsDatalist = document.getElementById('project-clients-datalist');
      if (clientsDatalist) {
        const existingClients = [...new Set(localProjects.map(p => p.client || p.client_or_brand).filter(Boolean))];
        clientsDatalist.innerHTML = existingClients.map(c => `<option value="${c}"></option>`).join('');
      }

      // Preencher checkboxes de jornalistas-alvo
      const jourContainer = document.getElementById('project-target-journalists-checkboxes');
      if (jourContainer) {
        jourContainer.innerHTML = localJournalists.map(j => {
          const outlet = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || '';
          return `
            <label class="flex items-center justify-between p-1.5 hover:bg-white rounded-lg cursor-pointer text-xs transition-colors">
              <span class="flex items-center gap-2">
                <input type="checkbox" name="proj-target-jour" value="${j.id}" class="rounded text-[#6C1C37] focus:ring-[#6C1C37]">
                <span class="font-medium text-[#1A1A1A]">${j.name}</span>
                <span class="text-[11px] text-[#6B6B6B]">(${outlet})</span>
              </span>
              <span class="text-[10px] text-[#6B6B6B]">${(j.intervention_areas && j.intervention_areas[0]) || 'Geral'}</span>
            </label>
          `;
        }).join('');
      }

      const today = new Date();
      document.getElementById('project-start-date').value = today.toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      document.getElementById('project-deadline').value = nextMonth.toISOString().split('T')[0];

      document.getElementById('modal-new-project').classList.remove('hidden');
      document.getElementById('modal-new-project').classList.add('flex');
    }

    function closeProjectModal() {
      document.getElementById('modal-new-project').classList.add('hidden');
      document.getElementById('modal-new-project').classList.remove('flex');
    }


    // Navegação para Detalhe de Projeto
    function openProjectDetail(id) {
      let proj = localProjects.find(p => p.id === id);
      if (!proj) proj = localProjects[0];
      if (!proj) return;
      activeProjectId = proj.id;
      switchView('project_detail', true, { projectId: proj.id });
      renderProjectDetail();
    }

    function openProjectDetailByName(name) {
      const proj = localProjects.find(p => p.name === name);
      if (proj) openProjectDetail(proj.id);
      else switchView('projects');
    }


    // ========================================================
    // INTEGRAÇÃO DE TAREFAS & PROJETOS NAS GAVETAS (REGRAS 2 & 3)
    // ========================================================

    function renderJournalistTasksInDrawer(j) {
      const completedList = document.getElementById('jd-completed-tasks-list');
      const completedCountEl = document.getElementById('jd-completed-contacts-count');
      const pendingList = document.getElementById('jd-pending-tasks-list');
      const pendingCountEl = document.getElementById('jd-pending-contacts-count');

      if (!completedList || !pendingList) return;

      const jTasks = localTasks.filter(t => t.journalist_id === j.id || t.journalist_name === j.name);
      const completedTasks = jTasks.filter(t => t.status === 'concluida' || t.status === 'completed');
      const pendingTasks = jTasks.filter(t => t.status !== 'concluida' && t.status !== 'completed');

      if (completedCountEl) completedCountEl.innerText = `${completedTasks.length} concluídas`;
      if (pendingCountEl) pendingCountEl.innerText = `${pendingTasks.length} pendentes`;

      // 1. Tarefas Concluídas (Histórico)
      if (completedTasks.length === 0) {
        completedList.innerHTML = '<span class="text-xs text-[#6B6B6B] block py-1">Nenhum contacto concluído registado no sistema.</span>';
      } else {
        completedList.innerHTML = completedTasks.map(t => `
          <div class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-medium text-[#1A1A1A]">${t.title}</span>
              <span class="font-mono text-[11px] text-[#6B6B6B]">${t.due_date || (t.completed_at ? t.completed_at.split('T')[0] : '—')}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#6B6B6B]">
              <span>Projeto: <strong class="text-[#1A1A1A] font-normal">${t.project_name || 'Geral'}</strong></span>
              <span>Resp: ${t.responsible || 'Leonor Rodrigues'}</span>
            </div>
            ${t.notes ? `<p class="text-[11px] text-[#6B6B6B] italic pt-0.5 border-t border-[#E4DDD3]/60">${t.notes}</p>` : ''}
          </div>
        `).join('');
      }

      // 2. Tarefas Pendentes
      if (pendingTasks.length === 0) {
        pendingList.innerHTML = '<span class="text-xs text-[#6B6B6B] block py-1">Não existem contactos ou tarefas pendentes com este jornalista.</span>';
      } else {
        pendingList.innerHTML = pendingTasks.map(t => {
          const isTaskOverdue = t.due_date && isOverdue(t.due_date);
          return `
            <div class="p-3 bg-white rounded-xl border border-[#E4DDD3] space-y-1.5 text-xs shadow-xs">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium text-[#1A1A1A]">${t.title}</span>
                ${isTaskOverdue 
                  ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FBEAE8] text-[#A3281E] border border-[#F5C2BE]">Em atraso</span>`
                  : `<span class="font-mono text-[11px] text-[#6B6B6B]">${t.due_date || 'Hoje'}</span>`
                }
              </div>
              <div class="flex items-center justify-between text-[11px] text-[#6B6B6B]">
                <span>Projeto: ${t.project_name || 'Geral'}</span>
                <button onclick="toggleTaskStatus('${t.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline flex items-center gap-1">
                  <span>Concluir contacto &check;</span>
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    function renderOutletProjectsInDrawer(ocs) {
      const container = document.getElementById('od-associated-projects-list');
      const countEl = document.getElementById('od-projects-count');
      if (!container) return;

      // Obter ids de jornalistas deste órgão
      const outletJourIds = localJournalists.filter(j => 
        (j.outlet_ids && j.outlet_ids.includes(ocs.id)) || 
        j.outlet_name === ocs.name || 
        (j.outlet_names && j.outlet_names.includes(ocs.name))
      ).map(j => j.id);

      const associatedProjs = localProjects.filter(p => {
        if (p.target_outlets && p.target_outlets.includes(ocs.name)) return true;
        if (p.target_journalist_ids && p.target_journalist_ids.some(jid => outletJourIds.includes(jid))) return true;
        return false;
      });

      if (countEl) countEl.innerText = `${associatedProjs.length} projetos`;

      if (associatedProjs.length === 0) {
        container.innerHTML = '<span class="text-xs text-[#6B6B6B] block py-1">Nenhum projeto ativo com cobertura prevista neste meio.</span>';
      } else {
        container.innerHTML = associatedProjs.map(p => `
          <div onclick="closeOutletDetailDrawer(); openProjectDetail('${p.id}');"
            class="p-3 bg-white rounded-xl border border-[#E4DDD3] hover:border-[#6C1C37]/50 hover:bg-[#FBF9F6] transition-all cursor-pointer flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="font-semibold text-xs text-[#1A1A1A] block">${p.name}</span>
              <span class="text-[11px] text-[#6B6B6B]">${p.client || p.client_or_brand} · Prazo: ${p.deadline || '—'}</span>
            </div>
            <div class="flex items-center gap-2">
              ${getProjectStatusBadge(p.status)}
              <span class="text-xs text-[#6C1C37]">&rarr;</span>
            </div>
          </div>
        `).join('');
      }
    }

  