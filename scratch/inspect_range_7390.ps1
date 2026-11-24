$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7390-7420 ---"
for ($i = 7389; $i -lt 7420; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}

Write-Output "--- Lines 8240-8280 ---"
for ($i = 8239; $i -lt 8280; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
