$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    $bad = [regex]::Matches($c, '[\u00C3][\u0080-\u00BF]')
    Write-Host "Mojibake in $f : $($bad.Count)"
}
