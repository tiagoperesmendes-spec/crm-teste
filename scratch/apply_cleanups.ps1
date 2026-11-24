$files = @("dashboard.html", "index.html")

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText((Resolve-Path $file).Path, [System.Text.Encoding]::UTF8)

    # 1. Fix Tarefas extra </div>
    $tasksPattern = '(<input type="text" id="tasks-search-input"[\s\S]*?</div>\s*</div>)\s*</div>(\s*<!-- Content Container -->)'
    if ($content -match $tasksPattern) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $tasksPattern, '$1$2')
        Write-Output "Fixed Tarefas extra </div> in $file"
    } else {
        Write-Output "Tarefas pattern not matched in $file"
    }

    # 2. Jornalistas filter bar replacement
    $jourOld = '<!-- Barra de Filtros numa Linha -->\s*<div class="bg-white p-2\.5 sm:p-3 rounded-2xl border border-\[#E4DDD3\] shadow-xs flex flex-wrap items-center gap-2\.5">\s*<div class="relative flex-1 min-w-\[220px\]">\s*<svg class="w-4 h-4 text-\[#8A8A8A\] absolute left-3 top-2\.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>\s*</svg>\s*<input type="text" id="search-journalists" oninput="renderJournalistsTable\(\)"\s*placeholder="Pesquisar por nome, meio ou área"\s*class="crm-input pl-9 pr-3 py-1\.5 text-xs w-full bg-\[#FAF8F5\] border-\[#E8E2D8\] focus:bg-white">\s*</div>\s*<select id="filter-jour-outlet"[\s\S]*?</select>\s*<select id="filter-jour-area"[\s\S]*?</select>\s*<select id="filter-jour-status"[\s\S]*?</select>\s*</div>'
    
    $jourNew = @'
        <!-- Barra de Pesquisa de Jornalistas -->
        <div class="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E4DDD3] shadow-xs flex items-center">
          <div class="relative flex-1">
            <svg class="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" id="search-journalists" oninput="renderJournalistsTable()"
              placeholder="Pesquisar por nome, meio ou área"
              class="crm-input pl-9 pr-3 py-1.5 text-xs w-full bg-[#FAF8F5] border-[#E8E2D8] focus:bg-white">
          </div>
        </div>
'@

    if ($content -match $jourOld) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $jourOld, $jourNew)
        Write-Output "Replaced Jornalistas filters with search in $file"
    } else {
        Write-Output "Jornalistas filter pattern not matched in $file"
    }

    # 3. Meios filter bar replacement
    $ocsOld = '<!-- Barra de Filtros numa Linha -->\s*<div class="bg-white p-2\.5 sm:p-3 rounded-2xl border border-\[#E4DDD3\] shadow-xs flex flex-wrap items-center gap-2\.5">\s*<div class="relative flex-1 min-w-\[220px\]">\s*<svg class="w-4 h-4 text-\[#8A8A8A\] absolute left-3 top-2\.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>\s*</svg>\s*<input type="text" id="search-outlets" oninput="renderOutletsTable\(\)"\s*placeholder="Pesquisar por nome, grupo ou especialidade"\s*class="crm-input pl-9 pr-3 py-1\.5 text-xs w-full bg-\[#FAF8F5\] border-\[#E8E2D8\] focus:bg-white">\s*</div>\s*<select id="filter-ocs-format"[\s\S]*?</select>\s*<select id="filter-ocs-scope"[\s\S]*?</select>\s*<select id="filter-ocs-specialty"[\s\S]*?</select>\s*<select id="filter-ocs-group"[\s\S]*?</select>\s*<label class="flex items-center gap-2 text-xs text-\[#1A1A1A\] cursor-pointer ml-auto pl-2 select-none">\s*<input type="checkbox" id="filter-ocs-include-extinct"[\s\S]*?</div>'

    $ocsNew = @'
        <!-- Barra de Pesquisa de Meios -->
        <div class="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E4DDD3] shadow-xs flex items-center">
          <div class="relative flex-1">
            <svg class="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" id="search-outlets" oninput="renderOutletsTable()"
              placeholder="Pesquisar por nome, grupo ou especialidade"
              class="crm-input pl-9 pr-3 py-1.5 text-xs w-full bg-[#FAF8F5] border-[#E8E2D8] focus:bg-white">
          </div>
        </div>
'@

    if ($content -match $ocsOld) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $ocsOld, $ocsNew)
        Write-Output "Replaced Meios filters with search in $file"
    } else {
        Write-Output "Meios filter pattern not matched in $file"
    }

    # 4. Update filterJournalistsByOutlet
    $fnOld = 'function filterJournalistsByOutlet\(outletIdOrName\) \{\s*const outletObj = localOutlets\.find\(o => o\.id === outletIdOrName \|\| o\.name\.toLowerCase\(\) === outletIdOrName\.toLowerCase\(\)\);\s*const targetName = outletObj \? outletObj\.name : outletIdOrName;\s*switchView\(''journalists''\);\s*setTimeout\(\(\) => \{\s*const sel = document\.getElementById\(''filter-jour-outlet''\);\s*if \(sel\) \{\s*sel\.value = targetName;\s*\}\s*renderJournalistsTable\(\);\s*\}, 50\);\s*\}'
    
    $fnNew = @'
    function filterJournalistsByOutlet(outletIdOrName) {
      const outletObj = localOutlets.find(o => o.id === outletIdOrName || o.name.toLowerCase() === outletIdOrName.toLowerCase());
      const targetName = outletObj ? outletObj.name : outletIdOrName;
      switchView('journalists');
      setTimeout(() => {
        const searchInput = document.getElementById('search-journalists');
        if (searchInput) {
          searchInput.value = targetName;
        }
        const sel = document.getElementById('filter-jour-outlet');
        if (sel) {
          sel.value = targetName;
        }
        renderJournalistsTable();
      }, 50);
    }
'@

    if ($content -match $fnOld) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $fnOld, $fnNew)
        Write-Output "Updated filterJournalistsByOutlet in $file"
    } else {
        Write-Output "filterJournalistsByOutlet pattern not matched in $file"
    }

    [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
}
