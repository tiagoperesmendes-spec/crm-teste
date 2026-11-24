$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 1895-1970 (view-project-detail markup) ---"
for ($i = 1894; $i -lt [Math]::Min(1970, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
