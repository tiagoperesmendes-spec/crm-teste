$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

    # 1. Tarefas filter bar
    $tasksPattern = '(?s)<div class="flex flex-wrap lg:flex-nowrap items-center gap-3 pt-1">\s*<!-- Pesquisa -->.*?id="tasks-search-input".*?<!-- Seletor de Agrupamento -->.*?</div>\s*</div>'
    $newTasksBar = @'
<div class="flex items-center gap-3 pt-1">
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
    if ($content -match $tasksPattern) {
        $content = [regex]::Replace($content, $tasksPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newTasksBar }, 1)
        Write-Host "Replaced Tarefas filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: tasksPattern not matched in $file" -ForegroundColor Yellow
    }

    # 2. Jornalistas filter bar
    $jourPattern = '(?s)<div class="flex flex-wrap items-center gap-3">\s*<div class="relative flex-1 min-w-\[220px\]">\s*<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-\[#8A8A8A\]">.*?id="search-journalists".*?id="filter-jour-status".*?</select>\s*</div>'
    $newJourBar = @'
<div class="flex items-center gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="search-journalists" oninput="renderJournalistsTable()"
              placeholder="Pesquisar por nome, meio ou área..."
              class="crm-input pl-9 pr-4 py-2 text-xs w-full bg-white border-[#E4DDD3] rounded-xl focus:bg-white shadow-xs">
          </div>
        </div>
'@
    if ($content -match $jourPattern) {
        $content = [regex]::Replace($content, $jourPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newJourBar }, 1)
        Write-Host "Replaced Jornalistas filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: jourPattern not matched in $file" -ForegroundColor Yellow
    }

    # 3. Meios filter bar
    $ocsPattern = '(?s)<div class="flex flex-wrap items-center gap-3">\s*<div class="relative flex-1 min-w-\[220px\]">\s*<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-\[#8A8A8A\]">.*?id="search-outlets".*?id="filter-ocs-include-extinct".*?</label>\s*</div>'
    $newOcsBar = @'
<div class="flex items-center gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input type="text" id="search-outlets" oninput="renderOutletsTable()"
              placeholder="Pesquisar por nome, grupo ou especialidade..."
              class="crm-input pl-9 pr-4 py-2 text-xs w-full bg-white border-[#E4DDD3] rounded-xl focus:bg-white shadow-xs">
          </div>
        </div>
'@
    if ($content -match $ocsPattern) {
        $content = [regex]::Replace($content, $ocsPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newOcsBar }, 1)
        Write-Host "Replaced Meios filter bar in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: ocsPattern not matched in $file" -ForegroundColor Yellow
    }

    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
}
