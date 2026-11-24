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
