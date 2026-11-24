$lines = [System.IO.File]::ReadAllLines("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)
$corruptLineNumbers = @()
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
        $corruptLineNumbers += ($i + 1)
    }
}
Write-Output ("Min line: " + ($corruptLineNumbers | Measure-Object -Minimum).Minimum)
Write-Output ("Max line: " + ($corruptLineNumbers | Measure-Object -Maximum).Maximum)
Write-Output ("Total count: " + $corruptLineNumbers.Count)
