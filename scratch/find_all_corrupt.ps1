$lines = Get-Content -Path 'dashboard.html' -Encoding UTF8
$corruptLines = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
        $corruptLines += [PSCustomObject]@{ LineNumber = ($i + 1); Text = $lines[$i] }
    }
}
Write-Output ("Total corrupt lines found: " + $corruptLines.Count)
$corruptLines | Select-Object -First 30 | Format-Table -AutoSize
