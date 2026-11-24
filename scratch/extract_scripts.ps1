$html = [System.IO.File]::ReadAllText("scratch/test_updated_dashboard.html", [System.Text.Encoding]::UTF8)

# Find all script blocks
$pattern = "(?s)<script(?:\s+[^>]*)?>(.*?)</script>"
$matches = [regex]::Matches($html, $pattern)
Write-Output "Found $($matches.Count) script tags."

$index = 1
foreach ($m in $matches) {
    $scriptContent = $m.Groups[1].Value
    $testFile = "scratch/test_script_$index.js"
    [System.IO.File]::WriteAllText($testFile, $scriptContent, [System.Text.Encoding]::UTF8)
    Write-Output "Script $index length: $($scriptContent.Length) chars, saved to $testFile"
    $index++
}
