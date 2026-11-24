$files = @(
    'scratch/views_markup.html',
    'scratch/drawers_only.html',
    'scratch/modals_only.html',
    'scratch/crm_bases_logic.js',
    'scratch/sample_outlets.js',
    'scratch/sample_journalists.js'
)

foreach ($f in $files) {
    $t = Get-Content -Path $f -Encoding UTF8 -Raw
    $hasMoji = ($t -match 'Ã[¡§£“]')
    Write-Output ($f + " has mojibake: " + $hasMoji)
}
