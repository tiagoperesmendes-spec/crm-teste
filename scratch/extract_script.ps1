$html = Get-Content -Raw -Path 'scratch/test_dashboard.html'
$scriptMatch = [regex]::Match($html, '<script>([\s\S]*?)<\/script>\s*<\/body>')
if ($scriptMatch.Success) {
    Set-Content -Path 'scratch/extracted_script.js' -Value $scriptMatch.Groups[1].Value -Encoding UTF8
    Write-Output ("Extracted script length: " + $scriptMatch.Groups[1].Value.Length)
} else {
    Write-Error "Could not extract main script"
}
