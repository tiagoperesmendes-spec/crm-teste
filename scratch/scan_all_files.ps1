$files = Get-ChildItem -Path . -Recurse -File -Include *.html, *.ts, *.tsx, *.sql, *.json, *.js | Where-Object { $_.FullName -notmatch '\\scratch\\' -and $_.FullName -notmatch '\\\.next\\' -and $_.FullName -notmatch '\\node_modules\\' }

$corruptFiles = @()

foreach ($f in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        if ($content -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]') {
            $corruptFiles += $f.FullName
        }
    } catch { }
}

Write-Output ("Total files with mojibake outside scratch: " + $corruptFiles.Count)
$corruptFiles | ForEach-Object { Write-Output " - $_" }
