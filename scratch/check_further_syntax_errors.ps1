$content = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

# Find top-level let and const declarations
# A simple way is to test the script with Chrome headless and trap the SyntaxError
# Let's remove the duplicates in a test file and see if any other error appears!

$modified = $content.Replace("let currentTaskTab = 'all';", "currentTaskTab = 'all';")
$modified = $modified.Replace("let currentTaskGrouping = 'none';", "currentTaskGrouping = 'none';")

# Also check tailwind warning (line 30):
# <script>
#   tailwind.config = { ... }
# </script>
# If tailwind CDN is loaded async or fails, guard it with if (window.tailwind) { ... }

[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_clean_duplicates.html", $modified, [System.Text.Encoding]::UTF8)

# Now inject error trap and test in chrome
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
  const errDiv = document.createElement('div');
  errDiv.id = 'TRAPPED_ERRORS_CLEAN';
  errDiv.innerText = JSON.stringify(window.__ERRORS__ || []);
  document.body.appendChild(errDiv);
});
</script>
'@

$testHtml = $modified.Replace("<head>", "<head>`n" + $errorTrap)
$testHtml = $testHtml.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_clean_trap.html", $testHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outFile = "c:\Users\tiago\Desktop\crm-teste\scratch\test_clean_trap_out.txt"
cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_clean_trap.html > `"$outFile`""

Start-Sleep -Milliseconds 500
$res = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
if ($res -match '(?s)<div id="TRAPPED_ERRORS_CLEAN"[^>]*>(.*?)</div>') {
    Write-Host "CLEAN TRAPPED ERRORS: $($matches[1])"
} else {
    Write-Host "No div found"
}
