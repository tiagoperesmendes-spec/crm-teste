$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")

$projDetailMarkup = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\extracted_view_project_detail.html", [System.Text.Encoding]::UTF8)

$target = @'
        <!-- Vista Quadro (Kanban por Estado) -->
        <div id="projects-kanban-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <!-- 5 Colunas geradas dinamicamente -->
        </div>
      </div>
'@

$replacement = @"
        <!-- Vista Quadro (Kanban por Estado) -->
        <div id="projects-kanban-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <!-- 5 Colunas geradas dinamicamente -->
        </div>
      </div>

$($projDetailMarkup.Trim())
"@

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    if ($content.Contains($target)) {
        $content = $content.Replace($target, $replacement)
        Write-Output "Successfully inserted view-project-detail into $file"
        [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    } else {
        Write-Output "Target not found in $file - trying normalized line endings"
        $normContent = $content -replace "\r\n", "`n"
        $normTarget = $target -replace "\r\n", "`n"
        $normRepl = $replacement -replace "\r\n", "`n"
        if ($normContent.Contains($normTarget)) {
            $normContent = $normContent.Replace($normTarget, $normRepl)
            $content = $normContent -replace "`n", "`r`n"
            Write-Output "Successfully inserted view-project-detail (normalized) into $file"
            [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        }
    }
}
