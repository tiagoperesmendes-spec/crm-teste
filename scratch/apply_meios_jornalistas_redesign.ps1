# Script to apply redesign for MEIOS and JORNALISTAS

$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Substituir view-journalists
$newViewJour = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\view_journalists_new.html", [System.Text.Encoding]::UTF8)
$vJourStart = '<div id="view-journalists"'
$vJourEnd = '<!-- ========================================================'
$vJourStartIdx = $html.IndexOf($vJourStart)
$vJourEndIdx = $html.IndexOf($vJourEnd, $vJourStartIdx)

if ($vJourStartIdx -ge 0 -and $vJourEndIdx -gt $vJourStartIdx) {
    $html = $html.Substring(0, $vJourStartIdx) + $newViewJour + "`n`n      " + $html.Substring($vJourEndIdx)
    Write-Host "[1/7] Substituted #view-journalists markup successfully."
} else {
    Write-Error "Could not find boundaries for #view-journalists"
}

# 2. Substituir view-outlets
$newViewOutlets = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\view_outlets_new.html", [System.Text.Encoding]::UTF8)
$vOutStart = '<div id="view-outlets"'
$vOutEnd = '<!-- ========================================================'
$vOutStartIdx = $html.IndexOf($vOutStart)
$vOutEndIdx = $html.IndexOf($vOutEnd, $vOutStartIdx)

if ($vOutStartIdx -ge 0 -and $vOutEndIdx -gt $vOutStartIdx) {
    $html = $html.Substring(0, $vOutStartIdx) + $newViewOutlets + "`n`n      " + $html.Substring($vOutEndIdx)
    Write-Host "[2/7] Substituted #view-outlets markup successfully."
} else {
    Write-Error "Could not find boundaries for #view-outlets"
}

# 3. Substituir modal-new-journalist
$newModalJour = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\modal_new_journalist.html", [System.Text.Encoding]::UTF8)
$mJourStart = '<div id="modal-new-journalist"'
$mJourEnd = '<!-- ========================================================'
$mJourStartIdx = $html.IndexOf($mJourStart)
$mJourEndIdx = $html.IndexOf($mJourEnd, $mJourStartIdx)

if ($mJourStartIdx -ge 0 -and $mJourEndIdx -gt $mJourStartIdx) {
    $html = $html.Substring(0, $mJourStartIdx) + $newModalJour + "`n`n  " + $html.Substring($mJourEndIdx)
    Write-Host "[3/7] Substituted #modal-new-journalist markup successfully."
} else {
    Write-Error "Could not find boundaries for #modal-new-journalist"
}

# 4. Substituir modal-new-outlet
$newModalOut = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\modal_new_outlet.html", [System.Text.Encoding]::UTF8)
$mOutStart = '<div id="modal-new-outlet"'
$mOutEnd = '<!-- ========================================================'
$mOutStartIdx = $html.IndexOf($mOutStart)
$mOutEndIdx = $html.IndexOf($mOutEnd, $mOutStartIdx)

if ($mOutStartIdx -ge 0 -and $mOutEndIdx -gt $mOutStartIdx) {
    $html = $html.Substring(0, $mOutStartIdx) + $newModalOut + "`n`n  " + $html.Substring($mOutEndIdx)
    Write-Host "[4/7] Substituted #modal-new-outlet markup successfully."
} else {
    Write-Error "Could not find boundaries for #modal-new-outlet"
}

# 5. Substituir DEFAULT_SAMPLE_OUTLETS e DEFAULT_SAMPLE_JOURNALISTS
$newOutletsJs = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\sample_outlets_10.js", [System.Text.Encoding]::UTF8)
$newJourJs = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\sample_journalists_20.js", [System.Text.Encoding]::UTF8)

$outletsJsStart = 'const DEFAULT_SAMPLE_OUTLETS = ['
$jourJsEnd = '// 3. AUXILIARES DE FORMATAÇÃO E STATUS'
$oStartIdx = $html.IndexOf($outletsJsStart)
$jEndIdx = $html.IndexOf($jourJsEnd, $oStartIdx)

if ($oStartIdx -ge 0 -and $jEndIdx -gt $oStartIdx) {
    $combinedSamples = $newOutletsJs.Trim() + "`n`n" + $newJourJs.Trim() + "`n`n    "
    $html = $html.Substring(0, $oStartIdx) + $combinedSamples + $html.Substring($jEndIdx)
    Write-Host "[5/7] Substituted sample data for Outlets (10) and Journalists (20) successfully."
} else {
    Write-Error "Could not find boundaries for sample data"
}

# 6. Substituir a lógica antiga de renderização e controlo da Base 1 e Base 2
$newLogicJs = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\scratch\meios_jornalistas_logic.js", [System.Text.Encoding]::UTF8)

$logicStart = 'function filterJournalistsByTab(tab)'
$logicEnd = '// ========================================================`n    // FICHA / GAVETA DO JORNALISTA (BASE 2 -> BASE 1)'
# Alternativa: procurar pelo comentário da gaveta
$gDrawerMarker = '// FICHA / GAVETA DO JORNALISTA'
$lStartIdx = $html.IndexOf($logicStart)
$lEndIdx = $html.IndexOf($gDrawerMarker, $lStartIdx)

# Retroceder até o início do bloco de comentários antes de filterJournalistsByTab
$blockComment = '// 12. FILTRO DE JORNALISTAS (+90 DIAS)'
$bcIdx = $html.LastIndexOf($blockComment, $lStartIdx)
if ($bcIdx -gt 0) {
    $lStartIdx = $html.LastIndexOf('// ==========================================', $bcIdx)
}

if ($lStartIdx -ge 0 -and $lEndIdx -gt $lStartIdx) {
    $html = $html.Substring(0, $lStartIdx) + $newLogicJs + "`n`n    // ========================================================`n    " + $html.Substring($lEndIdx)
    Write-Host "[6/7] Substituted render/filter logic for Journalists and Outlets successfully."
} else {
    Write-Error "Could not find boundaries for logic block"
}

# 7. Neutralizar declarações duplicadas antigas de openJournalistModal / openOutletModal e handles
$oldOpenJourBlock = @'
    function openJournalistModal() {
      if (!currentUserPermissions()?.canCreateJournalists) {
        showToast('Acesso Restrito: O seu perfil não tem autorização para adicionar novos jornalistas.');
        return;
      }
      populateDropdowns();
      document.getElementById('j-date').valueAsDate = new Date();
      document.getElementById('modal-new-journalist').classList.remove('hidden');
      document.getElementById('modal-new-journalist').classList.add('flex');
    }
    function closeJournalistModal() {
      document.getElementById('modal-new-journalist').classList.add('hidden');
      document.getElementById('modal-new-journalist').classList.remove('flex');
    }

    function openOutletModal() {
      if (!currentUserPermissions()?.canCreateOutlets) {
        showToast('Acesso Restrito: O seu perfil não tem autorização para adicionar OCS.');
        return;
      }
      selectedOcsFormats = ['Online'];
      updateFormatButtons();
      document.getElementById('modal-new-outlet').classList.remove('hidden');
      document.getElementById('modal-new-outlet').classList.add('flex');
    }
    function closeOutletModal() {
      document.getElementById('modal-new-outlet').classList.add('hidden');
      document.getElementById('modal-new-outlet').classList.remove('flex');
    }
'@

$normOld = $oldOpenJourBlock -replace "`r`n", "`n"
$html_norm = $html -replace "`r`n", "`n"

if ($html_norm.Contains($normOld)) {
    $html = $html_norm.Replace($normOld, "// [openJournalistModal and openOutletModal moved to unified block]")
    Write-Host "Neutralized duplicate openJournalistModal and openOutletModal definitions."
} else {
    Write-Warning "Could not find exact duplicate openJournalistModal block to neutralize"
}

# Neutralizar funções assíncronas antigas duplicadas em linhas 9128-9220
$oldAsyncSubmit = @'
    async function handleNewJournalistSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('j-name').value.trim();
      const outlet_name = document.getElementById('j-outlet').value;
      const intervention_area = document.getElementById('j-area').value.trim();
      const contact_email = document.getElementById('j-email').value.trim();
      const contact_phone = document.getElementById('j-phone').value.trim();
      const registration_date = document.getElementById('j-date').value || new Date().toISOString().split('T')[0];
      const links = document.getElementById('j-links').value.trim();

      const newJourno = {
        name,
        outlet_name,
        intervention_area,
        contact_email,
        contact_phone,
        registration_date,
        links
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('journalists').insert([newJourno]).select();
          if (!error && data && data[0]) {
            newJourno.id = data[0].id;
          } else {
            newJourno.id = 'j-' + Date.now();
          }
        } catch (err) {
          newJourno.id = 'j-' + Date.now();
        }
      } else {
        newJourno.id = 'j-' + Date.now();
      }

      localJournalists.unshift(newJourno);
      syncLocalStorage();
      closeJournalistModal();
      renderAll();
      showToast('Jornalista adicionado à base.');
      e.target.reset();
    }

    async function handleNewOutletSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('ocs-name').value.trim();
      const media_group = document.getElementById('ocs-group').value.trim();
      const specialty = document.getElementById('ocs-specialty').value.trim();
      const erc_registration = document.getElementById('ocs-erc').value.trim();
      const contact_email = document.getElementById('ocs-email').value.trim();
      const website_url = document.getElementById('ocs-website').value.trim();
      const address = document.getElementById('ocs-address').value.trim();
      const logo_url = document.getElementById('ocs-logo').value.trim();
      const formats = [...selectedOcsFormats];

      const newOcs = {
        name,
        media_group,
        specialty,
        erc_registration,
        contact_email,
        website_url,
        address,
        logo_url,
        formats
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.from('media_outlets').insert([newOcs]).select();
          if (!error && data && data[0]) {
            newOcs.id = data[0].id;
          } else {
            newOcs.id = 'ocs-' + Date.now();
          }
        } catch (err) {
          newOcs.id = 'ocs-' + Date.now();
        }
      } else {
        newOcs.id = 'ocs-' + Date.now();
      }

      localOutlets.unshift(newOcs);
      syncLocalStorage();
      closeOutletModal();
      renderAll();
      showToast('Órgão de comunicação adicionado à base.');
      e.target.reset();
    }
'@

$normAsync = $oldAsyncSubmit -replace "`r`n", "`n"
$html_norm = $html -replace "`r`n", "`n"

if ($html_norm.Contains($normAsync)) {
    $html = $html_norm.Replace($normAsync, "// [handleNewJournalistSubmit and handleNewOutletSubmit moved to unified block]")
    Write-Host "Neutralized duplicate async submit handlers."
} else {
    Write-Warning "Could not find exact duplicate async submit block to neutralize"
}

# 8. Atualizar chaves no fallback para forçar atualização da cache: rep_bases_v9 e rep_outlets_v9
$html = $html -replace "localStorage\.getItem\('rep_bases_v\d+'\)", "localStorage.getItem('rep_bases_v9')"
$html = $html -replace "localStorage\.setItem\('rep_bases_v\d+',\s*'true'\)", "localStorage.setItem('rep_bases_v9', 'true')"
$html = $html -replace "localStorage\.getItem\('rep_outlets_v\d+'\)", "localStorage.getItem('rep_outlets_v9')"
$html = $html -replace "localStorage\.setItem\('rep_outlets_v\d+',\s*'true'\)", "localStorage.setItem('rep_outlets_v9', 'true')"

# 9. No listener de cliques globais, adicionar fecho dos menus popover de jornalistas e meios
$oldClickWin = "if (!e.target.closest('.proj-row-menu-btn') && !e.target.closest('.proj-row-menu-popover')) {`n        closeAllProjectMenus();`n      }"
$newClickWin = @"
      if (!e.target.closest('.proj-row-menu-btn') && !e.target.closest('.proj-row-menu-popover')) {
        closeAllProjectMenus();
      }
      if (!e.target.closest('.jour-row-menu-btn') && !e.target.closest('.jour-row-menu-popover')) {
        closeAllJourMenus();
      }
      if (!e.target.closest('.outlet-row-menu-btn') && !e.target.closest('.outlet-row-menu-popover')) {
        closeAllOutletMenus();
      }
      if (!e.target.closest('#new-jour-outlet-input') && !e.target.closest('#new-jour-outlet-suggestions')) {
        const sugg = document.getElementById('new-jour-outlet-suggestions');
        if (sugg) sugg.classList.add('hidden');
      }
"@

$html_norm = $html -replace "`r`n", "`n"
$normClickOld = $oldClickWin -replace "`r`n", "`n"
$normClickNew = $newClickWin -replace "`r`n", "`n"

if ($html_norm.Contains($normClickOld)) {
    $html = $html_norm.Replace($normClickOld, $normClickNew)
    Write-Host "[7/7] Added global window click dismissals for journalist & outlet menus."
}

# Gravar nos dois ficheiros
[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)

Write-Host "Redesign successfully applied to both dashboard.html and index.html!"
