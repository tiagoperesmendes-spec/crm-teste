$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 10115-10160 ---"
for ($i = 10114; $i -lt [Math]::Min(10160, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
