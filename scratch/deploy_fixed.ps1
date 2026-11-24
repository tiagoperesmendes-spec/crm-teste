$utf8 = [System.Text.Encoding]::UTF8
$fixedContent = [System.IO.File]::ReadAllText("$pwd/scratch/test_fixed.html", $utf8)

[System.IO.File]::WriteAllText("$pwd/dashboard.html", $fixedContent, $utf8)
[System.IO.File]::WriteAllText("$pwd/index.html", $fixedContent, $utf8)

$hash1 = (Get-FileHash 'dashboard.html').Hash
$hash2 = (Get-FileHash 'index.html').Hash

Write-Output ("dashboard.html hash: " + $hash1)
Write-Output ("index.html hash:     " + $hash2)
Write-Output ("Hashes match: " + ($hash1 -eq $hash2))

$lines = [System.IO.File]::ReadAllLines("$pwd/dashboard.html", $utf8)
$corrupt = $lines | Where-Object { $_ -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]' }
Write-Output ("Corrupt lines in deployed dashboard.html: " + $corrupt.Count)
