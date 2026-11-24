$html = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

# Inject an auto-runner script right before </body>
$testScript = @'
<script>
window.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Set login
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');
    
    // 2. Switch to journalists
    switchView('journalists');
    
    // 3. Open drawer
    const jId = (localJournalists && localJournalists[0]) ? localJournalists[0].id : 'jour-1';
    openJournalistDetailDrawer(jId);
    
    // 4. Check state
    const panel = document.getElementById('panel-journalist-detail');
    const isHidden = panel ? panel.classList.contains('hidden') : true;
    const name = document.getElementById('jd-name')?.innerText || '';
    const lastContact = document.getElementById('jd-last-contact')?.innerText || '';
    
    const banner = document.createElement('div');
    banner.id = 'TEST_DRAWER_RESULT';
    banner.setAttribute('data-visible', (!isHidden).toString());
    banner.setAttribute('data-name', name);
    banner.setAttribute('data-contact', lastContact);
    banner.innerText = 'TEST_RESULT_SUCCESS: visible=' + (!isHidden) + ' name=' + name + ' contact=' + lastContact;
    document.body.appendChild(banner);
  } catch(err) {
    const banner = document.createElement('div');
    banner.id = 'TEST_DRAWER_RESULT';
    banner.innerText = 'TEST_RESULT_ERROR: ' + err.message + ' stack=' + err.stack;
    document.body.appendChild(banner);
  }
});
</script>
'@

$testHtml = $html.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_drawer_direct.html", $testHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outFile = "c:\Users\tiago\Desktop\crm-teste\scratch\test_drawer_direct_out.txt"
cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=3000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_drawer_direct.html > `"$outFile`""

Start-Sleep -Milliseconds 600
$content = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
if ($content -match 'TEST_RESULT_SUCCESS:[^<]+') {
    Write-Host "DIRECT DOM TEST: $($matches[0])" -ForegroundColor Green
} elseif ($content -match 'TEST_RESULT_ERROR:[^<]+') {
    Write-Host "DIRECT DOM TEST ERROR: $($matches[0])" -ForegroundColor Red
} else {
    Write-Host "No result banner found in output" -ForegroundColor Yellow
}
