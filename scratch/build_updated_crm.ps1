$sourceHtmlPath = "dashboard.html"
$outputHtmlPath = "scratch/test_updated_dashboard.html"

$html = [System.IO.File]::ReadAllText($sourceHtmlPath, [System.Text.Encoding]::UTF8)

# 1. Update Sample Data: replace DEFAULT_SAMPLE_TASKS and DEFAULT_SAMPLE_PROJECTS
$mockJs = [System.IO.File]::ReadAllText("scratch/mock_projects_tasks.js", [System.Text.Encoding]::UTF8)
$projStart = $mockJs.IndexOf("const DEFAULT_SAMPLE_PROJECTS = [")
$taskStart = $mockJs.IndexOf("const DEFAULT_SAMPLE_TASKS = [")

$mockProjectsBlock = $mockJs.Substring($projStart, $taskStart - $projStart).Trim()
$mockTasksBlock = $mockJs.Substring($taskStart).Trim()

# Find where DEFAULT_SAMPLE_TASKS starts in dashboard.html
$origTaskStart = $html.IndexOf("    const DEFAULT_SAMPLE_TASKS = [")
if ($origTaskStart -lt 0) { throw "Could not find DEFAULT_SAMPLE_TASKS" }

# Find where DEFAULT_SAMPLE_PROJECTS ends in dashboard.html
$origProjStart = $html.IndexOf("    const DEFAULT_SAMPLE_PROJECTS = [")
if ($origProjStart -lt 0) { throw "Could not find DEFAULT_SAMPLE_PROJECTS" }

# Find the closing ]; of DEFAULT_SAMPLE_PROJECTS
$origProjEnd = $html.IndexOf("    ];", $origProjStart)
if ($origProjEnd -lt 0) { throw "Could not find end of DEFAULT_SAMPLE_PROJECTS" }
$origProjEnd += 6 # include "    ];"

$newSampleData = "    " + $mockTasksBlock + "`r`n`r`n    " + $mockProjectsBlock

$html = $html.Substring(0, $origTaskStart) + $newSampleData + $html.Substring($origProjEnd)
Write-Output "Step 1: Sample data replaced."

# 2. Replace view-tasks and view-projects markup
$vTasksStart = $html.IndexOf('<div id="view-tasks"')
if ($vTasksStart -lt 0) { throw "Could not find <div id=""view-tasks""" }
# Back up to the comment
$vTasksCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vTasksStart)

$vJourStart = $html.IndexOf('<div id="view-journalists"')
if ($vJourStart -lt 0) { throw "Could not find <div id=""view-journalists""" }
# Back up to comment before view-journalists
$vJourCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vJourStart)

$newTasksProjectsMarkup = [System.IO.File]::ReadAllText("scratch/view_tasks_projects_markup.html", [System.Text.Encoding]::UTF8)

$html = $html.Substring(0, $vTasksCommentStart) + $newTasksProjectsMarkup + "`r`n`r`n" + $html.Substring($vJourCommentStart)
Write-Output "Step 2: view-tasks and view-projects markup replaced."

# 3. Replace view-project-detail markup
$vProjDetStart = $html.IndexOf('<div id="view-project-detail"')
if ($vProjDetStart -lt 0) { throw "Could not find <div id=""view-project-detail""" }
$vProjDetCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vProjDetStart)

$vContactsStart = $html.IndexOf('<div id="view-contacts"')
if ($vContactsStart -lt 0) { throw "Could not find <div id=""view-contacts""" }
$vContactsCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $vContactsStart)

$newProjDetailMarkup = [System.IO.File]::ReadAllText("scratch/view_project_detail_markup.html", [System.Text.Encoding]::UTF8)

$html = $html.Substring(0, $vProjDetCommentStart) + $newProjDetailMarkup + "`r`n`r`n" + $html.Substring($vContactsCommentStart)
Write-Output "Step 3: view-project-detail markup replaced."

# 4. Replace modal-new-task and modal-new-project markup
$modalTaskStart = $html.IndexOf('<div id="modal-new-task"')
if ($modalTaskStart -lt 0) { throw "Could not find <div id=""modal-new-task""" }
$modalTaskCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $modalTaskStart)

$modalContactStart = $html.IndexOf('<div id="modal-new-contact"')
if ($modalContactStart -lt 0) { throw "Could not find <div id=""modal-new-contact""" }
$modalContactCommentStart = $html.LastIndexOf('<!-- ======================================================== -->', $modalContactStart)

$newModalsMarkup = [System.IO.File]::ReadAllText("scratch/modals_tasks_projects_markup.html", [System.Text.Encoding]::UTF8)

$html = $html.Substring(0, $modalTaskCommentStart) + $newModalsMarkup + "`r`n`r`n" + $html.Substring($modalContactCommentStart)
Write-Output "Step 4: modal-new-task and modal-new-project markup replaced."

# 5. Add Drawer Extra Markup (panel-journalist-detail and panel-outlet-detail)
# In panel-journalist-detail: before the bottom actions bar
$jdActionsStart = $html.IndexOf('<!-- Barra de Ações Inferior -->', $html.IndexOf('id="panel-journalist-detail"'))
$jdTasksExtraHtml = @"
        <!-- TAREFAS DE CONTACTO (REGRAS DE LIGAÇÃO CRM) -->
        <div class="space-y-3 pt-2 border-t border-[#E4DDD3]">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Histórico de Contactos (Tarefas Concluídas)</label>
            <span id="jd-completed-contacts-count" class="text-xs font-medium text-[#6C1C37]">0 concluídas</span>
          </div>
          <div id="jd-completed-tasks-list" class="space-y-2">
            <!-- Gerado dinamicamente -->
          </div>

          <div class="flex items-center justify-between pt-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Tarefas Pendentes com este Jornalista</label>
            <span id="jd-pending-contacts-count" class="text-xs font-medium text-[#6C1C37]">0 pendentes</span>
          </div>
          <div id="jd-pending-tasks-list" class="space-y-2">
            <!-- Gerado dinamicamente -->
          </div>
        </div>
      </div>

"@
# Replace the closing </div> of jd-drawer-body
$jdCloseBody = $html.LastIndexOf('</div>', $jdActionsStart)
$html = $html.Substring(0, $jdCloseBody) + $jdTasksExtraHtml + $html.Substring($jdActionsStart)
Write-Output "Step 5a: Journalist Drawer extra markup added."

# In panel-outlet-detail: after associated journalists
$odActionsStart = $html.IndexOf('<!-- Barra de Ações Inferior -->', $html.IndexOf('id="panel-outlet-detail"'))
$odProjsExtraHtml = @"
        <!-- PROJETOS COM COBERTURA NESTE MEIO (REGRAS DE LIGAÇÃO CRM) -->
        <div class="space-y-3 pt-2 border-t border-[#E4DDD3]">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Projetos com Cobertura Neste Meio</label>
            <span id="od-projects-count" class="text-xs font-medium text-[#6C1C37]">0 projetos</span>
          </div>
          <div id="od-associated-projects-list" class="space-y-2">
            <!-- Gerado dinamicamente -->
          </div>
        </div>
      </div>

"@
$odCloseBody = $html.LastIndexOf('</div>', $odActionsStart)
$html = $html.Substring(0, $odCloseBody) + $odProjsExtraHtml + $html.Substring($odActionsStart)
Write-Output "Step 5b: Outlet Drawer extra markup added."

# 6. Save intermediate html
[System.IO.File]::WriteAllText($outputHtmlPath, $html, [System.Text.Encoding]::UTF8)
Write-Output "Saved intermediate file to $outputHtmlPath. Size: $($html.Length)"
