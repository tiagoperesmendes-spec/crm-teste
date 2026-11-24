$content = Get-Content -Path 'dashboard.html' -Encoding UTF8 -Raw
$idx = $content.IndexOf('function initSupabase')
if ($idx -ge 0) {
    Write-Output ($content.Substring($idx, 1500))
}
