$content = Get-Content -Path 'dashboard.html' -Encoding UTF8 -Raw
$hasJour = $content.Contains('DEFAULT_SAMPLE_JOURNALISTS')
Write-Output ("Contains DEFAULT_SAMPLE_JOURNALISTS: " + $hasJour)

$index = $content.IndexOf('const DEFAULT_SAMPLE_JOURNALISTS')
if ($index -ge 0) {
    Write-Output ($content.Substring($index, 300))
} else {
    Write-Output "NOT FOUND"
}
