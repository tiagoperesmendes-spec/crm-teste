$filePath = "scratch/test_updated_dashboard.html"
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Replace sample-proj-1 with proj-1
$text = $text.Replace("let activeProjectId = 'sample-proj-1';", "let activeProjectId = 'proj-1';")

# Add openProjectDetail snippet right before saveProjectTitleInline
$snippet = [System.IO.File]::ReadAllText("scratch/open_proj_detail_snippet.js", [System.Text.Encoding]::UTF8)
$target = "    function saveProjectTitleInline(e) {"

if ($text.IndexOf("function openProjectDetail(") -lt 0) {
    $text = $text.Replace($target, $snippet + "`r`n`r`n" + $target)
}

[System.IO.File]::WriteAllText($filePath, $text, [System.Text.Encoding]::UTF8)
Write-Output "Successfully added openProjectDetail snippet and updated activeProjectId!"
