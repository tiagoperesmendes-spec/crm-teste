$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 9640-9685 (handleNewTaskSubmit preparation) ---"
for ($i = 9639; $i -lt [Math]::Min(9685, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
