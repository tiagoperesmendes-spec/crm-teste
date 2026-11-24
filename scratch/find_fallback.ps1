$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function loadFromLocalStorageFallback\(\)') {
        Write-Output "Line $($i+1): $($lines[$i])"
        for ($j = $i; $j -lt [Math]::Min($i+35, $lines.Length); $j++) {
            Write-Output "$($j+1): $($lines[$j])"
        }
        break
    }
}
