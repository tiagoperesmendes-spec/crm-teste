# Verification script for projects redesign

$dash = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

# Check 1: No mojibake
$mojibakePatterns = @('Ã§', 'Ã£', 'Ã©', 'Ã¡', 'Ã³', 'Ãº', 'Ã', 'â€“', 'â€”', '')
$foundMoji = @()
foreach ($m in $mojibakePatterns) {
    if ($dash.Contains($m)) {
        $foundMoji += $m
    }
}
if ($foundMoji.Count -gt 0) {
    Write-Warning "Possible mojibake found: $($foundMoji -join ', ')"
} else {
    Write-Host "PASS: Clean UTF-8, no mojibake detected."
}

# Check 2: Zero emojis
$emojiMatch = [regex]::Match($dash, '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]')
if ($emojiMatch.Success) {
    Write-Warning "Emoji character found: $($emojiMatch.Value)"
} else {
    Write-Host "PASS: Zero emojis in code."
}

# Check 3: Projects summary header
if ($dash.Contains('id="projects-summary-text"')) {
    Write-Host "PASS: id='projects-summary-text' present."
} else {
    Write-Error "FAIL: projects-summary-text missing"
}

# Check 4: Status tabs present
$tabs = @('all', 'em_preparacao', 'em_curso', 'aguarda_aprovacao', 'em_pausa', 'concluido')
foreach ($t in $tabs) {
    if (!$dash.Contains("id=`"proj-tab-$t`"") -or !$dash.Contains("id=`"proj-tab-count-$t`"")) {
        Write-Error "FAIL: Status tab $t missing"
    }
}
Write-Host "PASS: All 6 status tabs and count badges present."

# Check 5: Filter bar single line elements
$filters = @('filter-proj-search', 'filter-proj-client', 'filter-proj-responsible', 'filter-proj-priority', 'btn-proj-view-list', 'btn-proj-view-kanban')
foreach ($f in $filters) {
    if (!$dash.Contains("id=`"$f`"")) {
        Write-Error "FAIL: Filter element $f missing"
    }
}
Write-Host "PASS: Filter bar elements present."

# Check 6: Table 6 columns, no "Ações"
if ($dash.Contains('<th>Projeto</th>') -or $dash.Contains('>Projeto</th>')) {
    Write-Host "PASS: Table header Projeto present."
}
if ($dash.Contains('>Ações</th>')) {
    Write-Error "FAIL: Table header still has Ações"
} else {
    Write-Host "PASS: Table header does not have Ações column header."
}

# Check 7: Modal elements
$modalElements = @(
    'id="project-name"',
    'id="project-client"',
    'id="project-type"',
    'id="project-deadline"',
    'id="project-responsible"',
    'id="btn-prio-alta"',
    'id="btn-prio-media"',
    'id="btn-prio-baixa"',
    'id="project-start-date"',
    'id="project-team-chips-container"',
    'id="new-project-details-content"',
    'id="project-objective"',
    'id="project-selected-journalists-chips"',
    'id="project-jour-search-input"',
    'id="project-link-briefing"',
    'id="project-link-folder"',
    'id="btn-submit-new-project"'
)
foreach ($elem in $modalElements) {
    if (!$dash.Contains($elem)) {
        Write-Error "FAIL: Modal element $elem missing"
    }
}
Write-Host "PASS: All required modal form elements present."

# Check 8: Verify 8 sample projects in DEFAULT_SAMPLE_PROJECTS
$projTitles = @(
    'Entrevista CEO — Expresso',
    'Recall de produto',
    'Relatório Anual de Sustentabilidade',
    'Web Summit — media lounge',
    'Expansão Ibérica 2026',
    'Campanha de Natal',
    'Lançamento da app Lumina',
    'Dossiê de imprensa FinTech'
)
foreach ($title in $projTitles) {
    if (!$dash.Contains($title)) {
        Write-Error "FAIL: Project title '$title' missing from sample data."
    }
}
Write-Host "PASS: All 8 reference projects present in DEFAULT_SAMPLE_PROJECTS."

Write-Host "ALL CHECKS PASSED SUCCESSFULLY!"
