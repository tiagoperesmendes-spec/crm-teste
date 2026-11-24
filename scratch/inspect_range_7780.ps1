$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7780-7895 ---"
for ($i = 7779; $i -lt 7895; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
