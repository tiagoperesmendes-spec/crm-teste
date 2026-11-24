$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$harness = @'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Tasks Full Verification</title></head>
<body>
<div id="output">Running...</div>
<script>
window.addEventListener('load', async () => {
  try {
    // Read and eval dashboard.html script in isolated context
    const resp = await fetch('../dashboard.html');
    const htmlText = await resp.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Check DOM elements in the HTML
    const results = [];

    const viewTasks = doc.getElementById('view-tasks');
    results.push('VIEW_TASKS_EXISTS:' + (viewTasks !== null));

    const summaryEl = doc.getElementById('tasks-summary-text');
    results.push('SUMMARY_EL:' + (summaryEl !== null));

    const tabAll = doc.getElementById('task-tab-all');
    const tabToday = doc.getElementById('task-tab-today');
    const tabWeek = doc.getElementById('task-tab-week');
    const tabOverdue = doc.getElementById('task-tab-overdue');
    const tabMy = doc.getElementById('task-tab-my');
    results.push('TABS_ALL_PRESENT:' + (tabAll && tabToday && tabWeek && tabOverdue && tabMy ? 'YES' : 'NO'));

    const searchInput = doc.getElementById('tasks-search-input');
    const typeFilter = doc.getElementById('tasks-filter-type');
    const prioFilter = doc.getElementById('tasks-filter-priority');
    const respFilter = doc.getElementById('tasks-filter-responsible');
    const groupSelect = doc.getElementById('tasks-grouping-select');
    results.push('FILTERS_ALL_PRESENT:' + (searchInput && typeFilter && prioFilter && respFilter && groupSelect ? 'YES' : 'NO'));

    const modalTask = doc.getElementById('modal-new-task');
    results.push('MODAL_TASK_EXISTS:' + (modalTask !== null));

    const taskTitle = doc.getElementById('task-title');
    const typeButtons = doc.getElementById('task-type-buttons-container');
    const dueDate = doc.getElementById('task-duedate');
    const missingMsg = doc.getElementById('task-modal-missing-msg');
    const submitBtn = doc.getElementById('btn-submit-new-task');
    results.push('MODAL_FIELDS_PRESENT:' + (taskTitle && typeButtons && dueDate && missingMsg && submitBtn ? 'YES' : 'NO'));

    document.getElementById('output').innerText = results.join(' ; ');
    document.body.setAttribute('data-test-result', results.join(' ; '));
  } catch (err) {
    document.getElementById('output').innerText = 'ERROR: ' + err.message;
    document.body.setAttribute('data-test-result', 'ERROR:' + err.message);
  }
});
</script>
</body>
</html>
'@

[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_dom_harness.html", $harness, [System.Text.Encoding]::UTF8)

# Now let's run a node or powershell script to directly execute DOM and JS tests
