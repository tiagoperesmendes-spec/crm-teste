$files = @("dashboard.html", "index.html", "public/dashboard.html", "public/index.html")

$targetSwitch = @'
      } else if (viewName === 'outlets') {
        document.getElementById('view-outlets').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Meios";
        document.getElementById('page-subtitle').innerText = "Registo de redações, moradas, grupos de media, registo ERC e formatos.";
        renderOutletsTable();
      } else if (viewName === 'communication') {
        document.getElementById('view-communication', 'view-announcements').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Comunicação";
        document.getElementById('page-subtitle').innerText = "Anúncios da direção e chat entre colaboradores.";
        renderCommunicationView();
      } else {
'@

$replacementSwitch = @'
      } else if (viewName === 'outlets') {
        document.getElementById('view-outlets').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Meios";
        document.getElementById('page-subtitle').innerText = "Registo de redações, moradas, grupos de media, registo ERC e formatos.";
        renderOutletsTable();
      } else if (viewName === 'communication') {
        document.getElementById('view-communication').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Comunicação";
        document.getElementById('page-subtitle').innerText = "Chat da equipa em direto com canais temáticos e conversas entre a equipa.";
        renderCommunicationView();
      } else if (viewName === 'announcements') {
        document.getElementById('view-announcements').classList.remove('hidden');
        document.getElementById('page-title').innerText = "Anúncios";
        document.getElementById('page-subtitle').innerText = "Diretivas e comunicados oficiais da direção geral.";
        renderAnnouncementsView();
      } else {
'@

$oldRenderCommTab = @'
      if (currentCommTab === 'chat') {
        renderChatContactsList();
        renderTeamChat();
      } else {
        renderAnnouncementsList();
      }
'@

$newRenderCommTab = @'
      renderChatContactsList();
      renderTeamChat();
'@

$oldSetCommTab = @'
    function setCommTab(tab) {
      currentCommTab = tab;
      const tabAnn = document.getElementById('comm-tab-announcements');
      const tabChat = document.getElementById('comm-tab-chat');
      const secAnn = document.getElementById('comm-content-announcements');
      const secChat = document.getElementById('comm-content-chat');

      if (tab === 'announcements') {
        if (tabAnn) {
          tabAnn.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0";
          const countBadge = tabAnn.querySelector('span:last-child');
          if (countBadge) countBadge.className = "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white";
        }
        if (tabChat) {
          tabChat.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0";
          const countBadge = tabChat.querySelector('span:last-child');
          if (countBadge) countBadge.className = "text-[11px] font-normal text-[#8A8A8A]";
        }
        if (secAnn) secAnn.classList.remove('hidden');
        if (secChat) secChat.classList.add('hidden');
        renderAnnouncementsList();
      } else {
        if (tabChat) {
          tabChat.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-semibold text-[#1A1A1A] border-b-2 border-[#6C1C37] transition-all cursor-pointer shrink-0";
          const countBadge = tabChat.querySelector('span:last-child');
          if (countBadge) countBadge.className = "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6C1C37] text-white";
        }
        if (tabAnn) {
          tabAnn.className = "comm-tab flex items-center gap-2 pb-2.5 -mb-[1px] font-normal text-[#6B6B6B] hover:text-[#1A1A1A] border-b-2 border-transparent transition-all cursor-pointer shrink-0";
          const countBadge = tabAnn.querySelector('span:last-child');
          if (countBadge) countBadge.className = "text-[11px] font-normal text-[#8A8A8A]";
        }
        if (secChat) secChat.classList.remove('hidden');
        if (secAnn) secAnn.classList.add('hidden');
        renderChatContactsList();
        renderTeamChat();
      }
    }
'@

$newSetCommTab = @'
    function setCommTab(tab) {
      if (tab === 'announcements') {
        switchView('announcements');
      } else {
        switchView('communication');
      }
    }
'@

foreach ($file in $files) {
    if (-not (Test-Path $file)) { continue }
    $path = (Resolve-Path $file).Path
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    if ($content.Contains($targetSwitch)) {
        $content = $content.Replace($targetSwitch, $replacementSwitch)
        Write-Output "Updated switchView branch in $file"
    } else {
        Write-Output "targetSwitch not found in $file - trying normalized line endings"
        $normContent = $content -replace "\r\n", "`n"
        $normTarget = $targetSwitch -replace "\r\n", "`n"
        $normRepl = $replacementSwitch -replace "\r\n", "`n"
        if ($normContent.Contains($normTarget)) {
            $normContent = $normContent.Replace($normTarget, $normRepl)
            $content = $normContent -replace "`n", "`r`n"
            Write-Output "Updated switchView branch (normalized) in $file"
        }
    }

    if ($content.Contains($oldRenderCommTab)) {
        $content = $content.Replace($oldRenderCommTab, $newRenderCommTab)
        Write-Output "Updated renderCommunicationView tab branch in $file"
    } else {
        $normContent = $content -replace "\r\n", "`n"
        $normTarget = $oldRenderCommTab -replace "\r\n", "`n"
        $normRepl = $newRenderCommTab -replace "\r\n", "`n"
        if ($normContent.Contains($normTarget)) {
            $normContent = $normContent.Replace($normTarget, $normRepl)
            $content = $normContent -replace "`n", "`r`n"
            Write-Output "Updated renderCommunicationView tab branch (normalized) in $file"
        }
    }

    if ($content.Contains($oldSetCommTab)) {
        $content = $content.Replace($oldSetCommTab, $newSetCommTab)
        Write-Output "Updated setCommTab alias in $file"
    } else {
        $normContent = $content -replace "\r\n", "`n"
        $normTarget = $oldSetCommTab -replace "\r\n", "`n"
        $normRepl = $newSetCommTab -replace "\r\n", "`n"
        if ($normContent.Contains($normTarget)) {
            $normContent = $normContent.Replace($normTarget, $normRepl)
            $content = $normContent -replace "`n", "`r`n"
            Write-Output "Updated setCommTab alias (normalized) in $file"
        }
    }

    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
}
