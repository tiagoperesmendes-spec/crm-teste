$lines = Get-Content dashboard.html
for ($i = 0; $i -lt $lines.Count; $i++) {
    $l = $lines[$i]
    if ($l -match 'id="view-') {
        Write-Output ("Line " + ($i + 1) + ": " + $l.Trim())
    }
}
