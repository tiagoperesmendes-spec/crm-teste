$files = @(
    'scratch/views_markup.html',
    'scratch/drawers_and_modals.html',
    'scratch/drawers_only.html',
    'scratch/modals_only.html',
    'scratch/crm_bases_logic.js',
    'scratch/sample_outlets.js',
    'scratch/sample_journalists.js'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = [System.IO.File]::ReadAllText("$pwd/$f", [System.Text.Encoding]::UTF8)
        $hasMoji = ($content -match 'Ã[¡§£“ªº®¯°±²³´µ¶·¸¹»¼½¾¿Â]')
        Write-Output ($f + " has mojibake: " + $hasMoji)
    }
}
