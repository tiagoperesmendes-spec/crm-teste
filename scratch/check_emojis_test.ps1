$content = [System.IO.File]::ReadAllText("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

# Regex matching Unicode emoji ranges
$emojiRegex = '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF\u2300-\u23FF\u2B50\u200D\uFE0F]'

$matches = [regex]::Matches($content, $emojiRegex)
Write-Output "Emoji matches count in test_updated_dashboard.html: $($matches.Count)"

for ($i = 0; $i -lt [Math]::Min(10, $matches.Count); $i++) {
    Write-Output "Match: $($matches[$i].Value) at index $($matches[$i].Index)"
}
