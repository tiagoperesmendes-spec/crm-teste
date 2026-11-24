# Check emojis and syntax in test_dashboard.html
$content = Get-Content -Raw -Path 'scratch/test_dashboard.html'

# Regex for emojis (standard Unicode emoji ranges)
$emojiRegex = '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]'
$emojiMatches = [regex]::Matches($content, $emojiRegex)

Write-Output ("Emoji count found: " + $emojiMatches.Count)
if ($emojiMatches.Count -gt 0) {
    foreach ($m in $emojiMatches | Select-Object -First 5) {
        Write-Output ("Emoji match at index " + $m.Index + ": " + $m.Value)
    }
}

# Check tag counts
$divOpen = ([regex]::Matches($content, '<div[\s>]')).Count
$divClose = ([regex]::Matches($content, '</div>')).Count
Write-Output ("div open: $divOpen, div close: $divClose")

$scriptOpen = ([regex]::Matches($content, '<script[\s>]')).Count
$scriptClose = ([regex]::Matches($content, '</script>')).Count
Write-Output ("script open: $scriptOpen, script close: $scriptClose")
