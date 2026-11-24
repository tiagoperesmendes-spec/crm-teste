$srcMockPath = "scratch/mock_projects_tasks.js"
$targetPath = "src/lib/mock-data.ts"

$mockContent = [System.IO.File]::ReadAllText($srcMockPath, [System.Text.Encoding]::UTF8)

# Parse out DEFAULT_SAMPLE_PROJECTS and DEFAULT_SAMPLE_TASKS
$projStart = $mockContent.IndexOf("const DEFAULT_SAMPLE_PROJECTS = [")
$projEnd = $mockContent.IndexOf("const DEFAULT_SAMPLE_TASKS = [")

$projBlock = $mockContent.Substring($projStart, $projEnd - $projStart).Trim()
# Convert `const DEFAULT_SAMPLE_PROJECTS = [` to `export const sampleProjects: Project[] = [`
$projBlock = $projBlock -replace 'const DEFAULT_SAMPLE_PROJECTS = \[', 'export const sampleProjects: Project[] = ['

$taskBlock = $mockContent.Substring($projEnd).Trim()
# Convert `const DEFAULT_SAMPLE_TASKS = [` to `export const sampleTasks: Task[] = [`
$taskBlock = $taskBlock -replace 'const DEFAULT_SAMPLE_TASKS = \[', 'export const sampleTasks: Task[] = ['

$targetContent = [System.IO.File]::ReadAllText($targetPath, [System.Text.Encoding]::UTF8)

# Find where sampleProjects begins in target
$tProjStart = $targetContent.IndexOf("export const sampleProjects: Project[] = [")
# Find where sampleJournalists begins in target
$tJourStart = $targetContent.IndexOf("export const sampleJournalists: Journalist[] = [")

$head = $targetContent.Substring(0, $tProjStart)
$tail = $targetContent.Substring($tJourStart)

$newTargetContent = $head + $projBlock + "`r`n`r`n" + $taskBlock + "`r`n`r`n" + $tail
[System.IO.File]::WriteAllText($targetPath, $newTargetContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated src/lib/mock-data.ts! Length: $($newTargetContent.Length)"
