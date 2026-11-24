$filePath = "scratch/test_updated_dashboard.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Read our logic files
$tasksProjectsLogic = [System.IO.File]::ReadAllText("scratch/tasks_projects_logic.js", [System.Text.Encoding]::UTF8)
$drawersExtraLogic = [System.IO.File]::ReadAllText("scratch/drawers_extra_logic.js", [System.Text.Encoding]::UTF8)

# 2. In openJournalistDetailDrawer: add call to renderJournalistTasksInDrawer(j)
$jdDrawerCallTarget = "document.getElementById('panel-journalist-detail').classList.remove('hidden');"
$jdReplacement = "renderJournalistTasksInDrawer(j);`r`n      document.getElementById('panel-journalist-detail').classList.remove('hidden');"
$content = $content.Replace($jdDrawerCallTarget, $jdReplacement)

# 3. In openOutletDetailDrawer: add call to renderOutletProjectsInDrawer(ocs)
$odDrawerCallTarget = "document.getElementById('panel-outlet-detail').classList.remove('hidden');"
$odReplacement = "renderOutletProjectsInDrawer(ocs);`r`n      document.getElementById('panel-outlet-detail').classList.remove('hidden');"
$content = $content.Replace($odDrawerCallTarget, $odReplacement)

# 4. Replace renderFullTasks down to right before "8. CONTACTOS DO DASHBOARD"
$startTasksFn = $content.IndexOf("    function renderFullTasks() {")
$endTasksFn = $content.IndexOf("    // ==========================================", $startTasksFn)
# Specifically find: // 8. CONTACTOS DO DASHBOARD & PROJETOS
$contactSectionComment = $content.IndexOf("    // 8. CONTACTOS DO DASHBOARD & PROJETOS", $startTasksFn)
if ($contactSectionComment -lt 0) { throw "Could not find CONTACTOS DO DASHBOARD section" }
$startOfComment = $content.LastIndexOf("    // ==========================================", $contactSectionComment)

# We want to replace from $startTasksFn to $startOfComment with an empty string or comment,
# because we will place all tasks and projects logic cleanly in the script.
$content = $content.Substring(0, $startTasksFn) + "// [Tasks logic moved to unified block]`r`n`r`n" + $content.Substring($startOfComment)

# 5. Replace renderFullProjects down to right before "9. VISTA DE CONSULTA DE CONTACTOS"
$startProjFn = $content.IndexOf("    function renderFullProjects() {")
$contactsViewComment = $content.IndexOf("    // 9. VISTA DE CONSULTA DE CONTACTOS", $startProjFn)
if ($contactsViewComment -lt 0) { throw "Could not find VISTA DE CONSULTA DE CONTACTOS section" }
$startOfContactsComment = $content.LastIndexOf("    // ==========================================", $contactsViewComment)

$content = $content.Substring(0, $startProjFn) + "// [Projects logic moved to unified block]`r`n`r`n" + $content.Substring($startOfContactsComment)

# 6. Replace old toggleTaskStatus
$startToggle = $content.IndexOf("    async function toggleTaskStatus(id) {")
if ($startToggle -gt 0) {
    $endToggle = $content.IndexOf("    async function deleteTask(id) {", $startToggle)
    $content = $content.Substring(0, $startToggle) + "// [toggleTaskStatus moved to unified block]`r`n`r`n" + $content.Substring($endToggle)
}

# 7. Replace old handleNewTaskSubmit and handleNewProjectSubmit
$startNewTask = $content.IndexOf("    async function handleNewTaskSubmit(e) {")
if ($startNewTask -gt 0) {
    $startNewContact = $content.IndexOf("    async function handleNewContactSubmit(e) {", $startNewTask)
    $content = $content.Substring(0, $startNewTask) + "// [handleNewTaskSubmit and handleNewProjectSubmit moved to unified block]`r`n`r`n" + $content.Substring($startNewContact)
}

# 8. Replace old openTaskModal and openProjectModal
$startOpenTask = $content.IndexOf("    function openTaskModal() {")
if ($startOpenTask -gt 0) {
    $startOpenContact = $content.IndexOf("    function openContactModal() {", $startOpenTask)
    $content = $content.Substring(0, $startOpenTask) + "// [openTaskModal and openProjectModal moved to unified block]`r`n`r`n" + $content.Substring($startOpenContact)
}

# 9. Insert our unified tasksProjectsLogic and drawersExtraLogic right before the main closing </script>
$scriptEnd = $content.LastIndexOf("  </script>")
if ($scriptEnd -lt 0) { throw "Could not find </script>" }

$unifiedBlock = @"

$tasksProjectsLogic

$drawersExtraLogic

"@

$content = $content.Substring(0, $scriptEnd) + $unifiedBlock + $content.Substring($scriptEnd)

# 10. Write back to test_updated_dashboard.html
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated test_updated_dashboard.html! Length: $($content.Length)"
