$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 7180; $i -lt 7480; $i++) {
    if ($lines[$i] -match 'function toggleTaskStatus') {
        Write-Output "Line $($i+1): $($lines[$i])"
        for ($j = $i; $j -lt [Math]::Min($i+30, $lines.Length); $j++) {
            Write-Output "$($j+1): $($lines[$j])"
        }
        break
    }
}
