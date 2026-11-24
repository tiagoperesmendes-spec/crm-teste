$lines = [System.IO.File]::ReadAllLines("dashboard.html", [System.Text.Encoding]::UTF8)

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'panel-journalist-detail|panel-outlet-detail|function showJournalistDetail|function showOutletDetail') {
        Write-Output "Line $($i+1): $($lines[$i].Trim())"
    }
}
