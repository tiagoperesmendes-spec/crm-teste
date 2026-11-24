$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7800-7875 (renderProjectDetail continued) ---"
for ($i = 7799; $i -lt [Math]::Min(7875, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
