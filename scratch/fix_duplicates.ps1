$content = [System.IO.File]::ReadAllText("index.html", [System.Text.Encoding]::UTF8)

$dupPattern = @"
    // ==========================================
    // 2. DADOS INICIAIS DE EXEMPLO (PR & COMUNICAÇÃO)
    // ==========================================
    let activeProjectId = 'sample-proj-1';
    let activeTaskId = 'sample-task-1';
    let currentContactPeriod = 'today';
    let currentProjectFilter = 'all';
    let currentJourTab = 'all';
    let currentProjectDetailTab = 'overview';
    let lastEditedTaskBackup = null;

    function getOffsetDateString(days) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    }
"@

# Count how many times it appears
$count = 0
$idx = 0
while (($idx = $content.IndexOf($dupPattern, $idx)) -ne -1) {
    $count++
    $idx += $dupPattern.Length
}
Write-Output "Found $count occurrences of the block."

if ($count -eq 3) {
    # Replace the first two occurrences
    $first = $content.IndexOf($dupPattern)
    $second = $content.IndexOf($dupPattern, $first + $dupPattern.Length)
    
    # Remove from $first up to $second + $dupPattern.Length
    # Leaving only the third occurrence
    $newContent = $content.Substring(0, $first) + $content.Substring($second + $dupPattern.Length)
    # But wait! We need leading whitespace or newlines clean
    # Let's verify
    [System.IO.File]::WriteAllText("index.html", $newContent, [System.Text.UTF8Encoding]::new($false))
    [System.IO.File]::WriteAllText("dashboard.html", $newContent, [System.Text.UTF8Encoding]::new($false))
    Write-Output "Removed 2 duplicated occurrences!"
} else {
    Write-Output "Count was not 3, let's inspect."
}
