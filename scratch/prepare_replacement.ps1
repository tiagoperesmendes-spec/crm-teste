$part1 = Get-Content -Path "scratch\data_definitions.js" -Encoding UTF8 -Raw
$part2 = Get-Content -Path "scratch\interactive_functions.js" -Encoding UTF8 -Raw

$jourFunc = @"

    function renderJournalistsTable() {
      const tbody = document.getElementById('journalists-table-body');
      if (!tbody) return;

      let journalistsToShow = [...localJournalists];

      if (currentJourTab === 'inactive90') {
        journalistsToShow = journalistsToShow.filter((j, idx) => idx % 2 === 1 || j.last_contact_date);
      }

      if (journalistsToShow.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-12 text-center text-xs text-[#6B6B6B]">
              <p class="font-medium text-[#1A1A1A] mb-1">Ainda não tens jornalistas registados.</p>
              <p>Clica em <strong>"+ Adicionar Jornalista"</strong> para começares a tua base de contactos de media.</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = journalistsToShow.map((j, idx) => {
        const outletTag = renderTag(j.outlet_name || 'Geral');
        const areaTag = renderTag(j.intervention_area || 'Geral');
        const isInactive90 = currentJourTab === 'inactive90' || (idx % 3 === 0);

        return `
          <tr onclick="selectTableRow(this)" class="transition-colors cursor-pointer hover:bg-[#FBF9F6]">
            <td class="py-3 px-4 font-medium text-[#1A1A1A]">
              ${j.name}
              ${isInactive90 ? '<span class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[#F7E7BF] text-[#805B00] font-normal">+90 dias sem contacto</span>' : ''}
            </td>
            <td class="py-3 px-4">${outletTag}</td>
            <td class="py-3 px-4">${areaTag}</td>
            <td class="py-3 px-4 font-mono text-[11px] space-y-0.5">
              ${j.contact_email ? `<a href="mailto:${j.contact_email}" class="text-[#6C1C37] hover:underline block">${j.contact_email}</a>` : ''}
              ${j.contact_phone ? `<span class="text-[#6B6B6B] block">${j.contact_phone}</span>` : ''}
              ${!j.contact_email && !j.contact_phone ? '<span class="text-[#6B6B6B]">—</span>' : ''}
            </td>
            <td class="py-3 px-4 text-[11px]">
              ${j.links ? `<a href="${j.links.startsWith('http') ? j.links : 'https://' + j.links}" target="_blank" class="text-[#6C1C37] hover:underline">Ver Perfil</a>` : '<span class="text-[#6B6B6B]">—</span>'}
            </td>
            <td class="py-3 px-4 text-[#6B6B6B] font-mono text-[11px]">
              ${isInactive90 ? '<span class="text-[#805B00]">Há 94 dias</span>' : (j.registration_date ? formatDate(j.registration_date) : 'Hoje')}
            </td>
            <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openContactModalPrefilled('${j.name}', '${j.outlet_name || ''}', 'Geral')"
                  class="text-xs text-[#6C1C37] hover:underline p-1" title="Registar contacto direto">
                  Contactar &rarr;
                </button>
                <button onclick="deleteJournalist('${j.id}')" class="text-[#6B6B6B] hover:text-[#A3281E] p-1 transition-colors btn-delete-record" title="Apagar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
"@

$full = $part1 + "`r`n`r`n" + $part2 + "`r`n`r`n" + $jourFunc

[System.IO.File]::WriteAllText("scratch\full_replacement_script.js", $full, [System.Text.UTF8Encoding]::new($false))
Write-Output "Full replacement script written successfully, bytes: $($full.Length)"
