$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

$checks = @(
    # Jornalistas
    @{ Name = "Jornalistas view header"; Pattern = '<h1 class="text-2xl font-bold font-title text-[#1A1A1A]">Jornalistas</h1>' },
    @{ Name = "Jornalistas summary header"; Pattern = 'id="journalists-summary-header"' },
    @{ Name = "Jornalistas tabs (Todos, Inactivos, Sem RGPD)"; Pattern = 'id="tab-jour-inactive15"' },
    @{ Name = "Jornalistas filter single line"; Pattern = 'id="filter-jour-outlet"' },
    @{ Name = "Jornalistas status Só ativos default"; Pattern = '<option value="ativo" selected>Só ativos</option>' },
    @{ Name = "Jornalistas table columns (5 cols)"; Pattern = 'th class="py-3 px-4 text-left font-medium">Último contacto</th>' },
    @{ Name = "Jornalistas pagination"; Pattern = 'id="journalists-pagination-info"' },
    @{ Name = "Modal Novo jornalista title"; Pattern = '<h3 class="text-base font-semibold text-[#1A1A1A] font-title">Novo jornalista</h3>' },
    @{ Name = "Modal Novo jornalista subtitle"; Pattern = 'Só precisas de 3 campos para começar. O resto podes preencher depois.' },
    @{ Name = "Modal Novo jornalista multi-outlet"; Pattern = 'id="new-jour-outlets-box"' },
    @{ Name = "Modal Novo jornalista preference buttons"; Pattern = 'id="new-jour-pref-segmented"' },
    @{ Name = "Modal Novo jornalista footer text"; Pattern = 'O último contacto atualiza-se sozinho quando concluíres uma tarefa de contacto.' },
    
    # Meios
    @{ Name = "Meios view header"; Pattern = '<h1 class="text-2xl font-bold font-title text-[#1A1A1A]">Meios</h1>' },
    @{ Name = "Meios summary header"; Pattern = 'id="outlets-summary-header"' },
    @{ Name = "Meios single-line filter bar"; Pattern = 'id="filter-ocs-include-extinct"' },
    @{ Name = "Meios table columns (6 cols)"; Pattern = 'th class="py-3 px-4 text-left font-medium">Email de agenda</th>' },
    @{ Name = "Meios table column Jornalistas"; Pattern = 'th class="py-3 px-4 text-left font-medium">Jornalistas</th>' },
    @{ Name = "Modal Novo meio title"; Pattern = '<h3 class="text-base font-semibold text-[#1A1A1A] font-title">Novo meio</h3>' },
    @{ Name = "Modal Novo meio subtitle"; Pattern = 'Só precisas de 4 campos para começar. O resto podes preencher depois.' },
    @{ Name = "Modal Novo meio 4 required fields"; Pattern = 'id="new-outlet-name"' },
    @{ Name = "Modal Novo meio formats chips"; Pattern = 'id="new-outlet-formats-chips"' },
    @{ Name = "Modal Novo meio segmented scope"; Pattern = 'id="new-outlet-scope-segmented"' },
    @{ Name = "Modal Novo meio agenda email"; Pattern = 'id="new-outlet-agenda-email"' },
    @{ Name = "Modal Novo meio dynamic missing msg"; Pattern = 'id="new-outlet-missing-msg"' },
    
    # Shared and linking rules
    @{ Name = "Shared areas list"; Pattern = 'let sharedAreasList =' },
    @{ Name = "Filter journalists by outlet function"; Pattern = 'function filterJournalistsByOutlet(' }
)

foreach ($f in $files) {
    Write-Host "=========================================="
    Write-Host "Verifying $f"
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
