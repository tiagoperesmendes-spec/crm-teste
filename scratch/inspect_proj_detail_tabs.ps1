$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 1971-2100 (view-project-detail tabs & content) ---"
for ($i = 1970; $i -lt [Math]::Min(2100, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
