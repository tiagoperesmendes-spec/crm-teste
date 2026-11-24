$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
window.__ERRORS__ = [];
window.addEventListener('error', (e) => { window.__ERRORS__.push(e.message); });

window.addEventListener('load', () => {
  try {
    const results = {};

    // 1. Iniciar sessão como Diretor (Tiago Mendes)
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');

    // 2. Testar Navegação para Comunicação (Chat)
    switchView('communication');
    const viewComm = document.getElementById('view-communication');
    const viewAnn = document.getElementById('view-announcements');
    const navComm = document.getElementById('nav-communication');
    const navAnn = document.getElementById('nav-announcements');

    results.viewCommVisible = viewComm && !viewComm.classList.contains('hidden');
    results.viewAnnHiddenWhenComm = viewAnn && viewAnn.classList.contains('hidden');
    results.navCommActive = navComm && navComm.className.includes('bg-white');

    // Chat Contacts & Feed
    const contactsList = document.getElementById('chat-contacts-list');
    results.chatContactsCount = contactsList ? contactsList.children.length : 0;
    const msgBox = document.getElementById('team-chat-messages');
    results.chatMessagesCount = msgBox ? msgBox.querySelectorAll('.group').length : 0;

    // Test send message in chat
    const chatInput = document.getElementById('team-chat-input');
    if (chatInput) chatInput.value = 'Mensagem de teste da Direcao no chat geral';
    sendChatMessage();
    results.chatMessagesAfterSend = msgBox ? msgBox.querySelectorAll('.group').length : 0;

    // 3. Testar Navegação para Anúncios
    switchView('announcements');
    results.viewAnnVisible = viewAnn && !viewAnn.classList.contains('hidden');
    results.viewCommHiddenWhenAnn = viewComm && viewComm.classList.contains('hidden');
    results.navAnnActive = navAnn && navAnn.className.includes('bg-white');

    // Announcements Feed
    const annFeed = document.getElementById('announcements-feed-container');
    results.announcementsCardsCount = annFeed ? annFeed.children.length : 0;

    // Director modal button
    const btnNewAnn = document.getElementById('btn-open-announcement-modal');
    results.btnNewAnnVisibleForDirector = btnNewAnn && btnNewAnn.style.display !== 'none';

    // Test open and close announcement modal
    openAnnouncementModal();
    const modalAnn = document.getElementById('modal-announcement');
    results.modalAnnOpened = modalAnn && !modalAnn.classList.contains('hidden');
    closeAnnouncementModal();
    results.modalAnnClosed = modalAnn && modalAnn.classList.contains('hidden');

    // 4. Sidebar Badges
    const badgeComm = document.getElementById('sidebar-comm-count');
    const badgeAnn = document.getElementById('sidebar-announcements-count');
    results.badgeCommValue = badgeComm ? badgeComm.innerText : null;
    results.badgeAnnValue = badgeAnn ? badgeAnn.innerText : null;

    // 5. Test Technician role permissions
    currentUser = { email: 'leonor.rp.faculdade@gmail.com', name: 'Leonor Rodrigues', user_metadata: { role: 'tech' } };
    renderAnnouncementsView();
    results.btnNewAnnHiddenForTech = btnNewAnn && btnNewAnn.style.display === 'none';

    results.errors = window.__ERRORS__;

    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_SEPARATED_VIEWS_RESULT';
    resDiv.innerText = JSON.stringify(results, null, 2);
    document.body.appendChild(resDiv);
  } catch (err) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_SEPARATED_VIEWS_RESULT';
    resDiv.innerText = 'CATCH_ERROR: ' + err.message + ' ' + err.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$harnessHtml = $dashboardContent.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_separated_harness.html", $harnessHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outDump = "c:\Users\tiago\Desktop\crm-teste\scratch\test_separated_dump.txt"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_separated_harness.html > `"$outDump`""
Start-Sleep -Milliseconds 500

$dumpContent = [System.IO.File]::ReadAllText($outDump, [System.Text.Encoding]::UTF8)
if ($dumpContent -match '(?s)<div id="TEST_SEPARATED_VIEWS_RESULT"[^>]*>(.*?)</div>') {
    Write-Host "SEPARATED VIEWS VERIFICATION RESULT:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Result div not found!" -ForegroundColor Red
}
