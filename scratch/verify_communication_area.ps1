$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
window.__ERRORS__ = [];
window.addEventListener('error', (e) => { window.__ERRORS__.push(e.message); });

window.addEventListener('load', () => {
  try {
    const results = {};

    // 1. Iniciar sessão como Diretor
    currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');

    // 2. Verificar botão de navegação na sidebar
    const navComm = document.getElementById('nav-communication');
    results.navCommExists = !!navComm;
    const sidebarCommCount = document.getElementById('sidebar-comm-count')?.innerText;
    results.sidebarCommCount = sidebarCommCount;

    // 3. Mudar para a vista de comunicação
    switchView('communication');
    const viewComm = document.getElementById('view-communication');
    results.viewCommVisible = viewComm && !viewComm.classList.contains('hidden');

    // 4. Testar Mural da Direção (Anúncios)
    const feed = document.getElementById('announcements-feed-container');
    results.announcementsCount = feed ? feed.children.length : 0;
    const btnNewAnnDirector = document.getElementById('btn-open-announcement-modal');
    results.directorCanSeeNewAnnBtn = btnNewAnnDirector && btnNewAnnDirector.style.display !== 'none';

    // Testar abertura e fecho de modal de anúncio
    openAnnouncementModal();
    const modal = document.getElementById('modal-announcement');
    results.modalOpen = modal && !modal.classList.contains('hidden');
    closeAnnouncementModal();
    results.modalClosed = modal && modal.classList.contains('hidden');

    // 5. Testar Chat da Equipa
    setCommTab('chat');
    const chatSec = document.getElementById('comm-content-chat');
    results.chatSecVisible = chatSec && !chatSec.classList.contains('hidden');
    const chatMessages = document.getElementById('team-chat-messages');
    results.initialChatMessagesCount = chatMessages ? chatMessages.children.length : 0;

    // Testar envio de mensagem pelo Diretor
    const chatInput = document.getElementById('team-chat-input');
    if (chatInput) chatInput.value = 'Mensagem de teste de verificação automatizada';
    sendChatMessage();
    results.afterSendChatMessagesCount = chatMessages ? chatMessages.children.length : 0;

    // 6. Testar Permissões como Convidado (Viewer)
    currentUser = { email: 'tiagoperesmendesps4@gmail.com', name: 'Tiago Mendes (Convidado)', user_metadata: { role: 'viewer' } };
    renderCommunicationView();
    const btnNewAnnViewer = document.getElementById('btn-open-announcement-modal');
    results.viewerNewAnnBtnHidden = btnNewAnnViewer && btnNewAnnViewer.style.display === 'none';
    results.viewerChatInputDisabled = chatInput && chatInput.disabled === true;

    // 7. Testar Permissões como Técnica (Leonor)
    currentUser = { email: 'leonor.rp.faculdade@gmail.com', name: 'Leonor Rodrigues', user_metadata: { role: 'tech' } };
    renderCommunicationView();
    const btnNewAnnTech = document.getElementById('btn-open-announcement-modal');
    results.techNewAnnBtnHidden = btnNewAnnTech && btnNewAnnTech.style.display === 'none';
    results.techChatInputEnabled = chatInput && chatInput.disabled === false;

    results.errors = window.__ERRORS__;

    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_COMMUNICATION_RESULT';
    resDiv.innerText = JSON.stringify(results, null, 2);
    document.body.appendChild(resDiv);
  } catch (err) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_COMMUNICATION_RESULT';
    resDiv.innerText = 'CATCH_ERROR: ' + err.message + ' ' + err.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$harnessHtml = $dashboardContent.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_comm_harness.html", $harnessHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outDump = "c:\Users\tiago\Desktop\crm-teste\scratch\test_comm_dump.txt"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_comm_harness.html > `"$outDump`""
Start-Sleep -Milliseconds 500

$dumpContent = [System.IO.File]::ReadAllText($outDump, [System.Text.Encoding]::UTF8)
if ($dumpContent -match '(?s)<div id="TEST_COMMUNICATION_RESULT"[^>]*>(.*?)</div>') {
    Write-Host "COMMUNICATION VERIFICATION RESULT:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Result div not found!" -ForegroundColor Red
}
