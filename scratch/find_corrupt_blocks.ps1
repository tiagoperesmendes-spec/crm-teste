$lines = [System.IO.File]::ReadAllLines("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)
$blocks = @()
$currentBlockStart = -1
$currentBlockEnd = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
        if ($currentBlockStart -eq -1) {
            $currentBlockStart = $i + 1
        }
        $currentBlockEnd = $i + 1
    } else {
        if ($currentBlockStart -ne -1) {
            $blocks += [PSCustomObject]@{ Start = $currentBlockStart; End = $currentBlockEnd; Count = ($currentBlockEnd - $currentBlockStart + 1) }
            $currentBlockStart = -1
            $currentBlockEnd = -1
        }
    }
}
if ($currentBlockStart -ne -1) {
    $blocks += [PSCustomObject]@{ Start = $currentBlockStart; End = $currentBlockEnd; Count = ($currentBlockEnd - $currentBlockStart + 1) }
}

$blocks | Format-Table -AutoSize
