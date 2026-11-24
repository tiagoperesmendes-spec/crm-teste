$files = Get-ChildItem -Path supabase -Recurse -File
$emojiPattern = '[\uD83C-\uDBFF\uDC00-\uDFFF]'
$count = 0
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    if ($content -match $emojiPattern) {
        Write-Host "Emoji found in $($f.FullName)"
        $count++
    }
}
Write-Host "Total emojis in supabase: $count"
