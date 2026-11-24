$testScript = @'
<script>
window.addEventListener('load', () => {
  try {
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');
    
    switchView('journalists');
    
    const jId = (localJournalists && localJournalists[0]) ? localJournalists[0].id : 'jour-1';
    openJournalistDetailDrawer(jId);
    
    const panel = document.getElementById('panel-journalist-detail');
    const isHidden = panel ? panel.classList.contains('hidden') : true;
    const name = document.getElementById('jd-name')?.innerText || '';
    const lastContact = document.getElementById('jd-last-contact')?.innerText || '';
    
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_DRAWER_OUTCOME';
    resDiv.innerText = 'DRAWER_STATUS: isVisible=' + (!isHidden) + ' | name=' + name + ' | contact=' + lastContact;
    document.body.appendChild(resDiv);
  } catch (e) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_DRAWER_OUTCOME';
    resDiv.innerText = 'DRAWER_ERROR: ' + e.message + ' ' + e.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$content = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_clean_duplicates.html", [System.Text.Encoding]::UTF8)
$safeTailwind = $content.Replace("tailwind.config =", "window.tailwind = window.tailwind || {}; tailwind.config =")
$finalHtml = $safeTailwind.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_drawer_verified.html", $finalHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outFile = "c:\Users\tiago\Desktop\crm-teste\scratch\test_drawer_verified_out.txt"
cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_drawer_verified.html > `"$outFile`""

Start-Sleep -Milliseconds 500
$res = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
if ($res -match '(?s)<div id="TEST_DRAWER_OUTCOME"[^>]*>(.*?)</div>') {
    Write-Host "OUTCOME: $($matches[1])" -ForegroundColor Green
} else {
    Write-Host "No outcome found" -ForegroundColor Yellow
}
