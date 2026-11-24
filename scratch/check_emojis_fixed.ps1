$content = [System.IO.File]::ReadAllText("$pwd/scratch/test_fixed.html", [System.Text.Encoding]::UTF8)
$emojiRegex = '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]'
$emojiMatches = [regex]::Matches($content, $emojiRegex)
Write-Output ("Total emojis found: " + $emojiMatches.Count)
