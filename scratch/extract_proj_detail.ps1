$content = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_all_tabs_harness.html", [System.Text.Encoding]::UTF8)

$startMarker = '<!-- VISTA 5: FICHA DO PROJETO (view-project-detail)          -->'
$endMarker = '<!-- ======================================================== -->'

$idxStart = $content.IndexOf($startMarker)
if ($idxStart -ge 0) {
    # Find the next view comment or end of this view
    $idxNextView = $content.IndexOf('<!-- ======================================================== -->', $idxStart + 50)
    # The view ends just before that
    # Let's extract between idxStart and idxNextView
    $viewHtml = $content.Substring($idxStart, $idxNextView - $idxStart)
    Write-Output "Found view HTML! Length: $($viewHtml.Length)"
    [System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\extracted_view_project_detail.html", $viewHtml, [System.Text.Encoding]::UTF8)
} else {
    Write-Output "startMarker not found"
}
