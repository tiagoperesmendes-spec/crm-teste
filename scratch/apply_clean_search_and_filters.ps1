$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

    # ========================================================
    # 1. DASHBOARD: Remove cmd-K and quick buttons, make search functional
    # ========================================================
    $dashSearchPattern = '(?s)<div class="flex items-center gap-3">\s*<!-- Barra de Pesquisa com atalho ⌘K -->.*?<!-- Botões de Ação Rápida -->.*?</div>\s*</div>'
    $newDashSearch = @'
<div class="flex items-center gap-3">
            <!-- Barra de Pesquisa da Dashboard -->
            <div class="relative w-72 sm:w-80" id="dash-search-container">
              <input type="text" id="dash-global-search-input" oninput="handleDashboardSearch(this.value)" onfocus="handleDashboardSearch(this.value)"
                placeholder="Pesquisar projetos, tarefas, jornalistas..."
                class="w-full bg-white/95 border border-[#E4DDD3] rounded-xl pl-9 pr-8 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-2xs" />
              <svg class="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <button id="dash-search-clear-btn" type="button" onclick="clearDashboardSearch()"
                class="hidden absolute right-2.5 top-2 text-[#8A8A8A] hover:text-[#1A1A1A] cursor-pointer text-xs p-0.5" title="Limpar pesquisa">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <!-- Popover de Resultados em Tempo Real -->
              <div id="dash-search-results-popover"
                class="hidden absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white border border-[#E4DDD3] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#E4DDD3]/60 max-h-[420px] overflow-y-auto">
              </div>
            </div>
          </div>
        </div>
'@
    if ($content -match $dashSearchPattern) {
        $content = [regex]::Replace($content, $dashSearchPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newDashSearch }, 1)
        Write-Host "Replaced dashboard search bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: dashSearchPattern not matched in $file" -ForegroundColor Yellow
    }

    # ========================================================
    # 2. TAREFAS: Remove all filters next to search bar
    # ========================================================
    $tasksFilterPattern = '(?s)<div class="flex flex-wrap items-center gap-3">\s*<!-- Pesquisa -->.*?id="tasks-search-input".*?<!-- Seletor de Agrupamento -->.*?</div>\s*</div>'
    $newTasksFilter = @'
<div class="flex items-center gap-3">
          <!-- Pesquisa de Tarefas -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="tasks-search-input" oninput="onTasksFilterChange()"
              placeholder="Pesquisar por tarefa, projeto, cliente ou jornalista..."
              class="w-full bg-white border border-[#E4DDD3] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] transition-colors shadow-xs">
          </div>
        </div>
'@
    if ($content -match $tasksFilterPattern) {
        $content = [regex]::Replace($content, $tasksFilterPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newTasksFilter }, 1)
        Write-Host "Replaced tasks filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: tasksFilterPattern not matched in $file" -ForegroundColor Yellow
    }

    # ========================================================
    # 3. PROJETOS: Remove Cliente, Responsável, Prioridade filters. Keep ONLY search bar & Lista/Quadro toggle!
    # ========================================================
    $projFilterPattern = '(?s)<div class="flex flex-wrap lg:flex-nowrap items-center gap-3 pt-1">\s*<!-- Pesquisa de projeto ou cliente -->.*?id="filter-proj-search".*?<!-- Alternador Lista / Quadro -->'
    $newProjFilter = @'
<div class="flex items-center gap-3 pt-1">
          <!-- Pesquisa de projeto ou cliente -->
          <div class="relative flex-1 min-w-[220px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="filter-proj-search" oninput="filterProjectsBySearch(this.value)"
              placeholder="Pesquisar projeto ou cliente"
              class="w-full bg-white border border-[#E4DDD3] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-xs">
          </div>

          <!-- Alternador Lista / Quadro -->
'@
    if ($content -match $projFilterPattern) {
        $content = [regex]::Replace($content, $projFilterPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newProjFilter }, 1)
        Write-Host "Replaced projects filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: projFilterPattern not matched in $file" -ForegroundColor Yellow
    }

    # ========================================================
    # 4. JORNALISTAS: Remove outlet, area, status dropdowns. Keep ONLY search bar!
    # ========================================================
    $jourFilterPattern = '(?s)<div class="flex flex-wrap items-center gap-3">\s*<div class="relative flex-1 min-w-\[220px\]">\s*<div class="absolute inset-y-0 left-0 pl-3.*?id="search-journalists".*?id="filter-jour-status".*?</div>\s*</div>'
    $newJourFilter = @'
<div class="flex items-center gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="search-journalists" oninput="renderJournalistsTable()"
              placeholder="Pesquisar por nome, meio ou área..."
              class="w-full bg-white border border-[#E4DDD3] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-xs">
          </div>
        </div>
'@
    if ($content -match $jourFilterPattern) {
        $content = [regex]::Replace($content, $jourFilterPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newJourFilter }, 1)
        Write-Host "Replaced journalists filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: jourFilterPattern not matched in $file" -ForegroundColor Yellow
    }

    # ========================================================
    # 5. MEIOS: Remove formats, scope, specialty, group, extinct filters. Keep ONLY search bar!
    # ========================================================
    $ocsFilterPattern = '(?s)<div class="flex flex-wrap items-center gap-3">\s*<div class="relative flex-1 min-w-\[220px\]">\s*<div class="absolute inset-y-0 left-0 pl-3.*?id="search-outlets".*?id="filter-ocs-include-extinct".*?</div>\s*</div>'
    $newOcsFilter = @'
<div class="flex items-center gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="search-outlets" oninput="renderOutletsTable()"
              placeholder="Pesquisar por nome, grupo ou especialidade..."
              class="w-full bg-white border border-[#E4DDD3] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:outline-none focus:border-[#6C1C37] shadow-xs">
          </div>
        </div>
'@
    if ($content -match $ocsFilterPattern) {
        $content = [regex]::Replace($content, $ocsFilterPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newOcsFilter }, 1)
        Write-Host "Replaced outlets filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: ocsFilterPattern not matched in $file" -ForegroundColor Yellow
    }

    # ========================================================
    # 6. JAVASCRIPT: Add handleDashboardSearch and update renderDashboardTodayTasks / renderDashboardAtRiskProjects
    # ========================================================
    $jsDashboardSearchBlock = @'
    // ========================================================
    // PESQUISA GLOBAL FUNCIONAL DA DASHBOARD
    // ========================================================
    function handleDashboardSearch(query) {
      const q = (query || '').trim().toLowerCase();
      const clearBtn = document.getElementById('dash-search-clear-btn');
      const popover = document.getElementById('dash-search-results-popover');

      if (!q) {
        if (clearBtn) clearBtn.classList.add('hidden');
        if (popover) popover.classList.add('hidden');
        renderDashboardTodayTasks('');
        renderDashboardAtRiskProjects('');
        return;
      }

      if (clearBtn) clearBtn.classList.remove('hidden');

      // Filtrar listas presentes na Dashboard
      renderDashboardTodayTasks(q);
      renderDashboardAtRiskProjects(q);

      // Pesquisar entidades
      const matchProjects = (localProjects || []).filter(p => {
        const name = (p.name || '').toLowerCase();
        const client = (p.client || p.client_or_brand || '').toLowerCase();
        const type = (p.type || '').toLowerCase();
        return name.includes(q) || client.includes(q) || type.includes(q);
      }).slice(0, 3);

      const matchTasks = (localTasks || []).filter(t => {
        const title = (t.title || '').toLowerCase();
        const proj = (t.project_name || '').toLowerCase();
        const resp = (t.responsible || t.assignee || '').toLowerCase();
        const jour = (t.journalist_name || '').toLowerCase();
        return title.includes(q) || proj.includes(q) || resp.includes(q) || jour.includes(q);
      }).slice(0, 3);

      const matchJournalists = (localJournalists || []).filter(j => {
        const name = (j.name || '').toLowerCase();
        const role = (j.role_title || j.role || '').toLowerCase();
        const ocs = (j.outlet_name || (j.outlet_names || []).join(' ')).toLowerCase();
        const areas = (j.intervention_areas || [j.intervention_area || '']).join(' ').toLowerCase();
        return name.includes(q) || role.includes(q) || ocs.includes(q) || areas.includes(q);
      }).slice(0, 3);

      const matchOutlets = (localOutlets || []).filter(o => {
        const name = (o.name || '').toLowerCase();
        const grp = (o.media_group || '').toLowerCase();
        const specs = (o.specialties || []).join(' ').toLowerCase();
        return name.includes(q) || grp.includes(q) || specs.includes(q);
      }).slice(0, 3);

      const totalMatches = matchProjects.length + matchTasks.length + matchJournalists.length + matchOutlets.length;

      if (!popover) return;

      if (totalMatches === 0) {
        popover.innerHTML = `
          <div class="p-4 text-center text-xs text-[#6B6B6B]">
            Nenhum resultado encontrado para "<strong>${escapeHtml(query)}</strong>".
          </div>
        `;
        popover.classList.remove('hidden');
        return;
      }

      let html = '';

      if (matchProjects.length > 0) {
        html += `
          <div class="p-2">
            <span class="px-2.5 py-1 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Projetos</span>
            ${matchProjects.map(p => `
              <div onclick="closeDashboardSearchPopover(); openProjectDetail('${p.id}');"
                class="px-2.5 py-2 hover:bg-[#FAF8F5] rounded-xl cursor-pointer transition-colors flex items-center justify-between group">
                <div class="min-w-0 pr-2">
                  <span class="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate">${p.name}</span>
                  <span class="text-[11px] text-[#6B6B6B] block truncate">${p.client || p.client_or_brand || 'Institucional'} · ${getProjectTypeBadge(p.type)}</span>
                </div>
                <span class="text-xs text-[#6C1C37] font-medium shrink-0">&rarr;</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (matchTasks.length > 0) {
        html += `
          <div class="p-2">
            <span class="px-2.5 py-1 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Tarefas</span>
            ${matchTasks.map(t => `
              <div onclick="closeDashboardSearchPopover(); openTaskDetail('${t.id}');"
                class="px-2.5 py-2 hover:bg-[#FAF8F5] rounded-xl cursor-pointer transition-colors flex items-center justify-between group">
                <div class="min-w-0 pr-2">
                  <span class="font-medium text-xs text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate">${t.title}</span>
                  <span class="text-[11px] text-[#6B6B6B] block truncate">${t.project_name || 'Geral'} · Prazo: ${t.due_date || '—'}</span>
                </div>
                <span class="text-xs text-[#6C1C37] font-medium shrink-0">&rarr;</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (matchJournalists.length > 0) {
        html += `
          <div class="p-2">
            <span class="px-2.5 py-1 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Jornalistas</span>
            ${matchJournalists.map(j => `
              <div onclick="closeDashboardSearchPopover(); openJournalistDetailDrawer('${j.id}');"
                class="px-2.5 py-2 hover:bg-[#FAF8F5] rounded-xl cursor-pointer transition-colors flex items-center justify-between group">
                <div class="min-w-0 pr-2">
                  <span class="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate">${j.name}</span>
                  <span class="text-[11px] text-[#6B6B6B] block truncate">${j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral'} · ${j.role_title || 'Jornalista'}</span>
                </div>
                <span class="text-xs text-[#6C1C37] font-medium shrink-0">&rarr;</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (matchOutlets.length > 0) {
        html += `
          <div class="p-2">
            <span class="px-2.5 py-1 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Meios de Comunicação</span>
            ${matchOutlets.map(o => `
              <div onclick="closeDashboardSearchPopover(); openOutletDetailDrawer('${o.id}');"
                class="px-2.5 py-2 hover:bg-[#FAF8F5] rounded-xl cursor-pointer transition-colors flex items-center justify-between group">
                <div class="min-w-0 pr-2">
                  <span class="font-semibold text-xs text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate">${o.name}</span>
                  <span class="text-[11px] text-[#6B6B6B] block truncate">${o.media_group || 'Sem grupo'}</span>
                </div>
                <span class="text-xs text-[#6C1C37] font-medium shrink-0">&rarr;</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      popover.innerHTML = html;
      popover.classList.remove('hidden');
    }

    function clearDashboardSearch() {
      const input = document.getElementById('dash-global-search-input');
      if (input) {
        input.value = '';
        handleDashboardSearch('');
        input.focus();
      }
    }

    function closeDashboardSearchPopover() {
      const popover = document.getElementById('dash-search-results-popover');
      if (popover) popover.classList.add('hidden');
    }

'@

    # Update renderDashboardTodayTasks to support query filter
    $oldTodayFn = 'function renderDashboardTodayTasks() {'
    $newTodayFn = "function renderDashboardTodayTasks(filterQuery = '') {"
    $content = $content.Replace($oldTodayFn, $newTodayFn)

    $filterTodayTasksPattern = '(?s)if \(tasks\.length === 0\) \{\s*tasks = localTasks\.filter\(t => t\.status !== ''completed''\)\.slice\(0, 5\);\s*\}'
    $newFilterTodayTasks = @'
if (tasks.length === 0) {
        tasks = localTasks.filter(t => t.status !== 'completed' && t.status !== 'concluida').slice(0, 5);
      }
      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        tasks = (localTasks || []).filter(t => {
          return (t.title || '').toLowerCase().includes(q) ||
                 (t.project_name || '').toLowerCase().includes(q) ||
                 (t.responsible || t.assignee || '').toLowerCase().includes(q) ||
                 (t.journalist_name || '').toLowerCase().includes(q);
        });
      }
'@
    if ($content -match $filterTodayTasksPattern) {
        $content = [regex]::Replace($content, $filterTodayTasksPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newFilterTodayTasks }, 1)
    }

    # Update renderDashboardAtRiskProjects to support query filter
    $oldRiskFn = 'function renderDashboardAtRiskProjects() {'
    $newRiskFn = "function renderDashboardAtRiskProjects(filterQuery = '') {"
    $content = $content.Replace($oldRiskFn, $newRiskFn)

    $filterRiskPattern = '(?s)const isProjDone = \(p\) => p\.status === ''concluido'' \|\| p\.status === ''completed'';\s*const openProjects = localProjects\.filter\(p => !isProjDone\(p\)\);'
    $newFilterRisk = @'
const isProjDone = (p) => p.status === 'concluido' || p.status === 'completed';
      let openProjects = (localProjects || []).filter(p => !isProjDone(p));
      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        openProjects = (localProjects || []).filter(p => {
          return (p.name || '').toLowerCase().includes(q) ||
                 (p.client || p.client_or_brand || '').toLowerCase().includes(q) ||
                 (p.objective || '').toLowerCase().includes(q);
        });
      }
'@
    if ($content -match $filterRiskPattern) {
        $content = [regex]::Replace($content, $filterRiskPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newFilterRisk }, 1)
    }

    # Insert handleDashboardSearch before window.addEventListener('click')
    if (-not $content.Contains("function handleDashboardSearch(")) {
        $windowClickTarget = "    // Fechar popovers e sugestões ao clicar fora"
        if ($content.Contains($windowClickTarget)) {
            $content = $content.Replace($windowClickTarget, $jsDashboardSearchBlock + "`r`n`r`n" + $windowClickTarget)
        } else {
            $content = $content.Replace("window.addEventListener('click', function (e) {", $jsDashboardSearchBlock + "`r`n`r`n    window.addEventListener('click', function (e) {")
        }
    }

    # Ensure click outside closes dashboard search popover
    $closePopTarget = "if (!e.target.closest('#dash-search-container')) { closeDashboardSearchPopover(); }"
    if (-not $content.Contains($closePopTarget)) {
        $content = $content.Replace("window.addEventListener('click', function (e) {", "window.addEventListener('click', function (e) {`r`n      if (!e.target.closest('#dash-search-container')) { closeDashboardSearchPopover(); }")
    }

    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated $file completely." -ForegroundColor Cyan
}
