$content = [System.IO.File]::ReadAllText("$pwd/dashboard.html", [System.Text.Encoding]::UTF8)

$taskView = $content.Substring(67130, 71393 - 67130)
$projView = $content.Substring(71393, 74888 - 71393)
$projDetail = $content.Substring(104008, 122746 - 104008)

[System.IO.File]::WriteAllText("$pwd/scratch/current_view_tasks.html", $taskView, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("$pwd/scratch/current_view_projects.html", $projView, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("$pwd/scratch/current_view_project_detail.html", $projDetail, [System.Text.Encoding]::UTF8)

Write-Output "Tasks len: $($taskView.Length), Proj len: $($projView.Length), ProjDetail len: $($projDetail.Length)"
