$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outImg = "c:\Users\tiago\Desktop\crm-teste\scratch\journalist_drawer_screenshot.png"
if (Test-Path $outImg) { Remove-Item -Force $outImg }

$url = "file:///c:/Users/tiago/Desktop/crm-teste/scratch/drawer_screenshot_harness.html"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --screenshot=`"$outImg`" --window-size=1440,900 --virtual-time-budget=3000 --disable-gpu --allow-file-access-from-files `"$url`""

Start-Sleep -Milliseconds 800

if (Test-Path $outImg) {
    Write-Host "SCREENSHOT_SUCCESS: $outImg (Size: $((Get-Item $outImg).Length) bytes)" -ForegroundColor Green
} else {
    Write-Host "SCREENSHOT_FAILED" -ForegroundColor Red
}
