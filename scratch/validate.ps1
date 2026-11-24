$content = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)

# 1. Check for Emojis
$emojiPattern = '[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]'
$emojiMatches = [regex]::Matches($content, $emojiPattern)
Write-Output "Emoji count in index.html: $($emojiMatches.Count)"
if ($emojiMatches.Count -gt 0) {
    foreach ($m in $emojiMatches) {
        Write-Output "Found emoji: $($m.Value)"
    }
} else {
    Write-Output "PASSED: Zero emojis found in index.html."
}

# 2. Check essential view IDs
$requiredIds = @(
    "view-dashboard",
    "view-tasks",
    "view-projects",
    "view-project-detail",
    "view-contacts",
    "view-clipping",
    "view-analytics-response",
    "view-journalists",
    "view-outlets",
    "panel-task-detail"
)

Write-Output "`nChecking essential View & Panel IDs:"
foreach ($id in $requiredIds) {
    if ($content.Contains("id=`"$id`"")) {
        Write-Output "  [OK] id=`"$id`""
    } else {
        Write-Error "  [MISSING] id=`"$id`""
    }
}

# 3. Check essential functions
$requiredFunctions = @(
    "function switchView",
    "function renderAll",
    "function updateKpis",
    "function renderDashboardTasks",
    "function renderFullTasks",
    "function renderDashboardProjects",
    "function renderFullProjects",
    "function renderDashboardContacts",
    "function renderJournalistsTable",
    "function renderOutletsTable",
    "function renderContactsView",
    "function renderClippingView",
    "function renderAnalyticsResponseView",
    "function openProjectDetail",
    "function renderProjectDetail",
    "function switchProjectDetailTab",
    "function openTaskDetail",
    "function closeTaskDetail",
    "function toggleTaskDetailExpand",
    "function saveTaskProperty",
    "function filterTasksByTab",
    "function filterProjectsByTab",
    "function filterContactsPeriod",
    "function filterJournalistsByTab",
    "function updateTaskPriorityInline",
    "function updateTaskDueDateInline",
    "function updateTaskAssigneeInline",
    "function updateContactStatusInline"
)

Write-Output "`nChecking essential JS functions:"
foreach ($fn in $requiredFunctions) {
    if ($content.Contains($fn)) {
        Write-Output "  [OK] $fn"
    } else {
        Write-Error "  [MISSING] $fn"
    }
}

# 4. Check Dashboard KPI click handlers
$requiredKpiHandlers = @(
    "switchView('projects', true, { filter: 'open' })",
    "switchView('tasks', true, { filter: 'today' })",
    "switchView('tasks', true, { filter: 'overdue' })",
    "switchView('tasks', true, { filter: 'week' })",
    "switchView('contacts', true, { period: 'today' })",
    "switchView('contacts', true, { period: 'week' })",
    "switchView('clipping', true, { period: 'month' })",
    "switchView('response_analytics', true)"
)

Write-Output "`nChecking Dashboard KPI click handlers:"
foreach ($h in $requiredKpiHandlers) {
    if ($content.Contains($h)) {
        Write-Output "  [OK] $h"
    } else {
        Write-Error "  [MISSING] $h"
    }
}
