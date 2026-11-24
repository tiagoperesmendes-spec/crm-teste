# Build updated dashboard.html
$original = Get-Content -Raw -Path 'dashboard.html'
$viewsMarkup = Get-Content -Raw -Path 'scratch/views_markup.html'
$drawers = Get-Content -Raw -Path 'scratch/drawers_only.html'
$modals = Get-Content -Raw -Path 'scratch/modals_only.html'
$sampleOutlets = Get-Content -Raw -Path 'scratch/sample_outlets.js'
$sampleJournalists = Get-Content -Raw -Path 'scratch/sample_journalists.js'
$logic = Get-Content -Raw -Path 'scratch/crm_bases_logic.js'

$updated = $original

# 1. Replace views markup (view-journalists and view-outlets)
$viewsPattern = '<!-- ======================================================== -->\s*<!-- VISTA 4: BASE DE JORNALISTAS \(CRM\)[\s\S]*?(?=\s*<!-- ======================================================== -->\s*<!-- VISTA 5: DETALHE DO PROJETO)'
if ($updated -match $viewsPattern) {
    $updated = [regex]::Replace($updated, $viewsPattern, $viewsMarkup)
    Write-Output "Step 1: Replaced views markup successfully."
} else {
    Write-Error "Step 1 Failed: Could not match views markup."
}

# 2. Insert drawers before MODAL: NOVA TAREFA
$drawerAnchor = '(?=<!-- ======================================================== -->\s*<!-- MODAL: NOVA TAREFA)'
if ($updated -match $drawerAnchor) {
    $updated = [regex]::Replace($updated, $drawerAnchor, ($drawers + "`n`n  "))
    Write-Output "Step 2: Inserted drawers successfully."
} else {
    Write-Error "Step 2 Failed: Could not match drawer anchor."
}

# 3. Replace old modals for journalist and outlet
$modalPattern = '<!-- ======================================================== -->\s*<!-- MODAL: ADICIONAR JORNALISTA[\s\S]*?(?=\s*<!-- ======================================================== -->\s*<!-- MODAL: REGISTAR PEDIDO DE IMPRENSA)'
if ($updated -match $modalPattern) {
    $updated = [regex]::Replace($updated, $modalPattern, ($modals + "`n`n  "))
    Write-Output "Step 3: Replaced modals successfully."
} else {
    Write-Error "Step 3 Failed: Could not match old modals."
}

# 4. Insert DEFAULT_SAMPLE_OUTLETS and DEFAULT_SAMPLE_JOURNALISTS
$clippingsPattern = '(const DEFAULT_SAMPLE_CLIPPINGS = \[[\s\S]*?\n    \];)'
if ($updated -match $clippingsPattern) {
    $mockAddition = "`n`n    " + $sampleOutlets + "`n`n    " + $sampleJournalists
    $updated = [regex]::Replace($updated, $clippingsPattern, ('$1' + $mockAddition))
    Write-Output "Step 4: Added sample outlets and journalists data successfully."
} else {
    Write-Error "Step 4 Failed: Could not match DEFAULT_SAMPLE_CLIPPINGS."
}

# 5. Update loadFromLocalStorageFallback
$storagePattern = '(if \(!localClippings \|\| localClippings\.length === 0\) \{\s*localClippings = \[\.\.\.DEFAULT_SAMPLE_CLIPPINGS\];\s*\})'
$storageReplacement = '$1' + @"

      if (!localJournalists || localJournalists.length === 0 || localStorage.getItem('rep_bases_v2') !== 'true') {
        localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
        localStorage.setItem('rep_bases_v2', 'true');
        localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
      }
      if (!localOutlets || localOutlets.length === 0 || localStorage.getItem('rep_outlets_v2') !== 'true') {
        localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
        localStorage.setItem('rep_outlets_v2', 'true');
        localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
      }
"@

if ($updated -match $storagePattern) {
    $updated = [regex]::Replace($updated, $storagePattern, $storageReplacement)
    Write-Output "Step 5: Updated loadFromLocalStorageFallback successfully."
} else {
    Write-Error "Step 5 Failed: Could not match storage pattern."
}

# 6. Replace old renderJournalistsTable and renderOutletsTable with new crm_bases_logic.js
$logicPattern = 'function renderJournalistsTable\(\) \{[\s\S]*?function filterJournalistsTable\(\) \{[\s\S]*?\n    \}'
if ($updated -match $logicPattern) {
    $updated = [regex]::Replace($updated, $logicPattern, $logic)
    Write-Output "Step 6: Replaced table rendering logic successfully."
} else {
    Write-Error "Step 6 Failed: Could not match logic pattern."
}

# Write to test file first
Set-Content -Path 'scratch/test_dashboard.html' -Value $updated -Encoding UTF8
Write-Output "Saved scratch/test_dashboard.html, length: $($updated.Length)"
