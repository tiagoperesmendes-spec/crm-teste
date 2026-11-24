$dash = [System.IO.File]::ReadAllText('c:\Users\tiago\Desktop\crm-teste\dashboard.html', [System.Text.Encoding]::UTF8)
$start = $dash.IndexOf('const DEFAULT_SAMPLE_JOURNALISTS = [')
$end = $dash.IndexOf('// 3. AUXILIARES DE FORMATAÇÃO E STATUS', $start)
$block = $dash.Substring($start, $end - $start)

$matches = [regex]::Matches($block, "id:\s*'jour-(\d+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?days_inactive:\s*(\d+)[\s\S]*?rgpd_consent:\s*(true|false)")
Write-Host "Found $($matches.Count) journalists matched regex."

$over15 = 0
$noRgpd = 0
foreach ($m in $matches) {
    $id = $m.Groups[1].Value
    $name = $m.Groups[2].Value
    $days = [int]$m.Groups[3].Value
    $rgpd = $m.Groups[4].Value
    if ($days -gt 15) { $over15++ }
    if ($rgpd -eq 'false') { $noRgpd++ }
}
Write-Host "Over 15 days inactive: $over15"
Write-Host "No RGPD consent: $noRgpd"
