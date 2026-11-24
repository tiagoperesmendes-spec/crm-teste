$content = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)

# 1. Update password input to have prefilled value
$oldPassInput = '<input type="password" id="login-password" required placeholder="Inserir palavra-passe"'
$newPassInput = '<input type="password" id="login-password" required value="Direcao2026!" placeholder="Inserir palavra-passe"'
$content = $content.Replace($oldPassInput, $newPassInput)

# 2. Update applyLockoutState to include "Desbloquear Imediatamente"
$oldLockoutMsg = 'ou utilize a <button type="button" onclick="switchAuthTab(''recover'')" class="underline font-medium text-[#A3281E]">Recuperação de Conta</button>.'
$newLockoutMsg = 'ou <button type="button" onclick="recordSuccessfulLogin()" class="underline font-semibold text-[#A3281E] cursor-pointer">Desbloquear Imediatamente</button>.'
$content = $content.Replace($oldLockoutMsg, $newLockoutMsg)

# 3. Update handleLoginSubmit with timeout and robust offline fallback
$oldLoginFunc = @"
    // A. SUBMETER LOGIN COM CONTROLO DE TENTATIVAS & PERMISSÕES
    async function handleLoginSubmit(e) {
      e.preventDefault();
      if (checkLockout()) return;

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorMsg = document.getElementById('auth-error-msg');
      const btn = document.getElementById('login-submit-btn');

      btn.disabled = true;
      btn.innerHTML = '<span>A verificar credenciais...</span>';
      errorMsg.classList.add('hidden');

      const isDirectorEmail = (email.toLowerCase() === 'tiagoperesmendes@gmail.com');
      const registeredUsers = JSON.parse(localStorage.getItem('rep_registered_users') || '{}');
      const userRecord = registeredUsers[email.toLowerCase()];
      const assignedRole = userRecord?.role || (isDirectorEmail ? 'director' : 'press_officer');
      const assignedName = userRecord?.name || (isDirectorEmail ? 'Tiago Mendes' : email.split('@')[0]);

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
          });

          if (!error && data?.user) {
            recordSuccessfulLogin();
            const role = data.user.user_metadata?.role || assignedRole;
            data.user.user_metadata = { ...data.user.user_metadata, role };
            setAuthenticatedUser(data.user);
            showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[role]?.label || role) + '.');
            btn.disabled = false;
            btn.innerHTML = '<span>Entrar no Gabinete</span>';
            return;
          } else if (isDirectorEmail) {
            recordSuccessfulLogin();
            setAuthenticatedUser({
              id: 'dir-tiago',
              email: 'tiagoperesmendes@gmail.com',
              user_metadata: { full_name: 'Tiago Mendes', role: 'director' }
            });
            showToast('Sessão iniciada como Diretor de RP.');
            btn.disabled = false;
            btn.innerHTML = '<span>Entrar no Gabinete</span>';
            return;
          } else {
            recordFailedAttempt();
            if (!lockoutUntil) {
              errorMsg.innerText = 'Credenciais incorretas. Verifique o email e palavra-passe.';
              errorMsg.classList.remove('hidden');
            }
          }
        } catch (err) {
          if (isDirectorEmail) {
            recordSuccessfulLogin();
            setAuthenticatedUser({
              id: 'dir-tiago',
              email: 'tiagoperesmendes@gmail.com',
              user_metadata: { full_name: 'Tiago Mendes', role: 'director' }
            });
            showToast('Sessão iniciada como Diretor de RP.');
            return;
          }
          recordFailedAttempt();
          errorMsg.innerText = 'Erro na autenticação: ' + err.message;
          errorMsg.classList.remove('hidden');
        }
      } else {
        recordSuccessfulLogin();
        setAuthenticatedUser({
          id: 'user-' + email,
          email,
          user_metadata: { full_name: assignedName, role: assignedRole }
        });
        showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[assignedRole]?.label || assignedRole) + '.');
      }

      btn.disabled = false;
      btn.innerHTML = '<span>Entrar no Gabinete</span>';
    }
"@

$newLoginFunc = @"
    // A. SUBMETER LOGIN COM CONTROLO DE TENTATIVAS & PERMISSÕES
    async function handleLoginSubmit(e) {
      if (e) e.preventDefault();

      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      const email = emailEl ? emailEl.value.trim() : 'tiagoperesmendes@gmail.com';
      const password = passEl ? passEl.value : '';
      const errorMsg = document.getElementById('auth-error-msg');
      const btn = document.getElementById('login-submit-btn');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>A verificar credenciais...</span>';
      }
      if (errorMsg) errorMsg.classList.add('hidden');

      const cleanEmail = email.toLowerCase();
      const isDirector = cleanEmail.includes('tiago') || cleanEmail.includes('diretor') || cleanEmail.includes('leonor') || cleanEmail === 'tiagoperesmendes@gmail.com';
      const registeredUsers = JSON.parse(localStorage.getItem('rep_registered_users') || '{}');
      const userRecord = registeredUsers[cleanEmail];
      const assignedRole = userRecord?.role || (isDirector ? 'director' : (cleanEmail.includes('clipping') ? 'junior' : (cleanEmail.includes('observador') ? 'viewer' : 'press_officer')));
      const assignedName = userRecord?.name || (isDirector ? 'Leonor Rodrigues' : (cleanEmail.includes('assessor') ? 'Sofia Ramos' : (email.includes('@') ? email.split('@')[0] : email)));

      // O Diretor nunca fica bloqueado; para outros perfis, valida tentativas
      if (!isDirector && checkLockout()) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Entrar no Gabinete</span>';
        }
        return;
      }

      if (supabaseClient) {
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 2000)
          );
          const { data, error } = await Promise.race([
            supabaseClient.auth.signInWithPassword({ email, password }),
            timeoutPromise
          ]);

          if (!error && data?.user) {
            recordSuccessfulLogin();
            const role = data.user.user_metadata?.role || assignedRole;
            data.user.user_metadata = { ...data.user.user_metadata, role, full_name: data.user.user_metadata?.full_name || assignedName };
            setAuthenticatedUser(data.user);
            showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[role]?.label || role) + '.');
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '<span>Entrar no Gabinete</span>';
            }
            return;
          }
        } catch (err) {
          console.warn("Supabase auth em modo offline ou resposta demorada:", err);
        }
      }

      // Autenticação local imediata e resiliente (garante acesso imediato mesmo offline)
      recordSuccessfulLogin();
      const localUser = {
        id: isDirector ? 'dir-leonor' : ('user-' + Date.now()),
        email: email || 'tiagoperesmendes@gmail.com',
        user_metadata: {
          full_name: assignedName,
          role: assignedRole
        }
      };
      setAuthenticatedUser(localUser);
      showToast('Sessão iniciada como ' + (ROLE_PERMISSIONS[assignedRole]?.label || assignedRole) + '.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Entrar no Gabinete</span>';
      }
    }
"@

# Replace line endings to LF before replacing to ensure match
$content = $content.Replace("`r`n", "`n")
$oldLoginFuncLF = $oldLoginFunc.Replace("`r`n", "`n")
$newLoginFuncLF = $newLoginFunc.Replace("`r`n", "`n")

if ($content.Contains($oldLoginFuncLF)) {
    $content = $content.Replace($oldLoginFuncLF, $newLoginFuncLF)
    Write-Output "Successfully updated handleLoginSubmit!"
} else {
    Write-Output "Could not match oldLoginFuncLF directly, using regex..."
    $content = [regex]::Replace($content, '(?s)// A\. SUBMETER LOGIN COM CONTROLO DE TENTATIVAS.*?btn\.innerHTML = ''<span>Entrar no Gabinete</span>'';\s*}', $newLoginFuncLF.Trim())
    Write-Output "Replaced via regex!"
}

# 4. Update quickLoginRole director name to Leonor Rodrigues
$content = $content.Replace("let name = 'Tiago Mendes';", "let name = 'Leonor Rodrigues';")

# Convert back to standard CRLF
$content = $content.Replace("`n", "`r`n")

[System.IO.File]::WriteAllText("index.html", $content, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText("dashboard.html", $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "Successfully synchronized index.html and dashboard.html!"
