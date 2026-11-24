$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 1365-1445 (view-tasks markup) ---"
for ($i = 1364; $i -lt 1445; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}

Write-Output "--- Lines 1442-1520 (view-projects markup start) ---"
for ($i = 1442; $i -lt 1520; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
