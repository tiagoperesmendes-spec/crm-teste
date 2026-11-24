$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7085-7160 (renderFullTasks) ---"
for ($i = 7084; $i -lt [Math]::Min(7160, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
