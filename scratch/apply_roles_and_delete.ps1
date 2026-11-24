$ErrorActionPreference = "Stop"

function Update-FileContent($filePath) {
    Write-Host "Updating file: $filePath"
    $c = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # 1. Atualizar ROLE_PERMISSIONS
    $oldPermsRegex = '(?s)const ROLE_PERMISSIONS = \{.*?\};'
    $newPerms = @'
const ROLE_PERMISSIONS = {
      director: {
        roleKey: 'director',
        label: 'Geral',
        fullTitle: 'Diretor(a) de Comunicação',
        tag: 'Acesso Total',
        badgeColor: 'bg-[#E6C5CA]/40 text-[#6C1C37] border-[#E6C5CA]',
        dotColor: 'bg-[#6C1C37]',
        canCreateTasks: true,
        canCreateProjects: true,
        canCreateContacts: true,
        canCreateJournalists: true,
        canCreateOutlets: true,
        canDeleteRecords: true,
        canEditRecords: true,
        canCompleteTasks: true,
        canConfigDatabase: true,
        isReadOnly: false
      },
      tech: {
        roleKey: 'tech',
        label: 'Técnico de Comunicação',
        fullTitle: 'Técnico(a) de Comunicação',
        tag: 'Adiciona & Conclui',
        badgeColor: 'bg-[#DFE7D6] text-[#3F5A2E] border-[#DFE7D6]',
        dotColor: 'bg-[#3F5A2E]',
        canCreateTasks: true,
        canCreateProjects: false,
        canCreateContacts: true,
        canCreateJournalists: true,
        canCreateOutlets: true,
        canDeleteRecords: false,
        canEditRecords: false,
        canCompleteTasks: true,
        canConfigDatabase: false,
        isReadOnly: false
      },
      viewer: {
        roleKey: 'viewer',
        label: 'Visualização',
        fullTitle: 'Visualização (Apenas Leitura)',
        tag: 'Apenas Leitura',
        badgeColor: 'bg-[#E9E5E0] text-[#5C554E] border-[#E9E5E0]',
        dotColor: 'bg-[#5C554E]',
        canCreateTasks: false,
        canCreateProjects: false,
        canCreateContacts: false,
        canCreateJournalists: false,
        canCreateOutlets: false,
        canDeleteRecords: false,
        canEditRecords: false,
        canCompleteTasks: false,
        canConfigDatabase: false,
        isReadOnly: true
      }
    };
    ROLE_PERMISSIONS.press_officer = ROLE_PERMISSIONS.tech;
    ROLE_PERMISSIONS.junior = ROLE_PERMISSIONS.tech;

    const AUTHORIZED_ACCOUNTS = {
      'tiagoperesmendes@gmail.com': {
        name: 'Tiago Mendes',
        role: 'director',
        title: 'Diretor(a) de Comunicação',
        password: 'Direcao2026!'
      },
      'leonor.rp.faculdade@gmail.com': {
        name: 'Leonor Rodrigues',
        role: 'tech',
        title: 'Técnico(a) de Comunicação',
        password: 'Modo2026!'
      },
      'tiagoperesmendesps4@gmail.com': {
        name: 'Tiago Mendes (Convidado)',
        role: 'viewer',
        title: 'Visualização (Apenas Leitura)',
        password: 'Convidado2026!'
      }
    };
'@
    $c = [System.Text.RegularExpressions.Regex]::Replace($c, $oldPermsRegex, $newPerms)
    Write-Host "ROLE_PERMISSIONS updated."

    # 2. Atualizar handleLoginSubmit para validar as 3 contas e as suas passwords exatas
    $oldLoginRegex = '(?s)async function handleLoginSubmit\(e\)\s*\{.*?btn\.disabled = false;\s*btn\.innerHTML = .<span>Entrar no Gabinete</span>.;\s*\}'
    $newLogin = @'
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
      const authAccount = AUTHORIZED_ACCOUNTS[cleanEmail];

      if (authAccount) {
        if (password !== authAccount.password) {
          if (errorMsg) {
            errorMsg.innerText = 'Palavra-passe incorreta para ' + cleanEmail + '. Verifica e tenta novamente.';
            errorMsg.classList.remove('hidden');
          }
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Entrar no Gabinete</span>';
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
          btn.innerHTML = '<span>Entrar no Gabinete</span>';
        }
        return;
      }

      // Se não for uma das 3 principais, verificar contas registadas localmente
      const registeredUsers = JSON.parse(localStorage.getItem('rep_registered_users') || '{}');
      const userRecord = registeredUsers[cleanEmail];
      if (userRecord && (!userRecord.password || userRecord.password === password)) {
        recordSuccessfulLogin();
        const localUser = {
          id: 'user-' + Date.now(),
          email: cleanEmail,
          user_metadata: {
            full_name: userRecord.name || cleanEmail,
            role: userRecord.role || 'viewer'
          }
        };
        setAuthenticatedUser(localUser);
        showToast('Sessão iniciada com sucesso.');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Entrar no Gabinete</span>';
        }
        return;
      }

      if (errorMsg) {
        errorMsg.innerText = 'Email ou palavra-passe não autorizados. Por favor utilize uma das 3 contas institucionais configuradas.';
        errorMsg.classList.remove('hidden');
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Entrar no Gabinete</span>';
      }
    }

    function quickFillAccount(email, pass) {
      const emailEl = document.getElementById('login-email');
      const passEl = document.getElementById('login-password');
      if (emailEl) emailEl.value = email;
      if (passEl) passEl.value = pass;
    }
'@
    $c = [System.Text.RegularExpressions.Regex]::Replace($c, $oldLoginRegex, $newLogin)
    Write-Host "handleLoginSubmit updated."

    # 3. Adicionar atalhos de seleção das 3 contas no formulário de login
    $oldLoginBtn = '</button>' + "`r`n" + "`r`n" + '      </form>'
    $oldLoginBtnLF = '</button>' + "`n" + "`n" + '      </form>'
    $quickAccHtml = @'
</button>

        <!-- Acessos Rápidos de Demonstração (As 3 Contas Configuradas) -->
        <div class="pt-3 border-t border-[#E4DDD3]/70">
          <p class="text-[11px] text-[#6B6B6B] mb-2 font-medium">Contas de Acesso Disponíveis:</p>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" onclick="quickFillAccount('tiagoperesmendes@gmail.com', 'Direcao2026!')" class="p-2 text-left rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white text-[11px] hover:border-[#6C1C37] transition-all cursor-pointer">
              <span class="font-semibold block text-[#1A1A1A]">Geral</span>
              <span class="text-[10px] text-[#6B6B6B] block truncate">Tiago Mendes</span>
            </button>
            <button type="button" onclick="quickFillAccount('leonor.rp.faculdade@gmail.com', 'Modo2026!')" class="p-2 text-left rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white text-[11px] hover:border-[#6C1C37] transition-all cursor-pointer">
              <span class="font-semibold block text-[#1A1A1A]">Técnico</span>
              <span class="text-[10px] text-[#6B6B6B] block truncate">Leonor R.</span>
            </button>
            <button type="button" onclick="quickFillAccount('tiagoperesmendesps4@gmail.com', 'Convidado2026!')" class="p-2 text-left rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] hover:bg-white text-[11px] hover:border-[#6C1C37] transition-all cursor-pointer">
              <span class="font-semibold block text-[#1A1A1A]">Leitura</span>
              <span class="text-[10px] text-[#6B6B6B] block truncate">Convidado</span>
            </button>
          </div>
        </div>

      </form>
'@
    if (-not $c.Contains('Contas de Acesso Disponíveis:')) {
        if ($c.Contains($oldLoginBtn)) {
            $c = $c.Replace($oldLoginBtn, $quickAccHtml)
        } elseif ($c.Contains($oldLoginBtnLF)) {
            $c = $c.Replace($oldLoginBtnLF, $quickAccHtml)
        }
        Write-Host "Quick account selector added to login screen."
    }

    # 4. Atualizar gavetas de detalhe com botão Eliminar para quem tem permissão
    # Gaveta Jornalista
    $oldJdActions = '<button onclick="closeJournalistDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">' + "`r`n" + '          Fechar' + "`r`n" + '        </button>'
    $oldJdActionsLF = '<button onclick="closeJournalistDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">' + "`n" + '          Fechar' + "`n" + '        </button>'
    $newJdActions = @'
<div class="flex items-center gap-2">
          <button onclick="closeJournalistDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">
            Fechar
          </button>
          <button id="jd-btn-delete" onclick="handleDeleteJournalistFromDrawer()" class="btn-delete-record py-2 px-3 text-xs font-medium text-[#A3281E] hover:bg-[#FBEAE8] border border-[#F5C2BE] rounded-xl transition-colors cursor-pointer">
            Eliminar Jornalista
          </button>
        </div>
'@
    if ($c.Contains($oldJdActions)) {
        $c = $c.Replace($oldJdActions, $newJdActions)
    } elseif ($c.Contains($oldJdActionsLF)) {
        $c = $c.Replace($oldJdActionsLF, $newJdActions)
    }

    # Gaveta OCS
    $oldOdActions = '<button onclick="closeOutletDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">' + "`r`n" + '          Fechar' + "`r`n" + '        </button>'
    $oldOdActionsLF = '<button onclick="closeOutletDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">' + "`n" + '          Fechar' + "`n" + '        </button>'
    $newOdActions = @'
<div class="flex items-center gap-2">
          <button onclick="closeOutletDetailDrawer()" class="btn-secondary py-2 px-4 text-xs">
            Fechar
          </button>
          <button id="od-btn-delete" onclick="handleDeleteOutletFromDrawer()" class="btn-delete-record py-2 px-3 text-xs font-medium text-[#A3281E] hover:bg-[#FBEAE8] border border-[#F5C2BE] rounded-xl transition-colors cursor-pointer">
            Eliminar Meio
          </button>
        </div>
'@
    if ($c.Contains($oldOdActions)) {
        $c = $c.Replace($oldOdActions, $newOdActions)
    } elseif ($c.Contains($oldOdActionsLF)) {
        $c = $c.Replace($oldOdActionsLF, $newOdActions)
    }

    # 5. Atualizar deleteJournalist e deleteOutlet para fechar a gaveta e atualizar tabela
    $oldDeleteJourRegex = '(?s)async function deleteJournalist\(id\)\s*\{.*?showToast\(.Jornalista removido..\);\s*\}'
    $newDeleteJour = @'
async function deleteJournalist(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: O seu perfil não tem autorização para eliminar jornalistas.');
        return;
      }
      const j = localJournalists.find(item => item.id === id);
      const name = j ? j.name : 'este jornalista';
      if (!confirm('Tem a certeza que deseja eliminar o jornalista "' + name + '"? Esta ação não pode ser desfeita.')) return;
      
      localJournalists = localJournalists.filter(item => item.id !== id);
      if (supabaseClient) {
        try { await supabaseClient.from('journalists').delete().eq('id', id); } catch(e){}
      }
      syncLocalStorage();
      closeJournalistDetailDrawer();
      renderJournalistsTable();
      updateSidebarCounts();
      showToast('Jornalista "' + name + '" eliminado com sucesso.');
    }

    function handleDeleteJournalistFromDrawer() {
      if (currentDrawerJournalistId) {
        deleteJournalist(currentDrawerJournalistId);
      }
    }
'@
    $c = [System.Text.RegularExpressions.Regex]::Replace($c, $oldDeleteJourRegex, $newDeleteJour)

    $oldDeleteOcsRegex = '(?s)async function deleteOutlet\(id\)\s*\{.*?showToast\(.Órgão de comunicação removido..\);\s*\}'
    $newDeleteOcs = @'
async function deleteOutlet(id) {
      if (!currentUserPermissions()?.canDeleteRecords) {
        showToast('Permissão negada: O seu perfil não tem autorização para eliminar OCS.');
        return;
      }
      const ocs = localOutlets.find(item => item.id === id);
      const name = ocs ? ocs.name : 'este meio de comunicação';
      if (!confirm('Tem a certeza que deseja eliminar o meio de comunicação "' + name + '"? Esta ação não pode ser desfeita.')) return;
      
      localOutlets = localOutlets.filter(item => item.id !== id);
      if (supabaseClient) {
        try { await supabaseClient.from('media_outlets').delete().eq('id', id); } catch(e){}
      }
      syncLocalStorage();
      closeOutletDetailDrawer();
      renderOutletsTable();
      updateSidebarCounts();
      showToast('Órgão de comunicação "' + name + '" eliminado com sucesso.');
    }

    function handleDeleteOutletFromDrawer() {
      if (currentDrawerOutletId) {
        deleteOutlet(currentDrawerOutletId);
      }
    }

    function updateSidebarCounts() {
      const pCount = document.getElementById('sidebar-projects-count');
      if (pCount) pCount.innerText = (localProjects || []).filter(p => p.status !== 'concluido' && p.status !== 'completed').length;
      const tCount = document.getElementById('sidebar-tasks-count');
      if (tCount) tCount.innerText = (localTasks || []).filter(t => t.status !== 'concluida' && t.status !== 'completed').length;
      const jCount = document.getElementById('sidebar-journalists-count');
      if (jCount) jCount.innerText = (localJournalists || []).length;
      const oCount = document.getElementById('sidebar-outlets-count');
      if (oCount) oCount.innerText = (localOutlets || []).length;
    }
'@
    $c = [System.Text.RegularExpressions.Regex]::Replace($c, $oldDeleteOcsRegex, $newDeleteOcs)
    Write-Host "deleteJournalist and deleteOutlet updated."

    # 6. Atualizar renderJournalistsTable com botão Eliminar na linha se canDelete
    $oldJourRowAction = @'
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openContactModalPrefilled('${j.name.replace(/'/g, "\\'")}', '${outletName.replace(/'/g, "\\'")}', 'Geral')"
                  class="text-xs text-[#6C1C37] hover:underline p-1 font-medium" title="Registar contacto direto com ${j.name}">
                  Contactar &rarr;
                </button>
                <button onclick="openJournalistDetailDrawer('${j.id}')" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1 text-xs" title="Ver ficha">
                  Ficha
                </button>
              </div>
            </td>
'@
    $newJourRowAction = @'
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openContactModalPrefilled('${j.name.replace(/'/g, "\\'")}', '${outletName.replace(/'/g, "\\'")}', 'Geral')"
                  class="text-xs text-[#6C1C37] hover:underline p-1 font-medium" title="Registar contacto direto com ${j.name}">
                  Contactar &rarr;
                </button>
                <button onclick="openJournalistDetailDrawer('${j.id}')" class="text-[#6B6B6B] hover:text-[#1A1A1A] p-1 text-xs" title="Ver ficha">
                  Ficha
                </button>
                ${currentUserPermissions()?.canDeleteRecords ? `
                  <button onclick="event.stopPropagation(); deleteJournalist('${j.id}')" class="btn-delete-record text-[#8A8A8A] hover:text-[#A3281E] hover:bg-[#FBEAE8] p-1.5 rounded-lg text-xs transition-colors shrink-0" title="Eliminar Jornalista">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
'@
    $oldActionNorm = $oldJourRowAction.Replace("`r`n", "`n").Trim()
    $cNorm = $c.Replace("`r`n", "`n")
    if ($cNorm.Contains($oldActionNorm)) {
        $cNorm = $cNorm.Replace($oldActionNorm, $newJourRowAction.Replace("`r`n", "`n").Trim())
        $c = $cNorm
        Write-Host "Journalist row delete action added."
    }

    # 7. Atualizar renderOutletsTable com botão Eliminar na linha se canDelete
    $oldOcsRowAction = @'
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openOutletDetailDrawer('${ocs.id}')" class="text-[#6C1C37] hover:underline p-1 text-xs font-medium" title="Consultar ficha completa">
                  Ficha &rarr;
                </button>
              </div>
            </td>
'@
    $newOcsRowAction = @'
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openOutletDetailDrawer('${ocs.id}')" class="text-[#6C1C37] hover:underline p-1 text-xs font-medium" title="Consultar ficha completa">
                  Ficha &rarr;
                </button>
                ${currentUserPermissions()?.canDeleteRecords ? `
                  <button onclick="event.stopPropagation(); deleteOutlet('${ocs.id}')" class="btn-delete-record text-[#8A8A8A] hover:text-[#A3281E] hover:bg-[#FBEAE8] p-1.5 rounded-lg text-xs transition-colors shrink-0" title="Eliminar Meio de Comunicação">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
'@
    $oldOcsActionNorm = $oldOcsRowAction.Replace("`r`n", "`n").Trim()
    $cNorm = $c.Replace("`r`n", "`n")
    if ($cNorm.Contains($oldOcsActionNorm)) {
        $cNorm = $cNorm.Replace($oldOcsActionNorm, $newOcsRowAction.Replace("`r`n", "`n").Trim())
        $c = $cNorm
        Write-Host "OCS row delete action added."
    }

    # 8. Atualizar applyUserPermissions para esconder botões de criação se viewer e ativar/desativar checkboxes de tarefas
    $oldApplyRegex = '(?s)function applyUserPermissions\(roleKey\)\s*\{.*?document\.querySelectorAll\(..btn-delete-record.\)\.forEach\(el => \{.*?\}\);\s*\}'
    $newApply = @'
function applyUserPermissions(roleKey) {
      const perms = ROLE_PERMISSIONS[roleKey] || ROLE_PERMISSIONS['director'];

      // 1. Sidebar: Nome e Cargo do Utilizador
      const sidebarTitle = document.getElementById('sidebar-user-title');
      const sidebarName = document.getElementById('sidebar-user-name');
      if (sidebarTitle) sidebarTitle.innerText = perms.fullTitle || perms.label;

      const userEmail = (currentUser?.email || '').toLowerCase();
      if (userEmail.includes('leonor')) {
        if (sidebarName) sidebarName.innerText = 'Leonor Rodrigues';
      } else if (userEmail.includes('ps4') || roleKey === 'viewer') {
        if (sidebarName) sidebarName.innerText = 'Tiago Mendes (Convidado)';
      } else {
        if (sidebarName) sidebarName.innerText = 'Tiago Mendes';
      }

      // 2. Botões de Criação na Toolbar das Bases
      const jourAddBtn = document.getElementById('btn-open-modal-add-jour') || document.querySelector('button[onclick="openAddJournalistModal()"]');
      const outletAddBtn = document.getElementById('btn-open-modal-add-outlet') || document.querySelector('button[onclick="openAddOutletModal()"]');
      if (jourAddBtn) jourAddBtn.style.display = perms.canCreateJournalists ? '' : 'none';
      if (outletAddBtn) outletAddBtn.style.display = perms.canCreateOutlets ? '' : 'none';

      // 3. Botões de Eliminar (Apenas Geral / Direção)
      document.querySelectorAll('.btn-delete-record').forEach(el => {
        el.style.display = perms.canDeleteRecords ? '' : 'none';
      });

      const jdDeleteBtn = document.getElementById('jd-btn-delete');
      if (jdDeleteBtn) jdDeleteBtn.style.display = perms.canDeleteRecords ? '' : 'none';
      const odDeleteBtn = document.getElementById('od-btn-delete');
      if (odDeleteBtn) odDeleteBtn.style.display = perms.canDeleteRecords ? '' : 'none';

      // 4. Checkboxes de Conclusão de Tarefas
      document.querySelectorAll('input[type="checkbox"][onchange*="toggleTask"]').forEach(cb => {
        if (perms.isReadOnly || !perms.canCompleteTasks) {
          cb.disabled = true;
          cb.classList.add('cursor-not-allowed', 'opacity-50');
        } else {
          cb.disabled = false;
          cb.classList.remove('cursor-not-allowed', 'opacity-50');
        }
      });

      // 5. Botões Globais de Adicionar Tarefa / Projeto
      const viewTaskAddBtn = document.getElementById('view-tasks-add-btn');
      const viewProjectAddBtn = document.getElementById('view-projects-add-btn');
      const dashTaskBtn = document.getElementById('dash-task-btn');
      const dashContactBtn = document.getElementById('dash-contact-btn');
      const dashProjectBtn = document.getElementById('dash-project-btn');

      if (viewTaskAddBtn) viewTaskAddBtn.style.display = perms.canCreateTasks ? '' : 'none';
      if (viewProjectAddBtn) viewProjectAddBtn.style.display = perms.canCreateProjects ? '' : 'none';
      if (dashTaskBtn) dashTaskBtn.style.display = perms.canCreateTasks ? '' : 'none';
      if (dashContactBtn) dashContactBtn.style.display = perms.canCreateContacts ? '' : 'none';
      if (dashProjectBtn) dashProjectBtn.style.display = perms.canCreateProjects ? '' : 'none';
    }
'@
    $c = [System.Text.RegularExpressions.Regex]::Replace($c, $oldApplyRegex, $newApply)
    Write-Host "applyUserPermissions updated."

    [System.IO.File]::WriteAllText($filePath, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Updated file successfully: $filePath"
}

Update-FileContent("c:\Users\tiago\Desktop\crm-teste\dashboard.html")
Update-FileContent("c:\Users\tiago\Desktop\crm-teste\index.html")
