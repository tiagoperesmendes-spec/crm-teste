$lines = [System.IO.File]::ReadAllLines("$pwd/scratch/test_fixed.html", [System.Text.Encoding]::UTF8)
$corruptCount = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
        Write-Output ("Corrupt line " + ($i + 1) + ": " + $lines[$i])
        $corruptCount++
    }
}
Write-Output ("Total corrupt lines: " + $corruptCount)

$hasArrow = $lines | Where-Object { $_.Contains([char]8597) }
Write-Output ("Lines containing ↕: " + $hasArrow.Count)

$divOpen = ([regex]::Matches($lines -join "`n", '<div[\s>]')).Count
$divClose = ([regex]::Matches($lines -join "`n", '</div>')).Count
Write-Output ("div open: $divOpen, div close: $divClose")

$scriptOpen = ([regex]::Matches($lines -join "`n", '<script[\s>]')).Count
$scriptClose = ([regex]::Matches($lines -join "`n", '</script>')).Count
Write-Output ("script open: $scriptOpen, script close: $scriptClose")
