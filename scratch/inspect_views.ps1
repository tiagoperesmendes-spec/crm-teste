$lines = Get-Content dashboard.html
for ($i = 0; $i -lt $lines.Count; $i++) {
    $l = $lines[$i]
    if ($l -match 'id="view-tasks"' -or $l -match 'tasks-search-input' -or $l -match 'search-journalists' -or $l -match 'search-outlets' -or $l -match 'id="view-projects"') {
        Write-Output ("Line " + ($i + 1) + ": " + $l.Trim())
    }
}
