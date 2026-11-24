$lines = Get-Content "c:\Users\tiago\Desktop\crm-teste\scratch\test_all_tabs_harness.html"

$start = -1
$end = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'id="view-project-detail"') {
        $start = $i - 2
    }
    if ($start -gt 0 -and $i -gt $start + 10 -and $lines[$i] -match 'id="view-') {
        $end = $i - 2
        break
    }
}

Write-Output "Start line: $start, End line: $end"
if ($start -ge 0 -and $end -ge 0) {
    $slice = $lines[$start..$end]
    Write-Output "Slice lines count: $($slice.Count)"
    Write-Output "First line: $($slice[0])"
    Write-Output "Last line: $($slice[-1])"
    [System.IO.File]::WriteAllLines("c:\Users\tiago\Desktop\crm-teste\scratch\extracted_view_project_detail.html", $slice, [System.Text.Encoding]::UTF8)
}
