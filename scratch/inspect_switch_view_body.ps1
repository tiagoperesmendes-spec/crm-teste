$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7140-7185 ---"
for ($i = 7139; $i -lt 7185; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
