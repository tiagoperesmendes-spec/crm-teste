$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 9680-9760 (handleNewTaskSubmit & handleNewProjectSubmit) ---"
for ($i = 9679; $i -lt [Math]::Min(9760, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
