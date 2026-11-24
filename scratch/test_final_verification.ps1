$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

$checks = @(
    @{ Name = "CSS no-slashed-zero"; Pattern = 'font-variant-numeric: normal no-slashed-zero !important;' },
    @{ Name = "Sidebar sticky top-0"; Pattern = 'md:sticky md:top-0 md:h-screen' },
    @{ Name = "User card shrink-0 mt-auto"; Pattern = 'pt-4 border-t border-[#E4DDD3] shrink-0 mt-auto' },
    @{ Name = "Badge without font-mono"; Pattern = 'id="sidebar-projects-count"' },
    @{ Name = "Tiago Mendes account"; Pattern = 'tiagoperesmendes@gmail.com' },
    @{ Name = "Tiago password Direcao2026!"; Pattern = 'Direcao2026!' },
    @{ Name = "Leonor account"; Pattern = 'leonor.rp.faculdade@gmail.com' },
    @{ Name = "Leonor password Modo2026!"; Pattern = 'Modo2026!' },
    @{ Name = "Convidado account"; Pattern = 'tiagoperesmendesps4@gmail.com' },
    @{ Name = "Convidado password Convidado2026!"; Pattern = 'Convidado2026!' },
    @{ Name = "Delete journalist row button"; Pattern = 'deleteJournalist(' },
    @{ Name = "Delete outlet row button"; Pattern = 'deleteOutlet(' },
    @{ Name = "Drawer delete journalist button"; Pattern = 'id="jd-btn-delete"' },
    @{ Name = "Drawer delete outlet button"; Pattern = 'id="od-btn-delete"' },
    @{ Name = "Login quick account selector"; Pattern = 'Contas de Acesso Disponíveis:' }
)

foreach ($f in $files) {
    Write-Host "=========================================="
    Write-Host "Testing $f"
    Write-Host "=========================================="
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    $allPassed = $true

    foreach ($chk in $checks) {
        $found = $text.Contains($chk.Pattern)
        if ($found) {
            Write-Host "  [PASS] $($chk.Name)" -ForegroundColor Green
        } else {
            Write-Host "  [FAIL] $($chk.Name) (pattern: $($chk.Pattern))" -ForegroundColor Red
            $allPassed = $false
        }
    }

    if ($allPassed) {
        Write-Host "ALL CHECKS PASSED FOR $f!" -ForegroundColor Cyan
    } else {
        Write-Host "SOME CHECKS FAILED FOR $f" -ForegroundColor Yellow
    }
}
