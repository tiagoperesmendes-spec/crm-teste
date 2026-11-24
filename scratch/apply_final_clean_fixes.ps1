$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
    
    # 1. Safe tailwind initialization
    if ($content.Contains("  <script>`r`n    tailwind.config =") -or $content.Contains("  <script>`n    tailwind.config =")) {
        $content = $content.Replace("    tailwind.config =", "    window.tailwind = window.tailwind || {}; tailwind.config =")
    }
    
    # 2. Fix duplicate let declaration in tasks module
    $targetBlock = "    let editingTaskId = null;`r`n    let currentTaskTab = 'all';`r`n    let currentTaskGrouping = 'none';"
    $replacementBlock = "    let editingTaskId = null;`r`n    currentTaskTab = 'all';`r`n    currentTaskGrouping = 'none';"
    
    if (-not $content.Contains($targetBlock)) {
        $targetBlock = "    let editingTaskId = null;`n    let currentTaskTab = 'all';`n    let currentTaskGrouping = 'none';"
        $replacementBlock = "    let editingTaskId = null;`n    currentTaskTab = 'all';`n    currentTaskGrouping = 'none';"
    }
    
    if ($content.Contains($targetBlock)) {
        $content = $content.Replace($targetBlock, $replacementBlock)
        Write-Host "Replaced duplicate let currentTaskTab in $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: target block for duplicate let not found in $file" -ForegroundColor Yellow
    }
    
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
}

# Now take screenshot of dashboard.html directly
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

# Verify with run_trap_errors on actual dashboard.html
$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)
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
  errDiv.id = 'TRAPPED_ERRORS_DASH';
  errDiv.innerText = JSON.stringify(window.__ERRORS__ || []);
  document.body.appendChild(errDiv);
});
</script>
'@

$checkHtml = $dashboardContent.Replace("<head>", "<head>`n" + $errorTrap).Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\check_dash_errors.html", $checkHtml, [System.Text.Encoding]::UTF8)

$outTrap = "c:\Users\tiago\Desktop\crm-teste\scratch\check_dash_errors_out.txt"
cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/check_dash_errors.html > `"$outTrap`""
Start-Sleep -Milliseconds 400

$res = [System.IO.File]::ReadAllText($outTrap, [System.Text.Encoding]::UTF8)
if ($res -match '(?s)<div id="TRAPPED_ERRORS_DASH"[^>]*>(.*?)</div>') {
    Write-Host "DASHBOARD REAL RUNTIME ERRORS: $($matches[1])" -ForegroundColor Cyan
}

# Take screenshot of test_drawer_verified
$outImg = "c:\Users\tiago\Desktop\crm-teste\scratch\screenshot_drawer_open.png"
cmd /c "`"$chromePath`" --headless=new --no-sandbox --screenshot=`"$outImg`" --window-size=1440,900 --virtual-time-budget=2500 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_drawer_verified.html"
Start-Sleep -Milliseconds 600

if (Test-Path $outImg) {
    Write-Host "Screenshot captured successfully: $outImg" -ForegroundColor Green
}
