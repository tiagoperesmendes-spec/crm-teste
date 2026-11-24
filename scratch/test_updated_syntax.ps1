$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///c:/Users/tiago/Desktop/crm-teste/dashboard.html"
$outFile = "scratch/chrome_out_sidebar.txt"
$errFile = "scratch/chrome_err_sidebar.txt"

$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--no-sandbox", "--disable-gpu", "--dump-dom", "`"$url`"" -NoNewWindow -PassThru -RedirectStandardOutput $outFile -RedirectStandardError $errFile
$proc.WaitForExit(8000)

if (Test-Path $errFile) {
    $errText = [System.IO.File]::ReadAllText($errFile, [System.Text.Encoding]::UTF8)
    Write-Output "Chrome errors length: $($errText.Length)"
    if ($errText.Length -gt 0) {
        Write-Output "Errors: $errText"
    }
}

if (Test-Path $outFile) {
    $outText = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
    Write-Output "Chrome DOM dump length: $($outText.Length)"
    
    $checks = @(
        'id="nav-dashboard"',
        'id="nav-projects"',
        'id="nav-tasks"',
        'id="nav-journalists"',
        'id="nav-outlets"',
        'Bases de Dados',
        'id="sidebar-user-name"',
        'id="sidebar-user-title"',
        'Terminar Sessão'
    )
    foreach ($c in $checks) {
        $has = $outText.Contains($c)
        Write-Output "Contains '$c': $has"
    }

    $removedChecks = @(
        '<span>Contactos</span>',
        '<span>Pitches</span>',
        '<span>Cobertura</span>',
        '# Economia &amp; Negócios',
        '# Tech Lisboa',
        '<span>Relatórios &amp; Taxas</span>'
    )
    foreach ($r in $removedChecks) {
        $has = $outText.Contains($r)
        Write-Output "Still has removed item '$r': $has"
    }
}
