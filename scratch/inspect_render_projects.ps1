$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 7580-7660 (renderFullProjects) ---"
for ($i = 7579; $i -lt [Math]::Min(7660, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
