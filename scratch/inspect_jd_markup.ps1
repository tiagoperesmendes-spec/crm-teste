$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 2895-2960 (panel-journalist-detail markup) ---"
for ($i = 2894; $i -lt [Math]::Min(2960, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
