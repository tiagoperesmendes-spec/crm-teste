$lines = [System.IO.File]::ReadAllLines("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
        Write-Output ("Line " + ($i + 1) + ": " + $lines[$i].Trim())
    }
}
