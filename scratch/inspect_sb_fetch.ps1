$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 4780-4815 ---"
for ($i = 4779; $i -lt 4815; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
