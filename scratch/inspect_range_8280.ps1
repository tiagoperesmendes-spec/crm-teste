$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 8280-8350 ---"
for ($i = 8279; $i -lt 8350; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
