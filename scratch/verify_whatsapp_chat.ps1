$dashboardContent = [System.IO.File]::ReadAllText("c:\Users\tiago\Desktop\crm-teste\dashboard.html", [System.Text.Encoding]::UTF8)

$testScript = @'
<script>
window.__ERRORS__ = [];
window.addEventListener('error', (e) => { window.__ERRORS__.push(e.message); });

window.addEventListener('load', () => {
  try {
    const results = {};

    // Iniciar sessão como Leonor Rodrigues
    currentUser = { email: 'leonor.rp.faculdade@gmail.com', name: 'Leonor Rodrigues', user_metadata: { role: 'tech' } };
    localStorage.setItem('rep_auth_user', JSON.stringify(currentUser));
    document.getElementById('view-login')?.classList.add('hidden');
    document.getElementById('app-container')?.classList.remove('hidden');
    document.getElementById('app-container')?.classList.add('flex');

    switchView('communication');
    setCommTab('chat');

    // 1. Verificar lista de contactos/conversas
    const contactsList = document.getElementById('chat-contacts-list');
    results.contactsListRendered = !!contactsList;
    results.contactsCount = contactsList ? contactsList.children.length : 0;

    // 2. Verificar conversa ativa inicial (Canal Geral)
    const activeName = document.getElementById('active-chat-name')?.innerText;
    results.initialActiveChat = activeName;
    const msgBox = document.getElementById('team-chat-messages');
    results.initialMessagesCount = msgBox ? msgBox.querySelectorAll('.group').length : 0;

    // 3. Testar troca de conversa para Tiago Mendes (Direct Message)
    selectChatConversation('dm-tiago');
    const newActiveName = document.getElementById('active-chat-name')?.innerText;
    results.selectedContactChatName = newActiveName;
    const dmMsgCount = msgBox ? msgBox.querySelectorAll('.group').length : 0;
    results.dmMessagesCount = dmMsgCount;

    // 4. Testar envio de mensagem direta para Tiago Mendes
    const input = document.getElementById('team-chat-input');
    if (input) input.value = 'Olá Tiago, teste de mensagem direta estilo WhatsApp!';
    sendChatMessage();

    const afterSendCount = msgBox ? msgBox.querySelectorAll('.group').length : 0;
    results.afterSendDmCount = afterSendCount;

    // Verificar se última mensagem na barra lateral atualizou
    const lastMsgEl = document.querySelector('#chat-contacts-list p');
    results.lastMsgInSidebar = lastMsgEl ? lastMsgEl.innerText : '';

    results.errors = window.__ERRORS__;

    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_WHATSAPP_CHAT_RESULT';
    resDiv.innerText = JSON.stringify(results, null, 2);
    document.body.appendChild(resDiv);
  } catch (err) {
    const resDiv = document.createElement('div');
    resDiv.id = 'TEST_WHATSAPP_CHAT_RESULT';
    resDiv.innerText = 'CATCH_ERROR: ' + err.message + ' ' + err.stack;
    document.body.appendChild(resDiv);
  }
});
</script>
'@

$harnessHtml = $dashboardContent.Replace("</body>", $testScript + "`n</body>")
[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_whatsapp_harness.html", $harnessHtml, [System.Text.Encoding]::UTF8)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$outDump = "c:\Users\tiago\Desktop\crm-teste\scratch\test_whatsapp_dump.txt"

cmd /c "`"$chromePath`" --headless=new --no-sandbox --dump-dom --virtual-time-budget=2000 --disable-gpu --allow-file-access-from-files file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_whatsapp_harness.html > `"$outDump`""
Start-Sleep -Milliseconds 500

$dumpContent = [System.IO.File]::ReadAllText($outDump, [System.Text.Encoding]::UTF8)
if ($dumpContent -match '(?s)<div id="TEST_WHATSAPP_CHAT_RESULT"[^>]*>(.*?)</div>') {
    Write-Host "WHATSAPP CHAT VERIFICATION RESULT:" -ForegroundColor Green
    Write-Host $matches[1] -ForegroundColor Cyan
} else {
    Write-Host "Result div not found!" -ForegroundColor Red
}
