$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///c:/Users/tiago/Desktop/crm-teste/dashboard.html"
$outFile = "scratch/chrome_out_table_clean.txt"
$errFile = "scratch/chrome_err_table_clean.txt"

$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--no-sandbox", "--disable-gpu", "--dump-dom", "`"$url`"" -NoNewWindow -PassThru -RedirectStandardOutput $outFile -RedirectStandardError $errFile
$proc.WaitForExit(8000)

if (Test-Path $outFile) {
    $outText = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
    Write-Output "Chrome DOM dump length: $($outText.Length)"
    
    $present = @(
        'id="search-journalists"',
        'id="search-outlets"',
        'Exportar dados',
        '+ Adicionar Jornalista',
        '+ Adicionar Meio'
    )
    foreach ($p in $present) {
        $has = $outText.Contains($p)
        Write-Output "Present '$p': $has"
    }

    $absent = @(
        'id="dropdown-jour-cols"',
        'id="dropdown-outlets-cols"',
        'id="filter-jour-area"',
        'id="filter-ocs-format"',
        'id="sort-icon-jour-name"',
        'id="sort-icon-ocs-name"',
        'Densidade'
    )
    foreach ($a in $absent) {
        $has = $outText.Contains($a)
        Write-Output "Absent '$a' (should be False): $has"
    }
}
