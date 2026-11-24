$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

# Let's create a test harness HTML that loads dashboard.html inside an iframe or tests the exact JS
$harness = @'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Tasks Test</title></head>
<body>
<iframe id="crmFrame" src="../dashboard.html" style="width:1200px; height:800px;"></iframe>
<script>
window.addEventListener('load', () => {
  const iframe = document.getElementById('crmFrame');
  iframe.onload = () => {
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;

      // Force login
      win.currentUser = { email: 'tiagoperesmendes@gmail.com', name: 'Tiago Mendes', user_metadata: { role: 'director' } };
      win.localStorage.setItem('rep_user_role', 'director');
      win.localStorage.setItem('rep_current_user', JSON.stringify(win.currentUser));
      win.document.getElementById('view-login').classList.add('hidden');
      win.document.getElementById('app-container').classList.remove('hidden');
      win.document.getElementById('app-container').classList.add('flex');

      // Navigate to tasks
      win.switchView('tasks');
      win.renderFullTasks();

      const taskRows = doc.querySelectorAll('#tasks-table-body tr');
      const taskCount = taskRows.length;
      console.log('TASK_ROWS_COUNT=' + taskCount);

      // Open Task Modal
      win.openTaskModal();
      const modal = doc.getElementById('modal-new-task');
      const isVisible = modal && !modal.classList.contains('hidden') && modal.classList.contains('flex');
      console.log('MODAL_TASK_OPENED=' + isVisible);

      const dueDate = doc.getElementById('task-duedate').value;
      console.log('DUE_DATE_VALUE=' + dueDate);

      document.body.setAttribute('data-test-result', 'ROWS:' + taskCount + '|MODAL:' + isVisible + '|DATE:' + dueDate);
    } catch(err) {
      console.error('TEST_ERROR: ' + err.message);
      document.body.setAttribute('data-test-result', 'ERROR:' + err.message);
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
$proc = Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--dump-dom", "--disable-gpu", "--allow-file-access-from-files", $url -NoNewWindow -PassThru -RedirectStandardOutput $outFile
$proc.WaitForExit(8000)

$res = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8)
Write-Host "Output from harness:"
if ($res -match 'data-test-result="([^"]+)"') {
    Write-Host "TEST RESULT: $($matches[1])" -ForegroundColor Green
} else {
    Write-Host "No data-test-result found in DOM dump" -ForegroundColor Yellow
}
