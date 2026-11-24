$html = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

# Inject window.onerror at the very top of <head>
$errorTrap = @'
  <script>
    window.__ERRORS__ = [];
    window.onerror = function(msg, url, line, col, err) {
      window.__ERRORS__.push({ msg: msg, line: line, col: col });
      console.error("PAGE_ERROR:", msg, "at line", line, col);
    };
  </script>
'@

$testScript = @'
<script>
window.addEventListener('load', () => {
  const errDiv = document.createElement('div');
  errDiv.id = 'TRAPPED_ERRORS';
  errDiv.innerText = JSON.stringify(window.__ERRORS__ || []);
  document.body.appendChild(errDiv);
});
</script>
'@

$modified = $html.Replace("<head>", "<head>`n" + $errorTrap)
$modified = $modified.Replace("</body>", $testScript + "`n</body>")

[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_trap_errors.html", $modified, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outFile = "c:\Users\tiago\Desktop\crm-teste\scratch\test_trap_errors_out.txt"
cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_trap_errors.html > `"$outFile`""

Start-Sleep -Milliseconds 500
$content = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
if ($content -match '(?s)<div id="TRAPPED_ERRORS"[^>]*>(.*?)</div>') {
    Write-Host "TRAPPED ERRORS: $($matches[1])"
} else {
    Write-Host "No TRAPPED_ERRORS div found"
}
