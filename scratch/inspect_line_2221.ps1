$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 2215; $i -lt [Math]::Min(2230, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}
