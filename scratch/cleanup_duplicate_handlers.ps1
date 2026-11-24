$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Neutralizar bloco 1: function handleNewJournalistSubmit e function handleNewOutletSubmit
$start1 = 'function handleNewJournalistSubmit(e) {'
$end1 = 'closeOutletModal();'
$idxStart1 = $html.IndexOf($start1)
if ($idxStart1 -gt 0) {
    # encontrar o fim da função handleNewOutletSubmit
    $idxEnd1 = $html.IndexOf($end1, $idxStart1)
    if ($idxEnd1 -gt 0) {
        $idxClose1 = $html.IndexOf('}', $idxEnd1)
        if ($idxClose1 -gt 0) {
            $html = $html.Substring(0, $idxStart1) + "// [legacy sync handleNewJournalistSubmit & handleNewOutletSubmit removed]`n" + $html.Substring($idxClose1 + 1)
            Write-Host "Neutralized first duplicate handlers block."
        }
    }
}

# 2. Neutralizar bloco 2: async function handleNewJournalistSubmit e async function handleNewOutletSubmit
$start2 = 'async function handleNewJournalistSubmit(e) {'
$idxStart2 = $html.IndexOf($start2)
# Atenção: o primeiro é o nosso novo em meios_jornalistas_logic.js! Queremos neutralizar apenas se houver um segundo!
$idxStart2_second = $html.IndexOf($start2, $idxStart2 + 10)
if ($idxStart2_second -gt 0) {
    $idxEnd2 = $html.IndexOf('e.target.reset();', $idxStart2_second)
    if ($idxEnd2 -gt 0) {
        # encontrar o próximo e.target.reset(); que fecha a segunda função
        $idxEnd2_second = $html.IndexOf('e.target.reset();', $idxEnd2 + 10)
        if ($idxEnd2_second -gt 0) {
            $idxClose2 = $html.IndexOf('}', $idxEnd2_second)
            if ($idxClose2 -gt 0) {
                $html = $html.Substring(0, $idxStart2_second) + "// [legacy async handleNewJournalistSubmit & handleNewOutletSubmit removed]`n" + $html.Substring($idxClose2 + 1)
                Write-Host "Neutralized second duplicate handlers block."
            }
        }
    }
}

[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)
Write-Host "Cleaned up duplicate handlers."
