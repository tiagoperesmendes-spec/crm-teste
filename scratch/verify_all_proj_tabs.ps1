$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
window.addEventListener('load', () => {
  try {
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');

    openProjectDetail('proj-1');

    // 1. Resumo Tab
    const title = document.getElementById('proj-detail-title')?.innerText || '';
    const dateStart = document.getElementById('proj-detail-start-date')?.value || '';
    const dateDeadline = document.getElementById('proj-detail-deadline-date')?.value || '';
    const outletsCount = document.querySelectorAll('#proj-detail-target-outlets-list > *').length;

    // 2. Switch to Tasks Tab
    switchProjectDetailTab('tasks');
    const tasksRowsCount = document.querySelectorAll('#proj-detail-tasks-tbody tr').length;
    const isTasksTabVisible = !document.getElementById('proj-tab-content-tasks')?.classList.contains('hidden');

    // 3. Switch to Journalists Tab
    switchProjectDetailTab('journalists');
    const jourCardsCount = document.querySelectorAll('#proj-detail-journalists-grid > *').length;
    const isJourTabVisible = !document.getElementById('proj-tab-content-journalists')?.classList.contains('hidden');

    // Back to Overview
    switchProjectDetailTab('overview');

    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_ALL_TABS_RESULT';
    resDiv.innerText = JSON.stringify({
      title: title,
      dateStart: dateStart,
      dateDeadline: dateDeadline,
      outletsCount: outletsCount,
      tasksRowsCount: tasksRowsCount,
      isTasksTabVisible: isTasksTabVisible,
      jourCardsCount: jourCardsCount,
      isJourTabVisible: isJourTabVisible
    });
    document.body.appendChild(resDiv);
  } catch (err) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_ALL_TABS_RESULT';
    resDiv.innerText = 'CATCH_ERROR: ' + err.message + ' ' + err.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$harnessHtml = $dashboardContent.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_all_tabs_harness.html", $harnessHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outDump = "c:\Users\tiago\Desktop\crm-teste\scratch\test_all_tabs_dump.txt"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_all_tabs_harness.html > `"$outDump`""
Start-Sleep -Milliseconds 500

$dumpContent = [System.IO.File]::ReadAllText($outDump, [System.Text.Encoding]::UTF8)
if ($dumpContent -match '(?s)<div id="TEST_ALL_TABS_RESULT"[^>]*>(.*?)</div>') {
    Write-Host "ALL TABS TEST RESULT:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Result div not found!" -ForegroundColor Red
}
