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
      const dateEl = document.getElementById('dash-greeting-date');
      if (!greetingEl) return;

      const hour = new Date().getHours();
      let salutation = "Bom dia";
      if (hour >= 12 && hour < 20) salutation = "Boa tarde";
      else if (hour >= 20 || hour < 6) salutation = "Boa noite";

      let userName = "Leonor";
      if (currentUser) {
        userName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "Leonor";
        userName = userName.split(' ')[0];
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);
      }

      greetingEl.innerText = `${salutation}, ${userName}`;

      if (dateEl) {
        const today = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const dateFormatted = today.toLocaleDateString('pt-PT', options);
        const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
        dateEl.innerText = `${capitalizedDate} · dados de exemplo`;
      }
    }

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
          if (icon) icon.className = "w-4 h-4 text-[#6B6B6B]";
        }
      });

      // Destacar item de navegação ativo
      let activeNavId = 'nav-' + viewName;
      if (viewName === 'project_detail') activeNavId = 'nav-projects';
      if (viewName === 'response_analytics') activeNavId = 'nav-analytics';

      const activeEl = document.getElementById(activeNavId);
      if (activeEl) {
        activeEl.className = "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium bg-[#E6C5CA]/45 text-[#6C1C37] transition-colors cursor-pointer";
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
    function renderDashboardTasks() {
      const container = document.getElementById('dashboard-tasks-table-body');
      if (!container) return;

      let tasksToShow = localTasks.filter(t => t.status !== 'completed');
      if (tasksToShow.length === 0 && localTasks.length > 0) {
        tasksToShow = localTasks.slice(0, 5);
      }

      if (tasksToShow.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-xs text-[#6B6B6B]">
            <p class="font-medium text-[#1A1A1A] mb-1">Tudo em dia. Não existem tarefas pendentes.</p>
            <p>Clica em "+ Nova Tarefa" para adicionares novas entregas.</p>
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

      const acts = task.activity_log || ['Registo criado no ReputationOS'];
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
    function renderDashboardContacts() {
      const container = document.getElementById('dashboard-contacts-container');
      if (!container) return;

      const todayIso = new Date().toISOString().split('T')[0];
      const contactsToShow = localDailyContacts.filter(c => (c.contact_date || '').startsWith(todayIso)).slice(0, 5);

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
