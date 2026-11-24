$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")

$projDetailMarkup = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\extracted_view_project_detail.html", [System.Text.Encoding]::UTF8)

# Target pattern for the orphaned response and pautas HTML at the end of <main>
$strayHtmlPattern = '(?s)\s*<!-- Eficácia por Colaborador da Agência -->.*?<tbody id="analytics-pending-followup-tbody">.*?</tbody>\s*</table>\s*</div>\s*</div>\s*</div>'

# Pattern for view-projects end to insert view-project-detail
$projEndPattern = '(?s)(<!-- VISTA 3: PROJETOS DE COMUNICAÇÃO.*?</div>\s*</div>\s*</div>)\s*(<!-- =+ -->\s*<!-- VISTA 4: JORNALISTAS)'

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Remove stray "Taxa de Resposta por Colaborador" and "Pautas Sem Resposta (+48h)"
    if ($content -match $strayHtmlPattern) {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $strayHtmlPattern, "")
        Write-Output "Removed stray response and pautas HTML from $file"
    } else {
        Write-Output "Warning: strayHtmlPattern did not match in $file"
    }

    # 2. Insert view-project-detail if not present
    if (-not $content.Contains('id="view-project-detail"')) {
        $replacement = "`$1`r`n`r`n" + $projDetailMarkup.Trim() + "`r`n`r`n`$2"
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $projEndPattern, $replacement)
        Write-Output "Inserted view-project-detail into $file"
    } else {
        Write-Output "view-project-detail already exists in $file"
    }

    # 3. Remove call to renderAnalyticsResponseView() in init
    $content = $content.Replace("renderAnalyticsResponseView();", "// renderAnalyticsResponseView removed")

    # 4. Remove duplicate FICHA DETALHADA DO PROJETO block
    $dupPattern = '(?s)\s*// ========================================================\s*// FICHA DETALHADA DO PROJETO \(view-project-detail\)\s*// ========================================================\s*function switchProjectDetailTab\(tab\) \{.*?function openProjectDetailByName\(name\) \{.*?\}\s*'
    $matches = [System.Text.RegularExpressions.Regex]::Matches($content, $dupPattern)
    if ($matches.Count -gt 1) {
        # Remove the first occurrence
        $firstMatch = $matches[0]
        $content = $content.Remove($firstMatch.Index, $firstMatch.Length)
        Write-Output "Removed duplicate FICHA DETALHADA DO PROJETO block from $file"
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}
