$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7710-7800 (renderProjectDetail) ---"
for ($i = 7709; $i -lt [Math]::Min(7800, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
