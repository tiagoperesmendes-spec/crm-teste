$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 3120-3175 (panel-outlet-detail bottom) ---"
for ($i = 3119; $i -lt [Math]::Min(3175, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
