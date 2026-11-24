$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 9910-9950 (toggleTaskStatus) ---"
for ($i = 9909; $i -lt [Math]::Min(9950, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
