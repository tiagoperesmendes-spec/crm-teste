$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 2960-3035 (panel-journalist-detail bottom) ---"
for ($i = 2959; $i -lt [Math]::Min(3035, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
