$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# Substituir ocorrências duplicadas subsequentes renomeando para legacy_
$lines = $html -split "`n"
$jourCount = 0
$outletCount = 0

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "(async\s+)?function\s+handleNewJournalistSubmit\(") {
        $jourCount++
        if ($jourCount -gt 1) {
            $lines[$i] = $lines[$i] -replace "handleNewJournalistSubmit", "legacy_handleNewJournalistSubmit_$jourCount"
            Write-Host "Renamed duplicate journalist handler at line $($i+1)"
        }
    }
    if ($lines[$i] -match "(async\s+)?function\s+handleNewOutletSubmit\(") {
        $outletCount++
        if ($outletCount -gt 1) {
            $lines[$i] = $lines[$i] -replace "handleNewOutletSubmit", "legacy_handleNewOutletSubmit_$outletCount"
            Write-Host "Renamed duplicate outlet handler at line $($i+1)"
        }
    }
}

$newHtml = $lines -join "`n"

[System.IO.File]::WriteAllText($dashPath, $newHtml, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $newHtml, [System.Text.Encoding]::UTF8)

Write-Host "Done! Only 1 active handleNewJournalistSubmit and handleNewOutletSubmit exist now."
