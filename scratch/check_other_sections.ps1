$lines = [System.IO.File]::ReadAllLines("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)
$before1500 = 0
$middle = 0
$after9600 = 0

for ($i = 0; $i -lt $lines.Length; $i++) {
    $lineNum = $i + 1
    if ($lines[$i] -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
        if ($lineNum -lt 1500) { $before1500++ }
        elseif ($lineNum -ge 3700 -and $lineNum -lt 8300) { $middle++ }
        elseif ($lineNum -ge 9600) { $after9600++ }
    }
}

Write-Output "Lines < 1500: $before1500"
Write-Output "Lines 3700-8300: $middle"
Write-Output "Lines >= 9600: $after9600"
