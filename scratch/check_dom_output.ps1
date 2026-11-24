$domFile = "scratch/dash_dom_out.html"
$errFile = "scratch/dash_dom_err.txt"

if (Test-Path $errFile) {
    $errText = [System.IO.File]::ReadAllText($errFile, [System.Text.Encoding]::UTF8)
    Write-Output "Errors file length: $($errText.Length)"
    if ($errText.Length -gt 0) {
        Write-Output "Error snippet: $($errText.Substring(0, [Math]::Min(300, $errText.Length)))"
    }
}

if (Test-Path $domFile) {
    $domText = [System.IO.File]::ReadAllText($domFile, [System.Text.Encoding]::UTF8)
    Write-Output "DOM out length: $($domText.Length)"
    
    $checks = @(
        "Expansão Ibérica 2026",
        "Pauta Sustentabilidade",
        "Holdings SA",
        "BioFarma",
        "Contactar Rui Almeida sobre fecho de caderno",
        "Enviar minuta de resultados",
        "Revisão jurídica do comunicado",
        "dash-card-open-projects",
        "dash-card-week-deliveries",
        "dash-card-waiting-client",
        "dash-card-contacts-today"
    )

    foreach ($c in $checks) {
        $found = $domText.Contains($c)
        Write-Output "Check '$c': $found"
    }
}
