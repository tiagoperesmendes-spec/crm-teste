$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
window.__ERRORS__ = [];
window.addEventListener('error', (e) => { window.__ERRORS__.push(e.message); });

window.addEventListener('load', () => {
  try {
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');

    const results = {};

    // 1. Dashboard search bar
    const dashSearch = document.getElementById('dash-global-search-input');
    results.dashSearchExists = !!dashSearch;
    results.dashKbdExists = !!document.querySelector('#dash-search-container kbd');
    results.dashQuickBtnsBeside = !!document.querySelector('#dash-search-container button.bg-\\[\\#6C1C37\\]');
    
    // Test dashboard search functionality
    handleDashboardSearch('web');
    const popover = document.getElementById('dash-search-results-popover');
    results.popoverVisible = popover && !popover.classList.contains('hidden');
    results.popoverHasContent = popover && popover.innerText.includes('Web');

    // 2. Projetos
    switchView('projects');
    results.projSearchExists = !!document.getElementById('filter-proj-search');
    results.projBtnListExists = !!document.getElementById('btn-proj-view-list');
    results.projBtnKanbanExists = !!document.getElementById('btn-proj-view-kanban');
    results.projClientFilterExists = !!document.getElementById('filter-proj-client');
    results.projRespFilterExists = !!document.getElementById('filter-proj-responsible');
    results.projPriorityFilterExists = !!document.getElementById('filter-proj-priority');

    // 3. Tarefas
    switchView('tasks');
    results.tasksSearchExists = !!document.getElementById('tasks-search-input');
    results.tasksFilterTypeExists = !!document.getElementById('tasks-filter-type');
    results.tasksFilterPriorityExists = !!document.getElementById('tasks-filter-priority');
    results.tasksFilterRespExists = !!document.getElementById('tasks-filter-responsible');
    results.tasksGroupingExists = !!document.getElementById('tasks-grouping-select');
    results.tasksTableWrapperExists = !!document.getElementById('tasks-content-wrapper');

    // 4. Jornalistas
    switchView('journalists');
    results.jourSearchExists = !!document.getElementById('search-journalists');
    results.jourOutletFilterExists = !!document.getElementById('filter-jour-outlet');
    results.jourAreaFilterExists = !!document.getElementById('filter-jour-area');
    results.jourStatusFilterExists = !!document.getElementById('filter-jour-status');
    const jourRows = document.querySelectorAll('#journalists-table tbody tr');
    results.jourRowsCount = jourRows.length;

    // 5. Meios
    switchView('outlets');
    results.outletsSearchExists = !!document.getElementById('search-outlets');
    results.outletsFormatFilterExists = !!document.getElementById('filter-ocs-format');
    results.outletsScopeFilterExists = !!document.getElementById('filter-ocs-scope');
    results.outletsSpecFilterExists = !!document.getElementById('filter-ocs-specialty');
    results.outletsGroupFilterExists = !!document.getElementById('filter-ocs-group');
    results.outletsExtinctCheckboxExists = !!document.getElementById('filter-ocs-include-extinct');
    const outletRows = document.querySelectorAll('#outlets-table tbody tr');
    results.outletRowsCount = outletRows.length;

    results.errors = window.__ERRORS__;

    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_VERIFY_RESULT';
    resDiv.innerText = JSON.stringify(results, null, 2);
    document.body.appendChild(resDiv);
  } catch (err) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_VERIFY_RESULT';
    resDiv.innerText = 'CATCH_ERROR: ' + err.message + ' ' + err.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$harnessHtml = $dashboardContent.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_clean_search_harness.html", $harnessHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outDump = "c:\Users\tiago\Desktop\crm-teste\scratch\test_clean_search_dump.txt"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_clean_search_harness.html > `"$outDump`""
Start-Sleep -Milliseconds 500

$dumpContent = [System.IO.File]::ReadAllText($outDump, [System.Text.Encoding]::UTF8)
if ($dumpContent -match '(?s)<div id="TEST_VERIFY_RESULT"[^>]*>(.*?)</div>') {
    Write-Host "CLEAN SEARCH & FILTERS VERIFICATION RESULT:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Result div not found!" -ForegroundColor Red
}
