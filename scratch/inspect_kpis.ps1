$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 6720-6810 (updateKpis) ---"
for ($i = 6719; $i -lt [Math]::Min(6810, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
