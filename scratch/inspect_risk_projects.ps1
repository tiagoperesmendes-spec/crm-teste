$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 6850-6920 ---"
for ($i = 6849; $i -lt 6920; $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
