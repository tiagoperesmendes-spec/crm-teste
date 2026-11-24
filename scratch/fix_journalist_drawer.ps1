$dashboardPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$newCode = @'
    // ========================================================
    // FICHA / GAVETA DO JORNALISTA (BASE 2 -> BASE 1)
    // ========================================================
    function formatRelativeDays(dateStr) {
      if (typeof formatRelativeDaysPt === 'function') {
        return formatRelativeDaysPt(dateStr).text;
      }
      return dateStr || 'Nunca';
    }

    function openJournalistDetailDrawer(journalistId) {
      let j = localJournalists.find(item => item.id === journalistId);
      if (!j) {
        j = localJournalists.find(item => item.name && item.name.toLowerCase() === (journalistId || '').toLowerCase());
      }
      if (!j) return;
      currentDrawerJournalistId = j.id;

      // Nome, cargo e iniciais
      const nameParts = (j.name || 'Jornalista').split(' ').filter(Boolean);
      const initials = nameParts.map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'J';

      const hName = document.getElementById('jd-header-name'); if (hName) hName.innerText = j.name;
      const jName = document.getElementById('jd-name'); if (jName) jName.innerText = j.name;
      const jRole = document.getElementById('jd-role'); if (jRole) jRole.innerText = j.role_title || 'Jornalista';
      const jAvatar = document.getElementById('jd-avatar'); if (jAvatar) jAvatar.innerText = initials;

      // Estado
      const statusBadgeContainer = document.getElementById('jd-status-badge');
      if (statusBadgeContainer) {
        if (j.status === 'mudou_de_meio') {
          statusBadgeContainer.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3E3C3] text-[#7A4E0F]">Mudou de Meio</span>`;
        } else if (j.status === 'reformado') {
          statusBadgeContainer.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E9E5E0] text-[#5C554E]">Reformado</span>`;
        } else {
          statusBadgeContainer.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#DFE7D6] text-[#3F5A2E]">Ativo</span>`;
        }
      }

      // Meios de Comunicação Social Associados
      const outletsContainer = document.getElementById('jd-outlets-list');
      if (outletsContainer) {
        let outletNames = j.outlet_names || (j.outlet_name ? [j.outlet_name] : []);
        if (outletNames.length === 0 && j.outlet_ids && j.outlet_ids.length > 0) {
          outletNames = j.outlet_ids.map(id => {
            const found = (localOutlets || []).find(o => o.id === id);
            return found ? found.name : id;
          });
        }
        if (outletNames.length === 0) outletNames = ['Geral'];

        outletsContainer.innerHTML = outletNames.map(oname => {
          const matchedOcs = (localOutlets || []).find(o => o.name && o.name.toLowerCase() === oname.toLowerCase());
          const ocsId = matchedOcs ? matchedOcs.id : null;
          const logoHtml = matchedOcs && matchedOcs.logo_url
            ? `<img src="${matchedOcs.logo_url}" class="w-8 h-8 rounded-lg object-contain bg-white border border-[#E4DDD3] p-1">`
            : `<div class="w-8 h-8 rounded-lg bg-[#F6F2EC] text-[#1A1A1A] font-bold text-xs flex items-center justify-center border border-[#E4DDD3]">OCS</div>`;

          return `
            <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E4DDD3] shadow-xs">
              <div class="flex items-center gap-3">
                ${logoHtml}
                <div>
                  <h4 class="font-bold text-xs text-[#1A1A1A]">${oname}</h4>
                  <p class="text-[11px] text-[#6B6B6B]">${matchedOcs ? (matchedOcs.media_group || 'Sem grupo associado') : 'Sem grupo associado'}</p>
                </div>
              </div>
              ${ocsId ? `
                <button type="button" onclick="openOutletDetailDrawer('${ocsId}')" class="btn-secondary py-1 px-2.5 text-xs flex items-center gap-1 text-[#6C1C37] font-medium" title="Abrir ficha deste meio">
                  <span>Abrir Ficha do Meio</span>
                  <span>&rarr;</span>
                </button>
              ` : ''}
            </div>
          `;
        }).join('');
      }

      // Emails
      const emailsContainer = document.getElementById('jd-emails-list');
      if (emailsContainer) {
        const emails = j.emails && j.emails.length > 0 ? j.emails : (j.contact_email ? [j.contact_email] : []);
        emailsContainer.innerHTML = emails.length > 0
          ? emails.map((em, idx) => `
              <div class="flex items-center justify-between py-0.5">
                <a href="mailto:${em}" class="text-[#6C1C37] hover:underline">${em}</a>
                <span class="text-[10px] text-[#6B6B6B]">${idx === 0 ? 'Principal' : 'Secundário'}</span>
              </div>
            `).join('')
          : '<span class="text-[#6B6B6B]">—</span>';
      }

      // Telefones
      const phonesContainer = document.getElementById('jd-phones-list');
      if (phonesContainer) {
        const phones = j.phones && j.phones.length > 0 ? j.phones : (j.contact_phone ? [j.contact_phone] : []);
        phonesContainer.innerHTML = phones.length > 0
          ? phones.map((ph, idx) => `
              <div class="flex items-center justify-between py-0.5">
                <a href="tel:${ph}" class="text-[#1A1A1A] hover:underline">${ph}</a>
                <span class="text-[10px] text-[#6B6B6B]">${idx === 0 ? 'Direto / Móvel' : 'Redação'}</span>
              </div>
            `).join('')
          : '<span class="text-[#6B6B6B]">—</span>';
      }

      // Preferência
      const prefEl = document.getElementById('jd-contact-pref');
      if (prefEl) {
        let prefText = 'Email Institucional';
        if (j.contact_preference === 'whatsapp') prefText = 'WhatsApp (Contacto Preferencial / Rápido)';
        if (j.contact_preference === 'telefone') prefText = 'Chamada Telefónica Direta';
        prefEl.innerText = prefText;
      }

      // Áreas
      const areasContainer = document.getElementById('jd-areas-list');
      if (areasContainer) {
        const areas = j.intervention_areas || (j.intervention_area ? [j.intervention_area] : ['Geral']);
        areasContainer.innerHTML = areas.map(a => renderTag(a)).join('');
      }

      // Links Digitais
      const linksContainer = document.getElementById('jd-links-container');
      if (linksContainer) {
        const linksHtml = [];
        const lIn = j.links?.linkedin || j.linkedin;
        const tw = j.links?.twitter_x || j.twitter_x || j.twitter;
        const au = j.links?.author_page || j.author_page;
        if (lIn) linksHtml.push(`<a href="${lIn}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">LinkedIn &nearr;</a>`);
        if (tw) linksHtml.push(`<a href="${tw}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">X / Twitter &nearr;</a>`);
        if (au) linksHtml.push(`<a href="${au}" target="_blank" class="px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#E4DDD3] text-[#1A1A1A] font-medium transition-colors">Página de Autor &nearr;</a>`);
        linksContainer.innerHTML = linksHtml.length > 0 ? linksHtml.join('') : '<span class="text-xs text-[#6B6B6B]">Nenhum link ou perfil externo registado.</span>';
      }

      // RGPD
      const rgpdBadge = document.getElementById('jd-rgpd-badge');
      if (rgpdBadge) {
        rgpdBadge.innerText = j.rgpd_consent ? 'Sim (Consentimento Válido)' : 'Não / Pendente';
        rgpdBadge.className = j.rgpd_consent ? 'font-medium text-[#3F5A2E]' : 'font-medium text-[#8A3E22]';
      }
      const rgpdDate = document.getElementById('jd-rgpd-date');
      if (rgpdDate) rgpdDate.innerText = j.rgpd_consent_date || '—';
      const contactOrigin = document.getElementById('jd-contact-origin');
      if (contactOrigin) contactOrigin.innerText = j.contact_origin || 'Registo Interno';

      // Histórico e Notas
      const lastContactEl = document.getElementById('jd-last-contact');
      if (lastContactEl) {
        const relText = (typeof formatRelativeDaysPt === 'function') ? formatRelativeDaysPt(j.last_contact_date).text : (j.last_contact_date || 'Nunca');
        lastContactEl.innerText = relText;
      }
      const updatedAt = document.getElementById('jd-updated-at');
      if (updatedAt) updatedAt.innerText = j.updated_at ? j.updated_at.split('T')[0] : '2026-11-22';
      const notesEl = document.getElementById('jd-notes');
      if (notesEl) notesEl.innerText = j.notes || 'Sem notas editoriais registadas.';

      // Abrir Gaveta
      const panel = document.getElementById('panel-journalist-detail');
      if (panel) panel.classList.remove('hidden');

      try {
        renderJournalistTasksInDrawer(j);
      } catch (err) {
        console.warn('Erro ao carregar tarefas do jornalista na gaveta:', err);
      }
    }
'@

$pattern = '(?s)// ========================================================\s*// FICHA / GAVETA DO JORNALISTA \(BASE 2 -> BASE 1\)\s*// ========================================================\s*function openJournalistDetailDrawer\(journalistId\) \{.*?document\.getElementById\(''panel-journalist-detail''\)\.classList\.remove\(''hidden''\);\s*\}'

foreach ($file in @($dashboardPath, $indexPath)) {
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newCode.Trim() }, 1)
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $file successfully."
    } else {
        Write-Host "ERROR: Pattern not matched in $file!" -ForegroundColor Red
    }
}
