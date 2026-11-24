$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 9000-9070 (showJournalistDetail) ---"
for ($i = 8999; $i -lt [Math]::Min(9070, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}

Write-Output "--- Lines 9155-9230 (showOutletDetail) ---"
for ($i = 9154; $i -lt [Math]::Min(9230, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
