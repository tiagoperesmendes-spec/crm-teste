$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 1190-1250 ---"
for ($i = 1189; $i -lt 1250; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
