$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

# Inject error trap and auto-runner for project detail
$errorTrap = @'
  <script>
    window.__ERRORS__ = [];
    window.onerror = function(msg, url, line, col, err) {
      window.__ERRORS__.push({ msg: msg, line: line, col: col });
    };
  </script>
'@

$testScript = @'
<script>
window.addEventListener('load', () => {
  try {
    // 1. Force Login as Director
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');

    // 2. Open first project detail
    const projId = (localProjects && localProjects[0]) ? localProjects[0].id : 'proj-1';
    openProjectDetail(projId);

    // 3. Inspect populated fields
    const title = document.getElementById('proj-detail-title')?.innerText || '';
    const client = document.getElementById('proj-detail-client-badge')?.innerText || '';
    const progress = document.getElementById('proj-detail-tasks-progress-label')?.innerText || '';
    const objective = document.getElementById('proj-detail-objective')?.innerText || '';
    const teamBadgesCount = document.querySelectorAll('#proj-detail-team-badges > *').length;
    const isVisible = !document.getElementById('view-project-detail')?.classList.contains('hidden');

    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_PROJ_DETAIL_RESULT';
    resDiv.setAttribute('data-visible', isVisible.toString());
    resDiv.setAttribute('data-title', title);
    resDiv.setAttribute('data-client', client);
    resDiv.setAttribute('data-progress', progress);
    resDiv.setAttribute('data-objective', objective);
    resDiv.setAttribute('data-team', teamBadgesCount.toString());
    resDiv.innerText = JSON.stringify({
      visible: isVisible,
      title: title,
      client: client,
      progress: progress,
      objective: objective,
      teamCount: teamBadgesCount,
      errors: window.__ERRORS__ || []
    });
    document.body.appendChild(resDiv);
  } catch (err) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_PROJ_DETAIL_RESULT';
    resDiv.innerText = 'CATCH_ERROR: ' + err.message + ' ' + err.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$harnessHtml = $dashboardContent.Replace("<head>", "<head>`n" + $errorTrap).Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_proj_detail_harness.html", $harnessHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outDump = "c:\Users\tiago\Desktop\crm-teste\scratch\test_proj_detail_dump.txt"
$outImg = "c:\Users\tiago\Desktop\crm-teste\scratch\screenshot_proj_detail_working.png"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --screenshot=`"$outImg`" --window-size=1440,900 --virtual-time-budget=2500 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_proj_detail_harness.html > `"$outDump`""
Start-Sleep -Milliseconds 600

$dumpContent = [System.IO.File]::ReadAllText($outDump, [System.Text.Encoding]::UTF8)
if ($dumpContent -match '(?s)<div id="TEST_PROJ_DETAIL_RESULT"[^>]*>(.*?)</div>') {
    Write-Host "HARNESS RESULT:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Result div not found!" -ForegroundColor Red
}

if (Test-Path $outImg) {
    Write-Host "Screenshot saved: $outImg (Size: $((Get-Item $outImg).Length) bytes)" -ForegroundColor Green
}
