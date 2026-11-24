$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Substituir o bloco de lógica completo com meios_jornalistas_logic.js
$newLogic = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\meios_jornalistas_logic.js", [System.Text.Encoding]::UTF8)

$startBlock = '// MEIOS E JORNALISTAS - REDESIGN E REGRAS DE NEGÓCIO'
$endBlock = '// FICHA / GAVETA DO JORNALISTA'

$sIdx = $html.IndexOf($startBlock)
if ($sIdx -gt 0) {
    # Retroceder até o início dos comentários do bloco
    $prevComment = $html.LastIndexOf('// ========================================================', $sIdx)
    if ($prevComment -gt 0) { $sIdx = $prevComment }
}
$eIdx = $html.IndexOf($endBlock, $sIdx)
if ($eIdx -gt 0) {
    $prevDrawerComment = $html.LastIndexOf('// ========================================================', $eIdx)
    if ($prevDrawerComment -gt 0) { $eIdx = $prevDrawerComment }
}

if ($sIdx -gt 0 -and $eIdx -gt $sIdx) {
    $html = $html.Substring(0, $sIdx) + $newLogic.Trim() + "`n`n    " + $html.Substring($eIdx)
    Write-Host "Replaced logic block cleanly with full meios_jornalistas_logic.js!"
} else {
    Write-Error "Could not find start/end for logic block ($sIdx, $eIdx)"
}

# 2. Remover blocos legados no final do ficheiro
# Bloco legado 1: function handleNewJournalistSubmit(e)
$legacy1Start = 'function handleNewJournalistSubmit(e) {'
$l1Idx = $html.IndexOf($legacy1Start)
if ($l1Idx -gt 0) {
    # Procurar o fim de handleNewOutletSubmit
    $l1EndMarker = "showToast(`Órgão ${name} adicionado com sucesso.`);"
    $l1EndIdx = $html.IndexOf($l1EndMarker, $l1Idx)
    if ($l1EndIdx -gt 0) {
        $l1Close = $html.IndexOf('}', $l1EndIdx)
        if ($l1Close -gt 0) {
            $html = $html.Substring(0, $l1Idx) + "// [legacy sync handlers removed]`n" + $html.Substring($l1Close + 1)
            Write-Host "Removed legacy block 1 (sync submit handlers)."
        }
    }
}

# Bloco legado 2: async function handleNewJournalistSubmit(e)
# Deve ser posterior ao nosso novo bloco (procurar depois do índice da ficha do jornalista)
$drawerIdx = $html.IndexOf('// FICHA / GAVETA DO JORNALISTA')
$legacy2Start = 'async function handleNewJournalistSubmit(e) {'
$l2Idx = $html.IndexOf($legacy2Start, $drawerIdx)
if ($l2Idx -gt 0) {
    $l2EndMarker = "showToast('Órgão de comunicação adicionado à base.');"
    $l2EndIdx = $html.IndexOf($l2EndMarker, $l2Idx)
    if ($l2EndIdx -gt 0) {
        $l2Reset = $html.IndexOf('e.target.reset();', $l2EndIdx)
        if ($l2Reset -gt 0) {
            $l2Close = $html.IndexOf('}', $l2Reset)
            if ($l2Close -gt 0) {
                $html = $html.Substring(0, $l2Idx) + "// [legacy async handlers removed]`n" + $html.Substring($l2Close + 1)
                Write-Host "Removed legacy block 2 (async submit handlers)."
            }
        }
    }
}

# 3. Assegurar chaves de fallback para forçar recarga dos dados corretos
$html = $html -replace "localStorage\.getItem\('rep_bases_v\d+'\)", "localStorage.getItem('rep_bases_v9')"
$html = $html -replace "localStorage\.setItem\('rep_bases_v\d+',\s*'true'\)", "localStorage.setItem('rep_bases_v9', 'true')"
$html = $html -replace "localStorage\.getItem\('rep_outlets_v\d+'\)", "localStorage.getItem('rep_outlets_v9')"
$html = $html -replace "localStorage\.setItem\('rep_outlets_v\d+',\s*'true'\)", "localStorage.setItem('rep_outlets_v9', 'true')"

# Gravar nos dois ficheiros
[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)

Write-Host "Both dashboard.html and index.html successfully updated and finalized!"
