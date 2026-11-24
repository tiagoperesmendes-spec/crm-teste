$content = Get-Content -Path 'dashboard.html' -Encoding UTF8 -Raw
$matches = [regex]::Matches($content, 'localJournalists\s*=')
foreach ($m in $matches) {
    $start = [Math]::Max(0, $m.Index - 50)
    $len = [Math]::Min(150, $content.Length - $start)
    Write-Output "--- MATCH AT $($m.Index) ---"
    Write-Output $content.Substring($start, $len)
}
