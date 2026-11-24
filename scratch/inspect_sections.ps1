$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

Write-Output "--- Lines 4715-4750 (Tasks sample start) ---"
for ($i = 4714; $i -lt [Math]::Min(4750, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}

Write-Output "--- Lines 4965-5000 (Projects sample start) ---"
for ($i = 4964; $i -lt [Math]::Min(5000, $lines.Length); $i++) {
    Write-Output "$($i+1): $($lines[$i])"
}

Write-Output "--- Where DEFAULT_SAMPLE_PROJECTS ends ---"
for ($i = 4969; $i -lt [Math]::Min(5500, $lines.Length); $i++) {
    if ($lines[$i] -match '^\s*\];') {
        Write-Output "$($i+1): $($lines[$i])"
        break
    }
}
