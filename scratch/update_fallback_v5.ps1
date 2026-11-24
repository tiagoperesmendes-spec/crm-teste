$filePath = "scratch/test_updated_dashboard.html"
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$oldFallbackStart = $text.IndexOf("    function loadFromLocalStorageFallback() {")
$oldFallbackEnd = $text.IndexOf("    function syncLocalStorage() {", $oldFallbackStart)

$newFallback = @"
    function loadFromLocalStorageFallback() {
      try {
        localTasks = JSON.parse(localStorage.getItem('rep_tasks') || '[]');
        localProjects = JSON.parse(localStorage.getItem('rep_projects') || '[]');
        localDailyContacts = JSON.parse(localStorage.getItem('rep_contacts') || '[]');
        localJournalists = JSON.parse(localStorage.getItem('rep_journalists') || '[]');
        localOutlets = JSON.parse(localStorage.getItem('rep_outlets') || '[]');
        localClippings = JSON.parse(localStorage.getItem('rep_clippings') || '[]');
      } catch (e) { }

      if (!localTasks || localTasks.length === 0 || localStorage.getItem('rep_projects_v5') !== 'true') {
        localTasks = [...DEFAULT_SAMPLE_TASKS];
        localStorage.setItem('rep_tasks', JSON.stringify(localTasks));
      }
      if (!localDailyContacts || localDailyContacts.length === 0) {
        localDailyContacts = [...DEFAULT_SAMPLE_CONTACTS];
      }
      if (!localProjects || localProjects.length === 0 || localStorage.getItem('rep_projects_v5') !== 'true') {
        localProjects = [...DEFAULT_SAMPLE_PROJECTS];
        localStorage.setItem('rep_projects_v5', 'true');
        localStorage.setItem('rep_projects', JSON.stringify(localProjects));
      }
      if (!localClippings || localClippings.length === 0) {
        localClippings = [...DEFAULT_SAMPLE_CLIPPINGS];
      }
      if (!localJournalists || localJournalists.length === 0 || localStorage.getItem('rep_bases_v4') !== 'true') {
        localJournalists = [...DEFAULT_SAMPLE_JOURNALISTS];
        localStorage.setItem('rep_bases_v4', 'true');
        localStorage.setItem('rep_journalists', JSON.stringify(localJournalists));
      }
      if (!localOutlets || localOutlets.length === 0 || localStorage.getItem('rep_outlets_v4') !== 'true') {
        localOutlets = [...DEFAULT_SAMPLE_OUTLETS];
        localStorage.setItem('rep_outlets_v4', 'true');
        localStorage.setItem('rep_outlets', JSON.stringify(localOutlets));
      }
    }

"@

$text = $text.Substring(0, $oldFallbackStart) + $newFallback + $text.Substring($oldFallbackEnd)
[System.IO.File]::WriteAllText($filePath, $text, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated loadFromLocalStorageFallback with v5 cache key!"
