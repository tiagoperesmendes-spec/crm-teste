$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 6425-6500 (Dashboard Greeting & Today Tasks) ---"
for ($i = 6424; $i -lt [Math]::Min(6500, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
