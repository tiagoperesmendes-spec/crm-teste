$f = [System.IO.File]::ReadAllText('index.html', [System.Text.Encoding]::UTF8)
$m = [regex]::Matches($f, '[\uD83C-\uDBFF\uDC00-\uDFFF]')
Write-Host "Emoji matches in index.html: $($m.Count)"
