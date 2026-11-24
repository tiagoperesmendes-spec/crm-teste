$files = @("c:\Users\tiago\Desktop\crm-teste\dashboard.html", "c:\Users\tiago\Desktop\crm-teste\index.html")

$newCode = @'
    // ========================================================
    // FICHA DETALHADA DO PROJETO (view-project-detail)
    // ========================================================
    function switchProjectDetailTab(tab) {
      activeProjectDetailTab = tab;
      const tabs = ['overview', 'tasks', 'journalists'];
      tabs.forEach(t => {
        const btn = document.getElementById(`proj-tab-btn-${t}`);
        const content = document.getElementById(`proj-tab-content-${t}`);
        if (btn && content) {
          if (t === tab) {
            btn.className = 'px-4 py-2 rounded-xl font-medium bg-[#6C1C37] text-white transition-all cursor-pointer';
            content.classList.remove('hidden');
          } else {
            btn.className = 'px-4 py-2 rounded-xl font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F6F2EC] transition-all cursor-pointer flex items-center gap-1.5';
            content.classList.add('hidden');
          }
        }
      });
    }

    function renderProjectDetail() {
      if (!localProjects || localProjects.length === 0) {
        localProjects = (typeof DEFAULT_SAMPLE_PROJECTS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_PROJECTS))
          ? [...DEFAULT_SAMPLE_PROJECTS] : [];
      }

      let proj = localProjects.find(p => p.id === activeProjectId);
      if (!proj) proj = localProjects[0];
      if (!proj) return;
      activeProjectId = proj.id;

      const isCompleted = proj.status === 'concluido' || proj.status === 'completed';
      const isProjOverdue = proj.deadline && isOverdue(proj.deadline) && !isCompleted;

      // 1. Topo & Breadcrumb
      const bcTitle = document.getElementById('proj-detail-breadcrumb-title');
      if (bcTitle) bcTitle.innerText = proj.name || 'Projeto';
      const titleEl = document.getElementById('proj-detail-title');
      if (titleEl) titleEl.innerText = proj.name || 'Projeto';

      const clientName = proj.client || proj.client_or_brand || 'Institucional';
      const clientBadge = document.getElementById('proj-detail-client-badge');
      if (clientBadge) clientBadge.innerText = clientName;

      const typeBadge = document.getElementById('proj-detail-type-badge');
      if (typeBadge) typeBadge.innerText = getProjectTypeBadge(proj.type);

      const statusBadge = document.getElementById('proj-detail-status-badge');
      if (statusBadge) statusBadge.innerHTML = getProjectStatusBadge(proj.status);

      const priorityBadge = document.getElementById('proj-detail-priority-badge');
      if (priorityBadge) priorityBadge.innerHTML = getProjectPriorityBadge(proj.priority);

      const overdueAlert = document.getElementById('proj-detail-overdue-alert');
      if (overdueAlert) {
        if (isProjOverdue) overdueAlert.classList.remove('hidden');
        else overdueAlert.classList.add('hidden');
      }

      if (!localTasks || localTasks.length === 0) {
        localTasks = (typeof DEFAULT_SAMPLE_TASKS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_TASKS))
          ? [...DEFAULT_SAMPLE_TASKS] : [];
      }

      // 2. Progresso calculado pelas tarefas deste projeto
      const projTasks = (localTasks || []).filter(t => 
        (t.project_id && t.project_id === proj.id) || 
        (t.project_name && proj.name && t.project_name.toLowerCase() === proj.name.toLowerCase()) ||
        (t.project && proj.name && t.project.toLowerCase() === proj.name.toLowerCase())
      );
      let doneTasks = projTasks.filter(t => t.status === 'concluida' || t.status === 'completed').length;
      let totalTasks = projTasks.length;
      if (totalTasks === 0 && (proj.total_tasks || proj.tasks_total || proj.done_tasks)) {
        doneTasks = proj.done_tasks || 0;
        totalTasks = proj.total_tasks || proj.tasks_total || doneTasks;
      }
      const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (proj.progress || 0);

      const progLabel = document.getElementById('proj-detail-tasks-progress-label');
      if (progLabel) progLabel.innerText = `${doneTasks} de ${totalTasks} tarefas concluídas`;
      const pctLabel = document.getElementById('proj-detail-tasks-pct-label');
      if (pctLabel) pctLabel.innerText = `${pct}%`;
      const progBar = document.getElementById('proj-detail-progress-bar');
      if (progBar) progBar.style.width = `${pct}%`;

      // 3. Atualizar contadores das abas
      const tabTasksBadge = document.getElementById('proj-detail-tab-tasks-badge');
      if (tabTasksBadge) tabTasksBadge.innerText = totalTasks;

      const targetJourIds = proj.target_journalist_ids || [];
      const targetJourNames = proj.target_journalists || [];
      const targetJourObjs = (localJournalists || []).filter(j => targetJourIds.includes(j.id) || targetJourNames.includes(j.name));
      const tabJourBadge = document.getElementById('proj-detail-tab-journalists-badge');
      if (tabJourBadge) tabJourBadge.innerText = Math.max(targetJourIds.length, targetJourObjs.length);

      // 4. SEPARADOR RESUMO: Metadados
      const typeSelect = document.getElementById('proj-detail-type-select');
      if (typeSelect) typeSelect.value = proj.type || 'lancamento';

      const statusSelect = document.getElementById('proj-detail-status-select');
      if (statusSelect) statusSelect.value = proj.status || 'em_preparacao';

      const prioritySelect = document.getElementById('proj-detail-priority-select');
      if (prioritySelect) prioritySelect.value = proj.priority || 'media';

      const managerSelect = document.getElementById('proj-detail-manager-select');
      if (managerSelect) {
        const resp = proj.responsible || proj.manager || proj.manager_name || 'Leonor Rodrigues';
        managerSelect.value = resp;
        if (!managerSelect.value) {
          const opt = document.createElement('option');
          opt.value = resp;
          opt.innerText = resp;
          managerSelect.appendChild(opt);
          managerSelect.value = resp;
        }
      }

      const startDateInput = document.getElementById('proj-detail-start-date');
      if (startDateInput) startDateInput.value = proj.start_date || '';

      const deadlineInput = document.getElementById('proj-detail-deadline-date');
      if (deadlineInput) deadlineInput.value = proj.deadline || '';

      // Equipa Alocada
      const teamContainer = document.getElementById('proj-detail-team-badges');
      if (teamContainer) {
        const team = proj.team || proj.team_members || (proj.responsible ? [proj.responsible] : ['Leonor Rodrigues', 'Tiago Mendes']);
        teamContainer.innerHTML = team.map(m => {
          const uAvatar = getUserAvatar(m);
          return `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] text-xs font-medium border border-[#E4DDD3]">
              <span class="w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold shrink-0 select-none" style="background-color: ${uAvatar.color};">${uAvatar.initials}</span>
              <span>${m}</span>
            </span>
          `;
        }).join('');
      }

      // Objetivo Estratégico
      const objEl = document.getElementById('proj-detail-objective');
      if (objEl) objEl.innerText = proj.objective || proj.description || 'Sem objetivo estratégico registado.';

      // Meios-Alvo (Automático a partir dos jornalistas-alvo, só leitura)
      const outletsContainer = document.getElementById('proj-detail-target-outlets-list');
      if (outletsContainer) {
        const derivedOutlets = new Set();
        targetJourObjs.forEach(j => {
          if (j.outlet_name) derivedOutlets.add(j.outlet_name);
          if (j.outlet_names && Array.isArray(j.outlet_names)) j.outlet_names.forEach(o => derivedOutlets.add(o));
        });
        if (proj.target_outlets && Array.isArray(proj.target_outlets)) proj.target_outlets.forEach(o => derivedOutlets.add(o));

        const outletsArr = [...derivedOutlets];
        if (outletsArr.length === 0) {
          outletsContainer.innerHTML = '<span class="text-xs text-[#6B6B6B]">Nenhum órgão de comunicação identificado automaticamente. Adiciona jornalistas-alvo para associar meios.</span>';
        } else {
          outletsContainer.innerHTML = outletsArr.map(oName => {
            const ocsObj = (localOutlets || []).find(item => item.name && item.name.toLowerCase() === oName.toLowerCase());
            if (ocsObj) {
              return `
                <button type="button" onclick="openOutletDetailDrawer('${ocsObj.id}')"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF9F6] border border-[#E4DDD3] text-xs text-[#1A1A1A] hover:border-[#6C1C37] hover:shadow-xs transition-all cursor-pointer">
                  <span class="w-4 h-4 rounded bg-[#E4DDD3] flex items-center justify-center font-bold text-[9px]">${oName.substring(0, 2).toUpperCase()}</span>
                  <span class="font-medium">${oName}</span>
                  <span class="text-[10px] text-[#6C1C37]">&rarr;</span>
                </button>
              `;
            }
            return `<span class="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#F6F2EC] text-xs font-medium text-[#1A1A1A] border border-[#E4DDD3]">${oName}</span>`;
          }).join('');
        }
      }

      // Links & Documentos
      const linksContainer = document.getElementById('proj-detail-links-list');
      if (linksContainer) {
        const links = (proj.links_documents && proj.links_documents.length > 0) ? [...proj.links_documents] :
                      (proj.documents && proj.documents.length > 0) ? [...proj.documents] : [];
        if (proj.briefing_link) {
          links.unshift({ label: 'Link do Briefing', url: proj.briefing_link, type: 'Briefing' });
        }
        if (proj.shared_folder) {
          links.push({ label: 'Pasta Partilhada', url: proj.shared_folder, type: 'Drive / Pasta' });
        }
        if (links.length === 0) {
          linksContainer.innerHTML = '<span class="text-xs text-[#6B6B6B] col-span-full">Nenhum documento ou link de suporte associado a este projeto.</span>';
        } else {
          linksContainer.innerHTML = links.map(doc => {
            const title = doc.label || doc.title || 'Documento de Suporte';
            const url = doc.url || '#';
            return `
              <a href="${url}" target="_blank" rel="noopener noreferrer" class="p-3 bg-[#FBF9F6] rounded-xl border border-[#E4DDD3] hover:border-[#6C1C37]/50 hover:bg-white transition-all flex items-center justify-between group">
                <div class="space-y-0.5 truncate mr-2">
                  <span class="font-medium text-[#1A1A1A] group-hover:text-[#6C1C37] block truncate text-xs">${title}</span>
                  <span class="text-[10px] text-[#6B6B6B] uppercase font-mono">${doc.type || 'Link'}</span>
                </div>
                <svg class="w-4 h-4 text-[#6B6B6B] group-hover:text-[#6C1C37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            `;
          }).join('');
        }
      }

      // Notas
      const notesEl = document.getElementById('proj-detail-notes');
      if (notesEl) notesEl.innerText = proj.notes || 'Sem notas editoriais registadas.';

      // 5. SEPARADOR TAREFAS DESTE PROJETO
      const tasksTbody = document.getElementById('proj-detail-tasks-tbody');
      if (tasksTbody) {
        if (projTasks.length === 0) {
          tasksTbody.innerHTML = `<tr><td colspan="8" class="py-12 text-center text-xs text-[#6B6B6B]">Nenhuma tarefa associada a este projeto. Clica em "+ Nova Tarefa" acima para adicionar.</td></tr>`;
        } else {
          tasksTbody.innerHTML = projTasks.map(t => {
            const isDone = t.status === 'concluida' || t.status === 'completed';
            const isTaskOverdue = t.due_date && isOverdue(t.due_date) && !isDone;
            const resp = t.responsible || t.assignee || 'Leonor Rodrigues';
            const jourName = t.journalist_name || '—';

            return `
              <tr class="hover:bg-[#FBF9F6] transition-colors ${isDone ? 'opacity-60 bg-[#FAFAFA]' : ''}">
                <td class="w-10 text-center py-3 px-3" onclick="event.stopPropagation()">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus('${t.id}')"
                    class="w-4 h-4 text-[#6C1C37] rounded border-[#E4DDD3] focus:ring-[#6C1C37] cursor-pointer">
                </td>
                <td class="py-3 px-4 font-medium ${isDone ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}">
                  ${t.title}
                </td>
                <td class="py-3 px-4">
                  ${getTaskTypeBadge(t.type)}
                </td>
                <td class="py-3 px-4 text-xs">
                  ${t.journalist_id ? `<button type="button" onclick="openJournalistDetailDrawer('${t.journalist_id}')" class="text-[#6C1C37] hover:underline">${jourName}</button>` : jourName}
                </td>
                <td class="py-3 px-4 text-xs text-[#1A1A1A]">
                  ${resp}
                </td>
                <td class="py-3 px-4 font-mono text-xs">
                  ${isTaskOverdue 
                    ? `<span class="text-[#A3281E] font-medium">${t.due_date} (Em atraso)</span>` 
                    : (t.due_date || '—')}
                </td>
                <td class="py-3 px-4">
                  ${getProjectPriorityBadge(t.priority)}
                </td>
                <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
                  <button type="button" onclick="deleteTask('${t.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] text-xs p-1">Eliminar</button>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 6. SEPARADOR JORNALISTAS-ALVO
      const jourGrid = document.getElementById('proj-detail-journalists-grid');
      if (jourGrid) {
        if (targetJourObjs.length === 0) {
          jourGrid.innerHTML = `
            <div class="col-span-full py-12 text-center text-xs text-[#6B6B6B] bg-white rounded-2xl border border-[#E4DDD3] p-8">
              Nenhum jornalista-alvo associado a este projeto.
            </div>
          `;
        } else {
          jourGrid.innerHTML = targetJourObjs.map(j => {
            const outletName = j.outlet_name || (j.outlet_names && j.outlet_names[0]) || 'Geral';
            const ocs = (localOutlets || []).find(o => o.name === outletName);
            const initials = (j.name || 'Jornalista').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const relContact = (typeof formatRelativeDaysPt === 'function') ? formatRelativeDaysPt(j.last_contact_date).text : (j.last_contact_date || 'Nunca');

            return `
              <div class="crm-card p-4 space-y-3 bg-white">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-[#6C1C37] text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      ${initials}
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-[#1A1A1A]">${j.name}</h4>
                      <p class="text-[11px] text-[#6B6B6B]">${j.role_title || j.role || 'Jornalista'}</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-[#E4DDD3]/60 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Meio:</span>
                    ${ocs ? `
                      <button type="button" onclick="openOutletDetailDrawer('${ocs.id}')" class="font-medium text-[#6C1C37] hover:underline flex items-center gap-1">
                        <span>${ocs.name}</span> &nearr;
                      </button>
                    ` : `<span class="font-medium text-[#1A1A1A]">${outletName}</span>`}
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Último contacto:</span>
                    <span class="font-mono text-[#1A1A1A]">${relContact}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[#6B6B6B]">Área:</span>
                    <span class="text-[#1A1A1A]">${(j.intervention_areas && j.intervention_areas[0]) || j.intervention_area || 'Geral'}</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-[#E4DDD3]/60 flex items-center justify-between">
                  <button type="button" onclick="openJournalistDetailDrawer('${j.id}')" class="text-xs text-[#6C1C37] font-medium hover:underline">Ver Ficha &rarr;</button>
                  <button type="button" onclick="openTaskModal(null, '${j.id}')" class="btn-secondary py-1 px-2.5 text-xs">Agendar Contacto</button>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }

    // Ações inline da ficha de projeto
    function saveProjectTitleInline(e) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.name = e.target.innerText.trim();
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectTypeInline(val) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.type = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectStatusInline(val) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.status = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderAll();
    }
    function saveProjectPriorityInline(val) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.priority = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectManagerInline(val) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.responsible = val;
      proj.manager = val;
      proj.manager_name = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderProjectDetail();
    }
    function saveProjectStartDateInline(val) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.start_date = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectDeadlineInline(val) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.deadline = val;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
      renderAll();
    }
    function saveProjectObjectiveInline(e) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.objective = e.target.innerText.trim();
      proj.description = proj.objective;
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }
    function saveProjectNotesInline(e) {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      if (!proj) return;
      proj.notes = e.target.innerText.trim();
      proj.updated_at = new Date().toISOString();
      syncLocalStorage();
    }

    function openNewTaskForCurrentProject() {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      openTaskModal(proj ? proj.id : null);
    }

    function openNewContactForCurrentProject() {
      const proj = (localProjects || []).find(p => p.id === activeProjectId);
      openContactModalPrefilled('', '', proj ? proj.name : '');
    }

    function openTaskModalForJournalist(journalistId) {
      openTaskModal(null, journalistId);
    }

    function openContactModalPrefilled(jourName, outletName, projName) {
      openContactModal();
      setTimeout(() => {
        const nameInput = document.getElementById('contact-name');
        const outletInput = document.getElementById('contact-outlet');
        const notes = document.getElementById('contact-notes');
        if (nameInput) nameInput.value = jourName;
        if (outletInput) outletInput.value = outletName;
        if (notes && projName) notes.value = `[${projName}] Pauta editorial`;
      }, 50);
    }

    // Navegação para Detalhe de Projeto
    function openProjectDetail(id) {
      if (!localProjects || localProjects.length === 0) {
        localProjects = (typeof DEFAULT_SAMPLE_PROJECTS !== 'undefined' && Array.isArray(DEFAULT_SAMPLE_PROJECTS))
          ? [...DEFAULT_SAMPLE_PROJECTS] : [];
      }
      let proj = localProjects.find(p => p.id === id);
      if (!proj) proj = localProjects.find(p => p.name === id);
      if (!proj) proj = localProjects[0];
      if (!proj) return;
      activeProjectId = proj.id;
      switchView('project_detail', true, { projectId: proj.id });
      renderProjectDetail();
    }

    function openProjectDetailByName(name) {
      const proj = (localProjects || []).find(p => p.name === name);
      if (proj) openProjectDetail(proj.id);
      else switchView('projects');
    }
'@

$pattern = '(?s)\s*// Navegação para Detalhe de Projeto\s*function openProjectDetail\(id\) \{.*?function openProjectDetailByName\(name\) \{.*?\}\s*'

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) "`r`n" + $newCode + "`r`n`r`n" }, 1)
        [System.IO.File]::WriteAllText($f, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Replaced project detail block in $f successfully." -ForegroundColor Green
    } else {
        Write-Host "Pattern not matched in $f" -ForegroundColor Red
    }
}
