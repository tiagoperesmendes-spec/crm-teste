$content = Get-Content -Path 'dashboard.html' -Encoding UTF8 -Raw
$idx = $content.IndexOf('function loadFromLocalStorageFallback')
if ($idx -ge 0) {
    Write-Output ($content.Substring($idx, 2000))
}
