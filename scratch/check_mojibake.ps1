$lines = Get-Content -Path 'dashboard.html' -Encoding UTF8
$corruptLines = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[¡§£“šªº]') {
        $corruptLines += [PSCustomObject]@{ LineNumber = ($i + 1); Text = $lines[$i] }
        if ($corruptLines.Count -ge 15) { break }
    }
}
$corruptLines | Format-Table -AutoSize
