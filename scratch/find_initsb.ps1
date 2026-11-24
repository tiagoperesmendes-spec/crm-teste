$lines = [System.IO.File]::ReadAllLines("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'async function initSupabase\(\)') {
        Write-Output "Line $($i+1): $($lines[$i])"
        for ($j = $i; $j -lt [Math]::Min($i+60, $lines.Length); $j++) {
            Write-Output "$($j+1): $($lines[$j])"
        }
        break
    }
}
