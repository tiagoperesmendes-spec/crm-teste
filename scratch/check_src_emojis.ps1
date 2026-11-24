$files = Get-ChildItem -Path 'src' -Recurse -File -Include *.ts, *.tsx
$emojiRegex = '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]'
$totalEmojis = 0
foreach ($f in $files) {
    $text = Get-Content -Raw -Path $f.FullName
    $m = [regex]::Matches($text, $emojiRegex)
    if ($m.Count -gt 0) {
        Write-Output ($f.Name + ': ' + $m.Count + ' emojis')
        $totalEmojis += $m.Count
    }
}
Write-Output ("Total emojis in src: " + $totalEmojis)
