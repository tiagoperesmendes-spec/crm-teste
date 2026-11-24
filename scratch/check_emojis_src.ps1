$files = Get-ChildItem -Path "src", "supabase" -Recurse -Include *.ts, *.tsx, *.sql, *.css -ErrorAction SilentlyContinue
$totalEmojis = 0
foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $matches = [regex]::Matches($text, '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]')
    if ($matches.Count -gt 0) {
        Write-Output "Emoji found in $($f.FullName): $($matches.Count)"
        $totalEmojis += $matches.Count
    }
}
Write-Output "Total emojis found: $totalEmojis"
