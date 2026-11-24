$lines = [System.IO.File]::ReadAllLines('dashboard.html', [System.Text.Encoding]::UTF8)
$corrupt = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[ƒÂ]') {
        $corrupt++
        if ($corrupt -le 5) {
            Write-Output ("Line " + ($i+1) + ": " + $lines[$i])
        }
    }
}
Write-Output ("Corrupt matches: " + $corrupt)
