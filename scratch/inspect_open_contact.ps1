$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 6620-6640 ---"
for ($i = 6619; $i -lt 6640; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
