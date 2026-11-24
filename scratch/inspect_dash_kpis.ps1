$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 6738-6765 ---"
for ($i = 6737; $i -lt 6765; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}

Write-Output "--- Lines 7035-7120 ---"
for ($i = 7034; $i -lt 7120; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
