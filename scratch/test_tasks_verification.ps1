$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$harness = @'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Tasks Full Verification</title></head>
<body>
<iframe id="crmFrame" src="../dashboard.html" style="width:1200px; height:800px;"></iframe>
<script>
window.addEventListener('load', () => {
  const iframe = document.getElementById('crmFrame');
  iframe.onload = () => {
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;

      const results = [];

      // 1. Force login as Director
      win.currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
      win.localStorage.setItem('rep_auth_user', JSON.stringify(win.currentUser));
      win.document.getElementById('view-login').classList.add('hidden');
      win.document.getElementById('app-container').classList.remove('hidden');
      win.document.getElementById('app-container').classList.add('flex');

      // 2. Switch to Tasks view
      win.switchView('tasks');
      const viewTasks = doc.getElementById('view-tasks');
      const isTasksViewVisible = viewTasks && !viewTasks.classList.contains('hidden');
      results.push('VIEW_VISIBLE:' + isTasksViewVisible);

      // Check header summary
      const summaryText = doc.getElementById('tasks-summary-text')?.innerText || '';
      results.push('SUMMARY:' + (summaryText.includes('tarefas') ? 'OK' : 'FAIL'));

      // Check tabs
      const tabAll = doc.getElementById('task-tab-all');
      const tabCountAll = doc.getElementById('task-tab-count-all')?.innerText || '0';
      results.push('TABS:' + (tabAll ? 'OK' : 'FAIL') + '|COUNT:' + tabCountAll);

      // Check filter bar elements
      const sInput = doc.getElementById('tasks-search-input');
      const tFilter = doc.getElementById('tasks-filter-type');
      const pFilter = doc.getElementById('tasks-filter-priority');
      const rFilter = doc.getElementById('tasks-filter-responsible');
      const gSelect = doc.getElementById('tasks-grouping-select');
      const allFiltersPresent = sInput && tFilter && pFilter && rFilter && gSelect;
      results.push('FILTERS:' + (allFiltersPresent ? 'OK' : 'FAIL'));

      // Check rendered table rows
      const rows = doc.querySelectorAll('#tasks-content-wrapper table tbody tr');
      results.push('ROWS_INITIAL:' + rows.length);

      // 3. Open Task Modal
      win.openTaskModal();
      const modal = doc.getElementById('modal-new-task');
      const isModalVisible = modal && !modal.classList.contains('hidden');
      results.push('MODAL_OPEN:' + isModalVisible);

      const submitBtn = doc.getElementById('btn-submit-new-task');
      results.push('SUBMIT_INIT_DISABLED:' + (submitBtn?.disabled === true));

      // Fill in task form
      doc.getElementById('task-title').value = 'Coordenar lancamento imprensa 2026';
      win.setNewTaskType('redacao');
      doc.getElementById('task-duedate').value = '2026-11-25';
      win.checkNewTaskFormValidity();

      results.push('SUBMIT_READY_ENABLED:' + (submitBtn?.disabled === false));

      // 4. Submit form
      const mockEvent = { preventDefault: () => {} };
      win.handleNewTaskSubmit(mockEvent);

      // Check modal closed
      const isModalClosed = modal.classList.contains('hidden');
      results.push('MODAL_CLOSED:' + isModalClosed);

      // Check that the task is in localTasks at index 0
      const firstTask = win.localTasks[0];
      const isFirstTaskAdded = firstTask && firstTask.title === 'Coordenar lancamento imprensa 2026';
      results.push('LOCAL_TASKS_ADDED:' + isFirstTaskAdded);

      // Check localStorage
      const savedTasks = JSON.parse(win.localStorage.getItem('rep_tasks') || '[]');
      const inStorage = savedTasks.some(t => t.title === 'Coordenar lancamento imprensa 2026');
      results.push('STORAGE_SAVED:' + inStorage);

      // Check that table shows the newly created task
      const updatedRows = doc.querySelectorAll('#tasks-content-wrapper table tbody tr');
      const firstRowText = updatedRows[0]?.innerText || '';
      results.push('TABLE_SHOWS_NEW_TASK:' + firstRowText.includes('Coordenar lancamento'));

      // 5. Test toggle task completion
      const newlyAddedId = firstTask.id;
      win.toggleTaskStatus(newlyAddedId);
      const isNowCompleted = firstTask.status === 'concluida';
      results.push('TOGGLE_STATUS_DONE:' + isNowCompleted);

      // 6. Test tabs filtering
      win.setTasksStatusTab('today');
      const todayRows = doc.querySelectorAll('#tasks-content-wrapper table tbody tr').length;
      win.setTasksStatusTab('all');
      const allRows = doc.querySelectorAll('#tasks-content-wrapper table tbody tr').length;
      results.push('TAB_SWITCH_OK:' + (allRows >= todayRows));

      document.body.setAttribute('data-test-result', results.join(' ; '));
    } catch(err) {
      document.body.setAttribute('data-test-result', 'ERROR:' + err.message + ' STACK:' + err.stack);
    }
  };
});
</script>
</body>
</html>
'@

[System.IO.File]::WriteAllText("c:\Users\tiago\Desktop\crm-teste\scratch\test_tasks_harness.html", $harness, [System.Text.Encoding]::UTF8)

$url = "file:///c:/Users/tiago/Desktop/crm-teste/scratch/test_tasks_harness.html"
$outFile = "c:\Users\tiago\Desktop\crm-teste\scratch\test_tasks_out.txt"

# Run chrome with redirection via cmd to avoid locked handles
cmd /c "`"$chromePath`" --headless=new --dump-dom --disable-gpu --allow-file-access-from-files `"$url`" > `"$outFile`""

Start-Sleep -Milliseconds 500

$stream = [System.IO.FileStream]::new($outFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
$res = $reader.ReadToEnd()
$reader.Close()
$stream.Close()

Write-Host "Output from harness:"
if ($res -match 'data-test-result="([^"]+)"') {
    Write-Host "TEST RESULT:`n$($matches[1])" -ForegroundColor Green
} else {
    Write-Host "No data-test-result found in DOM dump" -ForegroundColor Yellow
}
