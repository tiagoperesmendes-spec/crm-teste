$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 6300; $i -lt [Math]::Min(8500, $lines.Length); $i++) {
    if ($lines[$i] -match 'function\s+([a-zA-Z0-9_]+)\s*\(') {
        Write-Output "Line $($i+1): $($matches[0])"
    }
}
