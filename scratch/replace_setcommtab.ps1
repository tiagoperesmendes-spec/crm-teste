$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")

$setCommTabRegex = '(?s)function setCommTab\(tab\)\s*\{.*?renderTeamChat\(\);\s*\}\s*\}'
$newSetCommTab = @'
function setCommTab(tab) {
      if (tab === 'announcements') {
        switchView('announcements');
      } else {
        switchView('communication');
      }
    }
'@

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    if ($content -match $setCommTabRegex) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $setCommTabRegex, $newSetCommTab.Trim())
        Write-Output "Replaced setCommTab in $file"
        [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    } else {
        Write-Output "Regex did not match in $file"
    }
}
