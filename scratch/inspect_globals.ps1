$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 3955-4000 ---"
for ($i = 3954; $i -lt 4000; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
