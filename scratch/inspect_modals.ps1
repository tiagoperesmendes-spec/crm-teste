$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 3170-3350 (modals in dashboard.html) ---"
for ($i = 3170; $i -lt [Math]::Min(3350, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
