$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 8940-9000 (openJournalistDetailDrawer start) ---"
for ($i = 8939; $i -lt [Math]::Min(9000, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
