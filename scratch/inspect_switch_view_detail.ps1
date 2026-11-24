$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7185-7210 ---"
for ($i = 7184; $i -lt 7210; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
