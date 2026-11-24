$test = Get-Content -Path 'scratch/views_markup.html' -Encoding UTF8 -Raw
Write-Output ("Contains mojibake in source views_markup: " + ($test -match 'Ã[¡§£“]'))
