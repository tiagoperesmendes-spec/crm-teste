# PowerShell script to fix project creation and project data loading

$dashPath = "c:\Users\tiago\Desktop\crm-teste\dashboard.html"
$indexPath = "c:\Users\tiago\Desktop\crm-teste\index.html"

$html = [System.IO.File]::ReadAllText($dashPath, [System.Text.Encoding]::UTF8)

# 1. Fix currentUser() function call to variable access
$target1 = 'const user = currentUser();'
$replace1 = 'const user = currentUser;'
if ($html.Contains($target1)) {
    $html = $html.Replace($target1, $replace1)
    Write-Host "Fixed: currentUser() call changed to currentUser object."
} else {
    Write-Warning "target1 not found"
}

# 2. Fix canCreateProjects in tech role
$target2 = "canCreateTasks: true,`r`n        canCreateProjects: false,"
$replace2 = "canCreateTasks: true,`r`n        canCreateProjects: true,"
if ($html.Contains($target2)) {
    $html = $html.Replace($target2, $replace2)
    Write-Host "Fixed: tech role canCreateProjects set to true."
} else {
    $target2_lf = "canCreateTasks: true,`n        canCreateProjects: false,"
    $replace2_lf = "canCreateTasks: true,`n        canCreateProjects: true,"
    if ($html.Contains($target2_lf)) {
        $html = $html.Replace($target2_lf, $replace2_lf)
        Write-Host "Fixed (LF): tech role canCreateProjects set to true."
    } else {
        Write-Warning "target2 not found"
    }
}

# 3. Fix loadInitialData Supabase projects fetch overwriting with empty array
$target3 = @"
        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          }
        } catch (e) { }
"@

$replace3 = @"
        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects && projects.length > 0) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          } else if (!localProjects || localProjects.length === 0) {
            localProjects = [...DEFAULT_SAMPLE_PROJECTS];
            localStorage.setItem('rep_projects', JSON.stringify(localProjects));
          }
        } catch (e) { }
"@

# Normalize line endings for replacement
$target3_normalized = $target3 -replace "`r`n", "`n"
$html_normalized = $html -replace "`r`n", "`n"
if ($html_normalized.Contains($target3_normalized)) {
    $html = $html_normalized.Replace($target3_normalized, ($replace3 -replace "`r`n", "`n"))
    Write-Host "Fixed: loadInitialData now checks projects.length > 0 before overwriting."
} else {
    Write-Warning "target3 not found in html"
}

# 4. Bump localStorage key to rep_projects_v7 in loadFromLocalStorageFallback
$html = $html.Replace("'rep_projects_v6'", "'rep_projects_v7'")
Write-Host "Bumped storage key to rep_projects_v7."

# 5. In loadFromLocalStorageFallback, ensure localProjects is restored if empty
$target5 = "if (!localProjects || localProjects.length === 0 || localStorage.getItem('rep_projects_v7') !== 'true') {"
if ($html.Contains($target5)) {
    Write-Host "Confirmed: loadFromLocalStorageFallback restores DEFAULT_SAMPLE_PROJECTS if localProjects is empty or key not v7."
}

# 6. At start of renderFullProjects, ensure localProjects fallback
$target6 = "function renderFullProjects() {"
$replace6 = @"
function renderFullProjects() {
      if (!localProjects || localProjects.length === 0) {
        localProjects = [...DEFAULT_SAMPLE_PROJECTS];
        try { localStorage.setItem('rep_projects', JSON.stringify(localProjects)); } catch(e){}
      }
"@
if ($html.Contains($target6)) {
    $html = $html.Replace($target6, $replace6)
    Write-Host "Fixed: renderFullProjects automatically restores DEFAULT_SAMPLE_PROJECTS if empty."
}

# 7. Move modal footer INSIDE form-new-project
$target7 = @'
      </form>

      <!-- Rodapé Fixo -->
      <div class="p-4 px-6 border-t border-[#E4DDD3] flex items-center justify-between bg-white shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#8A8A8A]">Estado inicial</span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDE6DE] text-[#5C554E]">Em preparação</span>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" onclick="closeProjectModal()"
            class="px-5 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-[#F0ECE7] transition-colors cursor-pointer">Cancelar</button>
          <button type="submit" form="form-new-project" id="btn-submit-new-project" disabled
            class="px-5 py-2 rounded-full text-xs font-semibold bg-[#6C1C37] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#56162C] transition-all cursor-pointer shadow-xs">Criar projeto</button>
        </div>
      </div>

    </div>
  </div>
'@

$replace7 = @'
        <!-- Rodapé Fixo (dentro do form para submissão universal) -->
        <div class="p-4 px-6 border-t border-[#E4DDD3] flex items-center justify-between bg-white shrink-0 -mx-5 sm:-mx-6 -mb-2 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-xs text-[#8A8A8A]">Estado inicial</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDE6DE] text-[#5C554E]">Em preparação</span>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" onclick="closeProjectModal()"
              class="px-5 py-2 rounded-xl text-xs font-medium text-[#1A1A1A] hover:bg-[#F0ECE7] transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" id="btn-submit-new-project" disabled
              class="px-5 py-2 rounded-full text-xs font-semibold bg-[#6C1C37] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#56162C] transition-all cursor-pointer shadow-xs">Criar projeto</button>
          </div>
        </div>

      </form>
    </div>
  </div>
'@

$target7_norm = $target7 -replace "`r`n", "`n"
$html_norm2 = $html -replace "`r`n", "`n"
if ($html_norm2.Contains($target7_norm)) {
    $html = $html_norm2.Replace($target7_norm, ($replace7 -replace "`r`n", "`n"))
    Write-Host "Fixed: Modal footer moved inside form tag."
} else {
    Write-Warning "target7 not found"
}

# Save to both dashboard.html and index.html
[System.IO.File]::WriteAllText($dashPath, $html, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)

Write-Host "Successfully patched dashboard.html and index.html!"
