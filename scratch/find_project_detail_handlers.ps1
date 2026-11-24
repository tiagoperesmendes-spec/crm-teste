$html = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

# Extract view-project-detail HTML block
$startIdx = $html.IndexOf('id="view-project-detail"')
$endIdx = $html.IndexOf('id="view-clipping"', $startIdx)
if ($endIdx -lt 0) { $endIdx = $html.IndexOf('<!-- VISTA', $startIdx + 100) }
$viewHtml = $html.Substring($startIdx, $endIdx - $startIdx)

# Find all handler calls
$pattern = '(onclick|onchange|onblur)="([^"(]+)'
$matches = [regex]::Matches($viewHtml, $pattern)
$fns = @()
foreach ($m in $matches) {
    $fnName = $m.Groups[2].Value.Trim()
    if ($fnName -and -not ($fns -contains $fnName)) {
        $fns += $fnName
    }
}

Write-Host "Functions referenced in view-project-detail HTML:"
foreach ($fn in $fns) {
    $isDef = $html.Contains("function $fn") -or $html.Contains("$fn =")
    if ($isDef) {
        Write-Host "  [OK] $fn" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $fn" -ForegroundColor Red
    }
}
