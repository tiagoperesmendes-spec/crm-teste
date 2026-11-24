$utf8 = [System.Text.Encoding]::UTF8
$html = [System.IO.File]::ReadAllText("$pwd/dashboard.html", $utf8)

$viewsMarkup = [System.IO.File]::ReadAllText("$pwd/scratch/views_markup.html", $utf8)
$drawers = [System.IO.File]::ReadAllText("$pwd/scratch/drawers_only.html", $utf8)
$modals = [System.IO.File]::ReadAllText("$pwd/scratch/modals_only.html", $utf8)
$logic = [System.IO.File]::ReadAllText("$pwd/scratch/crm_bases_logic.js", $utf8)

# 1. Replace views markup (view-journalists through view-outlets)
$viewsRegex = [regex]'<div id="view-journalists"[\s\S]*?<\/div>\s*<\/div>\s*(?=\s*<!-- ======================================================== -->\s*<!-- VISTA 5: DETALHE DO PROJETO)'
if ($viewsRegex.IsMatch($html)) {
    # Trim viewsMarkup to match div structure
    $cleanViews = $viewsMarkup.Trim()
    $html = $viewsRegex.Replace($html, "$cleanViews`n`n      ", 1)
    Write-Output "Step 1: Views markup replaced."
} else {
    Write-Error "Step 1: Failed to match views markup."
}

# 2. Replace drawers (panel-journalist-detail and panel-outlet-detail)
$drawersRegex = [regex]'<div id="panel-journalist-detail"[\s\S]*?<\/div>\s*<\/div>\s*(?=\s*<!-- ======================================================== -->\s*<!-- MODAL: NOVA TAREFA)'
if ($drawersRegex.IsMatch($html)) {
    $cleanDrawers = $drawers.Trim()
    $html = $drawersRegex.Replace($html, "$cleanDrawers`n`n  ", 1)
    Write-Output "Step 2: Drawers replaced."
} else {
    Write-Error "Step 2: Failed to match drawers."
}

# 3. Replace modals (modal-new-journalist and modal-new-outlet)
$modalsRegex = [regex]'<div id="modal-new-journalist"[\s\S]*?<\/div>\s*<\/div>\s*(?=\s*<!-- ======================================================== -->\s*<!-- MODAL: REGISTAR PEDIDO DE IMPRENSA)'
if ($modalsRegex.IsMatch($html)) {
    $cleanModals = $modals.Trim()
    $html = $modalsRegex.Replace($html, "$cleanModals`n`n  ", 1)
    Write-Output "Step 3: Modals replaced."
} else {
    Write-Error "Step 3: Failed to match modals."
}

# 4. Replace logic (crm_bases_logic.js)
$logicRegex = [regex]'\/\/\s*=+\s*\n\s*\/\/\s*BASE 1 \(OCS\) & BASE 2 \(JORNALISTAS\) - ESTADOS & CONTROLO[\s\S]*?(?=\s*function populateDropdowns\(\))'
if ($logicRegex.IsMatch($html)) {
    $cleanLogic = $logic.Trim()
    $html = $logicRegex.Replace($html, "$cleanLogic`n`n    ", 1)
    Write-Output "Step 4: Logic replaced."
} else {
    Write-Error "Step 4: Failed to match logic."
}

# 5. Fix Supabase fetch guard so it doesn't wipe localJournalists with empty array
$sbJourRegex = [regex]'if \(!error && journalists\) \{\s*localJournalists = journalists;\s*localStorage\.setItem\(''rep_journalists'', JSON\.stringify\(journalists\)\);\s*\}'
$sbJourReplacement = @"
if (!error && journalists && journalists.length > 0) {
            localJournalists = journalists;
            localStorage.setItem('rep_journalists', JSON.stringify(journalists));
          } else if (!localJournalists || localJournalists.length === 0) {
            localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
            localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
          }
"@
if ($sbJourRegex.IsMatch($html)) {
    $html = $sbJourRegex.Replace($html, $sbJourReplacement, 1)
    Write-Output "Step 5a: Fixed Supabase journalists fetch guard."
}

$sbOutletsRegex = [regex]'if \(!error && outlets\) \{\s*localOutlets = outlets;\s*localStorage\.setItem\(''rep_outlets'', JSON\.stringify\(outlets\)\);\s*\}'
$sbOutletsReplacement = @"
if (!error && outlets && outlets.length > 0) {
            localOutlets = outlets;
            localStorage.setItem('rep_outlets', JSON.stringify(outlets));
          } else if (!localOutlets || localOutlets.length === 0) {
            localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
            localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
          }
"@
if ($sbOutletsRegex.IsMatch($html)) {
    $html = $sbOutletsRegex.Replace($html, $sbOutletsReplacement, 1)
    Write-Output "Step 5b: Fixed Supabase outlets fetch guard."
}

[System.IO.File]::WriteAllText("$pwd/scratch/test_fixed.html", $html, $utf8)
Write-Output "Saved scratch/test_fixed.html successfully."
