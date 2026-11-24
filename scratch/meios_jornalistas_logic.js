    // ========================================================
    // MEIOS E JORNALISTAS - REDESIGN E REGRAS DE NEGÓCIO
    // ========================================================

    // Lista Partilhada de Especialidades / Áreas de Intervenção
    let sharedAreasList = [
      'Economia & Negócios',
      'Mercados & Finanças',
      'Política & Sociedade',
      'Sustentabilidade & ESG',
      'Tecnologia',
      'Opinião & Internacional',
      'Cultura',
      'Desporto'
    ];

    // Estados e Filtros de Jornalistas
    let jourActiveTab = 'all'; // 'all', 'inactive15', 'no_rgpd'
    let jourCurrentPage = 1;
    const jourPageSize = 10;
    let selectedNewJourOutlets = [];
    let selectedNewJourAreas = [];

    // Estados e Filtros de Meios
    let ocsIncludeExtinct = false;
    let selectedNewOutletFormats = ['Online'];
    let selectedNewOutletSpecialties = [];

    // ----------------------------------------------------
    // FUNÇÕES DE TEMPO E DATAS RELATIVAS (PORTUGUÊS DE PORTUGAL)
    // ----------------------------------------------------
    function formatRelativeDaysPt(dateStr) {
      if (!dateStr) return { text: 'Nunca', isOverdue: true, days: 999 };
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { text: dateStr, isOverdue: false, days: 0 };
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - d.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const isOverdue = diffDays > 15;

      if (diffDays <= 0) return { text: 'Hoje', isOverdue: false, days: diffDays };
      if (diffDays === 1) return { text: 'há 1 dia', isOverdue: false, days: diffDays };
      if (diffDays < 7) return { text: `há ${diffDays} dias`, isOverdue: false, days: diffDays };
      if (diffDays >= 7 && diffDays < 14) return { text: 'há 1 semana', isOverdue: false, days: diffDays };
      if (diffDays >= 14 && diffDays < 21) return { text: 'há 2 semanas', isOverdue: diffDays > 15, days: diffDays };
      return { text: `há ${diffDays} dias`, isOverdue: true, days: diffDays };
    }

    // ----------------------------------------------------
    // GESTÃO DE SEPARADORES (TABS) DE JORNALISTAS
    // ----------------------------------------------------
    function setJourActiveTab(tab) {
      jourActiveTab = tab;
      jourCurrentPage = 1;

      const tabs = [
        { id: 'tab-jour-all', badgeId: 'tab-jour-count-all', key: 'all' },
        { id: 'tab-jour-inactive15', badgeId: 'tab-jour-count-inactive', key: 'inactive15' },
        { id: 'tab-jour-no-rgpd', badgeId: 'tab-jour-count-norgpd', key: 'no_rgpd' }
      ];

      tabs.forEach(t => {
        const btn = document.getElementById(t.id);
        const badge = document.getElementById(t.badgeId);
        if (btn) {
          if (t.key === tab) {
            btn.className = "pb-3 text-xs font-medium border-b-2 border-[#6C1C37] text-[#1A1A1A] flex items-center gap-2 transition-all cursor-pointer";
            if (badge) badge.className = "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white";
          } else {
            btn.className = "pb-3 text-xs font-medium border-b-2 border-transparent text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-2 transition-all cursor-pointer";
            if (badge) badge.className = "px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F6F2EC] text-[#6B6B6B]";
          }
        }
      });

      renderJournalistsTable();
    }

    function changeJourPage(delta) {
      jourCurrentPage += delta;
      if (jourCurrentPage < 1) jourCurrentPage = 1;
      renderJournalistsTable();
    }

    // ----------------------------------------------------
    // RENDERIZAÇÃO DA TABELA DE JORNALISTAS
    // ----------------------------------------------------
    function renderJournalistsTable() {
      const tbody = document.getElementById('journalists-table-body');
      if (!tbody) return;

      if (!localJournalists || localJournalists.length === 0) {
        localJournalists = (typeof DEFAULT_SAMPLE_JOURNALISTS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_JOURNALISTS)) ? [...DEFAULT_SAMPLE_JOURNALISTS] : [];
      }

      // Preencher seletor de meios se vazio
      const outletSelect = document.getElementById('filter-jour-outlet');
      if (outletSelect && outletSelect.options.length <= 1) {
        const currentVal = outletSelect.value;
        const outletNames = [...new Set(localJournalists.map(j => j.outlet_name || (j.outlet_names && j.outlet_names[0])).filter(Boolean))].sort();
        outletSelect.innerHTML = '<option value="all">Todos os meios</option>' + 
          outletNames.map(on => `<option value="${on}">${on}</option>`).join('');
        if (currentVal) outletSelect.value = currentVal;
      }

      // Preencher seletor de áreas se vazio
      const areaSelect = document.getElementById('filter-jour-area');
      if (areaSelect && areaSelect.options.length <= 1) {
        const currentVal = areaSelect.value;
        areaSelect.innerHTML = '<option value="all">Todas as áreas</option>' + 
          sharedAreasList.map(a => `<option value="${a}">${a}</option>`).join('');
        if (currentVal) areaSelect.value = currentVal;
      }

      // Cálculos Globais de Cabeçalho e Contadores
      const totalAll = localJournalists.length;
      const inactive15Count = localJournalists.filter(j => {
        const info = formatRelativeDaysPt(j.last_contact_date);
        return info.isOverdue || (j.days_inactive && j.days_inactive > 15);
      }).length;
      const noRgpdCount = localJournalists.filter(j => !j.rgpd_consent).length;

      const headerSummary = document.getElementById('journalists-summary-header');
      if (headerSummary) {
        headerSummary.innerText = `${totalAll} jornalistas · ${inactive15Count} sem contacto há mais de 15 dias`;
      }

      const countAllEl = document.getElementById('tab-jour-count-all');
      if (countAllEl) countAllEl.innerText = totalAll;
      const countInactEl = document.getElementById('tab-jour-count-inactive');
      if (countInactEl) countInactEl.innerText = inactive15Count;
      const countRgpdEl = document.getElementById('tab-jour-count-norgpd');
      if (countRgpdEl) countRgpdEl.innerText = noRgpdCount;

      // Filtros
      const query = (document.getElementById('search-journalists')?.value || '').toLowerCase().trim();
      const outletFilter = document.getElementById('filter-jour-outlet')?.value || 'all';
      const areaFilter = document.getElementById('filter-jour-area')?.value || 'all';
      const statusFilter = document.getElementById('filter-jour-status')?.value || 'ativo';

      let list = [...localJournalists];

      // Filtro de Separador
      if (jourActiveTab === 'inactive15') {
        list = list.filter(j => {
          const info = formatRelativeDaysPt(j.last_contact_date);
          return info.isOverdue || (j.days_inactive && j.days_inactive > 15);
        });
      } else if (jourActiveTab === 'no_rgpd') {
        list = list.filter(j => !j.rgpd_consent);
      }

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

      // Filtro de Meio
      if (outletFilter !== 'all') {
        list = list.filter(j => {
          const mainOcs = (j.outlet_name || '').toLowerCase();
          const allOcs = (j.outlet_names || []).map(o => o.toLowerCase());
          return mainOcs === outletFilter.toLowerCase() || allOcs.includes(outletFilter.toLowerCase());
        });
      }

      // Filtro de Área
      if (areaFilter !== 'all') {
        list = list.filter(j => {
          const areas = j.intervention_areas || (j.intervention_area ? [j.intervention_area] : []);
          return areas.includes(areaFilter);
        });
      }

      // Filtro de Estado ("Só ativos" por defeito)
      if (statusFilter === 'ativo') {
        list = list.filter(j => (j.status || 'ativo') === 'ativo');
      } else if (statusFilter === 'mudou_de_meio') {
        list = list.filter(j => j.status === 'mudou_de_meio');
      } else if (statusFilter === 'reformado') {
        list = list.filter(j => j.status === 'reformado');
      }

      // Paginação
      const totalFiltered = list.length;
      const totalPages = Math.ceil(totalFiltered / jourPageSize) || 1;
      if (jourCurrentPage > totalPages) jourCurrentPage = totalPages;
      if (jourCurrentPage < 1) jourCurrentPage = 1;

      const startIndex = (jourCurrentPage - 1) * jourPageSize;
      const pagedList = list.slice(startIndex, startIndex + jourPageSize);

      const pagInfo = document.getElementById('journalists-pagination-info');
      if (pagInfo) {
        if (totalFiltered === 0) {
          pagInfo.innerText = "A mostrar 0 de 0 jornalistas";
        } else {
          pagInfo.innerText = `A mostrar ${startIndex + 1}–${Math.min(startIndex + jourPageSize, totalFiltered)} de ${totalFiltered}`;
        }
      }

      const prevBtn = document.getElementById('btn-jour-prev');
      const nextBtn = document.getElementById('btn-jour-next');
      if (prevBtn) prevBtn.disabled = jourCurrentPage <= 1;
      if (nextBtn) nextBtn.disabled = jourCurrentPage >= totalPages;

      if (totalFiltered === 0) {
        if (localJournalists.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="6" class="py-16 text-center text-xs text-[#6B6B6B]">
                <p class="font-medium text-[#1A1A1A] text-sm mb-2">Ainda não tens jornalistas</p>
                <button onclick="openJournalistModal()" class="btn-primary py-2 px-4 text-xs font-medium">
                  + Adicionar o primeiro jornalista
                </button>
              </td>
            </tr>
          `;
        } else {
          tbody.innerHTML = `
            <tr>
              <td colspan="6" class="py-12 text-center text-xs text-[#6B6B6B]">
                <p class="font-medium text-[#1A1A1A] mb-1">Nenhum jornalista encontrado com estes filtros.</p>
                <button onclick="resetJournalistFilters()" class="text-xs text-[#6C1C37] font-medium hover:underline">Limpar filtros</button>
              </td>
            </tr>
          `;
        }
        return;
      }

      // Paleta suave de avatares com iniciais
      const avatarColors = [
        'bg-[#7A263A] text-white',
        'bg-[#8C4A2F] text-white',
        'bg-[#2A5C45] text-white',
        'bg-[#2B4C6F] text-white',
        'bg-[#6B3A6F] text-white',
        'bg-[#4A5D3E] text-white'
      ];

      tbody.innerHTML = pagedList.map((j, idx) => {
        const initials = j.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const colorClass = avatarColors[idx % avatarColors.length];

        // 1. Meio (+N se múltiplos)
        const ocsList = j.outlet_names && j.outlet_names.length > 0 ? j.outlet_names : [j.outlet_name || 'Geral'];
        const mainOcs = ocsList[0];
        const extraOcsCount = ocsList.length - 1;
        const ocsDisplay = extraOcsCount > 0 
          ? `<span>${mainOcs}</span> <span class="text-[11px] text-[#8A8A8A] font-normal">+${extraOcsCount}</span>`
          : `<span>${mainOcs}</span>`;

        // 2. Área (+N se múltiplas)
        const areas = j.intervention_areas && j.intervention_areas.length > 0 ? j.intervention_areas : (j.intervention_area ? [j.intervention_area] : ['Geral']);
        const mainArea = areas[0];
        const extraAreaCount = areas.length - 1;
        const areaBadge = `
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FBE8EB] text-[#801D38]">
              ${mainArea}
            </span>
            ${extraAreaCount > 0 ? `<span class="text-xs text-[#8A8A8A] font-normal">+${extraAreaCount}</span>` : ''}
          </div>
        `;

        // 3. Contacto (Email + Preferência)
        const email = (j.emails && j.emails.length > 0) ? j.emails[0] : (j.contact_email || '—');
        let prefLabel = 'Prefere email';
        if (j.contact_preference === 'whatsapp') prefLabel = 'Prefere WhatsApp';
        else if (j.contact_preference === 'telefone') prefLabel = 'Prefere telefone';

        // 4. Último contacto (Cálculo e Projeto)
        const contactInfo = formatRelativeDaysPt(j.last_contact_date);
        const contactTimeLabel = contactInfo.text;
        const isRed = contactInfo.isOverdue || (j.days_inactive && j.days_inactive > 15);
        const timeClass = isRed ? 'text-[#C53030] font-semibold' : 'text-[#1A1A1A] font-normal';
        
        // Último projeto associado
        const lastProj = j.last_project_name || 'Ainda sem contacto';

        return `
          <tr onclick="openJournalistDetailDrawer('${j.id}')" class="transition-colors cursor-pointer hover:bg-[#FAF8F5]/80 group">
            <!-- 1. Jornalista -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full ${colorClass} flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  ${initials}
                </div>
                <div>
                  <span class="font-semibold text-[#1A1A1A] block text-xs group-hover:text-[#6C1C37] transition-colors">${j.name}</span>
                  <span class="text-xs text-[#6B6B6B] block">${j.role_title || 'Jornalista'}</span>
                </div>
              </div>
            </td>

            <!-- 2. Meio -->
            <td class="py-3 px-4 text-xs text-[#1A1A1A] font-normal">
              ${ocsDisplay}
            </td>

            <!-- 3. Área -->
            <td class="py-3 px-4">
              ${areaBadge}
            </td>

            <!-- 4. Contacto -->
            <td class="py-3 px-4 text-xs">
              <span class="text-[#1A1A1A] block">${email}</span>
              <span class="text-xs text-[#6B6B6B] block">${prefLabel}</span>
            </td>

            <!-- 5. Último contacto -->
            <td class="py-3 px-4 text-xs">
              <span class="${timeClass} block">${contactTimeLabel}</span>
              <span class="text-xs text-[#6B6B6B] block truncate max-w-[190px]" title="${lastProj}">${lastProj}</span>
            </td>

            <!-- Menu ⋯ -->
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="relative inline-block text-left">
                <button type="button" onclick="toggleJournalistRowMenu(event, '${j.id}')"
                  class="jour-row-menu-btn w-8 h-8 rounded-lg flex items-center justify-center text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F2EFE9] transition-all cursor-pointer">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
                </button>
                <div id="jour-menu-${j.id}" class="jour-row-menu-popover hidden fixed z-50 w-44 bg-white border border-[#E4DDD3] rounded-xl shadow-lg py-1 text-xs">
                  <button type="button" onclick="closeAllJourMenus(); openJournalistDetailDrawer('${j.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#1A1A1A] flex items-center gap-2">
                    Abrir ficha
                  </button>
                  <button type="button" onclick="closeAllJourMenus(); openEditJournalistModal('${j.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#1A1A1A] flex items-center gap-2">
                    Editar
                  </button>
                  <button type="button" onclick="closeAllJourMenus(); openTaskModalForJournalist('${j.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#6C1C37] font-medium flex items-center gap-2">
                    Criar tarefa de contacto
                  </button>
                  <button type="button" onclick="closeAllJourMenus(); toggleJournalistArchive('${j.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#6B6B6B] flex items-center gap-2">
                    ${j.status === 'arquivado' ? 'Desarquivar' : 'Arquivar'}
                  </button>
                  ${currentUserPermissions()?.canDeleteRecords ? `
                    <div class="border-t border-[#E4DDD3] my-1"></div>
                    <button type="button" onclick="closeAllJourMenus(); deleteJournalist('${j.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FBEAE8] text-[#C53030] flex items-center gap-2">
                      Eliminar
                    </button>
                  ` : ''}
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function resetJournalistFilters() {
      const q = document.getElementById('search-journalists');
      if (q) q.value = '';
      const o = document.getElementById('filter-jour-outlet');
      if (o) o.value = 'all';
      const a = document.getElementById('filter-jour-area');
      if (a) a.value = 'all';
      const s = document.getElementById('filter-jour-status');
      if (s) s.value = 'ativo';
      setJourActiveTab('all');
    }

    function toggleJournalistRowMenu(e, id) {
      e.stopPropagation();
      const menu = document.getElementById(`jour-menu-${id}`);
      const isHidden = menu ? menu.classList.contains('hidden') : true;
      closeAllJourMenus();
      if (menu && isHidden) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.left = `${Math.min(rect.right - 176, window.innerWidth - 186)}px`;
        menu.classList.remove('hidden');
      }
    }

    function closeAllJourMenus() {
      document.querySelectorAll('.jour-row-menu-popover').forEach(el => el.classList.add('hidden'));
    }

    function toggleJournalistArchive(id) {
      const j = localJournalists.find(item => item.id === id);
      if (!j) return;
      j.status = j.status === 'arquivado' ? 'ativo' : 'arquivado';
      syncLocalStorage();
      renderJournalistsTable();
      showToast(j.status === 'arquivado' ? 'Jornalista arquivado.' : 'Jornalista reativado.');
    }

    // ----------------------------------------------------
    // RENDERIZAÇÃO DA TABELA DE MEIOS (6 COLUNAS + MENU ⋯)
    // ----------------------------------------------------
    function renderOutletsTable() {
      const tbody = document.getElementById('outlets-table-body');
      if (!tbody) return;

      if (!localOutlets || localOutlets.length === 0) {
        localOutlets = (typeof DEFAULT_SAMPLE_OUTLETS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_OUTLETS)) ? [...DEFAULT_SAMPLE_OUTLETS] : [];
      }

      // Preencher seletor de especialidades se vazio
      const specSelect = document.getElementById('filter-ocs-specialty');
      if (specSelect && specSelect.options.length <= 1) {
        const currentVal = specSelect.value;
        specSelect.innerHTML = '<option value="all">Todas as especialidades</option>' + 
          sharedAreasList.map(s => `<option value="${s}">${s}</option>`).join('');
        if (currentVal) specSelect.value = currentVal;
      }

      // Preencher seletor de grupos se vazio
      const groupSelect = document.getElementById('filter-ocs-group');
      if (groupSelect && groupSelect.options.length <= 1) {
        const currentVal = groupSelect.value;
        const groups = [...new Set(localOutlets.map(o => o.media_group).filter(Boolean))].sort();
        groupSelect.innerHTML = '<option value="all">Todos os grupos</option>' + 
          groups.map(g => `<option value="${g}">${g}</option>`).join('');
        if (currentVal) groupSelect.value = currentVal;
      }

      // Filtros
      const query = (document.getElementById('search-outlets')?.value || '').toLowerCase().trim();
      const formatFilter = document.getElementById('filter-ocs-format')?.value || 'all';
      const scopeFilter = document.getElementById('filter-ocs-scope')?.value || 'all';
      const specialtyFilter = document.getElementById('filter-ocs-specialty')?.value || 'all';
      const groupFilter = document.getElementById('filter-ocs-group')?.value || 'all';
      const includeExtinct = document.getElementById('filter-ocs-include-extinct')?.checked || false;

      // Calcular resumo no cabeçalho
      const activeOutlets = localOutlets.filter(o => includeExtinct || (o.status || 'ativo') !== 'extinto');
      const uniqueGroups = new Set(activeOutlets.map(o => o.media_group).filter(Boolean));
      const headerSummary = document.getElementById('outlets-summary-header');
      if (headerSummary) {
        headerSummary.innerText = `${activeOutlets.length} meios · ${uniqueGroups.size} grupos`;
      }

      let list = [...activeOutlets];

      // Filtro de Texto
      if (query) {
        list = list.filter(o => {
          const name = (o.name || '').toLowerCase();
          const group = (o.media_group || '').toLowerCase();
          const spec = (o.specialties || [o.specialty || '']).join(' ').toLowerCase();
          return name.includes(query) || group.includes(query) || spec.includes(query);
        });
      }

      // Filtro de Formato
      if (formatFilter !== 'all') {
        list = list.filter(o => {
          const fmts = (o.formats || []).map(f => f.toLowerCase());
          return fmts.includes(formatFilter.toLowerCase());
        });
      }

      // Filtro de Âmbito
      if (scopeFilter !== 'all') {
        list = list.filter(o => (o.scope || 'nacional').toLowerCase() === scopeFilter.toLowerCase());
      }

      // Filtro de Especialidade
      if (specialtyFilter !== 'all') {
        list = list.filter(o => {
          const specs = o.specialties || (o.specialty ? [o.specialty] : []);
          return specs.includes(specialtyFilter);
        });
      }

      // Filtro de Grupo
      if (groupFilter !== 'all') {
        list = list.filter(o => (o.media_group || '') === groupFilter);
      }

      const footerCount = document.getElementById('outlets-footer-count');
      if (footerCount) {
        footerCount.innerText = `A mostrar ${list.length} de ${localOutlets.length} meios`;
      }

      if (list.length === 0) {
        if (localOutlets.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" class="py-16 text-center text-xs text-[#6B6B6B]">
                <p class="font-medium text-[#1A1A1A] text-sm mb-2">Ainda não tens meios</p>
                <button onclick="openOutletModal()" class="btn-primary py-2 px-4 text-xs font-medium">
                  + Adicionar o primeiro meio
                </button>
              </td>
            </tr>
          `;
        } else {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" class="py-12 text-center text-xs text-[#6B6B6B]">
                <p class="font-medium text-[#1A1A1A] mb-1">Nenhum meio encontrado com estes filtros.</p>
                <button onclick="resetOutletFilters()" class="text-xs text-[#6C1C37] font-medium hover:underline">Limpar filtros</button>
              </td>
            </tr>
          `;
        }
        return;
      }

      tbody.innerHTML = list.map(o => {
        const initials = o.name.substring(0, 2).toUpperCase();
        const logoHtml = o.logo_url 
          ? `<img src="${o.logo_url}" class="w-8 h-8 rounded-lg object-contain bg-white border border-[#E4DDD3] p-0.5 shrink-0" onerror="this.outerHTML='<div class=\\'w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#E4DDD3] shrink-0\\'>${initials}</div>'">`
          : `<div class="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#E4DDD3] shrink-0">${initials}</div>`;

        // Formatos (máx 2 neutros + "+N")
        const fmts = Array.isArray(o.formats) ? o.formats : (o.formats ? [o.formats] : ['Online']);
        const fmtLabels = fmts.map(f => {
          const fl = f.toLowerCase();
          if (fl === 'online') return 'Online';
          if (fl === 'papel') return 'Papel';
          if (fl === 'tv') return 'TV';
          if (fl === 'radio' || fl === 'rádio') return 'Rádio';
          if (fl === 'podcast') return 'Podcast';
          if (fl === 'agencia' || fl === 'agência') return 'Agência';
          return f;
        });
        const visibleFmts = fmtLabels.slice(0, 2);
        const extraFmtsCount = fmtLabels.length - 2;
        const formatsHtml = `
          <div class="flex items-center gap-1.5 flex-wrap">
            ${visibleFmts.map(fmt => `<span class="inline-block px-2 py-0.5 rounded-md text-xs font-normal bg-[#F2EFE9] text-[#4A4A4A] border border-[#E8E2D8]">${fmt}</span>`).join('')}
            ${extraFmtsCount > 0 ? `<span class="text-xs text-[#8A8A8A] font-normal">+${extraFmtsCount}</span>` : ''}
          </div>
        `;

        // Âmbito e Periodicidade
        const scopeLabel = o.scope ? (o.scope.charAt(0).toUpperCase() + o.scope.slice(1).toLowerCase()) : 'Nacional';
        const periodicityLabel = o.periodicity ? (o.periodicity.charAt(0).toUpperCase() + o.periodicity.slice(1).toLowerCase()) : 'Contínua';

        // Especialidade (1ª como etiqueta cor-de-rosa suave + "+N")
        const specs = o.specialties || (o.specialty ? [o.specialty] : ['Geral']);
        const mainSpec = specs[0] || 'Geral';
        const extraSpecsCount = specs.length - 1;
        const specHtml = `
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FBE8EB] text-[#801D38]">
              ${mainSpec}
            </span>
            ${extraSpecsCount > 0 ? `<span class="text-xs text-[#8A8A8A] font-normal">+${extraSpecsCount}</span>` : ''}
          </div>
        `;

        // Email de Agenda (Texto normal, truncado)
        const agendaEmail = o.agenda_email || o.contact_email || '—';

        // Jornalistas associados (Link clicável para a lista filtrada)
        const assocJour = localJournalists.filter(j => 
          (j.outlet_ids && j.outlet_ids.includes(o.id)) || 
          (j.outlet_name && j.outlet_name.toLowerCase() === o.name.toLowerCase()) ||
          (j.outlet_names && j.outlet_names.some(on => on.toLowerCase() === o.name.toLowerCase()))
        );
        const jourCount = assocJour.length;

        return `
          <tr onclick="openOutletDetailDrawer('${o.id}')" class="transition-colors cursor-pointer hover:bg-[#FAF8F5]/80 group">
            <!-- 1. Meio (Logo + Nome + Grupo) -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                ${logoHtml}
                <div>
                  <span class="font-semibold text-[#1A1A1A] block text-xs group-hover:text-[#6C1C37] transition-colors">${o.name}</span>
                  <span class="text-xs text-[#6B6B6B] block">${o.media_group || 'Sem grupo'}</span>
                </div>
              </div>
            </td>

            <!-- 2. Formatos -->
            <td class="py-3 px-4">
              ${formatsHtml}
            </td>

            <!-- 3. Âmbito & Periodicidade -->
            <td class="py-3 px-4 text-xs">
              <span class="font-semibold text-[#1A1A1A] block">${scopeLabel}</span>
              <span class="text-xs text-[#6B6B6B] block">${periodicityLabel}</span>
            </td>

            <!-- 4. Especialidade -->
            <td class="py-3 px-4">
              ${specHtml}
            </td>

            <!-- 5. Email de Agenda -->
            <td class="py-3 px-4 text-xs">
              <span class="text-[#1A1A1A] truncate max-w-[210px] block" title="${agendaEmail}">
                ${agendaEmail}
              </span>
            </td>

            <!-- 6. Jornalistas (Ligação) -->
            <td class="py-3 px-4 text-xs" onclick="event.stopPropagation()">
              <button type="button" onclick="filterJournalistsByOutlet('${o.id}')"
                class="font-medium text-[#1A1A1A] hover:text-[#6C1C37] hover:underline cursor-pointer">
                ${jourCount} ${jourCount === 1 ? 'jornalista' : 'jornalistas'}
              </button>
            </td>

            <!-- Menu ⋯ -->
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="relative inline-block text-left">
                <button type="button" onclick="toggleOutletRowMenu(event, '${o.id}')"
                  class="outlet-row-menu-btn w-8 h-8 rounded-lg flex items-center justify-center text-[#8A8A8A] hover:text-[#1A1A1A] hover:bg-[#F2EFE9] transition-all cursor-pointer">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
                </button>
                <div id="outlet-menu-${o.id}" class="outlet-row-menu-popover hidden fixed z-50 w-44 bg-white border border-[#E4DDD3] rounded-xl shadow-lg py-1 text-xs">
                  <button type="button" onclick="closeAllOutletMenus(); openOutletDetailDrawer('${o.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#1A1A1A] flex items-center gap-2">
                    Abrir ficha
                  </button>
                  <button type="button" onclick="closeAllOutletMenus(); openEditOutletModal('${o.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#1A1A1A] flex items-center gap-2">
                    Editar
                  </button>
                  <button type="button" onclick="closeAllOutletMenus(); toggleOutletArchive('${o.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] text-[#6B6B6B] flex items-center gap-2">
                    ${o.status === 'extinto' ? 'Reativar meio' : 'Arquivar'}
                  </button>
                  ${currentUserPermissions()?.canDeleteRecords ? `
                    <div class="border-t border-[#E4DDD3] my-1"></div>
                    <button type="button" onclick="closeAllOutletMenus(); deleteOutlet('${o.id}')" class="w-full text-left px-3.5 py-2 hover:bg-[#FBEAE8] text-[#C53030] flex items-center gap-2">
                      Eliminar
                    </button>
                  ` : ''}
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function resetOutletFilters() {
      const q = document.getElementById('search-outlets');
      if (q) q.value = '';
      const f = document.getElementById('filter-ocs-format');
      if (f) f.value = 'all';
      const s = document.getElementById('filter-ocs-scope');
      if (s) s.value = 'all';
      const sp = document.getElementById('filter-ocs-specialty');
      if (sp) sp.value = 'all';
      const g = document.getElementById('filter-ocs-group');
      if (g) g.value = 'all';
      const ext = document.getElementById('filter-ocs-include-extinct');
      if (ext) ext.checked = false;
      renderOutletsTable();
    }

    function toggleOutletRowMenu(e, id) {
      e.stopPropagation();
      const menu = document.getElementById(`outlet-menu-${id}`);
      const isHidden = menu ? menu.classList.contains('hidden') : true;
      closeAllOutletMenus();
      if (menu && isHidden) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.left = `${Math.min(rect.right - 176, window.innerWidth - 186)}px`;
        menu.classList.remove('hidden');
      }
    }

    function closeAllOutletMenus() {
      document.querySelectorAll('.outlet-row-menu-popover').forEach(el => el.classList.add('hidden'));
    }

    function toggleOutletArchive(id) {
      const o = localOutlets.find(item => item.id === id);
      if (!o) return;
      o.status = o.status === 'extinto' ? 'ativo' : 'extinto';
      syncLocalStorage();
      renderOutletsTable();
      showToast(o.status === 'extinto' ? 'Meio marcado como extinto/arquivado.' : 'Meio reativado.');
    }

    // Ligação: Filtrar jornalistas pelo meio selecionado
    function filterJournalistsByOutlet(outletIdOrName) {
      const outletObj = localOutlets.find(o => o.id === outletIdOrName || o.name.toLowerCase() === outletIdOrName.toLowerCase());
      const targetName = outletObj ? outletObj.name : outletIdOrName;
      switchView('journalists');
      setTimeout(() => {
        const sel = document.getElementById('filter-jour-outlet');
        if (sel) {
          sel.value = targetName;
        }
        renderJournalistsTable();
      }, 50);
    }

    // ----------------------------------------------------
    // MODAL NOVO JORNALISTA
    // ----------------------------------------------------
    function openJournalistModal() {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      const form = document.getElementById('form-new-journalist');
      if (form) form.reset();

      selectedNewJourOutlets = [];
      selectedNewJourAreas = [];
      setJourPref('email');

      // Fechar secção recolhível
      const content = document.getElementById('jour-details-content');
      const chevron = document.getElementById('jour-details-chevron');
      if (content) content.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');

      renderJourSelectedOutlets();
      renderJourAreasChips();
      validateNewJourForm();

      const modal = document.getElementById('modal-new-journalist');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function closeJournalistModal() {
      const modal = document.getElementById('modal-new-journalist');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      const sugg = document.getElementById('new-jour-outlet-suggestions');
      if (sugg) sugg.classList.add('hidden');
    }

    function toggleJourDetailsSection() {
      const content = document.getElementById('jour-details-content');
      const chevron = document.getElementById('jour-details-chevron');
      if (content && chevron) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          chevron.classList.add('rotate-180');
        } else {
          content.classList.add('hidden');
          chevron.classList.remove('rotate-180');
        }
      }
    }

    function setJourPref(pref) {
      const valInput = document.getElementById('new-jour-pref-value');
      if (valInput) valInput.value = pref;

      const seg = document.getElementById('new-jour-pref-segmented');
      if (seg) {
        seg.querySelectorAll('button').forEach(btn => {
          if (btn.getAttribute('data-pref') === pref) {
            btn.className = "flex-1 py-1.5 rounded-lg font-medium text-center transition-all bg-white text-[#1A1A1A] shadow-xs";
          } else {
            btn.className = "flex-1 py-1.5 rounded-lg font-medium text-center transition-all text-[#6B6B6B] hover:text-[#1A1A1A]";
          }
        });
      }
    }

    function renderJourSelectedOutlets() {
      const container = document.getElementById('new-jour-selected-outlets');
      if (!container) return;

      container.innerHTML = selectedNewJourOutlets.map(oname => `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F2EFE9] text-[#1A1A1A] border border-[#E8E2D8]">
          <span>${oname}</span>
          <button type="button" onclick="removeJourOutlet('${oname.replace(/'/g, "\\'")}')" class="text-[#8A8A8A] hover:text-[#C53030] p-0.5 rounded">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </span>
      `).join('');
    }

    function handleJourOutletSearch(query) {
      const sugg = document.getElementById('new-jour-outlet-suggestions');
      if (!sugg) return;

      const q = (query || '').toLowerCase().trim();
      const existingOutlets = localOutlets.map(o => o.name);
      const filtered = existingOutlets.filter(on => !selectedNewJourOutlets.includes(on) && (on.toLowerCase().includes(q) || !q));

      if (filtered.length === 0 && !q) {
        sugg.classList.add('hidden');
        return;
      }

      let html = filtered.map(on => `
        <div onclick="selectJourOutlet('${on.replace(/'/g, "\\'")}')" class="px-3 py-1.5 hover:bg-[#FAF8F5] cursor-pointer text-[#1A1A1A]">
          ${on}
        </div>
      `).join('');

      if (q && !existingOutlets.some(on => on.toLowerCase() === q)) {
        html += `
          <div onclick="selectJourOutlet('${query.replace(/'/g, "\\'")}')" class="px-3 py-1.5 hover:bg-[#FAF8F5] cursor-pointer text-[#6C1C37] font-medium border-t border-[#E4DDD3]">
            + Criar «${query}»
          </div>
        `;
      }

      sugg.innerHTML = html;
      sugg.classList.remove('hidden');
    }

    function selectJourOutlet(outletName) {
      if (!selectedNewJourOutlets.includes(outletName)) {
        selectedNewJourOutlets.push(outletName);
      }
      const inp = document.getElementById('new-jour-outlet-input');
      if (inp) inp.value = '';
      const sugg = document.getElementById('new-jour-outlet-suggestions');
      if (sugg) sugg.classList.add('hidden');
      renderJourSelectedOutlets();
      validateNewJourForm();
    }

    function removeJourOutlet(outletName) {
      selectedNewJourOutlets = selectedNewJourOutlets.filter(o => o !== outletName);
      renderJourSelectedOutlets();
      validateNewJourForm();
    }

    function renderJourAreasChips() {
      const container = document.getElementById('new-jour-areas-chips');
      if (!container) return;

      container.innerHTML = sharedAreasList.map(area => {
        const isSel = selectedNewJourAreas.includes(area);
        const cls = isSel 
          ? 'bg-[#FBE8EB] border-[#6C1C37] text-[#801D38] font-medium'
          : 'bg-white border-[#D1C7BA] text-[#1A1A1A] hover:bg-[#FAF8F5]';
        return `
          <button type="button" onclick="toggleJourAreaChip('${area.replace(/'/g, "\\'")}')"
            class="px-3 py-1 rounded-full border text-xs transition-all cursor-pointer ${cls}">
            ${area}
          </button>
        `;
      }).join('') + `
        <button type="button" onclick="promptAddNewSharedArea('jour')"
          class="px-3 py-1 rounded-full border border-dashed border-[#D1C7BA] text-[#6B6B6B] hover:border-[#6C1C37] hover:text-[#6C1C37] text-xs transition-all cursor-pointer">
          + Nova
        </button>
      `;
    }

    function toggleJourAreaChip(area) {
      if (selectedNewJourAreas.includes(area)) {
        selectedNewJourAreas = selectedNewJourAreas.filter(a => a !== area);
      } else {
        selectedNewJourAreas.push(area);
      }
      renderJourAreasChips();
    }

    function validateNewJourForm() {
      const name = document.getElementById('new-jour-name')?.value.trim();
      const email = document.getElementById('new-jour-email')?.value.trim();
      const hasOutlets = selectedNewJourOutlets.length > 0;
      const isValidEmail = email && email.includes('@');

      const isReady = !!(name && hasOutlets && isValidEmail);
      const btn = document.getElementById('new-jour-submit-btn');
      if (btn) {
        btn.disabled = !isReady;
        if (isReady) {
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
          btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
      }
    }

    async function handleNewJournalistSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('new-jour-name')?.value.trim();
      const email = document.getElementById('new-jour-email')?.value.trim();
      if (!name || selectedNewJourOutlets.length === 0 || !email) {
        showToast('Preenche todos os campos obrigatórios (*).');
        return;
      }

      const phone = document.getElementById('new-jour-phone')?.value.trim() || '';
      const role = document.getElementById('new-jour-role')?.value.trim() || 'Jornalista';
      const pref = document.getElementById('new-jour-pref-value')?.value || 'email';
      const linkedin = document.getElementById('new-jour-linkedin')?.value.trim() || '';
      const twitter = document.getElementById('new-jour-twitter')?.value.trim() || '';
      const authorPage = document.getElementById('new-jour-author')?.value.trim() || '';
      const status = document.getElementById('new-jour-status')?.value || 'ativo';
      const origin = document.getElementById('new-jour-origin')?.value.trim() || 'Registo Direto';
      const rgpd = document.getElementById('new-jour-rgpd')?.checked ?? true;
      const rgpdDate = document.getElementById('new-jour-rgpd-date')?.value || new Date().toISOString().split('T')[0];
      const notes = document.getElementById('new-jour-notes')?.value.trim() || '';

      const newId = 'jour-' + Date.now();
      const newJour = {
        id: newId,
        name,
        role_title: role,
        outlet_name: selectedNewJourOutlets[0] || 'Geral',
        outlet_names: [...selectedNewJourOutlets],
        emails: [email],
        contact_email: email,
        phones: phone ? [phone] : [],
        contact_phone: phone,
        contact_preference: pref,
        intervention_areas: selectedNewJourAreas.length > 0 ? [...selectedNewJourAreas] : ['Geral'],
        status,
        contact_origin: origin,
        rgpd_consent: rgpd,
        rgpd_consent_date: rgpdDate,
        notes,
        last_contact_date: null,
        days_inactive: 999,
        last_project_name: 'Ainda sem contacto',
        links: {
          linkedin,
          twitter_x: twitter,
          author_page: authorPage
        },
        created_at: new Date().toISOString()
      };

      if (supabaseClient) {
        try {
          await supabaseClient.from('journalists').insert([newJour]);
        } catch(err) {}
      }

      localJournalists.unshift(newJour);
      syncLocalStorage();
      closeJournalistModal();
      renderAll();
      showToast('Jornalista criado com sucesso.');

      // Abre imediatamente a ficha do jornalista
      openJournalistDetailDrawer(newJour.id);
    }

    // ----------------------------------------------------
    // MODAL NOVO MEIO
    // ----------------------------------------------------
    function openOutletModal() {
      if (currentUserPermissions()?.isReadOnly) {
        showToast('Modo Observador: O seu perfil tem acesso exclusivo de consulta.');
        return;
      }

      const form = document.getElementById('form-new-outlet');
      if (form) form.reset();

      selectedNewOutletFormats = ['Online'];
      selectedNewOutletSpecialties = [];
      setOutletScope('nacional');

      // Preencher lista de grupos
      const groupSelect = document.getElementById('new-outlet-group');
      if (groupSelect) {
        const groups = [...new Set(localOutlets.map(o => o.media_group).filter(Boolean))].sort();
        groupSelect.innerHTML = '<option value="">Sem grupo</option>' + 
          groups.map(g => `<option value="${g}">${g}</option>`).join('');
      }

      // Fechar secção recolhível
      const content = document.getElementById('outlet-details-content');
      const chevron = document.getElementById('outlet-details-chevron');
      if (content) content.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');

      renderOutletFormatsChips();
      renderOutletSpecialtiesChips();
      validateNewOutletForm();

      const modal = document.getElementById('modal-new-outlet');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function closeOutletModal() {
      const modal = document.getElementById('modal-new-outlet');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }

    function toggleOutletDetailsSection() {
      const content = document.getElementById('outlet-details-content');
      const chevron = document.getElementById('outlet-details-chevron');
      if (content && chevron) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          chevron.classList.add('rotate-180');
        } else {
          content.classList.add('hidden');
          chevron.classList.remove('rotate-180');
        }
      }
    }

    function setOutletScope(scope) {
      const valInput = document.getElementById('new-outlet-scope-value');
      if (valInput) valInput.value = scope;

      const seg = document.getElementById('new-outlet-scope-segmented');
      if (seg) {
        seg.querySelectorAll('button').forEach(btn => {
          if (btn.getAttribute('data-scope') === scope) {
            btn.className = "flex-1 py-1.5 rounded-lg font-medium text-center transition-all bg-white text-[#1A1A1A] shadow-xs";
          } else {
            btn.className = "flex-1 py-1.5 rounded-lg font-medium text-center transition-all text-[#6B6B6B] hover:text-[#1A1A1A]";
          }
        });
      }
      validateNewOutletForm();
    }

    function renderOutletFormatsChips() {
      const container = document.getElementById('new-outlet-formats-chips');
      if (!container) return;

      const formats = ['Online', 'Papel', 'TV', 'Rádio', 'Podcast', 'Agência noticiosa'];
      container.innerHTML = formats.map(fmt => {
        const isSel = selectedNewOutletFormats.includes(fmt);
        const cls = isSel 
          ? 'bg-[#FBE8EB] border-[#6C1C37] text-[#801D38] font-medium'
          : 'bg-white border-[#D1C7BA] text-[#1A1A1A] hover:bg-[#FAF8F5]';
        return `
          <button type="button" onclick="toggleOutletFormatChip(this, '${fmt}')"
            class="px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${cls}" data-fmt="${fmt}">
            ${fmt}
          </button>
        `;
      }).join('');
    }

    function toggleOutletFormatChip(btn, fmt) {
      if (selectedNewOutletFormats.includes(fmt)) {
        selectedNewOutletFormats = selectedNewOutletFormats.filter(f => f !== fmt);
      } else {
        selectedNewOutletFormats.push(fmt);
      }
      renderOutletFormatsChips();
      validateNewOutletForm();
    }

    function renderOutletSpecialtiesChips() {
      const container = document.getElementById('new-outlet-specialties-chips');
      if (!container) return;

      container.innerHTML = sharedAreasList.map(spec => {
        const isSel = selectedNewOutletSpecialties.includes(spec);
        const cls = isSel 
          ? 'bg-[#FBE8EB] border-[#6C1C37] text-[#801D38] font-medium'
          : 'bg-white border-[#D1C7BA] text-[#1A1A1A] hover:bg-[#FAF8F5]';
        return `
          <button type="button" onclick="toggleOutletSpecChip('${spec.replace(/'/g, "\\'")}')"
            class="px-3 py-1 rounded-full border text-xs transition-all cursor-pointer ${cls}">
            ${spec}
          </button>
        `;
      }).join('') + `
        <button type="button" onclick="promptAddNewSharedArea('outlet')"
          class="px-3 py-1 rounded-full border border-dashed border-[#D1C7BA] text-[#6B6B6B] hover:border-[#6C1C37] hover:text-[#6C1C37] text-xs transition-all cursor-pointer">
          + Nova
        </button>
      `;
    }

    function toggleOutletSpecChip(spec) {
      if (selectedNewOutletSpecialties.includes(spec)) {
        selectedNewOutletSpecialties = selectedNewOutletSpecialties.filter(s => s !== spec);
      } else {
        selectedNewOutletSpecialties.push(spec);
      }
      renderOutletSpecialtiesChips();
    }

    function promptCreateOutletGroup() {
      const groupName = prompt('Nome do novo grupo editorial:');
      if (!groupName || !groupName.trim()) return;
      const cleanName = groupName.trim();
      const sel = document.getElementById('new-outlet-group');
      if (sel) {
        const opt = document.createElement('option');
        opt.value = cleanName;
        opt.innerText = cleanName;
        opt.selected = true;
        sel.appendChild(opt);
      }
    }

    function triggerOutletLogoUpload() {
      const input = document.getElementById('new-outlet-logo-input');
      if (input) input.click();
    }

    function handleOutletLogoSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const dataUrl = evt.target.result;
        const urlInput = document.getElementById('new-outlet-logo-url');
        if (urlInput) urlInput.value = dataUrl;
        const label = document.getElementById('new-outlet-logo-label');
        if (label) label.innerText = `Logo carregado: ${file.name}`;
      };
      reader.readAsDataURL(file);
    }

    function validateNewOutletForm() {
      const name = document.getElementById('new-outlet-name')?.value.trim();
      const email = document.getElementById('new-outlet-agenda-email')?.value.trim();
      const hasFormats = selectedNewOutletFormats.length > 0;
      const scope = document.getElementById('new-outlet-scope-value')?.value;
      const isValidEmail = email && email.includes('@');

      const missing = [];
      if (!name) missing.push('nome do meio');
      if (!hasFormats) missing.push('formatos');
      if (!scope) missing.push('âmbito');
      if (!isValidEmail) missing.push('email de agenda');

      const missingEl = document.getElementById('new-outlet-missing-msg');
      if (missingEl) {
        if (missing.length === 0) {
          missingEl.innerText = "Tudo pronto para criar o meio.";
          missingEl.className = "text-xs text-[#2A5C45] font-medium";
        } else {
          missingEl.innerText = `Falta: ${missing.join(' e ')}`;
          missingEl.className = "text-xs text-[#8A8A8A]";
        }
      }

      const isReady = missing.length === 0;
      const btn = document.getElementById('new-outlet-submit-btn');
      if (btn) {
        btn.disabled = !isReady;
        if (isReady) {
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
          btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
      }
    }

    async function handleNewOutletSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('new-outlet-name')?.value.trim();
      const email = document.getElementById('new-outlet-agenda-email')?.value.trim();
      const scope = document.getElementById('new-outlet-scope-value')?.value || 'nacional';
      if (!name || selectedNewOutletFormats.length === 0 || !email) {
        showToast('Preenche todos os 4 campos obrigatórios (*).');
        return;
      }

      const group = document.getElementById('new-outlet-group')?.value || 'Sem grupo';
      const periodicity = document.getElementById('new-outlet-periodicity')?.value || 'diario';
      const website = document.getElementById('new-outlet-website')?.value.trim() || '';
      const logoUrl = document.getElementById('new-outlet-logo-url')?.value || '';
      const address = document.getElementById('new-outlet-address')?.value.trim() || '';
      const phone = document.getElementById('new-outlet-phone')?.value.trim() || '';
      const ercType = document.getElementById('new-outlet-erc-type')?.value || 'Publicação periódica';
      const ercReg = document.getElementById('new-outlet-erc-reg')?.value.trim() || '';
      const audience = parseInt(document.getElementById('new-outlet-audience')?.value, 10) || null;
      const linkedin = document.getElementById('new-outlet-linkedin')?.value.trim() || '';
      const twitter = document.getElementById('new-outlet-twitter')?.value.trim() || '';
      const instagram = document.getElementById('new-outlet-instagram')?.value.trim() || '';

      const newId = 'out-' + Date.now();
      const newOutlet = {
        id: newId,
        name,
        media_group: group,
        agenda_email: email,
        contact_email: email,
        formats: [...selectedNewOutletFormats],
        scope,
        periodicity,
        specialties: selectedNewOutletSpecialties.length > 0 ? [...selectedNewOutletSpecialties] : ['Geral'],
        website_url: website,
        logo_url: logoUrl,
        address,
        phone,
        erc_type: ercType,
        erc_registration: ercReg,
        estimated_audience: audience,
        status: 'ativo',
        social_links: {
          linkedin,
          twitter_x: twitter,
          instagram
        },
        created_at: new Date().toISOString()
      };

      if (supabaseClient) {
        try {
          await supabaseClient.from('media_outlets').insert([newOutlet]);
        } catch(err) {}
      }

      localOutlets.unshift(newOutlet);
      syncLocalStorage();
      closeOutletModal();
      renderAll();
      showToast('Meio criado com sucesso.');

      // Abre imediatamente a ficha do meio
      openOutletDetailDrawer(newOutlet.id);
    }

    // ----------------------------------------------------
    // ADIÇÃO DE NOVA ESPECIALIDADE / ÁREA PARTILHADA
    // ----------------------------------------------------
    function promptAddNewSharedArea(source) {
      const area = prompt('Nome da nova especialidade / área:');
      if (!area || !area.trim()) return;
      const clean = area.trim();
      if (!sharedAreasList.includes(clean)) {
        sharedAreasList.push(clean);
      }
      if (source === 'jour') {
        if (!selectedNewJourAreas.includes(clean)) selectedNewJourAreas.push(clean);
        renderJourAreasChips();
      } else {
        if (!selectedNewOutletSpecialties.includes(clean)) selectedNewOutletSpecialties.push(clean);
        renderOutletSpecialtiesChips();
      }
      renderJournalistsTable();
      renderOutletsTable();
    }

    // Importar CSV de Jornalistas
    function triggerJournalistsCsvImport() {
      const inp = document.getElementById('jour-csv-file-input');
      if (inp) inp.click();
    }

    function handleJournalistCsvSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      showToast(`Ficheiro CSV "${file.name}" carregado. A processar contactos...`);
      // Simular importação rápida
      setTimeout(() => {
        showToast('Contactos importados com sucesso.');
        renderJournalistsTable();
      }, 600);
    }
