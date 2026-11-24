$lines = Get-Content -Path 'dashboard.html' -Encoding UTF8
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function renderAll\(') {
        for ($j = $i; $j -lt [Math]::Min($i + 35, $lines.Length); $j++) {
            Write-Output "$($j + 1): $($lines[$j])"
        }
        break
    }
}
