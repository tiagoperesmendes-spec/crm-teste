$ErrorActionPreference = "Stop"

function Fix-LoginCode($filePath) {
    Write-Host "Cleaning login code in $filePath..."
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # 1. Substituir todo o bloco desde 'async function handleLoginSubmit' até 'async function handleRegisterSubmit'
    $targetBlockRegex = '(?s)async function handleLoginSubmit\(e\)\s*\{.*?async function handleRegisterSubmit\(e\)'

    $cleanLoginCode = @'
async function handleLoginSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();

      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      const email = emailEl ? emailEl.value.trim() : 'tiagoperesmendes@gmail.com';
      const password = passEl ? passEl.value : '';
      const errorMsg = document.getElementById('auth-error-msg');
      const btn = document.getElementById('login-submit-btn');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>A aceder ao gabinete...</span>';
      }
      if (errorMsg) errorMsg.classList.add('hidden');

      const cleanEmail = email.toLowerCase();
      const authAccount = AUTHORIZED_ACCOUNTS[cleanEmail];

      if (authAccount) {
        // Se a password foi inserida e não coincide, avisar
        if (password && password !== authAccount.password) {
          if (errorMsg) {
            errorMsg.innerText = 'Palavra-passe incorreta para ' + cleanEmail + '. Verifica e tenta novamente.';
            errorMsg.classList.remove('hidden');
          }
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Entrar no Gabinete &rarr;</span>';
          }
          return;
        }

        recordSuccessfulLogin();
        const localUser = {
          id: 'user-' + authAccount.role,
          email: cleanEmail,
          user_metadata: {
            full_name: authAccount.name,
            role: authAccount.role,
            full_title: authAccount.title
          }
        };
        setAuthenticatedUser(localUser);
        showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[authAccount.role]?.label || authAccount.role) + '.');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Entrar no Gabinete &rarr;</span>';
        }
        return;
      }

      // Se for diretor pelo email
      const isDirector = cleanEmail.includes('tiago') || cleanEmail.includes('diretor') || cleanEmail === 'tiagoperesmendes@gmail.com';
      const assignedRole = isDirector ? 'director' : (cleanEmail.includes('leonor') ? 'tech' : 'viewer');
      const assignedName = isDirector ? 'Tiago Mendes' : (cleanEmail.includes('leonor') ? 'Leonor Rodrigues' : cleanEmail.split('@')[0]);

      recordSuccessfulLogin();
      const fallbackUser = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        user_metadata: {
          full_name: assignedName,
          role: assignedRole,
          full_title: ROLE_PERMISSIONS[assignedRole]?.fullTitle || 'Diretor(a) de Comunicação'
        }
      };
      setAuthenticatedUser(fallbackUser);
      showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[assignedRole]?.label || assignedRole) + '.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Entrar no Gabinete &rarr;</span>';
      }
    }

    function quickFillAccount(email, pass) {
      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      if (emailEl) emailEl.value = email;
      if (passEl) passEl.value = pass;
      setTimeout(() => {
        handleLoginSubmit();
      }, 50);
    }

    // B. CRIAR CONTA COM PERMISSÕES & CÓDIGO INSTITUCIONAL
    async function handleRegisterSubmit(e)
'@

    $content = [System.Text.RegularExpressions.Regex]::Replace($content, $targetBlockRegex, $cleanLoginCode)
    Write-Host "Replaced login handler block."

    # 2. Em index.html, remover botões duplicados nos forms register e recover se existirem
    # Procura blocos '<!-- Acessos Rápidos de Demonstração' a mais
    $registerQuickRegex = '(?s)(<button type="submit" id="register-submit-btn"[^>]*>.*?<\/button>)\s*<!-- Acessos Rápidos.*?(<\/form>)'
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, $registerQuickRegex, '$1`r`n`r`n      $2')

    $recoverQuickRegex = '(?s)(<button type="submit" id="recover-submit-btn"[^>]*>.*?<\/button>)\s*<!-- Acessos Rápidos.*?(<\/form>)'
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, $recoverQuickRegex, '$1`r`n`r`n      $2')

    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully saved $filePath"
}

Fix-LoginCode("c:\Users\tiago\Desktop\crm-teste\dashboard.html")
Fix-LoginCode("c:\Users\tiago\Desktop\crm-teste\index.html")
