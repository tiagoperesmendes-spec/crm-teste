$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$harness = @'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Open Journalist Test</title></head>
<body>
<iframe id="crmFrame" src="../dashboard.html" style="width:1200px; height:800px;"></iframe>
<script>
window.addEventListener('load', () => {
  const iframe = document.getElementById('crmFrame');
  iframe.onload = () => {
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;

      // Force login
      win.currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
      win.localStorage.setItem('rep_auth_user', JSON.stringify(win.currentUser));
      win.document.getElementById('view-login').classList.add('hidden');
      win.document.getElementById('app-container').classList.remove('hidden');
      win.document.getElementById('app-container').classList.add('flex');

      // Switch to journalists
      win.switchView('journalists');

      // Try opening journalist drawer for jour-1
      const jourId = win.localJournalists[0]?.id || 'jour-1';
      console.log('Testing openJournalistDetailDrawer with ID: ' + jourId);
      
      let errorThrown = null;
      try {
        win.openJournalistDetailDrawer(jourId);
      } catch (e) {
        errorThrown = e.message;
        console.error('DRAWER_ERROR: ' + e.message);
      }

      const panel = doc.getElementById('panel-journalist-detail');
      const isVisible = panel && !panel.classList.contains('hidden');
      const nameText = doc.getElementById('jd-name')?.innerText || '';

      document.body.setAttribute('data-test-result', 'VISIBLE:' + isVisible + '|NAME:' + nameText + '|ERROR:' + errorThrown);
    } catch(err) {
      document.body.setAttribute('data-test-result', 'FATAL_ERROR:' + err.message);
    }
  };
});
</script>
</body>
</html>
'@

[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_open_jour_harness.html", $harness, [System.Text.Encoding]::UTF8)

$url = "file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_open_jour_harness.html"
$outFile = "c:\Users\tiago\Desktop\crm-teste\scratch\test_open_jour_out.txt"

cmd /c "`"$chromePath`" --headless=new --dump-dom --disable-gpu --allow-file-access-from-files `"$url`" > `"$outFile`""

Start-Sleep -Milliseconds 600

$stream = [System.IO.FileStream]::new($outFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
$res = $reader.ReadToEnd()
$reader.Close()
$stream.Close()

if ($res -match 'data-test-result="([^"]+)"') {
    Write-Host "TEST RESULT: $($matches[1])"
} else {
    Write-Host "No data-test-result found" -ForegroundColor Yellow
}
