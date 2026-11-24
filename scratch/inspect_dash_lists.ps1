$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 6765-6850 ---"
for ($i = 6764; $i -lt 6850; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
